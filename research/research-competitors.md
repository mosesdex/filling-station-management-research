# Competitive Landscape: Fuel-Station Management Software
## Research for a mobile app where station managers submit daily figures and the owner monitors multiple stations

Researched 2026-08-02 via firecrawl (10 searches, 12 page scrapes). All claims sourced with URLs.

---

# Part 1 — Product-by-product notes

## A. Nigeria / Africa players

### 1. Epump (Fuelmetrics Ltd, Lagos, Nigeria) — closest direct competitor
- URLs: https://fuelmetrics.com.ng/ , https://www.epump.com.ng/ , https://epump.africa/faq/
- Company: founded ~2014-2015, first prototype tested at a station in Ajao Estate, Lagos. Claims **2,005+ stations onboard, 5B+ transactions, 5 countries** ("From Lagos to Turkey"), 200+ companies incl. NNPC, Ardova, AA RANO, GIG.
- What it is: **hardware + software forecourt automation**. IoT controllers attached to pumps feed a cloud dashboard (web, Android, iOS).
- Features: real-time sales monitoring per pump/attendant, remote price changes from mobile, inventory/tank tracking, analytics & trends, reporting, payments tracking. Testimonials emphasize "bird's-eye view", "remotely change pump prices", control for multi-station chains (AA RANO, Mainland Oil & Gas, Matrix).
- Pricing: not published — sales-led, hardware install required.
- Positioning takeaway: strong incumbent for **automated** stations, but requires physical hardware installation per pump. Not a lightweight "manager submits figures" tool. Partnered with Eterna Plc for self-service terminals (Facebook/NSE group post).

### 2. Smartflow Technologies (Ogun/Lagos, Nigeria)
- URL: https://www.smartflowtech.com/service/fuel-management-products/
- Hardware-centric fuel management since 2009: Automatic Tank Gauges (ATG, "1000+ working probes around Nigeria"), forecourt controllers, FuelNet Manager cloud interface, fuel management consoles for fleets, terminal automation, tank farm systems.
- FuelNet Manager: cloud monitoring/control of dispensers, price signs, ATGs; wetstock inventory & reconciliation per site or network; delivery/volume history; alerts via email/SMS. New **SmartEye app** (with Energy360 Africa) for real-time wet-stock monitoring, restock alerts, "automated daily reconciliations" (per BusinessDay/Facebook/Instagram posts).
- Gilbarco's channel partner in Nigeria (gilbarco.com distributor post).
- Pricing: not published; enterprise/project sales with hardware.
- Takeaway: strongest on **tank monitoring hardware**; software is an adjunct. Targets bigger operators, fleets, depots — not a self-serve app.

### 3. RockEye Africa (Victoria Island, Lagos — pan-African ERP)
- URLs: https://www.rockeye.africa/erp-solutions/oil-gas-smart-station-system.html , https://www.rockeye.africa/pricing.html
- Full downstream oil & gas **ERP**: Smart Station System module + terminal automation, logistics, finance, HRMS, procurement, asset management. Markets: Nigeria, Kenya, Ghana, South Africa, Tanzania, Uganda, Angola.
- Smart Station features: real-time fuel inventory tracking, pump-level monitoring/control, automated sales recording + reconciliation, multi-location dashboard, **mobile-enabled station operations**, **offline data capture with auto-sync**, centralized analytics, multi-currency, compliance/audit records.
- Pricing: two packages, **Standard (1–200 users, shared hosting, ticket/chat support)** and **Enterprise (200+ users, private hosting, customization, dedicated RM)**. No prices published; Smart Station and Vehicle Tracking need **additional hardware**. Demo-led sales.
- Takeaway: aimed at oil marketing companies with depots + retail networks. Heavyweight; explicitly acknowledges the pain points (manual tracking, delayed reconciliation, multi-station visibility) our app targets, but solves them with an ERP + hardware.

