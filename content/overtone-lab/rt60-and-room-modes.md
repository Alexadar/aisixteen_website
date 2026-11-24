---
title: How do you calculate RT60 and room modes for a small room?
description: The Sabine equation for reverberation time, axial room-mode frequencies and the Schroeder frequency, worked for one 5 × 4 × 2.7 m room, with the limits of each.
date: 2026-11-24
answer: RT60 by the Sabine equation is 0.161 × V ÷ A, with V the room volume in m³ and A the total absorption in m² sabins. Axial room modes fall at n × c ÷ (2 × L) for each dimension L. A 5 × 4 × 2.7 m room has first modes near 34, 43 and 64 Hz.
---

Two calculations describe most of what a small room does to sound. Reverberation time says how long sound lingers. Room modes say which bass notes the room exaggerates or swallows. Both can be estimated from a tape measure and a table of absorption coefficients. This guide works them for one room.

The example room is 5.0 m long, 4.0 m wide and 2.7 m high.

## What is RT60?

RT60 is the time it takes for sound to decay by 60 dB after the source stops, which is a drop to one millionth of the original energy. It varies with frequency, so it is normally quoted per octave band (125 Hz, 250 Hz, 500 Hz, 1 kHz, 2 kHz, 4 kHz).

## How does the Sabine equation work?

**RT60 = 0.161 × V ÷ A** (metric), or **RT60 = 0.049 × V ÷ A** (feet)

- **V** is the room volume.
- **A** is the total absorption: each surface's area multiplied by its absorption coefficient α, all added up. α runs from 0 (perfect reflector) to 1 (an open window).

For the example room:

1. **Volume:** 5 × 4 × 2.7 = **54 m³**.
2. **Surface area:** floor 20 + ceiling 20 + two long walls 27 + two short walls 21.6 = **88.6 m²**.
3. **Absorption:** suppose the surfaces average α = 0.15 at 500 Hz (painted plasterboard, a carpet, some furniture). A = 88.6 × 0.15 = **13.3 m² sabins**.
4. **RT60:** 0.161 × 54 ÷ 13.3 = **0.65 s**.

In a real calculation you do step 3 surface by surface and band by band, because materials differ enormously across frequency. Typical published coefficients:

| Material | α at 125 Hz | α at 500 Hz | α at 2 kHz |
|---|---|---|---|
| Painted plasterboard on studs | 0.29 | 0.05 | 0.07 |
| Carpet on concrete | 0.02 | 0.14 | 0.60 |
| 50 mm mineral wool panel | 0.20 | 0.95 | 0.95 |
| Glass window | 0.35 | 0.18 | 0.07 |

The pattern is worth noticing: thin porous materials such as carpet absorb treble and almost no bass. A room treated only with them ends up dull and boomy at once.

## How much absorption does a target RT60 need?

Rearrange the equation: **A = 0.161 × V ÷ RT60**.

To bring the example room from 0.65 s to 0.35 s at 500 Hz, it needs A = 0.161 × 54 ÷ 0.35 = 24.8 m² sabins. It has 13.3, so it needs 11.5 more. A panel with α = 0.95 replacing a wall area with α = 0.05 adds 0.90 per square metre, so that is about **13 m²** of panels.

## When is the Sabine equation wrong?

Sabine assumes a diffuse sound field: energy spread evenly and arriving from all directions. That holds in large, live rooms. It weakens when:

- **The room is very absorbent.** Sabine predicts a non-zero RT60 even with α = 1 everywhere. The Eyring equation, RT60 = 0.161 × V ÷ (−S × ln(1 − ᾱ)), handles dead rooms better. For the example at ᾱ = 0.15 Eyring gives 0.60 s against Sabine's 0.65 s; the two diverge as absorption rises.
- **Absorption is concentrated on one surface,** such as a carpeted floor with bare walls.
- **The frequency is low** in a small room, where individual modes dominate. That is the next calculation.

## How do you calculate room modes?

A mode is a standing wave: a frequency whose half-wavelength fits a whole number of times between two parallel surfaces. For one dimension L:

**f = n × c ÷ (2 × L)**, with c the speed of sound, about 343 m/s at 20 °C, and n = 1, 2, 3…

These are the axial modes, the strongest kind.

| Dimension | 1st mode | 2nd | 3rd |
|---|---|---|---|
| Length 5.0 m | 34.3 Hz | 68.6 Hz | 102.9 Hz |
| Width 4.0 m | 42.9 Hz | 85.8 Hz | 128.6 Hz |
| Height 2.7 m | 63.5 Hz | 127.0 Hz | 190.6 Hz |

At a modal frequency the pressure is highest at the walls and lowest at the centre of that dimension (for the first mode). So a listener in the exact middle of the room hears almost none of the 34 Hz and 43 Hz modes, which is why the centre of a room is a poor listening position.

Look for coincidences. Here the height's second mode (127.0 Hz) sits next to the width's third (128.6 Hz), so expect a build-up near 128 Hz. Rooms whose dimensions are simple multiples of each other stack their modes on the same frequencies; a cube is the worst case.

The full formula adds tangential and oblique modes, which involve two or three pairs of surfaces: f = (c ÷ 2) × √((p ÷ L)² + (q ÷ W)² + (r ÷ H)²).

## Where do modes stop mattering?

Above the Schroeder frequency the modes overlap so densely that the room behaves statistically, and RT60 becomes the useful description:

**f = 2000 × √(RT60 ÷ V)**

For the example: 2000 × √(0.65 ÷ 54) = **about 220 Hz**. Below that, treat the room mode by mode, with placement and bass trapping. Above it, treat it with absorption and diffusion.

## Where does Overtone Lab fit?

[Overtone Lab](/overtone-lab/) is an offline audio calculator for engineers, musicians and instrument builders. It includes room reverberation by the Sabine equation and room modes, alongside tempo and delay times, SMPTE timecode, pitch and harmonics, string tension, filters and crossovers, and LUFS loudness to ITU-R BS.1770. Its formulas are validated against reference values. It runs on iPhone, iPad and Mac with no account.

It calculates from the dimensions and coefficients you enter. A calculated RT60 is an estimate; a measurement in the finished room is the check.

## Frequently asked questions

### What is a good RT60 for a home studio or listening room?

Small critical-listening rooms are commonly designed for roughly 0.2 to 0.4 s, kept even across frequency. Evenness matters more than the exact figure.

### What is the lowest room mode in a 5 m room?

About 34 Hz: the speed of sound, 343 m/s, divided by twice the length.

### Does furniture change RT60?

Yes. Sofas, bookshelves, curtains and people all add absorption, mostly at mid and high frequencies. An empty room measures longer than the same room in use.

## Sources

- Heinrich Kuttruff, *Room Acoustics*, 6th edition (CRC Press, 2016): Sabine and Eyring equations, room modes, the Schroeder frequency.
- ISO 3382-2:2008, *Acoustics: Measurement of room acoustic parameters, Part 2: Reverberation time in ordinary rooms*.
- ITU-R Recommendation BS.1770, *Algorithms to measure audio programme loudness and true-peak audio level*: [itu.int](https://www.itu.int/rec/R-REC-BS.1770)
