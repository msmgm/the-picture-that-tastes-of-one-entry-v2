import * as fs from 'node:fs';
import * as path from 'node:path';

function validateAndProcess() {
  const filePath = path.join(import.meta.dirname || __dirname, 'entry.png');
  
  if (!fs.existsSync(filePath)) {
    console.error('Error: entry.png does not exist.');
    process.exit(1);
  }

  const stat = fs.statSync(filePath);
  const maxSize = 1048576;
  if (stat.size > maxSize) {
    console.error(`Error: File size ${stat.size} exceeds maximum allowed size of ${maxSize} bytes.`);
    process.exit(1);
  }

  const buf = fs.readFileSync(filePath);

  const isPng = buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
    buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A;

  const isJpeg = buf.length >= 2 &&
    buf[0] === 0xFF && buf[1] === 0xD8;

  if (!isPng && !isJpeg) {
    console.error('Error: File is neither valid PNG nor valid JPEG.');
    process.exit(1);
  }

  let width = 0;
  let height = 0;

  if (isPng) {
    if (buf.length < 24) {
      console.error('Error: PNG file too short for IHDR.');
      process.exit(1);
    }
    const chunkType = buf.toString('ascii', 12, 16);
    if (chunkType !== 'IHDR') {
      console.error(`Error: First PNG chunk type is ${chunkType}, expected IHDR.`);
      process.exit(1);
    }
    width = buf.readUInt32BE(16);
    height = buf.readUInt32BE(20);
  } else {
    let offset = 2;
    let foundFrame = false;

    while (offset < buf.length) {
      while (offset < buf.length && buf[offset] === 0xFF) {
        offset++;
      }
      if (offset >= buf.length) break;

      const marker = buf[offset];
      offset++;

      const isStandalone = (marker === 0xD8 || marker === 0xD9 || marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7));

      if (isStandalone) {
        continue;
      }

      if (offset + 2 > buf.length) {
        console.error('Error: JPEG segment length exceeds buffer size.');
        process.exit(1);
      }

      const segmentLength = buf.readUInt16BE(offset);
      if (segmentLength < 2) {
        console.error(`Error: Invalid JPEG segment length ${segmentLength} at offset ${offset - 1}.`);
        process.exit(1);
      }

      const markerPos = offset - 1;

      if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
        foundFrame = true;
        if (markerPos + 7 > buf.length) {
          console.error('Error: Frame marker data runs past end of buffer.');
          process.exit(1);
        }
        height = buf.readUInt16BE(markerPos + 4);
        width = buf.readUInt16BE(markerPos + 6);
        break;
      }

      offset += segmentLength;
    }

    if (!foundFrame) {
      console.error('Error: No valid frame marker found in JPEG.');
      process.exit(1);
    }
  }

  if (width === 0 || height === 0 || width > 1024 || height > 1024) {
    console.error(`Error: Invalid image dimensions ${width}x${height}. Must be between 1 and 1024.`);
    process.exit(1);
  }

  const outputDir = '/output';
  const outputFilePath = path.join(outputDir, 'entry.png');

  try {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFilePath, buf);
  } catch (err: any) {
    console.error(`Error writing to output: ${err.message}`);
    process.exit(1);
  }

  const readBackBuf = fs.readFileSync(outputFilePath);
  if (readBackBuf.length !== buf.length) {
    console.error(`Error: Read-back size mismatch (${readBackBuf.length} vs ${buf.length}).`);
    process.exit(1);
  }

  for (let i = 0; i < buf.length; i++) {
    if (readBackBuf[i] !== buf[i]) {
      console.error(`Error: Byte mismatch at index ${i} (${readBackBuf[i]} vs ${buf[i]}).`);
      process.exit(1);
    }
  }

  console.log(`Success: Validated ${isPng ? 'PNG' : 'JPEG'} (${width}x${height}, ${buf.length} bytes), copied and verified successfully.`);
  process.exit(0);
}

validateAndProcess();
