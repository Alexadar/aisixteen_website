---
title: How do you calculate stair rise and run to code?
description: Divide total rise by the maximum riser, round up, then divide back. A worked stair layout with the IRC and IBC limits for risers, treads, headroom and variation.
date: 2026-11-24
answer: Measure the total rise from finished floor to finished floor, divide by the maximum riser height (7-3/4" under the IRC) and round up to get the number of risers. Divide the total rise by that number for the exact riser. There is one tread fewer than risers.
---

A stair is laid out from one measurement: the total rise between two finished floors. Everything else follows from it and from the limits in the building code. This guide works one stair from start to finish, first to the residential code and then to the commercial one.

## What do the IRC and the IBC require for stairs?

The two model codes used across the United States set different limits. Your jurisdiction adopts one edition and may amend it, so treat these as the starting point and check locally.

| Limit | IRC (one- and two-family homes) | IBC (most other buildings) |
|---|---|---|
| Riser height | 7-3/4" maximum | 4" minimum, 7" maximum |
| Tread depth | 10" minimum | 11" minimum |
| Variation within a flight | 3/8" between the largest and smallest riser, and the same for treads | 3/8" |
| Headroom | 6' 8" minimum | 80" (6' 8") minimum |
| Nosing | 3/4" to 1-1/4", required where treads are under 11" | Projection limited to 1-1/4" |

The IRC limits are in section R311.7; the IBC limits are in section 1011. The IBC keeps the 7-3/4" and 10" figures as an exception for stairs inside dwelling units.

## How many risers do I need?

Divide the total rise by the maximum riser height and round **up**.

Worked example, IRC: total rise 106" (8' 10"), finished floor to finished floor.

1. 106 ÷ 7.75 = 13.68. Round up: **14 risers**.
2. Exact riser: 106 ÷ 14 = 7.5714", which is **7-9/16"** on the tape (7.5625").
3. Treads: one fewer than risers, because the upper floor is the last step. **13 treads**.
4. Total run at the 10" minimum tread: 13 × 10" = 130" = **10' 10"**.

Rounding down to 13 risers would give 106 ÷ 13 = 8.15", which is over the limit. Always round up.

The same stair to the IBC: 106 ÷ 7 = 15.14, so 16 risers of 6.625" (6-5/8"), 15 treads, and a total run of 15 × 11" = 165" (13' 9"). The commercial stair is almost three feet longer on plan for the same rise.

## How long is the stringer?

The stringer is the hypotenuse of the total rise and the total run.

For the IRC stair: √(106² + 130²) = √28,136 = **167.7"**, about 13' 11-3/4". Order stock longer than that: a 14-foot board is 168" and leaves almost nothing for the plumb and level cuts at each end, so this stair wants a 16-footer.

The pitch is the angle whose tangent is riser ÷ tread: arctan(7.571 ÷ 10) = **37.1°**.

## Why do the risers have to match within 3/8 inch?

People stop looking at a stair after the first two steps and walk by rhythm. A single odd riser is where they trip. The code limit is 3/8" between the largest and the smallest riser in a flight.

Two things break the limit in practice:

- **Floor finishes.** Lay out from *finished* floor to *finished* floor. If 3/4" hardwood goes down upstairs after the stringers are cut, the top riser grows by 3/4".
- **Stepping off a rounded number.** Seven-and-nine-sixteenths is 0.009" short of the exact riser. Over 14 risers that is 1/8". Mark each riser from the bottom as a running total (7.571, 15.143, 22.714…) and round each mark by itself.

Remember the bottom of the stringer too: it sits on the floor, and the first tread adds its own thickness. Cut the tread thickness off the bottom of the stringer so the first riser matches the rest.

## Is there a comfort rule as well as the code?

Yes. A long-standing rule of thumb says two risers plus one tread should come to about 24" to 25". The IRC example gives 2 × 7.57 + 10 = 25.1", at the steep end. A 10-1/2" tread would lengthen the run to 136-1/2" and make the stair easier to walk, if the plan has the room. The rule is a guide; the code limits are the requirement.

## How does headroom get checked?

Headroom is measured vertically from the sloped line that joins the tread nosings up to the lowest thing above it: a beam, a soffit, the edge of the floor opening. The minimum is 6' 8". On a stair with a 37° pitch, the opening in the floor above has to be long enough that a person 6' 8" tall clears its edge, which is why the stairwell opening is usually much longer than people expect.

## Where does Kerf Calc fit?

[Kerf Calc](/kerf-calc/) has a stair tool that takes the total rise and checks the riser, tread and headroom against the IRC or IBC limits as you type, and shows the formula and the code section it cites. It gives the layout in feet, inches and fractions. It runs offline. It is a field calculator: confirm the result against the code adopted where you build, and against your inspector.

Related: [feet-inch-fraction math by hand](/kerf-calc/blog/feet-inch-fraction-math/).

## Frequently asked questions

### What is the maximum riser height for a house?

7-3/4" under the International Residential Code (R311.7.5.1). Local amendments can differ, and some jurisdictions use 8" or 8-1/4".

### Is the number of treads the same as the number of risers?

No. A straight flight has one tread fewer than risers, because the upper floor acts as the last tread.

### How much can stair risers vary?

By no more than 3/8" between the tallest and the shortest riser in one flight, under both the IRC and the IBC.

## Sources

- International Residential Code 2021, section R311.7, Stairways: [codes.iccsafe.org](https://codes.iccsafe.org/content/IRC2021P2/chapter-3-building-planning)
- International Building Code 2021, section 1011, Stairways: [codes.iccsafe.org](https://codes.iccsafe.org/content/IBC2021P2/chapter-10-means-of-egress)
