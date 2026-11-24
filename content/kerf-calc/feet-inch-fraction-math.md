---
title: How do you add, subtract and divide feet, inches and fractions?
description: Feet-inch-fraction math by hand: convert to inches, work in sixteenths, convert back. Worked examples, a decimal-to-fraction table and the saw-kerf allowance.
date: 2026-11-24
answer: Convert every dimension to inches, do the arithmetic, then convert back: divide by 12 for the feet and multiply the decimal remainder by 16 for sixteenths. 8' 4-1/2" + 3' 9-3/4" is 100.5" + 45.75" = 146.25", which is 12' 2-1/4".
---

A tape measure speaks in feet, inches and fractions; a pocket calculator speaks in decimals. Most layout mistakes happen in the translation between the two. This guide shows the method that always works, with numbers you can check.

![Kerf Calc rafter tool on Mac, showing the inputs, the formula and the cut length](/kerfcalc/screenshot-960.webp "Kerf Calc on Mac: every tool works in feet, inches and fractions and shows its formula.")

## How do you add feet, inches and fractions by hand?

Turn each measurement into inches, add, and turn the total back.

1. **To inches:** feet × 12 + inches + fraction. So 8' 4-1/2" is 96 + 4 + 0.5 = **100.5"**, and 3' 9-3/4" is 36 + 9 + 0.75 = **45.75"**.
2. **Add:** 100.5 + 45.75 = **146.25"**.
3. **Back to feet:** 146.25 ÷ 12 = 12 with 2.25 left over. That is 12 feet and 2.25 inches.
4. **Back to a fraction:** 0.25 × 16 = 4 sixteenths = 1/4.

Result: **12' 2-1/4"**.

Subtraction is the same road. 12' 2-1/4" − 5' 7-5/8" is 146.25 − 67.625 = 78.625". That is 6 feet (72") plus 6.625", and 0.625 × 16 = 10 sixteenths = 5/8. Result: **6' 6-5/8"**.

## How do you turn a decimal into a tape fraction?

Multiply the decimal part by the denominator you want and round to the nearest whole number. For sixteenths, multiply by 16.

| Decimal inch | × 16 | Fraction |
|---|---|---|
| 0.0625 | 1 | 1/16 |
| 0.125 | 2 | 1/8 |
| 0.1875 | 3 | 3/16 |
| 0.25 | 4 | 1/4 |
| 0.3125 | 5 | 5/16 |
| 0.375 | 6 | 3/8 |
| 0.4375 | 7 | 7/16 |
| 0.5 | 8 | 1/2 |
| 0.5625 | 9 | 9/16 |
| 0.625 | 10 | 5/8 |
| 0.6875 | 11 | 11/16 |
| 0.75 | 12 | 3/4 |
| 0.8125 | 13 | 13/16 |
| 0.875 | 14 | 7/8 |
| 0.9375 | 15 | 15/16 |

The same trick works for any precision: multiply by 32 for thirty-seconds or by 64 for sixty-fourths.

## How do you divide a length into equal parts without the error adding up?

Divide in decimals, but lay out from running totals, not by stepping the rounded part.

Take 12' 2-1/4" (146.25") split into 7 equal parts. 146.25 ÷ 7 = 20.892857". To the nearest sixteenth that is 20-7/8" (20.875"), which is 0.018" short each time. Step 20-7/8" seven times and you land at 146.125", a full 1/8" short of the end.

Instead, multiply first and round each mark on its own:

| Mark | Exact (in) | On the tape |
|---|---|---|
| 1 | 20.893 | 20-7/8" |
| 2 | 41.786 | 41-13/16" |
| 3 | 62.679 | 62-11/16" |
| 4 | 83.571 | 83-9/16" |
| 5 | 104.464 | 104-7/16" |
| 6 | 125.357 | 125-3/8" |
| 7 | 146.25 | 146-1/4" |

Every mark is now within 1/32" of true, and the last one lands exactly on the end.

## How do feet and inches multiply into area and volume?

Convert to decimal feet before you multiply. A slab 10' × 8' is 80 sq ft. At 4" thick, the depth is 4 ÷ 12 = 0.3333 ft, so the volume is 80 × 0.3333 = **26.67 cu ft**. Concrete is ordered by the cubic yard, and a cubic yard is 27 cu ft: 26.67 ÷ 27 = **0.99 cu yd** before any waste allowance.

Do not multiply feet by inches directly. 10' × 8' × 4 gives 320, which is neither cubic feet nor anything else.

## What is saw kerf, and when does it matter?

Kerf is the width of material a saw blade turns into dust. A full-kerf 10" table-saw blade removes about 1/8"; a thin-kerf blade removes about 3/32". Every cut costs one kerf, so a cut list has to include it.

Example: an 8-foot board (96") cut into 19" pieces with a 1/8" blade.

- Five pieces need 5 × 19" = 95", plus four cuts between them: 4 × 1/8" = 1/2". Total 95-1/2". It fits, with 1/2" left.
- Six 16" pieces need 96" of wood plus five kerfs (5/8"). The board is 5/8" too short, even though 6 × 16 = 96.

The general rule: **stock needed = pieces × length + cuts × kerf**.

## How do inches convert to millimetres exactly?

One inch is exactly 25.4 mm. This is a definition, not a rounding: the international yard was fixed at 0.9144 m in 1959. So 3/4" is 19.05 mm and a sixteenth is 1.5875 mm. Going the other way, 100 mm is 3.937", just under 3-15/16".

## Where does Kerf Calc fit?

[Kerf Calc](/kerf-calc/) is a field calculator that keeps the whole calculation in feet, inches and fractions. You enter dimensions the way you read them off the tape and read the result to the fraction you choose, from 1/8 down to 1/64. Area and volume work on the same tape. Each tool shows the formula it used. It works offline and has no account. It is a calculator, not a substitute for the code adopted where you build.

Next: [how to calculate stair rise and run to code](/kerf-calc/blog/stair-rise-and-run-to-code/).

## Frequently asked questions

### What is 0.625 inches as a fraction?

0.625" is 5/8". Multiply the decimal by 16 to get sixteenths: 0.625 × 16 = 10, and 10/16 reduces to 5/8.

### How many inches is 12 feet 2 and 1/4 inches?

146.25 inches: 12 × 12 = 144, plus 2.25.

### Should I measure in sixteenths or thirty-seconds?

Framing is normally laid out to the nearest 1/16". Finish carpentry and cabinet work often go to 1/32". Pick one precision for the job and round each mark from the exact value, not from the previous mark.

## Sources

- NIST Special Publication 811, *Guide for the Use of the International System of Units*, Appendix B (the inch is exactly 25.4 mm): [nist.gov](https://www.nist.gov/pml/special-publication-811)
