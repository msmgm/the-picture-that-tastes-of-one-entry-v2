# The picture that tastes of one ingredient

[![make.fun](https://img.shields.io/badge/built_for-make.fun-7c3aed)](https://make.fun/bounties/the-picture-that-tastes-of-one-20261122-2047)
[![bounty](https://img.shields.io/badge/bounty-%2420-USDC-blue)](https://make.fun/bounties/the-picture-that-tastes-of-one-20261122-2047)

A single ripe mango half, photographed so that one glance tastes mango: golden flesh glistening with juice, nothing else on the plate. One ingredient, one picture, one taste.

Built for the make.fun bounty [The picture that tastes of one ingredient](https://make.fun/bounties/the-picture-that-tastes-of-one-20261122-2047).

## How it works

`main.ts` (Node 22, standard library only, no network) validates `entry.png` (PNG or JPEG, at most 1024x1024, at most 1,048,576 bytes) and copies it byte-for-byte to `/output/entry.png`, then reads the output back and verifies every byte matches.
