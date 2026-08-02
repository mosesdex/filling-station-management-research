# Filling Station Management App — Deep Research

**Project:** Mobile app for a multi-station filling station owner in Nigeria. Station managers submit daily figures from each station; the owner monitors every station live from his phone.

**Audience:** the development team and the client. This research explains how Nigerian filling stations actually work, where money leaks, what competing software exists, and exactly what the app must do to be genuinely useful — not just a form-filling tool.

**Research date:** 2 August 2026 · 5 parallel research tracks · 45+ sources (official gazettes, national press, regulator sites, vendor documentation, practitioner forums). Every factual claim in the detailed docs carries a source link and a quality note.

---

## Executive Summary

Nigeria's downstream fuel market changed completely between 2023 and 2026. Subsidy removal (May 2023) and the Dangote refinery (petrol from Sept 2024) turned station ownership from a fixed-margin licence business into a volatile trading business: pump prices moved between ₦739/L and ₦1,250+/L, ex-depot prices can flip overnight, and a wrongly-timed 45,000 L truckload can put a station underwater. In this environment, **an owner's biggest risks are (1) not knowing his real daily numbers fast enough, and (2) internal leakage** — attendant tricks, cash skimming, short deliveries, and manager-level diversion (real cases include a manager charged over ~₦500m in diverted sales and another who diverted 26,700 litres of a 40,000 L delivery).

The good news: the entire industry already runs on two simple daily controls — **pump totalizer (meter) readings and tank dip readings** — reconciled against cash + POS + transfer takings. The math is standard and fully computable: litres sold = closing meter − opening meter; expected stock = opening dip + deliveries − sales; variance = actual dip − expected stock. Today most independent stations do this on paper, which is exactly why fraud survives. Nigerian evidence shows automation is what lets owners scale: one operator grew from 18 to 89 stations after automating; another reclaimed leased-out stations and grew from 73 to 176.

The competitive landscape is **barbell-shaped**: hardware-heavy enterprise systems (Epump, Smartflow, RockEye — all requiring pump controllers or tank probes, all sales-led with hidden pricing) on one end, and ₦0–₦5k generic Android ledger apps (single-device, no owner visibility) on the other. **The middle is nearly empty: a software-only, offline-first mobile app where managers submit structured daily figures in under 3 minutes and the owner sees every station's litres, cash, and variance on his phone.** That is precisely the app the client asked for, and this research shows it can deliver perhaps 80% of the accountability of hardware automation at 0% of the hardware cost.

## Key Findings

1. **Daily reconciliation is the product.** The core loop — per-attendant meter reconciliation, per-tank dip-vs-book variance, cash/POS/transfer split — is documented Nigerian audit practice. The app digitizes an existing ritual; it does not have to teach a new one. *(Docs 2, 5)*
2. **Variance trend analysis catches theft and leaks.** Track each tank's cumulative % variance against its own "normal"; alert on trend breaks (guideline triggers: +0.1% off monthly normal, +10 L/day, +300 L/month). Single-day noise is normal; trends are evidence. *(Docs 2, 3)*
3. **Fraud is well-documented and specific.** A rich, sourced inventory of attendant tricks (meter no-reset, distraction, display blocking), manager-level diversion (EFCC/NSCDC cases), and short deliveries. Each vector maps to a concrete app control. *(Doc 3)*
4. **Delivery verification is a first-class workflow**, not a footnote: waybill vs per-compartment discharge vs before/after dips. This exact control would have caught the 26,700 L Nasarawa diversion. *(Docs 2, 3)*
5. **Under-dispensing is a regulatory survival issue.** NMDPRA's "Operation One Litre for One Litre" seals stations outright (11 sealed in Rivers in one day, Feb 2026). Calibration tracking belongs in the app. *(Docs 1, 3)*
6. **Offline-first is non-negotiable.** 238 telco outages in January 2026 alone; POS terminals halt when towers drop. Submissions must queue locally and sync later, with visible pending/synced status. *(Doc 5)*
7. **Payments are a three-way split.** Cash 33.6%, card 27.3%, transfer 13.6% at Nigerian stations; 91% of stations run POS; the FG has mandated POS/transfer acceptance. The daily form must capture the split natively. *(Doc 2)*
8. **Data integrity beats data entry.** Manual figures are only trustworthy with append-only records (corrections as new rows, never edits), in-app camera-only photo evidence of meters and dip sticks, GPS + server timestamps, and server-side computation of all derived numbers. *(Doc 5)*
9. **No Nigerian competitor publishes pricing, and none is software-only.** Transparent per-station Naira pricing with a free tier would be unique in the market. *(Doc 4)*
10. **Recommended stack:** Expo/React Native + Supabase (Postgres row-level security for owner/manager roles, pg_cron + Edge Functions for the owner's nightly digest and "manager hasn't submitted" nags, local SQLite write-queue for offline). *(Doc 5)*

## Document Map

| Doc | Contents |
|---|---|
| [01 — Industry Context](docs/01-industry-context.md) | NMDPRA licensing and fees, PIA 2021, deregulation, Dangote, industry bodies, station economics |
| [02 — Station Operations](docs/02-station-operations.md) | Staff roles, daily open/close, shift reconciliation, wet stock, deliveries, cash and payments |
| [03 — Fraud & Controls](docs/03-fraud-and-controls.md) | Threat model (attendant/manager/delivery), real cases, detection methods, controls stack |
| [04 — Competitive Landscape](docs/04-competitive-landscape.md) | Nigerian + global products, feature matrix, pricing, gap analysis, positioning |
| [05 — App Blueprint](docs/05-app-blueprint.md) | Personas, feature set, daily-form spec, alert rules, data model, architecture, roadmap |
| [06 — Risks & Open Questions](docs/06-risks-and-open-questions.md) | Contrarian views, failure modes, questions to ask the client, rerun inputs |

## The One-Line Pitch

> **"Epump-grade visibility without the hardware."** Managers submit meter readings, dip readings, and the cash/POS/transfer count in under 3 minutes — even offline. The owner opens his phone at 9pm and sees every station's litres sold, expected vs actual cash, and tank variance, with alerts when anything drifts.
