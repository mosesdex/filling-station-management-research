# 03 — Fraud, Theft & Loss: The Threat Model the App Defends Against

Defensive/detection focus for a legitimate multi-station owner. Nigerian evidence throughout; forum anecdotes are used for threat modelling (what happens), never for prevalence statistics (how often).

---

## 1. Attendant-level fraud

The richest documented inventory comes from first-hand Nigerian accounts ([Nairaland thread](https://www.nairaland.com/6433076/numerous-ways-fuel-attendants-nigeria), corroborated by the [Punch investigation](https://punchng.com/meter-scam-fuel-attendants-drivers-in-battle-of-wits/)):

| Trick | Mechanism | Who loses |
|---|---|---|
| **No-reset / "selling on top"** | Dispense continuing from previous sale's meter; most-reported trick | Customer |
| Recall past sale | Digital pumps show a completed amount without fuel flowing | Customer |
| Distraction | Conversation, or collusion with hawkers, during dispensing | Customer |
| Display blocking | Hose or body blocks the meter display; or use a pump facing away | Customer |
| Power-cut wipe | Mid-dispense outage; attendant calls out an inflated figure | Customer |
| Unhooked nozzle | Nozzle hung without engaging reset | Customer |
| Systematic short-changing | Sub-₦100 amounts across dozens of vehicles daily | Customer |
| Counterfeit-note swap | Genuine notes swapped for pre-held fakes | Customer |
| **Jerry-can side sales** | Selling to black market during scarcity, off the books | **Owner** |
| **Cash skimming** | Pocketing takings; surfaces as shift shortage | **Owner** |

Customer-side fraud still hurts the owner — NMDPRA seals stations for under-dispensing (see §4), and reputational damage moves traffic to competitors. Context: attendant wages are very low; incentive design (transparent shortage tracking, not just punishment) matters.

## 2. Manager-level fraud — the expensive tier

Real, sourced Nigerian cases:

- **Sales diversion:** EFCC arrested the manager of an Emadeb Energy station over alleged diversion of **~₦500 million** of his employer's sales (Oct 2025, [EFCC official](https://x.com/officialEFCC/status/1973826270762074248), Channels TV). Allegation stage, not conviction.
- **Diverted delivery:** the manager of Lamido Petroleum (Nasarawa) received a 40,000 L truck but discharged only **13,300 L**, diverting 26,700 L to sell at scarcity prices elsewhere ([Premium Times](https://www.premiumtimesng.com/news/more-news/258384-nscdc-arrest-petrol-station-manager-fuel-diversion.html), Vanguard).
- **Under-reported sales / ghost entries:** Nigerian auditor (ACA) checklists explicitly test for altered meter readings and **attendant–manager collusion** to under-report sales.
- **Falsified dips:** no named Nigerian case found **[INFERRED vector]** — but audit checklists requiring independent dip verification exist precisely because self-reported dips are falsifiable.
- In-transit siphoning by tanker drivers is common enough that owners fit tankers with CCTV **[anecdotal]**.

Before automation, per a Fuelmetrics co-founder ([BusinessDay](https://businessday.ng/interview/article/ai-to-boost-fraud-detection-automate-decisions-in-fuel-stations/)): the sector was "heavily reliant on manual processes, which led to many thefts and inventory discrepancies."

## 3. Detection: wet-stock variance analysis

The universal method (Doc 2 §4) is also the fraud detector:

- **Shift-level:** per-attendant shortage = takings − (litres × price). Catches skimming same-day.
- **Tank-level:** daily variance = dip − book stock. Catches unrecorded sales (meter bypassed → dip drops faster than meters), delivery shortfalls, and leaks.
- **Trend-level:** cumulative % variance per tank vs its own baseline. Separates theft/leak (persistent one-direction drift) from benign noise (temperature, meter drift, dip error). Continuous reconciliation can even isolate variance to a specific dispenser.
- **Cross-signal:** meter drift shows when one pump's variance share rises; tank loss is constant across pumps; temperature effects are seasonal.

Delivery verification (before/after dips vs waybill per compartment) is the control that catches diversion — it would have caught the Nasarawa case at the forecourt.

## 4. The regulatory angle: dispensing accuracy = survival

- NMDPRA's **"Operation One Litre for One Litre"**: 11 stations sealed in Rivers State in one day for under-dispensing (Feb 2026, [Punch](https://punchng.com/nmdpra-seals-11-petrol-stations-in-rivers-for-under-dispensing-product-others/)). Quote: *"It is either you're dispensing within the bandwidth or we shut you down."*
- Stations sealed in Ogun for under-dispensing; tampering with NMDPRA seals is separately sanctionable.
- Weights & Measures separately seals inaccurate pumps.
- Exact NMDPRA tolerance bandwidth not published in found sources **[GAP]**.

A sealed station is a 100% revenue stop. Calibration logs and dispensing-accuracy checks in the app are regulatory insurance, not bureaucracy.

## 5. The controls stack (what the app implements)

1. **Per-shift, per-nozzle reconciliation** — the atomic unit. Catches skimming and unrecorded sales daily.
2. **Daily tank variance + cumulative trend with per-tank baselines** — alert on trend breaks, not single-day noise.
3. **Delivery verification workflow** — ordered vs waybill vs per-compartment vs before/after dips, with photos.
4. **Dual/independent dips** — dip recorded by one person, verified by another (or later, an ATG); flag divergence.
5. **Separation of duties** — who dispenses ≠ who counts cash ≠ who dips ≠ who reports. In a small station this is partly aspirational; the app enforces what it can (roles, independent photo evidence).
6. **Immutable records** — no edits, only superseding corrections with full history (Doc 5). An owner reviewing a dispute sees who changed what, when.
7. **Cashless bias with offline tolerance** — POS/transfer reduces skimmable cash; but design for network failure (Nigerian reality).
8. **Compliance dashboard** — calibration due dates, licence renewals, seal status.
9. **Surprise audit support** — owner can demand an unscheduled mid-day submission (dip + meters + photos) from his phone; deviation from the daily pattern is itself a signal.

## 6. Evidence that this works at scale in Nigeria

[BusinessDay interview](https://businessday.ng/interview/article/ai-to-boost-fraud-detection-automate-decisions-in-fuel-stations/) (vendor-sourced but specific): one Epump customer grew **18 → 89 stations** after automating; another had leased out stations "because they could not entirely manage the network," took them back post-automation, and grew **73 → 176**. Remote visibility is what lets a Nigerian owner scale beyond the stations he can personally stand in.

**The widely-quoted "30% of fuel budget lost to fraud" figure is uncited/promotional — do not use it in client materials.** The sourced cases above are stronger evidence anyway.