### 4. Vendra (vendraapp.com) — SaaS ERP/POS with petrol-station vertical (Africa-oriented, "localized for your country", Kenyan-shilling example in copy)
- URL: https://vendraapp.com/petrol-station-software
- Pure software, self-serve signup, works on any device. Petrol-station workflow:
  - POS terminal per pump/island; attendant opens shift session with opening cash balance
  - Shift close: litres sold by grade, payment-method breakdown, expected vs counted cash by denomination, discrepancy flagged for supervisor
  - **Tank dip reconciliation**: supervisor enters physical dip each shift; system shows variance vs expected (catches theft/meter drift/evaporation)
  - Corporate fleet credit accounts: credit limits, Net 30/45, one consolidated monthly invoice emailed, aged receivables
  - Reorder alerts + draft POs when tank below minimum; shop/lubricant sales; VAT receipts (90+ country tax setups); payroll for attendants
- **Pricing (published!):** Entrepreneur **$28/mo** (POS+inventory+fleet invoicing), Business **$59/mo** (adds accounting+payroll), Business Plus **$99/mo for up to 5 outlets** with consolidated reporting and inter-site stock visibility. No setup fee.
- Takeaway: the most direct *software-only* analog. Its multi-station tier is $99/mo for 5 sites. But it is a full POS/ERP requiring per-transaction entry — heavier than a "submit daily figures" app; no owner-first mobile monitoring emphasis.

### 5. Petrosoft (India, petrolbunksoftware.com) — NOT the US Petrosoft; big in petrol-pump software, markets globally incl. Nigeria
- URLs: https://petrolbunksoftware.com/pricing , https://petrolbunksoftware.com/petrosoft-app , https://petrolbunksoftware.com/blog/daily-fuel-reconciliation-guide
- **Pricing (one-off license + GST):** Petro Lite ₹17,000 (~$200), Petro Pro ₹22,000 (~$260), Petro Max ₹32,000 (~$380), Petro Premium ₹48,000 (~$575) custom. All plans: 12/7 support, free training, GST reports, stock variation, expenses, bank/vendor statements.
- Feature ladder: sales & purchase, inventory, credit management, SMS/WhatsApp/email notifications, multiple shift management, tanker management, payroll, density levels, loyalty, 40→90+ reports. Separate **role apps: Dealer App, Manager App, Credit Customer App, Pump Boy App** (counts limited by tier).
- Takeaway: proves demand for role-based mobile apps (owner/manager/attendant) and for **one-off pricing** in price-sensitive markets. India-centric compliance (GST, e-way bill) — not localized for Nigeria.

### 6. Small Android apps (Google Play) used by pump owners
- **Petrol & Diesel Pump Manager** (Tahajjud Apps, Pakistan) — https://play.google.com/store/apps/details?id=com.pump.petroleum.managment.software.services
  - 5K+ downloads, in-app purchases, updated Jul 2026. Features: tank dip stock in litres, purchase invoices, duty (shift) management by date, daily sale record, cash calculator for counting/deposit balance, expenses, salesman profiles, supplier ledgers/deposits, outstanding balance tracker, customer ledger. **"Works offline"** is a headline selling point. Single-phone record-keeping — no owner/multi-station cloud dashboard, data can't even be deleted per data-safety card; shares location/personal info with third parties.
- **Daily Sales Record — POS, CRM** (Kutirsoft) — https://play.google.com/store/apps/details?id=com.kutirsoft.dailysalesrecord
  - **4.5 stars, ~4K reviews**, freemium ("free to start, affordable Pro"). Generic small-business sales tracker: 3-tap sale entry, profit view, low-stock alerts, invoices, CSV export, **offline with sync**, multi-device sync. Review complaints: "not customizable at all", no integrated online payment. Not fuel-specific but widely used by small merchants incl. stations.
