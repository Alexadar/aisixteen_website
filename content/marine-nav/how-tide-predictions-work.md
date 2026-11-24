---
title: How do tide predictions work, and can they be computed offline?
description: Tide tables are built by adding harmonic constituents such as M2, S2, K1 and O1. How the method works, what it leaves out, and why it needs no connection.
date: 2026-11-24
answer: A tide prediction is the sum of a few dozen cosine waves, called harmonic constituents, each with a fixed astronomical period and a height and timing measured for one station. The constants are published, so the sum can be computed on a device with no connection. It predicts the astronomical tide only, not wind or surge.
---

A tide table looks like data from somewhere. It is really the output of a formula, and the same formula can run anywhere the station's constants are stored. That matters at sea, where a connection is the first thing to go.

![Marine Nav tide screen for San Francisco with the day's tide curve, high and low water times](/marinenav/screenshot-960.webp "Marine Nav: a day's tide curve computed on the device from NOAA harmonic constants.")

## What is the harmonic method?

The Moon and the Sun pull on the ocean with rhythms that astronomy gives exactly: the Moon passing overhead, the Sun passing overhead, the Moon's changing distance and tilt. Each rhythm produces a small regular rise and fall of the sea, a **constituent**, with a period that never changes.

What does change from port to port is how big each constituent is and how late it runs, because every bay and estuary responds differently. So for each station, a year or more of water-level measurements is analysed to find two numbers per constituent:

- its **amplitude** (how high), and
- its **phase lag** (how late, relative to the astronomical forcing).

Those are the **harmonic constants**. The predicted height at any moment is then:

**height = mean level + sum of [ f × amplitude × cos(speed × time + astronomical argument − phase lag) ]**

where *f* and the astronomical argument are slow corrections for the 18.6-year cycle of the Moon's orbit. NOAA's standard predictions use 37 constituents.

## Which constituents matter most?

Usually five carry most of the tide.

| Constituent | Cause | Period (hours) |
|---|---|---|
| M2 | Principal lunar, twice daily | 12.42 |
| S2 | Principal solar, twice daily | 12.00 |
| N2 | The Moon's elliptical orbit | 12.66 |
| K1 | Lunar-solar, once daily | 23.93 |
| O1 | Lunar, once daily | 25.82 |

Three familiar facts fall out of this table:

- **Tides come about 50 minutes later each day**, because M2 repeats every 12 h 25 min, so two cycles take 24 h 50 min.
- **Springs and neaps.** M2 and S2 drift in and out of step every 14.77 days. In step, they add (spring tides, near new and full Moon). Out of step, they partly cancel (neap tides).
- **Mixed tides.** Where K1 and O1 are large compared with M2, as on the US west coast, the two high waters of a day have very different heights.

## Why can this be computed offline?

Because nothing in the formula comes from a live measurement. The astronomy is known centuries ahead, and the station's constants are fixed numbers published by the hydrographic authority, in the US by NOAA's Center for Operational Oceanographic Products and Services. An app that stores the constants and does the sum gives the same predictions with the radio off as with it on.

Times need care. A tide table read in the wrong time zone is a navigational error, so a prediction should always state the zone it is in.

## What do tide predictions leave out?

Everything that is not astronomy. The predicted height is the **astronomical tide**. The observed water level also includes:

- **Wind and pressure.** Onshore gales and low pressure raise the water; a deep low can add a storm surge of a metre or more. High pressure lowers it, roughly one centimetre per hectopascal.
- **River flow** in estuaries.
- **Seiches** and other local oscillations.

Heights are given above a **chart datum**. In the United States that is Mean Lower Low Water (MLLW), the average of the lower of each day's two low waters, so a predicted height can be negative on a low spring tide. Check which datum your chart uses before adding a tide height to a charted depth.

## Is slack water at the same time as high water?

Often not. Tide (the vertical movement) and tidal current (the horizontal flow) are different predictions with their own constants. In many channels the current keeps flooding well after high water and turns an hour or more later. Use current predictions for slack water, never the tide table.

## What is the rule of twelfths?

A mental approximation for a regular twice-daily tide: over the six hours between low and high water, the level changes by 1, 2, 3, 3, 2 and 1 twelfths of the range. With a 3.6 m range, the water rises 0.3 m in the first hour, 0.6 in the second, 0.9 in each of the middle two, then 0.6 and 0.3. It is a sine curve in round numbers, and it fails where the tide is mixed or distorted by shallow water. A computed curve is better whenever you have one.

## Where does Marine Nav fit?

[Marine Nav](/marine-nav/) carries NOAA's published harmonic constants for its stations and runs the harmonic synthesis on the device, so tide and tidal-current predictions, including slack water, work with no signal. Times are shown in the station's own time zone, labelled. Its predictions are validated against NOAA's own published predictions for the same stations. The limits are stated on screen: astronomical tide only, no storm surge or wind, and currents along the major axis only. The app also does magnetic declination from the World Magnetic Model 2025, great-circle distance and bearing, and celestial sight reduction. It is an aid to planning, not a substitute for official tide tables, charts or prudent seamanship.

## Frequently asked questions

### How accurate are tide predictions?

For the astronomical tide at a station with good constants, typically within a few centimetres and a few minutes. The observed level can differ much more when wind and pressure are unusual.

### Why are there two high tides a day?

Because the Moon's pull raises water on the side of the Earth facing it and on the opposite side, and the Earth turns under both bulges. The main lunar constituent, M2, has a period of 12 hours 25 minutes.

### Do tide predictions include storm surge?

No. They are the astronomical tide. Surge from wind and low pressure is forecast separately by the weather service.

## Sources

- NOAA Center for Operational Oceanographic Products and Services, harmonic constituents and tide predictions: [tidesandcurrents.noaa.gov](https://tidesandcurrents.noaa.gov/about_harmonic_constituents.html)
- NOAA Special Publication NOS CO-OPS 3, *Tidal Analysis and Prediction* (2007): [tidesandcurrents.noaa.gov/publications](https://tidesandcurrents.noaa.gov/publications/Tidal_Analysis_and_Predictions.pdf)
- NOAA, tidal datums: [tidesandcurrents.noaa.gov/datum_options.html](https://tidesandcurrents.noaa.gov/datum_options.html)
