---
title: How do you calculate density altitude and wind correction angle?
description: Pressure altitude, density altitude, wind correction angle, groundspeed and crosswind component worked by hand, with the rule of thumb beside the exact value.
date: 2026-11-24
answer: Pressure altitude is field elevation plus 1,000 ft for each inch the altimeter setting is below 29.92. Density altitude is roughly pressure altitude plus 120 ft for every °C above standard temperature. Wind correction angle is the angle whose sine is wind speed × sin(wind angle) ÷ true airspeed.
---

These are the calculations an E6B flight computer exists for, and the ones a knowledge test expects you to understand. Working each once by hand shows what the computer is doing and gives you a way to catch a mis-keyed entry.

![TrueCourse E6B wind triangle solving a heading of 104 degrees with a vector diagram](/truecourse/screenshot-960.webp "TrueCourse E6B: the wind triangle with its vector diagram.")

## How do you find pressure altitude?

Pressure altitude is what the altimeter reads when it is set to 29.92 inHg. From the current setting:

**Pressure altitude = field elevation + (29.92 − altimeter setting) × 1,000**

Example: field elevation 5,000 ft, altimeter 29.72. The difference is 0.20 inHg, worth 200 ft. Pressure altitude = **5,200 ft**. A setting above 29.92 lowers it instead.

The 1,000 ft per inch figure is an approximation that holds well near sea level and is the one the FAA handbooks teach.

## How do you find density altitude?

Density altitude is pressure altitude corrected for temperature: the altitude in the standard atmosphere where the air is as thin as the air you are in. The aircraft performs as if it were there.

1. **Standard temperature** at your pressure altitude: 15 °C at sea level, falling 2 °C per 1,000 ft. At 5,200 ft: 15 − 10.4 = **4.6 °C**.
2. **Deviation** from standard: with 30 °C outside, 30 − 4.6 = **25.4 °C** warmer.
3. **Rule of thumb:** 120 ft for each °C. 25.4 × 120 = 3,048 ft.

Density altitude ≈ 5,200 + 3,048 = **about 8,250 ft**.

On a warm afternoon the aeroplane at a 5,000 ft airport takes off as if the runway were at 8,250 ft: a longer ground roll, a slower climb and less power from a normally aspirated engine.

The 120 ft rule is linear, and the real relationship is not. Computed from the ICAO Standard Atmosphere, the density altitude for this case is about 8,050 ft, some 200 ft lower than the rule of thumb. Here the rule errs on the cautious side, and the size of the gap changes with altitude and temperature, which is one reason to use a computed value for performance planning. Humidity raises density altitude a little and is in neither figure.

## How do you solve the wind triangle?

You know your true course, your true airspeed, and the wind. You want the heading to hold and the groundspeed you will make.

Worked example: true course 090°, true airspeed 120 kt, wind from 160° at 30 kt.

1. **Wind angle** between the course and the wind direction: 160 − 90 = 70°, from the right.
2. **Wind correction angle:** sin(WCA) = 30 × sin 70° ÷ 120 = 0.235, so WCA = **13.6°**. The wind is from the right, so correct to the right.
3. **True heading:** 090 + 13.6 = **104°**.
4. **Groundspeed:** 120 × cos 13.6° − 30 × cos 70° = 116.6 − 10.3 = **106 kt**.

The formulas:

- **WCA = arcsin( wind speed × sin(wind angle) ÷ TAS )**
- **Groundspeed = TAS × cos(WCA) − wind speed × cos(wind angle)**

Then apply magnetic variation and compass deviation to turn the true heading into the one you fly.

## How do you find the crosswind component for landing?

Same trigonometry, with the runway in place of the course.

**Crosswind = wind speed × sin(angle between wind and runway)**
**Headwind = wind speed × cos(angle)**

| Angle off the runway | Crosswind as a share of wind speed |
|---|---|
| 10° | 17% |
| 20° | 34% |
| 30° | 50% |
| 45° | 71% |
| 60° | 87% |
| 90° | 100% |

Runway 27 with the wind 300° at 20 kt: the angle is 30°, so the crosswind is **10 kt** and the headwind 17 kt. Compare the crosswind with the maximum demonstrated crosswind in your aircraft's handbook, and with your own limits. Runway numbers are magnetic, and tower and ATIS winds are magnetic; winds in METARs and forecasts are true.

## Why does true airspeed differ from indicated airspeed?

The airspeed indicator measures the pressure of the air hitting the pitot tube, and thin air pushes less. At altitude the aeroplane is moving faster through the air than the needle shows. A common approximation is that true airspeed is about 2% higher than calibrated airspeed for each 1,000 ft of density altitude. At a density altitude of 8,000 ft, 110 kt calibrated is about 124 kt true; the rule of thumb gives 128. The exact figure comes from the air density at your pressure altitude and temperature.

## Where does TrueCourse E6B fit?

[TrueCourse E6B](/truecourse-e6b/) is an E6B flight computer for student pilots, GA pilots and CFIs. It solves the wind triangle with a live vector diagram (heading, groundspeed, wind correction angle and the crosswind and headwind components), true airspeed and Mach, density, pressure and true altitude, a nav log, fuel, climb and descent, and weight and balance with a CG envelope. Its numbers come from published formulas in the FAA-H-8083 handbooks and the ICAO Standard Atmosphere. It works offline with no account. It is a training and planning aid: the aircraft's flight manual and current official weather remain the authority for any flight.

## Frequently asked questions

### What is the formula for density altitude?

A common approximation is pressure altitude + 120 × (outside air temperature − standard temperature), in feet and °C. Standard temperature is 15 °C minus 2 °C per 1,000 ft of pressure altitude.

### How do you calculate crosswind quickly?

Multiply the wind speed by the sine of the angle between the wind and the runway: half the wind at 30°, about 70% at 45°, nearly all of it at 60° and beyond.

### Does humidity affect density altitude?

Yes, slightly. Humid air is less dense than dry air at the same pressure and temperature, so it raises density altitude. The standard formulas ignore it.

## Sources

- FAA, *Pilot's Handbook of Aeronautical Knowledge* (FAA-H-8083-25), chapters on flight instruments, aircraft performance and navigation: [faa.gov](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak)
- ICAO Doc 7488, *Manual of the ICAO Standard Atmosphere*.
