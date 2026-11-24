---
title: What is the difference between Placidus, Koch and Whole Sign houses?
description: Six house systems compared by how each one divides the sky: Whole Sign, Equal, Placidus, Koch, Campanus and Regiomontanus, and why some fail near the poles.
date: 2026-11-24
answer: All house systems start from the same Ascendant; they differ in how they cut the sky into twelve. Whole Sign and Equal divide the ecliptic into even 30° parts. Placidus and Koch divide by time, Campanus and Regiomontanus by space, so their houses come out unequal.
---

A house system is a rule for dividing the sky around an observer into twelve sectors. Every system needs the same three inputs: the date, the exact time and the place. What differs is the geometry of the cut. This guide describes that geometry and leaves interpretation aside.

## What do all house systems have in common?

Two points, which are astronomy rather than convention:

- The **Ascendant** is the degree of the ecliptic rising on the eastern horizon at that moment and place.
- The **Midheaven (MC)** is the degree of the ecliptic crossing the meridian, due south or due north of the observer.

Their opposite points are the Descendant and the IC. Because the Earth turns once in about 24 hours, the whole zodiac crosses the horizon in a day: on average a new degree rises every four minutes. That is why houses need an accurate time.

## How does each system divide the sky?

| System | What is divided | Houses equal? | MC is the 10th cusp? |
|---|---|---|---|
| Whole Sign | The zodiac itself: the sign holding the Ascendant is the whole 1st house | Yes, 30° each | No, the MC falls wherever it falls |
| Equal | The ecliptic, in 30° steps from the Ascendant degree | Yes, 30° each | No |
| Placidus | Time: each cusp marks a third of the time a degree takes to go from horizon to meridian | No | Yes |
| Koch | Time: the rising time of the Midheaven degree, trisected | No | Yes |
| Campanus | Space: the prime vertical, in twelve 30° arcs | No | Yes |
| Regiomontanus | Space: the celestial equator, in twelve 30° arcs | No | Yes |

**Whole Sign** is the oldest and the simplest. If the Ascendant is 23° Leo, the 1st house is all of Leo, the 2nd all of Virgo, and so on. Cusps are always at 0° of a sign.

**Equal** keeps the 30° houses but starts them at the Ascendant degree, so with 23° Leo rising every cusp is at 23° of its sign.

**Placidus** is a time system. Any degree of the zodiac takes a certain time to climb from the horizon to the meridian (its diurnal semi-arc). Placidus puts the 12th and 11th cusps where degrees have completed one third and two thirds of that climb. It became the default of printed tables of houses, which is most of why it is the default of software today.

**Koch** is also time-based but works from one arc only: the time the Midheaven degree itself took to rise to the meridian, divided in three, with the Ascendant computed for each of those moments.

**Campanus** and **Regiomontanus** are space systems. Both cut a great circle into twelve equal 30° arcs and project the cuts onto the ecliptic through the north and south points of the horizon. Campanus cuts the prime vertical (the circle through east, zenith and west); Regiomontanus cuts the celestial equator.

## Why do houses come out so unequal at high latitudes?

In the four quadrant systems above, the Ascendant and the MC are both fixed cusps, and the houses have to fill whatever angle lies between them. At the equator that angle stays near 90°. Further from the equator the ecliptic meets the horizon at a shallower angle, some signs rise quickly and others slowly, and the Ascendant–MC angle swings widely. A chart for 60° north can have one house of 15° and another of 50°.

## Why do Placidus and Koch fail near the poles?

Inside the polar circles (beyond about 66.5° latitude) part of the ecliptic never rises or never sets. A degree that never crosses the horizon has no semi-arc to trisect, so Placidus and Koch cusps are undefined there. Whole Sign and Equal houses only need the Ascendant, so they still work wherever an Ascendant exists.

## What happens if the birth time is unknown?

Then the Ascendant and MC are unknown, and with them every house cusp in every system. Positions of the planets can still be computed, because they change slowly over a day, with the Moon the most uncertain at about 13° per day. A common workaround is to draw the chart for noon, but that produces houses that look precise and are not. The honest alternative is to leave houses and angles out.

## Which house system should I use?

There is no astronomical reason to prefer one. They are different conventions applied to the same sky, and practitioners choose by tradition and school. What can be said factually:

- Whole Sign and Equal are the simplest and work at any latitude with an Ascendant.
- Placidus is the most widely used default in modern Western software.
- Planets near a cusp can sit in different houses under different systems, so a chart should always state which system it uses.

## Where does Ephemeris Sky fit?

[Ephemeris Sky](/ephemeris-sky/) computes the Ascendant, Midheaven, Descendant and IC and all twelve cusps in six systems: Placidus, Koch, Whole Sign, Equal, Campanus and Regiomontanus. Cusps and angles are drawn on the wheel and listed by sign and degree, and you can switch systems on the same chart to see what moves. When a birth time is unknown, it leaves houses and angles out and says why, rather than assuming noon. Everything is computed on the device. It shows the geometry; it does not interpret it.

Related: [how to read an ephemeris](/ephemeris-sky/blog/how-to-read-an-ephemeris/).

## Frequently asked questions

### Do different house systems change the planets' positions?

No. Sign, degree and aspect are the same in every system. Only the house cusps move, and with them the house a planet falls in.

### Why is the Midheaven not always the 10th house cusp?

In Whole Sign and Equal houses the cusps are set by the Ascendant alone, so the Midheaven is a separate point that can fall in the 9th, 10th or 11th house.

### How much does four minutes of birth time change the houses?

About one degree of Ascendant on average, more for signs that rise quickly at your latitude.

## Sources

- Jean Meeus, *Astronomical Algorithms*, 2nd edition (Willmann-Bell, 1998): sidereal time, the ecliptic and the horizon.
- Ralph William Holden, *The Elements of House Division* (L. N. Fowler, 1977).