- **PetroMaxx** (promoted in Nigerian Facebook fuel-station groups) — fuel inventory + sales tracking for gas station owners; tanker volume tracking depot→station (facebook group posts). Play listing not scrapeable in this pass.
- Takeaway: Play Store category = cheap/offline single-device ledgers from Pakistani/Indian devs; none offer owner-side multi-station consolidation, attendant accountability workflows, or Nigerian localization (₦, POS-transfer payment mix).

## B. Global / US players (reference points)

### 7. Petrosoft Inc. — CStoreOffice (Pittsburgh, USA; flagship back-office)
- URLs: https://petrosoftinc.com/c-store-office/ , https://petrosoftinc.com/
- Positioning: "back office that pays for itself in 60 days"; claims to recover $48k+/yr in shrink, fuel mispricing, missed tobacco rebates, lottery shorts; 2 hrs/week paperwork instead of 20.
- Three pillars: (1) Inventory on auto-pilot — invoice scan & match, auto price-book sync, real-time shrink alerts; (2) Fuel margin control — pump-to-pocket reconciliation, competitor price tracking, real-time margin alerts; (3) Financials — one-click daily close ("4 minutes"), QuickBooks sync, multi-store P&L (1 to 500+ locations). Loss-prevention module for tobacco rebates ($704/mo avg recovered) and lottery reconciliation.
- Integrations: Verifone Commander, Gilbarco Passport, NCR, Wayne, Bulloch POS; free migration from PDI/FasTrax/SAP/Excel. 24/7 US phone support; 60-day money-back guarantee. Retail360 mobile companion app.
- Pricing: not published (demo-led); ROI calculator on page. Reddit r/smallbusiness threads recommend it for 5-store operators ("Cstore office from petrosoft is a good choice to track inventory, manage pricing, and prevent theft").
- Takeaway: gold standard of the category in the US; deeply tied to US POS hardware, tobacco/lottery categories — irrelevant complexity for Nigerian stations, and priced/sold accordingly.

### 8. FuelCloud (USA) — cloud fuel management for private/bulk tanks
- URLs: https://fuelcloud.com/ , https://fuelcloud.com/pricing , https://help.fuelcloud.com/hc/en-us/articles/22662722592275 , https://www.capterra.com/p/183846/FuelCloud-Fuel-Management/
- Hardware (CloudBox ~2 hoses, CloudLink expansion) + app + web portal; per-CloudBox monthly subscription that gets cheaper per site as you add sites; "monthly price less than a nice dinner out"; no contracts, pause/reactivate anytime; unlimited users, unlimited custom reports (xls/csv/txt), API access, alerts, tank-monitor integrations (Anova, Otodata…), off-road tax returns. $27.50/mo per authorization device (kiosk/iPad) add-on. Capterra shows a **$65/user/mo "Basic"** figure and a free version, 4.7/5 (only 4 reviews).
- Review signals (Capterra): pros — easy/intuitive, records every dispense; cons — "tracking of oil levels does not seem reliable. The delivery guys don't always input deliveries" (manual-entry weak link), early hardware bugs (fried micro-SD).
- Takeaway: for fleet/bulk-tank operators, not retail forecourts; but its pricing philosophy (flat, transparent, cancel-anytime, unlimited users) is the UX bar for SMB fuel software.

### 9. Gas Pos (USA)
- URLs: https://fuelsmarketnews.com/fyi-gas-pos-offers-a-new-approach/ , https://mcspetroleum.com/gaspos/
- POS-as-a-service for gas stations & truck stops: **$200/month flat including hardware, software, support, lifetime warranty** (fuelsmarketnews interview); 10-yr parts & labor via distributors. Disrupted incumbents (Verifone/Gilbarco POS ~$15-20k upfront) with subscription bundling.
- Takeaway: evidence that flat monthly bundles beat capex in this industry.

