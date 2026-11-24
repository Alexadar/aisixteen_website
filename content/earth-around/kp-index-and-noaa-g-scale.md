---
title: What do the Kp index and the NOAA G, R and S scales mean?
description: Kp runs from 0 to 9 and measures geomagnetic disturbance; NOAA's G1 to G5 storm levels map onto it. The R and S scales, Hp30 and what each level does.
date: 2026-11-24
answer: Kp is a 0 to 9 index of how disturbed the Earth's magnetic field is over three hours. NOAA's G scale names the storm level from it: Kp 5 is G1 (minor), 6 is G2, 7 is G3, 8 is G4 and 9 is G5 (extreme). R rates radio blackouts from flares; S rates radiation storms.
---

Space weather reports use a handful of numbers that look alike and measure different things. This guide separates them: what each one measures, where it comes from, and what a given level means in practice.

![Earth Around dashboard with the NOAA space weather scales, planetary Kp chart and solar wind readings](/eartharound/screenshot-960.webp "Earth Around: the NOAA scales first, then the numbers behind them.")

## What is the Kp index?

Kp is the planetary K index. Thirteen magnetic observatories around the world each measure how far the horizontal magnetic field strayed from its quiet-day curve during a three-hour window. Each station turns that range into a local K value, and the values are combined into one planetary number from 0 (quiet) to 9 (extreme).

Three things follow from how it is built:

- **It is quasi-logarithmic.** Each step up means a much larger disturbance, not an equal one.
- **It covers three hours.** A short, violent disturbance and a long, moderate one can give the same Kp.
- **The official value comes later.** The definitive Kp is produced by GFZ, the German Research Centre for Geosciences in Potsdam. NOAA publishes its own estimated Kp in near real time, which is what most live displays show.

## How does Kp map to the NOAA G scale?

The G scale is NOAA's public storm scale for geomagnetic storms. It is a direct relabelling of Kp from 5 upward.

| G level | Name | Kp | Average frequency per 11-year cycle | Aurora may be seen as low as (NOAA's examples) |
|---|---|---|---|---|
| G1 | Minor | 5 | 1,700 storms (900 days) | Northern Michigan and Maine |
| G2 | Moderate | 6 | 600 (360 days) | New York and Idaho |
| G3 | Strong | 7 | 200 (130 days) | Illinois and Oregon |
| G4 | Severe | 8, including 9− | 100 (60 days) | Alabama and northern California |
| G5 | Extreme | 9 | 4 (4 days) | Florida and southern Texas |

The effects NOAA lists grow with the level: weak power-grid fluctuations at G1, voltage alarms at high latitudes at G2, voltage corrections and satellite drag problems at G3, and possible widespread voltage-control problems and, at G5, grid collapse or transformer damage. Below Kp 5 there is no G level at all.

## What are the R and S scales?

They rate two other things the Sun does, and neither depends on Kp.

**R: radio blackouts.** A solar flare's X-rays reach Earth in about eight minutes and ionise the sunlit upper atmosphere, which absorbs HF radio. The level is set by the flare's peak X-ray flux measured by the GOES satellites.

| R level | Flare class at peak | X-ray flux (W/m²) |
|---|---|---|
| R1 Minor | M1 | 10⁻⁵ |
| R2 Moderate | M5 | 5 × 10⁻⁵ |
| R3 Strong | X1 | 10⁻⁴ |
| R4 Severe | X10 | 10⁻³ |
| R5 Extreme | X20 | 2 × 10⁻³ |

Flare classes run A, B, C, M, X, each ten times stronger than the last, so an X1 flare is ten times an M1.

**S: solar radiation storms.** These rate energetic protons arriving at Earth, by the flux of protons of 10 MeV and above: S1 at 10 particle flux units, then 100, 1,000, 10,000 and 100,000 for S5. They matter to astronauts, polar flights and satellites.

A single eruption can trigger all three scales at different times: R within minutes of the flare, S within tens of minutes to hours, and G one to three days later when the ejected cloud of plasma arrives.

## What is Hp30, and why use it next to Kp?

Kp's three-hour window hides fast changes. In 2022 GFZ introduced the Hpo family of indices, built the same way as Kp but with shorter windows: **Hp30** every 30 minutes and Hp60 every hour. Two differences matter:

- **Resolution.** A sharp substorm shows up in Hp30 within half an hour instead of being averaged into a three-hour block.
- **No ceiling.** Kp stops at 9. Hp30 is open-ended, so it can tell one extreme storm from a stronger one.

On a quiet day the two tell the same story. During a storm, Hp30 shows you its shape.

## What do solar wind speed and Bz add?

Kp and the G scale describe what has already happened at the ground. The solar wind, measured by spacecraft about 1.5 million km upstream of Earth, shows what is about to happen.

- **Speed.** The slow wind is around 300 to 500 km/s. Streams from coronal holes and clouds from eruptions can exceed 600 to 800 km/s.
- **Bz.** The north–south component of the magnetic field carried by the wind. When Bz points south (negative), it links with Earth's field and energy pours in. A strongly negative Bz held for hours is the usual cause of a storm; a fast wind with northward Bz often does very little.

How to use these for one specific question is covered in [how to tell whether the aurora will be visible tonight](/earth-around/blog/will-the-aurora-be-visible-tonight/).

## Where does Earth Around fit?

[Earth Around](/earth-around/) shows the current NOAA G, R and S levels in plain words, then the numbers behind them: Kp, Hp30 at 30-minute resolution, solar wind speed and Bz, and GOES X-ray flux. It runs on iPhone, iPad, Mac and Apple Watch. It needs a connection, because the data are live feeds from NOAA and GFZ. It has no account and no tracking. It displays measurements and the official scales; operational decisions for power grids, aviation or satellites belong with the official NOAA products.

## Frequently asked questions

### What Kp is a geomagnetic storm?

Kp 5 or higher. Kp 5 is G1 (minor), 6 is G2, 7 is G3, 8 is G4 and 9 is G5 (extreme).

### Is Kp a forecast or a measurement?

A measurement of the past three hours. NOAA also issues Kp forecasts, which are predictions and are labelled as such.

### Do solar flares cause geomagnetic storms?

Not directly. A flare's X-rays cause radio blackouts within minutes. Geomagnetic storms come from solar wind and from coronal mass ejections, which take one to three days to arrive.

## Sources

- NOAA Space Weather Prediction Center, NOAA Space Weather Scales: [swpc.noaa.gov/noaa-scales-explanation](https://www.swpc.noaa.gov/noaa-scales-explanation)
- GFZ Helmholtz Centre for Geosciences, the Kp index and the Hpo indices (Hp30, Hp60): [kp.gfz.de](https://kp.gfz.de/en/)
- Yamazaki et al., "Geomagnetic Activity Index Hpo", *Geophysical Research Letters*, 2022: [doi.org/10.1029/2022GL098860](https://doi.org/10.1029/2022GL098860)
