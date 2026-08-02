# 06 — Contrarian Views, Risks & Open Questions

What could make this app fail, honestly stated — and what to ask the client before writing code.

---

## 1. Contrarian views & failure modes

### "Garbage in, garbage out" — the core risk
The app's value rests on figures typed by the same people it monitors. A colluding manager can fabricate a self-consistent day (fake meters + fake dip + matching cash). Mitigations (photos, GPS, totalizer monotonicity across days, variance trends, surprise audits) raise the cost of lying substantially — a fabricated day must now stay consistent with yesterday's photos, tomorrow's readings, and the tank's physical trend — but only hardware (ATG probes, pump controllers) removes trust from the loop. **Position the app honestly: it makes theft hard and visible, not impossible.** The Epump upgrade path exists for stations that outgrow it.

### Manager resistance / adoption failure
FuelCloud's top complaint ("delivery guys don't always input deliveries") is an adoption problem, not a software problem. Managers may see the app as surveillance. Counters: make submission genuinely <3 minutes; make the app useful *to the manager* (their own records, shortage protection against false accusation, price updates); owner-side nags; and the client's authority as employer. If daily compliance still fails, the product fails — this is the #1 thing to validate in week 1 of pilot.

### Competitor response
Epump could ship a hardware-free tier; Vendra could localize for Nigeria. The window is real but not permanent. Speed to a working pilot with the client's stations matters more than feature completeness.

### Price/market volatility as product risk
Margins are politically exposed (price-cap episodes squeezed retailers below breakeven for weeks in 2025). If stations become unprofitable, software subscriptions are early casualties. Mitigation: price the app against leakage recovered, not against margin.

### Single-client shape vs product shape
Building exactly what one owner wants can produce a bespoke tool nobody else can use. The research says the general market gap is real — keep the data model multi-tenant from day one (it costs almost nothing early, and enables the product play later).

### Evidence-quality caveats
- Fraud prevalence is anecdote-rich, statistics-poor; the "30% lost to fraud" figure is uncited — never quote it.
- Mordor market figures (station counts, margins, throughput) are single-source estimates.
- NCC connectivity numbers were relayed second-hand — verify at ncc.gov.ng before putting them in client-facing materials.
- All naira prices are volatile snapshots.

## 2. Open questions for the client (before build)

**Operations**
1. How many stations today, and the 2–3 year ambition? (Shapes dashboard density and pricing.)
2. Which products per station — PMS/AGO/DPK/LPG/lubricants? LPG changes the form.
3. Current daily process: paper book? WhatsApp photos? Excel? (The app should mirror, then improve, the existing ritual.)
4. Shift pattern per station (2×12h? 3×8h? 24h?) — shift-level vs day-level entry for MVP.
5. Who dips the tanks and who records meters today — manager, supervisor, or attendants?
6. Any credit customers (fleets, businesses)? Volume and terms?

**Fraud & controls**
7. What losses has he actually experienced or suspects? (Prioritizes which detections ship first.)
8. Does any station have ATG probes or automation already?
9. Does he want managers to know the variance thresholds, or should alerting be silent to the owner?

**Money & payments**
10. POS providers per station (Moniepoint, OPay, bank terminals)? Settlement timing pain?
11. How does cash get banked today, and how often?
12. Who supplies him (Dangote direct, depots, IPMAN bulk)? Does he want delivery cost tracking in MVP?

**People & devices**
13. Managers' phones — Android versions, data plans? (Confirms the offline-first budget.)
14. Literacy/comfort with apps among managers — any need for Pidgin/Hausa/Yoruba/Igbo UI later?
15. Who besides the owner needs read access (accountant, the tech consultant, partners)?

**Commercial**
16. Is this a bespoke build for him, or is he open to it becoming a product (his stations as first tenant)?
17. Budget/timeline expectations; hosting costs sit with whom?

## 3. What was NOT verified (research gaps)

- Nigerian regulatory wet-stock loss tolerance and NMDPRA dispensing "bandwidth" figures
- Shift-pattern and headcount norms per station size
- Banking cadence / float management norms
- Moniepoint/OPay public developer APIs (appear thin vs Paystack)
- Full text of the Midstream & Downstream Petroleum Operations Regulations 2025 (current siting/technical standards)

## 4. Rerun inputs

```
workflow: firecrawl-deep-research
topic: Nigerian filling station operations, management practices, fraud controls,
       regulation (NMDPRA), competitive software landscape, and mobile app
       architecture for multi-station owner monitoring
depth: exhaustive (5 parallel angles, 45+ scraped sources)
output: markdown repo (README + 6 docs + research annexes)
date: 2026-08-02
```

Research annexes with per-claim citations and quality notes: [`research/`](../research/).
