# 02 — How a Nigerian Filling Station Runs Day to Day

The operational playbook the app must digitize. Assembled from Nigerian job ads, practitioner audit checklists, vendor training curricula, a national newspaper investigation, and standard fuel-retail practice (flagged **[GLOBAL]** where the source is not Nigerian).

---

## 1. Staff structure

Typical hierarchy at a Nigerian station (assembled from job ads and practitioner posts — no single authoritative org chart exists):

```
Owner (often multiple stations, off-site)
└── Station Manager        — overall P&L, reconciliation, deliveries, compliance
    ├── Supervisor         — floor control, pump checks, staff briefing
    ├── Cashier(s)         — collects & accounts for attendants' takings
    ├── Pump Attendants    — dispense AND take payment at the pump
    ├── Security           — night guards, anti-siphoning
    └── Support            — cleaners, lube bay / car wash where present
```

Key Nigerian specifics:

- **Attendants both dispense and collect payment** (cash, POS, transfer) at the pump — full-service, not self-service ([Fatgbems pump-attendant job ad](https://www.myjobmag.com/job/pump-attendant-fatgbems-petroleum-company-limited-1)). Minimum SSCE, basic numeracy, shift work.
- **The cashier is the aggregation point**: "Collect and account for all daily cash sales from pump attendants… Reconcile pump readings and sales figures" (Delta State cashier job ad).
- Manager pay benchmarks ₦150k–200k+/month (2025-26 job ads); attendant pay is very low (anecdotally ~₦30k) — which matters for fraud incentive design (Doc 3).
- Many stations rely on casual/temporary attendants; staff turnover is a data-quality risk the app should tolerate (attendants are records, not necessarily app users).

## 2. The two daily controls: dip and meter

Everything reduces to two physical measurements, taken at open, at shift change, and at close:

1. **Tank dip** — a calibrated dip stick lowered into each underground tank; reading converted to litres via the tank's calibration chart. (Larger operators use Automatic Tank Gauges — SmartFlow claims 1,000+ probes in Nigeria — but independents mostly dip manually.)
2. **Pump totalizer (meter) reading** — each nozzle's cumulative counter. Not resettable in normal operation, which is what makes it auditable.

Nigerian audit checklists (circulating among chartered accountants and station business groups) are explicit: *perform physical dip; check daily fuel logs and meter readings; match fuel sales to cash and POS receipts; trace deliveries against waybills and the stock book.*

## 3. Shift reconciliation — the core math

Per nozzle, per attendant, per shift:

```
litres_sold      = closing_meter − opening_meter
expected_takings = litres_sold × pump_price
shortage/overage = (cash + POS + transfers + authorized_credit) − expected_takings
```

The cashier aggregates attendants; the manager reconciles the day. Standard 7-step shift closure **[GLOBAL — FuelSetu]**: record opening readings → closing readings → verify sales vs transactions → reconcile by payment method → tie credit sales to customers → confirm inventory movement → generate shift report before handover.

Common failure points: counting errors, delayed entries, wrong nozzle readings, credit sales not booked to the right customer — all paper-process problems the app eliminates by computing everything server-side.

**[UNVERIFIED]** Shift patterns (2×12h vs 3×8h, 24h operation) vary by location and security; the app should support configurable shifts per station rather than assuming a pattern.

## 4. Wet stock management — where leaks and theft show up

Per tank, per day (method from the [EPA-aligned wetstock reconciliation guide](https://www.besmart.ie/fs/doc/Small_Business/Documents/Wetstock_Reconciliation_at_Fuel_Storage_Facilities.pdf), **[GLOBAL]** but universal):

```
book_stock     = opening_stock + deliveries − metered_sales
daily_variance = closing_dip − book_stock
cumulative_%_variance = cumulative_variance ÷ cumulative_sales × 100
```

Critical insight: **every tank has a "normal" small persistent loss** (temperature — petrol volume changes ~0.11%/°C, evaporation, meter calibration drift, delivery measurement error). The control objective is detecting a **change from that normal trend**, not chasing zero variance. Practical investigation triggers from the guide:

- variance worsens by **+0.1%** vs the tank's monthly normal, or
- an extra **10 L/day** loss over a month, or
- an extra **300 L/month** loss.

Nigerian regulatory loss-tolerance figures were not found **[UNVERIFIED]** — the trend-based method stands on its own.

## 5. Deliveries and restocking

Supply chain today: pay the depot **upfront** → truck loads at Dangote gantry / coastal or private depot → tanker arrives with waybill. Verification procedure (Nigerian audit checklists + standard practice):

1. Check waybill and meter tickets against the order before offloading
2. Check compartment seals; dip/ullage each compartment against the waybill
3. Dip the receiving tank **before** discharge
4. Discharge one compartment at a time
5. Dip again **after settling (~5 min)**; delivered volume = after − before
6. Water-paste check for water bottom; note fuel temperature (warm fuel shrinks)
7. Sign waybill; record delivery + unit cost in the stock book

This workflow is a first-class app feature, not an afterthought — see the diverted-delivery case in Doc 3.

Ex-depot price volatility (Doc 1) means every delivery carries its own unit cost; margin must be computed against the actual cost of the fuel in the tank.

## 6. Cash, POS, and transfers

From Moniepoint's Dec 2025 "Fueling the Nation" report (via [TechNext](https://technext24.com/reviews/digital-payment-nigerian-fuel-stations/)):

- Payment mix at Nigerian fuel stations: **cash 33.6%, card 27.3%, transfer 13.6%, mobile money 3.6%** (43% digital overall)
- **91% of stations run POS terminals**; a 2023 FG directive mandates POS/transfer acceptance
- **9 in 10 stations depend on same-day settlement** because depots demand upfront payment — cash-flow timing is an owner-level anxiety the dashboard should surface

Operational cash controls: drop safes, limited cash on site (robbery risk), counterfeit-note vigilance, daily banking **[banking cadence UNVERIFIED — standard practice assumed]**.

## 7. Products

| Code | Product | Notes |
|---|---|---|
| PMS | Premium Motor Spirit (petrol) | Price changes frequently post-deregulation; displayed price must match |
| AGO | Automotive Gas Oil (diesel) | Big B2B line (generators); deregulated earlier |
| DPK | Dual Purpose Kerosene | Declining with LPG adoption |
| LPG | Cooking gas | Separate skid/plant, own safety protocols; fastest-growing |
| Lubricants | Shop/forecourt sales | Higher margin; attendants trained to upsell |

Each liquid product has dedicated tanks and dispensers — the app's data model is per-tank and per-nozzle, with products as configuration.

## 8. Nigeria-specific operating realities

- **Power:** stations self-generate; diesel self-consumption is a real operating cost worth logging as an expense category.
- **Scarcity cycles:** queue management, rationing, jerrycan bans become live tasks; demand can spike 5× overnight.
- **Security:** CCTV and night guards common; cash-in-transit risk shapes banking.
- **Price display compliance:** posted board must match the approved price — supervisors brief staff on pricing daily.
- **Customer distrust is ambient:** the Punch investigation ("[Meter scam: fuel attendants, drivers in battle of wits](https://punchng.com/meter-scam-fuel-attendants-drivers-in-battle-of-wits/)") documents a market where customers actively watch the meter — a station with visibly tight controls is also a consumer-trust asset.

**App implication summary:** the app's daily submission form is exactly the paper ritual above — opening/closing meters per nozzle, dips per tank, deliveries with unit cost, takings split by cash/POS/transfer/credit, expenses — with all derived numbers (litres, expected cash, variance) computed by the server, never typed by the manager.
