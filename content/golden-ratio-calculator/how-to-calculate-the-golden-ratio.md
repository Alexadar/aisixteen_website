---
title: How do you calculate the golden ratio?
description: The golden ratio is 1.618. Multiply by 0.618 and 0.382 to split a length, or by 1.618 to extend one. Formulas, worked design examples and common myths.
date: 2026-11-24
answer: The golden ratio φ is (1 + √5) ÷ 2 = 1.6180339887. To split a length in golden proportion, multiply it by 0.618 for the larger part and by 0.382 for the smaller. To extend a length, multiply it by 1.618. A 960 px width splits into 593 px and 367 px.
---

Two lengths are in the golden ratio when the whole is to the larger part as the larger part is to the smaller. That single sentence produces one number, and three multiplications cover every practical use of it.

![Golden Ratio Calculator with three linked fields a, b and c and the ratio constants below](/goldencalc/screenshot-960.webp "Golden Ratio Calculator: enter any one of the three values and the other two follow.")

## What is the golden ratio exactly?

Call the larger part *a* and the smaller part *b*. The definition is (a + b) ÷ a = a ÷ b. Setting that common ratio to φ gives the equation φ² = φ + 1, whose positive solution is:

**φ = (1 + √5) ÷ 2 = 1.6180339887…**

It is irrational: the decimals never end or repeat. Three constants do all the work:

| Constant | Value | Meaning |
|---|---|---|
| φ | 1.6180339887 | whole ÷ larger part, and larger ÷ smaller |
| 1 ÷ φ | 0.6180339887 | larger part ÷ whole (also φ − 1) |
| 1 ÷ φ² | 0.3819660113 | smaller part ÷ whole (also 2 − φ) |

Note that 0.618 + 0.382 = 1, as it must: the two parts make the whole.

## How do you split a length into golden sections?

Multiply the whole by 0.618 and by 0.382.

- **960 px layout:** 960 × 0.618 = 593 px for the main column, 960 × 0.382 = 367 px for the sidebar.
- **A 2.40 m wall:** 1.483 m and 0.917 m.
- **A whole of 33,333:** 20,600.93 and 12,732.07.

Check any result by dividing: 593 ÷ 367 = 1.616, as close as whole pixels allow.

## How do you go from one part to the others?

| You know | Larger part | Smaller part | Whole |
|---|---|---|---|
| The whole, *c* | c × 0.618 | c × 0.382 | c |
| The larger part, *a* | a | a × 0.618 | a × 1.618 |
| The smaller part, *b* | b × 1.618 | b | b × 2.618 |

Example: a photo's main subject area is 500 mm wide and you want the full frame in golden proportion to it. Whole = 500 × 1.618 = 809 mm; the remaining strip is 309 mm.

## How do you build a golden rectangle?

A golden rectangle has sides in the ratio 1 : 1.618. Fix one side and multiply or divide.

- Height 1,000 px → width 1,618 px (landscape), or width 618 px (portrait).
- A 16:9 screen has a ratio of 1.778 and a 3:2 photo has 1.5, so neither is golden; 16:10 (1.6) is the closest common screen shape.

Cut a square off a golden rectangle and the piece left over is another, smaller golden rectangle. Repeating this is the construction behind the familiar spiral.

## How is the golden ratio used for type and spacing?

As a modular scale: pick a base size and multiply by φ for each step.

| Step | Size from a 16 px base |
|---|---|
| Small | 10 px (16 ÷ 1.618 = 9.9) |
| Body | 16 px |
| Subhead | 26 px (25.9) |
| Heading | 42 px (41.9) |
| Display | 68 px (67.8) |

The jumps are large, which suits posters and landing pages more than dense interfaces. Many designers use √φ (about 1.272) for a gentler scale with a step in between: 16, 20, 26, 33, 42.

## How does the Fibonacci sequence relate to it?

In the sequence 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89… each number is the sum of the two before it, and the ratio of neighbours closes in on φ:

| Ratio | Value |
|---|---|
| 8 ÷ 5 | 1.6000 |
| 13 ÷ 8 | 1.6250 |
| 21 ÷ 13 | 1.6154 |
| 55 ÷ 34 | 1.6176 |
| 89 ÷ 55 | 1.6182 |

That makes Fibonacci numbers handy whole-number stand-ins: a 5 : 8 or 8 : 13 split is a golden split to within about 1%.

## Is the golden ratio really the secret of beauty?

The mathematics is exact; many popular claims about it are not. The mathematician George Markowsky reviewed the best-known ones in 1992 and found that the supposed golden proportions of the Parthenon and the Great Pyramid depend on choosing which points to measure, and that experiments do not show people reliably preferring the golden rectangle over nearby shapes. A4 and the other ISO paper sizes use 1 : √2 (1.414), not φ.

Where φ does appear in nature, it has a mechanical reason. Many plants set each new leaf or seed about 137.5° around the stem from the last, the "golden angle" (360° ÷ φ²), which packs them efficiently.

A fair summary: the golden ratio is a pleasant, well-behaved proportion and a convenient way to choose two related sizes. It is a tool, not a law.

## Where does Golden Ratio Calculator fit?

[Golden Ratio Calculator](/golden-ratio-calculator/) has three linked fields: the larger part, the smaller part and the whole. Type any one and the other two update at once, using the constants 0.6180339887, 0.3819660113 and 1.6180339887, which you can also copy. It runs on your device with no account.

## Frequently asked questions

### What is the golden ratio to 10 decimal places?

1.6180339887. Its reciprocal is 0.6180339887 and the reciprocal of its square is 0.3819660113.

### What is 61.8% and 38.2%?

The golden split of a whole: the larger part is 61.8% and the smaller is 38.2%. The larger divided by the smaller is 1.618.

### Is 16:9 a golden rectangle?

No. 16:9 is 1.778. A golden rectangle is 1.618, closest to the 16:10 shape.

## Sources

- George Markowsky, "Misconceptions about the Golden Ratio", *The College Mathematics Journal* 23 (1), 1992.
- Mario Livio, *The Golden Ratio: The Story of Phi* (Broadway Books, 2002).
