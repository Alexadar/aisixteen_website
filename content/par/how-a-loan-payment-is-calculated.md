---
title: How is a loan payment calculated?
description: The loan payment formula worked by hand on a 30-year example, the first rows of the amortization schedule, and how the note rate, APR and APY differ.
date: 2026-11-24
answer: A fixed loan payment is PMT = P × i ÷ (1 − (1 + i)^−n), where P is the amount borrowed, i is the interest rate per period and n is the number of payments. For 420,000 at 6.25% over 360 months, i is 0.0625 ÷ 12 and the payment is 2,586.01.
---

Every fixed-rate loan, from a car loan to a 30-year mortgage, is priced with one equation. Financial calculators call its five variables N, I/Y, PV, PMT and FV. This guide works the equation by hand so you can check any number a calculator or a lender gives you.

![Par time-value-of-money screen with a running tape of calculations beside it](/par/screenshot-960.webp "Par: the calculation on the left, the tape of every solve on the right.")

## What is the loan payment formula?

**PMT = P × i ÷ (1 − (1 + i)^−n)**

- **P** is the principal: the amount borrowed (PV on a calculator).
- **i** is the periodic rate: the annual note rate divided by the number of payments per year.
- **n** is the total number of payments (N).

The formula comes from one idea: the loan amount equals the present value of all the payments, each discounted at the loan's own rate.

## How do you work it for a 30-year loan?

Take 420,000 borrowed at a 6.25% note rate, paid monthly for 30 years.

1. **Periodic rate:** 0.0625 ÷ 12 = 0.00520833.
2. **Number of payments:** 30 × 12 = 360.
3. **Growth factor:** (1.00520833)^360 = 6.4892.
4. **Denominator:** 1 − 1 ÷ 6.4892 = 0.84590.
5. **Numerator:** 420,000 × 0.00520833 = 2,187.50.
6. **Payment:** 2,187.50 ÷ 0.84590 = **2,586.01** per month.

Over 360 payments that is 930,964 in total, of which 510,964 is interest. The interest is larger than the loan, which is normal at this rate and term.

## How does the payment split between interest and principal?

Each month, interest is charged on the balance still owed, and whatever is left of the payment reduces the balance.

| Payment | Interest | Principal | Balance after |
|---|---|---|---|
| 1 | 2,187.50 | 398.51 | 419,601.49 |
| 2 | 2,185.42 | 400.59 | 419,200.90 |
| 3 | 2,183.34 | 402.67 | 418,798.23 |

Interest for payment 2 is 419,601.49 × 0.00520833 = 2,185.42. The principal part grows a little every month, slowly at first: on this loan the balance does not fall below half until about year 21. That is why an extra payment early in a loan saves far more interest than the same payment late.

## Why do calculators show the payment as a negative number?

Because of the cash-flow sign convention. Money you receive is positive, and money you pay out is negative. You receive the loan (PV = +420,000), so the payments are outflows (PMT = −2,586.01). If you enter both as positive, a calculator solving for the rate or the term will report an error, because no such loan can exist.

## What is the difference between the note rate, APR and APY?

They answer three different questions, and regulations define two of them.

| Term | What it measures | Defined by |
|---|---|---|
| Note rate | The rate used to compute interest on the balance | The loan contract |
| APR | The yearly cost of credit including certain fees (the finance charge), expressed as a rate | Regulation Z (Truth in Lending), 12 CFR 1026 |
| APY | The yearly yield on a deposit including compounding | Regulation DD (Truth in Savings), 12 CFR 1030 |

**APR on a loan** is found by asking: given the payments, what rate makes them equal to the amount the borrower actually received after prepaid finance charges? In the example, if 6,000 of fees count as finance charges, the amount financed is 414,000 while the payment stays 2,586.01. Solving the same formula for the rate gives an APR of about 6.39%, above the 6.25% note rate.

**APY on a deposit** shows the effect of compounding: APY = (1 + r ÷ m)^m − 1. A 6.25% rate compounded monthly is (1.00520833)^12 − 1 = **6.43%**.

A loan's APR and a deposit's APY are not comparable; they are built differently on purpose.

## Do the day-count rules change the answer?

For a standard monthly-payment loan, no: every month is treated as one twelfth of a year. Day count matters when interest accrues by the day, as on bonds, money-market instruments and some commercial loans.

- **30/360** treats every month as 30 days and the year as 360.
- **Actual/360** counts real days but divides by 360, which yields slightly more interest per year than the stated rate.
- **Actual/365** and **Actual/Actual** count real days over a 365-day or actual-length year.

On 1,000,000 at 6% for a 31-day month, 30/360 accrues 5,000.00, Actual/360 accrues 5,166.67 and Actual/365 accrues 5,095.89. Always check which convention a document names.

## Where does Par fit?

[Par](/par/) is an offline financial calculator with ten tools: time value of money, amortization, bonds, cash flow, day count, depreciation, percent, rate conversion, real estate and statistics. Each displayed result names the authority its method follows, such as CFPB Regulation Z and Regulation DD, the US Treasury, the IRS or NIST, and a running tape keeps every calculation so you can review it. It uses no network and has no account. It is a calculator, not financial advice, and it does not replace a lender's official disclosures.

## Frequently asked questions

### What is the monthly payment on 420,000 at 6.25% for 30 years?

2,586.01 for principal and interest. Taxes, insurance and any mortgage insurance are separate and are not part of the formula.

### Why is APR higher than the interest rate?

Because APR spreads certain fees over the life of the loan. With no finance charges other than interest, APR and the note rate are the same.

### How do I find the periodic rate?

Divide the annual note rate by the number of payments per year. For monthly payments at 6.25%, 0.0625 ÷ 12 = 0.00520833.

## Sources

- Consumer Financial Protection Bureau, Regulation Z (Truth in Lending), 12 CFR Part 1026, including Appendix J on APR computation: [consumerfinance.gov](https://www.consumerfinance.gov/rules-policy/regulations/1026/)
- Consumer Financial Protection Bureau, Regulation DD (Truth in Savings), 12 CFR Part 1030, including Appendix A on APY: [consumerfinance.gov](https://www.consumerfinance.gov/rules-policy/regulations/1030/)