### 10. Others noted (not deep-dived)
- **OPIS RetailSuite** — cloud gas-station management + fuel price intelligence for retailers (https://www.opis.com/product/pricing/retail-fuel-prices/retailsuite/).
- **Eaglestar FMS** (egfueldispenser.com) — Chinese dispenser-manufacturer management software.
- **Technotrade** (technotrade.ua) — attendant-control systems: each attendant assigned a dispenser, shift open/close totals — same accountability concept as our app, implemented in hardware.
- **eng366 blog** (https://www.eng366.com/blog/gas-station-management-software) — category overview: "Basic plans start from a few hundred dollars per month, while enterprise solutions cost more."

---

# Part 2 — Feature matrix

Legend: ● = core/included, ◐ = partial/add-on, — = absent. (Sources above.)

| Feature | Epump (NG) | Smartflow (NG) | RockEye (Africa) | Vendra (SaaS) | Petrosoft India | Play-Store ledger apps | CStoreOffice (US) | FuelCloud (US) |
|---|---|---|---|---|---|---|---|---|
| Requires hardware install | ● | ● | ◐ (Smart Station) | — | — | — | ◐ (POS integr.) | ● |
| Real-time pump/sales feed | ● | ● | ● | ◐ (POS entry) | ◐ | — | ● | ● |
| Tank/dip stock reconciliation | ● | ● (ATG) | ● | ● (manual dip) | ● (stock variation) | ◐ (manual) | ● (fuel recon) | ◐ |
| Shift/attendant cash reconciliation | ◐ | — | ● | ● | ● (shift mgmt) | ◐ (duty log) | ● (daily close) | n/a |
| Multi-station owner dashboard | ● | ● | ● | ◐ ($99 tier, 5 sites) | ◐ (Dealer app) | — | ● (500+) | ● |
| Mobile app for owner | ● | ● (SmartEye) | ● | ◐ (web-responsive) | ● (role apps) | ● | ◐ (Retail360) | ● |
| Offline capture + sync | ? | — | ● | — | — | ● | — | ◐ |
| Remote price change | ● | ● | ● | — | — | — | ◐ | n/a |
| Expense tracking | ◐ | — | ● | ● | ● | ● | ● | — |
| Credit/fleet customer accounts | ◐ | ◐ | ● | ● | ● | ◐ (ledgers) | ◐ | ● |
| Payroll/HR | — | — | ● | ● | ● | — | — | — |
| Alerts (low stock, variance) | ● | ● (SMS/email) | ● | ● | ● (SMS/WhatsApp) | ◐ | ● | ● |
| Published self-serve pricing | — | — | — | ● | ● | ● | — | ◐ |
| Localized for Nigeria (₦, workflows) | ● | ● | ● | ◐ | — | — | — | — |

## Table stakes (everything credible has these)
1. Daily/shift sales recording by product (PMS/AGO/DPK) and by attendant
2. Tank stock tracking in litres + dip-vs-book variance
3. Cash reconciliation at shift close (expected vs counted, discrepancy flag)
4. Low-stock / reorder alerts
5. Basic reports (daily, weekly, monthly; export)
6. Expense logging
7. Multi-user roles (owner / manager / attendant)

## Premium differentiators
- Real-time automated data from pump/ATG hardware (Epump, Smartflow, FuelCloud) — vs manual entry
- Remote price changes from the owner's phone (Epump headline feature)
- Multi-station consolidated dashboard + per-station P&L (CStoreOffice, RockEye)
- Loss-prevention analytics: variance trend detection, theft flags, margin alerts
- Credit/fleet invoicing and receivables aging (Vendra, Petrosoft India)
- Accounting sync (QuickBooks) / payroll
- Offline-first with auto-sync (RockEye advertises it; ledger apps live on it)
- WhatsApp/SMS notifications (Petrosoft India) — high-value in Nigerian context

---

# Part 3 — Gap analysis (opportunity for the new app)

**The market is barbell-shaped.** One end: hardware-dependent, sales-led, enterprise-priced automation (Epump, Smartflow, RockEye, CStoreOffice) — powerful but requires capex, installation visits, and contracts; pricing hidden. Other end: $0–$5 offline Android ledgers built by generalist devs — single-device, no owner visibility, no fuel-specific reconciliation, questionable data practices. **The middle — a software-only, mobile-first, low-cost app where managers submit structured daily figures and owners see all stations — is thin.** Vendra is the nearest occupant but is a full POS/ERP (per-transaction entry, heavier workflow) rather than a daily-figures reporting tool, and is not Nigeria-branded.

Specific gaps to exploit:
1. **No-hardware onboarding.** Every Nigerian incumbent needs pump controllers or ATG probes installed. A dip-stick + meter-reading + cash-count digital workflow gets 80% of the accountability at 0% of the capex. (Vendra's dip-reconciliation model proves the workflow works in software.)
2. **Offline-first is demanded, rarely delivered.** Play-Store apps win reviews on "works offline"; RockEye lists offline sync as a differentiator; Nigerian connectivity makes this table stakes for attendmanager-side entry. Cloud vendors (Vendra, CStoreOffice) are online-only.
3. **Owner-first mobile monitoring.** Incumbents' dashboards are web/back-office first. The pitch "open your phone at 9pm and see every station's litres, cash, and variance" is Epump's testimonial language — deliverable without Epump's hardware if managers submit figures on schedule.
4. **Variance/theft flags from manual data.** Compare declared pump meter readings vs dip drop vs cash banked; trend variances per attendant/station. FuelCloud's own weak point ("delivery guys don't always input deliveries") shows the design problem to solve: make submission mandatory, fast, and auditable (photos of meter/dip, timestamps, GPS).
5. **Nigeria-localized:** Naira, PMS/AGO/DPK grades, POS-terminal/transfer/cash payment mix, frequent govt price changes (remote price broadcast to managers), WhatsApp-style notifications.
6. **Transparent, low, self-serve pricing.** Nobody in Nigeria publishes prices. Vendra's $99/mo per 5 outlets and Gas Pos's flat $200/mo bundling show the psychology; Petrosoft India's one-off license (~$200-575) shows price sensitivity. A per-station/month tier (e.g. free 1 station limited history → paid multi-station) would be unique in the Nigerian market.
7. **Trust/data safety.** The Pakistani ledger app shares location/personal data and can't delete data — a credible privacy stance is a marketable differentiator.

## Common complaints observed (reviews/forums)
- Manual-entry dependence breaks data integrity (FuelCloud Capterra review re: deliveries not entered)
- Early hardware reliability issues (FuelCloud micro-SD failures)
- Rigidity/"not customizable" (Daily Sales Record review)
- Incumbent POS/back-office cost & complexity (Reddit r/smallbusiness: 5-store owner hunting for C-Store-compatible back office; r/POS complaints about aging Clover setups; Gas Pos marketing targets $15-20k POS capex)
- Category-wide: pricing opacity — nearly all serious vendors are demo/contact-sales only

## Pricing models seen
| Model | Examples |
|---|---|
| Hardware + hidden SaaS (sales-led) | Epump, Smartflow, RockEye, CStoreOffice, OPIS |
| Flat SaaS per month, published | Vendra $28/$59/$99 (up to 5 outlets) |
| Per-device/site subscription | FuelCloud (per CloudBox, volume discount; $27.50/device add-on; Capterra "$65/user/mo") |
| Flat bundle incl. hardware | Gas Pos $200/mo |
| One-off license | Petrosoft India ₹17k–48k + GST |
| Freemium consumer-grade | Daily Sales Record, Petrol & Diesel Pump Manager (IAP) |

## Suggested positioning for the new app
"Epump-grade visibility without the hardware": manager submits opening/closing meter readings, dip readings, cash/POS/transfer totals and expenses in <3 minutes (offline-capable); owner gets a real-time multi-station dashboard with automatic litres-sold, expected-cash, and variance calculations plus WhatsApp/push alerts on anomalies. Price per station/month in Naira, published, with a free single-station tier.
