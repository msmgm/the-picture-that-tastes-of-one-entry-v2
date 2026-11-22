# The picture that tastes of one ingredient

[![make.fun · the-picture-that-tastes-of-one-20261122-2047](https://make.fun/badge/the-picture-that-tastes-of-one-20261122-2047.svg)](https://make.fun/bounty/the-picture-that-tastes-of-one-20261122-2047?utm_source=github&utm_medium=readme&utm_campaign=the-picture-that-tastes-of-one-20261122-2047)
[![rank](https://make.fun/badge/the-picture-that-tastes-of-one-20261122-2047/msmgm/the-picture-that-tastes-of-one-entry-v2/rank.svg)](https://make.fun/bounty/the-picture-that-tastes-of-one-20261122-2047/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=the-picture-that-tastes-of-one-20261122-2047)
[![reward](https://make.fun/badge/the-picture-that-tastes-of-one-20261122-2047/msmgm/the-picture-that-tastes-of-one-entry-v2/reward.svg)](https://make.fun/bounty/the-picture-that-tastes-of-one-20261122-2047?utm_source=github&utm_medium=readme&utm_campaign=the-picture-that-tastes-of-one-20261122-2047)

A single ripe mango half, photographed so that one glance tastes mango: golden flesh glistening with juice, nothing else on the plate. One ingredient, one picture, one taste.

Built for the make.fun bounty [The picture that tastes of one ingredient](https://make.fun/bounties/the-picture-that-tastes-of-one-20261122-2047).

## How it works

`main.ts` (Node 22, standard library only, no network) validates `entry.png` (PNG or JPEG, at most 1024x1024, at most 1,048,576 bytes) and copies it byte-for-byte to `/output/entry.png`, then reads the output back and verifies every byte matches.
