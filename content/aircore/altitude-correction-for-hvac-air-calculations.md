---
title: Why does altitude change HVAC air calculations?
description: The 1.08, 4840 and 4.5 factors assume sea-level air. Where they come from, how to correct them for elevation, and a worked airflow example at 5,000 ft.
date: 2026-11-24
answer: The familiar air-side factors (1.08 for sensible heat, 0.68 or 4840 for latent, 4.5 for total) contain the density of standard sea-level air, 0.075 lb/ft³. Air is thinner at elevation, so each factor must be multiplied by the density ratio: about 0.83 at 5,000 ft, where 1.08 becomes 0.90.
---

Most air-side rules of thumb are the sea-level case of a more general equation. At a coastal site that does not matter. In Denver, Albuquerque or Mexico City it is a 17 to 25 percent error in airflow or capacity. This guide derives the factors, corrects them, and works one example.

![AirCore psychrometric screen with air-state inputs beside a psychrometric chart](/aircore/screenshot-960.webp "AirCore: the air state as numbers and as a point on the chart.")

## Where do 1.08, 4840 and 4.5 come from?

All three are a unit conversion wrapped around the density of standard air: 0.075 lb per cubic foot, which is dry air at about 70 °F and sea-level pressure (14.696 psia).

| Equation (IP units) | Factor | What is inside it |
|---|---|---|
| Sensible heat: q = 1.08 × cfm × ΔT | 1.08 | 0.075 lb/ft³ × 60 min/h × 0.24 Btu/lb·°F |
| Latent heat: q = 4840 × cfm × ΔW | 4840 | 0.075 × 60 × about 1,076 Btu/lb, with W in lb of water per lb of dry air |
| Latent heat, grains: q = 0.68 × cfm × Δgr | 0.68 | 4840 ÷ 7,000 grains per lb |
| Total heat: q = 4.5 × cfm × Δh | 4.5 | 0.075 × 60, with h in Btu/lb |

Check the first: 0.075 × 60 × 0.24 = 1.08. The 0.24 is the specific heat of dry air; some references use 1.10, which folds in a little moisture.

The point is that a fan moves **volume** (cfm), but heat is carried by **mass** (pounds of air). Density is the bridge between them, and density is what altitude changes.

## How much thinner is the air at elevation?

The ASHRAE standard atmosphere gives barometric pressure from elevation Z in feet:

**p = 14.696 × (1 − 6.8754 × 10⁻⁶ × Z)^5.2559 psia**

At the same temperature, air density is proportional to pressure, so the density ratio is simply p ÷ 14.696.

| Elevation (ft) | Pressure (psia) | Density ratio | 1.08 becomes | 4.5 becomes |
|---|---|---|---|---|
| 0 | 14.70 | 1.00 | 1.08 | 4.50 |
| 2,500 | 13.42 | 0.91 | 0.99 | 4.11 |
| 5,000 | 12.23 | 0.83 | 0.90 | 3.74 |
| 7,500 | 11.13 | 0.76 | 0.82 | 3.41 |
| 10,000 | 10.11 | 0.69 | 0.74 | 3.09 |

## What does the correction do to a real number?

Take a supply fan delivering 2,000 cfm with a 20 °F temperature rise across a heating coil.

- **Sea-level factor:** q = 1.08 × 2,000 × 20 = **43,200 Btu/h**.
- **At 5,000 ft:** q = 1.08 × 0.832 × 2,000 × 20 = **35,900 Btu/h**.

The same fan, the same coil temperature rise, 17% less heat delivered. Turn it around: to deliver the full 43,200 Btu/h at 5,000 ft with a 20 °F rise, the fan must move 43,200 ÷ (0.899 × 20) = **about 2,400 cfm**.

This is why equipment selected from sea-level tables comes up short at altitude, and why a measured ΔT that "proves" capacity with the 1.08 factor overstates it.

## Does altitude change the psychrometric chart too?

Yes. A printed psychrometric chart is drawn for one barometric pressure, usually sea level. At a lower pressure, air at the same dry-bulb temperature and relative humidity holds *more* water per pound of dry air, has a higher enthalpy and a larger specific volume.

Example, 75 °F and 50% relative humidity:

| Property | Sea level | 5,000 ft |
|---|---|---|
| Humidity ratio | about 65 gr/lb | about 78 gr/lb |
| Enthalpy | about 28.1 Btu/lb | about 30.2 Btu/lb |
| Specific volume | about 13.7 ft³/lb | about 16.5 ft³/lb |
| Dew point | about 55 °F | about 55 °F |

Dew point barely moves, because it depends on the vapour pressure, not on the total pressure. The other properties move enough to change a coil selection. ASHRAE publishes separate charts for 5,000 and 7,500 ft for this reason; software simply uses the right pressure.

## How many properties do you need to fix an air state?

Two, plus the barometric pressure. Moist air has seven commonly used properties: dry bulb, wet bulb, dew point, relative humidity, humidity ratio, enthalpy and specific volume. Any two independent ones determine the rest. A few pairs do not work, because they carry the same information: dew point and humidity ratio, for example, are both statements of how much water is in the air.

## Where does AirCore fit?

[AirCore](/aircore/) is an air-side calculator for HVAC technicians, designers and contractors. You enter any two of the seven properties and it solves the rest and plots the point on a psychrometric chart. Site elevation sits in the toolbar of every screen, and every number is corrected to it, so the sea-level assumption cannot slip in unnoticed. It also does air-side heat in any direction, air mixing weighted by mass, duct sizing from friction, fan laws, and pipe sizing by Darcy–Weisbach or Hazen–Williams. Its psychrometric values are checked against CoolProp and IAPWS-95 reference data. It runs offline on iPhone, iPad, Mac and Apple Watch.

What it does not do: it has no fitting library and it does not perform load calculations. It computes air properties and sizes from the inputs you give it.

## Frequently asked questions

### What is the 1.08 factor at 5,000 ft?

About 0.90. Multiply 1.08 by the density ratio, 12.23 ÷ 14.696 = 0.832.

### Do fans move less air at altitude?

A fan at a fixed speed moves the same volume (cfm) at any density, but less mass, so it carries less heat and develops less pressure. Fan power falls in the same proportion as density.

### Does dew point change with altitude?

Very little for the same moisture content by vapour pressure. Humidity ratio, enthalpy and specific volume change noticeably.

## Sources

- ASHRAE, *Handbook: Fundamentals*, chapter 1, Psychrometrics (standard atmosphere equation, moist-air properties, air-side heat equations).
- CoolProp, humid-air properties (HAPropsSI), an open reference implementation: [coolprop.org](http://www.coolprop.org/fluid_properties/HumidAir.html)
