---
title: How do you read an ephemeris?
description: An ephemeris lists where the Sun, Moon and planets are at a set time each day. How to read the columns, convert your time, and interpolate a position.
date: 2026-11-24
answer: An ephemeris is a table of planetary positions for a fixed time each day, usually 00:00 UT. Find the date row, read each body's zodiac longitude in degrees and minutes, and interpolate between two rows for any other time of day after converting your local time to UT.
---

An ephemeris (plural: ephemerides) is a table of where the Sun, Moon and planets are, computed for a regular step of time. Astronomers use one to point a telescope. Astrologers use one to draw a chart. The table is the same kind of object in both cases: numbers, not meanings.

![Ephemeris Sky showing a saved natal chart wheel, as shown on the App Store](/ephemeris_sky/screenshot-960.webp "A chart wheel is an ephemeris row drawn as a circle.")

## What does each column in an ephemeris mean?

A printed astrological ephemeris has one row per day and one column per body.

| Column | What it holds |
|---|---|
| Date | The calendar day. The positions are for one fixed moment on that day, stated on the page: midnight (00:00) or noon (12:00), in Universal Time. |
| Sidereal time | The sidereal time at Greenwich at that moment. It is used to find the Ascendant and the houses. |
| Sun, Moon, Mercury … Pluto | Each body's ecliptic longitude, written as degrees and minutes inside a zodiac sign: 14°♉32′ means 14 degrees 32 minutes of Taurus. |
| R or D marks | R where a planet turns retrograde, D where it turns direct. |
| Lunar node | The point where the Moon's orbit crosses the ecliptic, as mean or true node. |

Signs are 30° each, starting from 0° Aries. So 14°32′ Taurus is 30° + 14°32′ = 44°32′ of absolute longitude. Software usually works in the absolute number and prints the sign form.

## Which time does an ephemeris use?

Universal Time (UT), which for this purpose matches Greenwich Mean Time. Before you look anything up, convert your local clock time to UT, including daylight saving.

Example: 10:30 in New York in July is Eastern Daylight Time, UT−4, so it is 14:30 UT on the same date. 22:30 in Tokyo is UT+9, so it is 13:30 UT. A late-evening time west of Greenwich can land on the *next* UT date: 21:00 in Los Angeles in winter (UT−8) is 05:00 UT the following day.

Check whether your ephemeris is a midnight or a noon edition. Reading a noon table as if it were midnight puts the Moon about 6.5° out.

## How do you find a position between two rows?

By linear interpolation. Take the motion over 24 hours and scale it by the fraction of the day that has passed.

Worked example, Moon, midnight ephemeris:

- Day 1, 00:00 UT: 12°00′ Taurus
- Day 2, 00:00 UT: 25°12′ Taurus
- Daily motion: 13°12′, which is 13.2°

For 15:30 UT on day 1, the fraction of the day is 15.5 ÷ 24 = 0.6458. The Moon has moved 0.6458 × 13.2° = 8.525°, which is 8°31′. Add it to the starting position: **20°31′ Taurus**.

Linear interpolation is good to a few arcminutes for the Moon and far better for everything else, because the other bodies move much more slowly:

| Body | Typical daily motion |
|---|---|
| Moon | about 12° to 15° (mean 13°11′) |
| Sun | about 1° (mean 0°59′) |
| Mercury | up to about 2°, and backwards when retrograde |
| Venus | up to about 1°15′ |
| Mars | up to about 0°47′ |
| Jupiter | up to about 0°14′ |
| Saturn | up to about 0°08′ |

When a planet is retrograde the next day's longitude is *smaller*. The method is the same; the motion is negative.

## What does retrograde mean in the table?

A planet is retrograde when its longitude, seen from the Earth, is decreasing. Nothing reverses in space: the Earth and the planet are both moving around the Sun, and the line of sight between them swings backwards for a while, the way a slower car seems to drift back as you pass it. The days on which the motion changes direction are the stations. Mercury does this about three times a year, for roughly three weeks each time.

## Geocentric or heliocentric, tropical or sidereal?

These two choices change every number in the table, so check them first.

- **Geocentric** positions are as seen from the centre of the Earth. **Heliocentric** positions are as seen from the Sun. Chart work is geocentric.
- **Tropical** longitude is measured from the March equinox point. **Sidereal** longitude is measured against the stars and currently differs by about 24°, the exact figure depending on the reference (ayanamsa) chosen.

## How accurate does an ephemeris need to be?

For a chart, an arcminute or two is ample: the Sun moves one arcminute in about 24 minutes of time, and most birth times are not known that well. The practical reference for checking any ephemeris is NASA's JPL Horizons system, which serves positions from the same planetary solutions used for spacecraft navigation.

## Where does Ephemeris Sky fit?

[Ephemeris Sky](/ephemeris-sky/) computes the table on your device for any date and time, so there is nothing to interpolate. It gives geocentric, tropical positions referred to the equinox of date for the Sun, Moon and planets out to Pluto, with sign, degree and minute, daily motion and retrograde marked. Its positions are validated against JPL Horizons across 1900 to 2100: better than 7 arcminutes for every body, typically under 2. It works offline. It computes positions and shows the numbers; it does not interpret them or predict anything.

Related: [Placidus, Koch and Whole Sign houses compared](/ephemeris-sky/blog/house-systems-compared/).

## Frequently asked questions

### What time is an ephemeris calculated for?

For one fixed moment each day, printed on the page: 00:00 or 12:00 Universal Time. Convert your local time to UT before you read it.

### How far does the Moon move in a day?

Between about 12° and 15° of longitude, 13°11′ on average, which is why the Moon is the body that most needs interpolating.

### Is an ephemeris astronomy or astrology?

The table itself is astronomy: computed positions. Astrology is one of the things people do with it.

## Sources

- NASA Jet Propulsion Laboratory, Horizons System: [ssd.jpl.nasa.gov/horizons](https://ssd.jpl.nasa.gov/horizons/)
- Jean Meeus, *Astronomical Algorithms*, 2nd edition (Willmann-Bell, 1998), chapters on sidereal time and interpolation.
