# 07 — Weeldrop Petroleum & Logistics: Two App Options

**Client:** Weeldrop Petroleum & Logistics — [weeldroplogistics.com](https://weeldroplogistics.com/)
**Date:** 3 August 2026
**Purpose:** Turn the generic research in Docs 01–06 into two concrete, buildable product proposals scoped to *this* client's actual business.

---

## 1. Client profile (from their own website)

| Attribute | Detail |
|---|---|
| Business | "Fast-growing downstream petroleum company", 7+ years |
| HQ | Mufulanihun, Lagos–Ibadan Expressway, Sawmill, Ibadan |
| Retail network | **10 stations**, all Ibadan/Oyo: Sawmill, Iyana Oke-Adu (Agodi Gate), Ashi, Olaogun (Old Ife Rd), Breweries (New Ife Rd), Akobo, Lam Adeshina Way, Bodija, Nihort Rd, Jembewon Rd |
| Products | PMS, AGO, DPK, lubricants — "sourced locally and internationally" |
| Line 2 — **Logistics** | Own tanker fleet + trained drivers; haulage "across Oyo State and major Nigerian cities" |
| Line 3 — **Bulk supply** | Sells to factories, farms, institutions, **other petroleum marketers, depots** |
| Line 4 — Consultancy | Advises investors setting up retail outlets |
| Roadmap | **3 CNG stations across Ibadan by Q4 2026** |
| Contact | +234 813 4442 009 (24/7), hello@ / care@weeldroplogistics.com |
| Tech today | **None visible.** No booking, no tracking, no customer portal, no pricing shown |

**Two immediate observations for the client:**

1. The site says "DPR-licensed". DPR was dissolved under the PIA 2021; the downstream regulator is **NMDPRA**. Stale copy on a compliance claim is a small but real credibility leak with B2B buyers.
2. Weeldrop is **not** a pure retailer. It is a retailer **+ haulier + bulk trader**. Docs 01–06 of this repo only solve the retailer half. The haulage/bulk half is where the bigger, more defensible product sits.

---

## 2. Where the money leaks in *this* business

Three distinct leak surfaces, one per business line:

| Line | Leak | Evidence |
|---|---|---|
| 10 retail stations | Attendant skimming, manager under-reporting, falsified dips | EFCC case: station manager charged over ~₦500m diverted sales (Doc 03) |
| Tanker fleet | In-transit diversion, ghost trips, unauthorised detours, driver diesel theft | Nasarawa: manager received 40,000 L, discharged **13,300 L**, diverted 26,700 L (Doc 03). Nigerian telematics vendors sell explicitly against "detours, ghost trips and stolen diesel" ([CTN](https://services.travo.ng/bulk-haulage/haulage-operations-management-nigeria-fleet-and-logistics-solutions/)) |
| Bulk/B2B | Credit sales unbooked, disputed deliveries, no proof-of-delivery, unpriced trips | Weeldrop's own customer list (depots, other marketers) = high-value credit exposure |

Plus a regulatory hard stop that applies to all 10 stations: NMDPRA's **"Operation One Litre for One Litre"** sealed 11 stations in Rivers in a single day (Feb 2026). A sealed station is 100% revenue stop.

---

## 3. Idea 1 — **Weeldrop Control**: multi-station accountability app

> *"Epump-grade visibility without the hardware."* The owner opens his phone at 9pm and sees all 10 stations' litres, cash, and tank variance — with alerts on anything drifting.

This is the app fully specified in [Doc 05](05-app-blueprint.md). Below is only what changes for Weeldrop specifically.

### Core loop (unchanged from Doc 05)
Manager submits per-nozzle opening/closing totalizers, per-tank dips, deliveries with waybill + unit cost, takings split (cash / POS / transfer / credit), and expenses — in under 3 minutes, offline-capable. **Server computes everything derived**: litres sold, expected takings, per-attendant shortage, tank variance vs book stock. Manager never types a derived number.

### Full feature set

**A. Daily operations**
- Daily submission form with in-app-camera-only photo evidence (meter face, dip stick at the line, waybill) + GPS + server timestamp
- Shift-level entry (Weeldrop's Sawmill expressway site almost certainly runs 24h — shifts are not optional here)
- Append-only records: corrections are new rows with `supersedes_id`, never edits
- Totalizer monotonicity check across days (today's opening must equal yesterday's closing per nozzle)

**B. Owner cockpit**
- All-10-stations board: litres, revenue, cash position, variance flag, submission status
- Per-station drill-down → per-tank → per-nozzle → per-attendant
- **Ibadan cluster map view** — all 10 sites are within one metro, so a map is genuinely useful here (unlike a nationally-scattered network)
- Nightly digest push at 21:00 WAT: one notification, exceptions first
- **Surprise audit**: owner triggers an ad-hoc mid-day dip + meter + photo submission from his phone

**C. Fraud detection**
- Per-tank statistical variance baseline; alert on **trend break**, not single-day noise (triggers: +0.1% off monthly normal, +10 L/day, +300 L/month)
- Per-attendant shortage league table across all 10 stations — an attendant fired at Bodija for shortages shouldn't reappear at Akobo
- Delivery verification workflow: waybill vs per-compartment ullage vs before/after dips
- Cross-station benchmarking: 10 comparable Ibadan sites make outlier detection statistically real (a 1-station owner has no baseline; Weeldrop does)

**D. Money**
- Payment split native to the form — Nigerian station mix is cash 33.6% / card 27.3% / transfer 13.6%, and 91% of stations run POS
- Same-day settlement view: 9 in 10 Nigerian stations depend on same-day settlement because depots demand upfront payment. Show cash available vs next truck cost
- Margin per litre against **actual delivered cost** of the fuel currently in each tank (not list price) — critical post-deregulation when ex-depot flips overnight
- Expense capture with categories (generator diesel is a real, loggable cost line)

**E. Price & compliance**
- Owner broadcasts pump prices to all 10 stations; managers must acknowledge; full price history in the audit trail
- Compliance calendar: NMDPRA licence renewals, **pump calibration due dates**, fire cert, Weights & Measures — regulatory insurance against being sealed
- Dispensing-accuracy self-check log (station's own "one litre for one litre" test, photographed)

**F. CNG module (Q4 2026 — the timing gift)**
Weeldrop's 3 CNG stations land right as this app would ship. CNG is **sold by kilogram against a mass-flow meter, not by dipped litres** — the wet-stock reconciliation math does not transfer. Build it as a first-class product type from day one:
- Per-dispenser kg totalizers, gas received vs gas sold (no dip equivalent)
- Compressor run-hours, inlet pipeline pressure, cascade storage levels
- Downtime log — CNG station downtime is the #1 complaint Nigerian CNG drivers raise ([Daily Trust](https://dailytrust.com/cng-commercial-drivers-others-task-govt-on-infrastructure-refueling-stations/))
- Context: Oyo signed a 20-year CNG PPP with Atlas Core; NIPCO runs conversion centres in Ibadan and is building a Sagamu–Ibadan gas pipeline for mid-2026. Weeldrop's CNG bet is well-timed and the app should not be blind to it.

### Stack
Expo/React Native + Supabase (Postgres RLS for owner/manager roles, pg_cron + Edge Functions for the nightly digest and "manager hasn't submitted" nags), local SQLite write-ahead queue for offline. **Offline-first is non-negotiable:** 238 telco outages in Jan 2026 alone.

### Timeline
| Phase | Weeks | Scope |
|---|---|---|
| 1 | 4–6 | Daily form + offline queue, owner dashboard, digests, price broadcast, roles/audit |
| 2 | 3–4 | Shift entry, delivery verification, compliance calendar, exports, accountant role |
| 3 | ongoing | Variance baselines, margin analytics, surprise audits, CNG module, POS settlement reconciliation |

### Why it's a good first build
Lowest risk, fastest visible ROI, and it digitises a ritual Weeldrop's managers **already perform on paper** — no behaviour change to teach. It also becomes a sellable product: no Nigerian competitor is software-only, and none publishes pricing.

---

## 4. Idea 2 — **Weeldrop Supply**: bulk trading + tanker haulage platform

> *"Order fuel like you order a ride — and watch your truck the whole way."* A B2B ordering portal for Weeldrop's bulk customers, welded to a dispatch + chain-of-custody system for Weeldrop's own tanker fleet.

This is the bigger, more defensible product. Nothing in Docs 01–06 covers it, and it is the half of Weeldrop's business no existing Nigerian competitor addresses.

### The insight
Epump, Smartflow and RockEye all fight over the **forecourt**. Weeldrop's differentiated asset is that it owns **product + trucks + customers** end to end. A platform that turns that into an ordering experience makes Weeldrop the easiest bulk supplier in Oyo to buy from — and every trip is fully audited.

### Full feature set

**A. Customer-facing ordering app / web portal**
- Self-service quote → order: product (PMS/AGO/DPK/LPG), volume, delivery address, requested window
- Live price per product, tiered by volume and by customer contract
- **Reorder in two taps** from history; scheduled standing orders (a factory burning AGO weekly should never phone in)
- Order status timeline: Quoted → Confirmed → Paid → Loading at depot → In transit → Discharging → Delivered → Invoiced
- **Live truck tracking with ETA** — the single feature that wins B2B fuel customers; today they phone the driver
- Digital proof of delivery: waybill, per-compartment discharge volumes, before/after dip at *customer's* tank, signature + photo
- Documents: invoice, waybill, delivery certificate, **NMDPRA-compliant product quality/source docs** — a factory's auditor asks for these
- Credit account view: limit, outstanding, ageing, statements, disputes
- Reorder alert: predicted stock-out date from the customer's own consumption history

**B. Dispatch & fleet control (internal)**
- Fleet register: trucks, capacity per compartment, drivers, licences, insurance, roadworthiness, **NARTO membership status**, calibration certs
- Trip planner: assign order → truck → driver; multi-drop routing across Oyo and to other cities
- **Chain-of-custody per compartment**: seal number at load → seal number at arrival → discharge volume → receiving dip. This is exactly the control that would have caught the 26,700 L Nasarawa diversion
- **Telematics integration, not telematics build.** Nigeria already has mature GPS/fuel-level vendors (CTN, MTN Fleet, GPS Car Tracking). Integrate their feeds; do not build hardware. Consume: route deviation, unscheduled stops, harsh driving, idling, fuel-level drops (siphoning), engine cut-off for recovery
- Geofence alerts: departed depot, entered customer site, **stopped >N minutes off-route**
- Trip P&L: revenue − product cost − diesel − driver allowance − tolls/levies − maintenance. Weeldrop can then answer "which routes actually make money?"
- Driver mobile app: trip sheet, checklist, seal photos, discharge capture, POD signature — works offline, syncs later
- Maintenance scheduler by odometer/engine-hours; downtime log

**C. Trading & procurement (the owner's side)**
- Purchase orders to depots with landed cost per litre (product + freight + levies)
- **Margin per bulk order against actual landed cost** — post-deregulation, a wrongly-timed 45,000 L truckload can put a station underwater; the same math applies to bulk trades
- Allocation engine: incoming truck → split between the 10 retail stations and bulk customers by urgency, margin, and days-of-stock
- **This is the killer link to Idea 1:** the retail app knows each station's days-of-stock; the supply platform routes trucks accordingly. Retail restock and bulk sales stop competing blindly for the same product

**D. Money & credit**
- Invoicing, part-payments, receipts; Paystack/Flutterwave/Moniepoint collection
- **Prepaid wallet / fleet card for corporate customers** — Nigeria's prepaid card market is projected at ~$15.2bn in 2026, and incumbents (AgileFlex, Kardit, Energy Smart, Tango) exist. But note the documented pain: *"Why are Prepaid Fuel Cards in Nigeria often rejected?"* — third-party cards get refused at the pump. **A card Weeldrop issues and honours at its own 10 stations has zero acceptance risk.** That's a real edge, not a me-too feature
- Credit limits with automatic hold on over-limit orders; ageing and dunning
- Verifiable digital receipts — Nigeria's 2026 tax reforms make handwritten fuel receipts a liability for corporate buyers *(vendor-sourced claim; verify with the client's accountant before using in a sales pitch)*

**E. Consultancy line (small module, real revenue)**
Weeldrop already sells outlet-setup advisory. Add a light client workspace: site feasibility inputs, projected volumes/margins, licence checklist and status, build milestones. Low effort, high stickiness with high-net-worth clients.

### Stack
Same core (Expo/React Native + Supabase) plus: PostGIS for geofencing and route work, a telematics adapter layer (one interface, per-vendor drivers), a customer web portal (Next.js — B2B buyers order from desktops), and a webhook/SMS/WhatsApp notification channel because bulk customers will not install an app on day one.

### Timeline
| Phase | Weeks | Scope |
|---|---|---|
| 1 | 5–7 | Fleet + driver register, trip dispatch, driver app with seal/discharge chain-of-custody, internal trip board |
| 2 | 4–6 | Customer portal: order, status, live tracking, POD, invoices, credit view |
| 3 | 4–5 | Telematics integration, geofence/deviation alerts, trip P&L, allocation engine |
| 4 | ongoing | Wallet/fleet card, standing orders, consumption forecasting, consultancy workspace |

### Why it's the bigger prize
It is customer-facing, so it grows revenue rather than only protecting it; it locks in bulk customers with switching cost; and it is genuinely un-served — every Nigerian competitor named in Doc 04 is a forecourt product.

---

## 5. Side by side

| | **Idea 1 — Weeldrop Control** | **Idea 2 — Weeldrop Supply** |
|---|---|---|
| Solves | Money leaking out of 10 stations | Winning and holding bulk customers; auditing every trip |
| Primary user | Owner + 10 station managers | Bulk customers + dispatchers + drivers |
| Effect | Protects margin | Grows revenue |
| Build | 4–6 wks to first value | 5–7 wks to first value, longer to full |
| Risk | Low — digitises an existing paper ritual | Medium — needs customer adoption + telematics integration |
| Research coverage | Fully specified in Docs 01–06 | New ground; specced here |
| Competitors | Epump, Smartflow, RockEye (all hardware) | Effectively none in Nigeria for this exact shape |
| Resellable as SaaS | Yes — the empty middle of the market | Yes, and harder to copy |

---

## 6. Recommendation

**Build Idea 1 first, but design the data model for Idea 2 from day one.**

Reasons:
1. Idea 1 pays for itself in weeks by closing leaks across 10 stations, which funds Idea 2.
2. It requires no customer behaviour change — managers already do this on paper.
3. The two share a spine: `organizations → stations → tanks → products → deliveries`. A delivery in Idea 1 *is* a completed trip in Idea 2. Building them as one system with two front doors costs perhaps 20% more than Idea 1 alone; building Idea 2 later on a foreign schema costs a rewrite.
4. Idea 1's per-station days-of-stock is the input Idea 2's allocation engine needs. Sequencing them the other way loses that.

**The demo that closes the client:** open the app at 9pm → 9 of 10 stations green, Bodija red → tap it → tank 2 variance trending −0.4% for 9 days → tap the dip photo → call the manager. Then swipe to the fleet tab → truck WD-04 has been stopped 40 minutes off-route outside Iwo.

---

## 7. Questions to put to the client before scoping

1. How are the 10 stations reported today — WhatsApp photos, paper books, Excel? Who compiles it?
2. How many tankers, what capacities, and are any already GPS-tracked? Which vendor?
3. What share of revenue is retail vs bulk vs haulage-for-hire? (Changes which idea leads.)
4. How much bulk trade is on credit, and what is currently outstanding?
5. Does haulage carry third-party product, or only Weeldrop's own?
6. CNG: own-build or partnership (Atlas Core / NIPCO)? Who operates them?
7. Are managers on smartphones today, and is data allowance company-paid?
8. Is this internal tooling only, or does the client want to sell it to other marketers? (Doc 04 says the market gap is real.)
9. Confirm current regulator status and licence class — the site still says "DPR".

---

## Sources added in this doc

- [Weeldrop Petroleum & Logistics](https://weeldroplogistics.com/) — client website, accessed 3 Aug 2026
- [NARTO](https://narto.org/about/) — road transport owners' association, petroleum haulage
- [CTN / Travo haulage ops](https://services.travo.ng/bulk-haulage/haulage-operations-management-nigeria-fleet-and-logistics-solutions/) — Nigerian tanker telematics: detours, ghost trips, stolen diesel *(vendor-sourced)*
- [Oyo–Atlas Core 20-year CNG PPP](https://guardian.ng/energy/oyo-to-deepen-cng-mass-transit-seals-20-year-deal/)
- [NIPCO Gas CNG station + conversion workshop, Ibadan](https://nipcogas.com/nipco-gas-commences-cng-conversion-workshop-in-ibadan-oyo-state/)
- [Pi-CNG Presidential Initiative](https://pci.gov.ng/) — 120,000+ conversions claimed *(government-sourced)*
- [Daily Trust — CNG drivers on refuelling infrastructure gaps](https://dailytrust.com/cng-commercial-drivers-others-task-govt-on-infrastructure-refueling-stations/)
- [Fueling Agile — why prepaid fuel cards in Nigeria are often rejected](https://fuelingagilenigeria.com/why-prepaid-fuel-cards-in-nigeria-often-rejected/) *(vendor-sourced)*
- [Kardit Fleet Card](https://kardit.africa/fleet-card/), [Energy Smart](https://energysmartng.com/get-energy-smart-fuel-card.html), [Tango fuel vouchers](https://tangofuelapp.com/fuel-voucher) — incumbent fuel-card players
- [Moniepoint fuel cashback, from 1 Mar 2026](https://moniepoint.com/blog/get-1000naira-when-you-buy-fuel-with-moniepoint) — payment players moving into fuel loyalty
- [TechEconomy — top fuel cards & fleet products in Nigeria](https://techeconomy.ng/5-top-fuel-cards-and-fleet-management-products-in-nigeria/)
- [UR Fuels on-demand fuel delivery, Lagos](https://disruptafrica.com/2019/08/02/on-demand-fuel-delivery-app-launched-in-nigeria/) — earlier B2B/B2C delivery attempt

Docs 01–06 in this repo carry the underlying industry, operations, fraud, competitive and architecture evidence.
