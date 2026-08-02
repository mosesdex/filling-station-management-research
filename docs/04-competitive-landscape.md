# 04 — Competitive Landscape: Fuel-Station Management Software

Who else solves this problem, what they charge, and where the gap is.

---

## 1. The market is barbell-shaped

**One end:** hardware-dependent, enterprise, sales-led automation — pump controllers and tank probes, hidden pricing, installation visits, contracts.
**Other end:** $0–$5 offline Android ledger apps — single-device, generic, no owner visibility, questionable data practices.
**The middle — software-only, mobile-first, daily-figures reporting with an owner multi-station dashboard — is nearly empty.** That middle is this project.

## 2. Nigeria / Africa players

### Epump (Fuelmetrics, Lagos) — closest competitor
[epump.com.ng](https://www.epump.com.ng/) · Claims 2,005+ stations, 5B+ transactions, clients incl. NNPC, Ardova, AA RANO. IoT controllers on pumps feed cloud dashboards (web/Android/iOS): real-time per-pump/per-attendant sales, **remote price changes from the owner's phone**, tank tracking, analytics. Added an offline-tolerant "Always-On" mode (Sept 2025) — even the hardware player had to solve Nigerian connectivity. **Requires hardware per pump; pricing hidden, sales-led.**

### Smartflow Technologies (Lagos/Ogun)
[smartflowtech.com](https://www.smartflowtech.com/) · Hardware-first since 2009: ATG probes ("1,000+ working probes around Nigeria"), forecourt controllers, FuelNet cloud, SmartEye app. Wetstock reconciliation per site or network; alerts via email/SMS. Gilbarco's Nigerian channel partner. Enterprise/project sales.

### RockEye Africa (Lagos, pan-African)
[rockeye.africa](https://www.rockeye.africa/erp-solutions/oil-gas-smart-station-system.html) · Full downstream ERP (stations + depots + logistics + finance + HR). Notably advertises **offline data capture with auto-sync** and mobile station operations. Aimed at oil marketing companies; heavyweight; demo-led; Smart Station module needs extra hardware.

### Vendra — nearest software-only analog
[vendraapp.com](https://vendraapp.com/petrol-station-software) · Pure SaaS POS/ERP with a petrol vertical: attendant shift sessions, litres by grade at close, expected-vs-counted cash by denomination, **supervisor-entered tank dips with variance**, fleet credit accounts. **Published pricing: $28 / $59 / $99 per month (top tier = up to 5 outlets).** Proves the manual-dip software-only workflow works — but it's a full POS requiring per-transaction entry, much heavier than a daily-figures app, and not Nigeria-branded.

### Petrosoft (India)
[petrolbunksoftware.com](https://petrolbunksoftware.com/pricing) · One-off licences ₹17k–48k (~$200–575). Ships **separate role apps: Dealer (owner), Manager, Pump Boy** — proof of demand for role-based mobile apps and one-off pricing in price-sensitive markets. India-centric compliance (GST); not localized for Nigeria.

### Google Play ledger apps
- *Petrol & Diesel Pump Manager* (Pakistan, 5K+ downloads): dip stock, duty logs, cash calculator, "works offline" as the headline feature. Single-phone; shares personal data; can't delete data.
- *Daily Sales Record* (4.5★, ~4K reviews): generic 3-tap sales ledger, offline with sync. "Not customizable" is the top complaint.
- None offer owner-side multi-station consolidation, fuel-specific reconciliation, or ₦/POS/transfer localization.

## 3. Global reference points

- **Petrosoft CStoreOffice (US):** category gold standard — "pump-to-pocket" fuel reconciliation, one-click daily close, multi-store P&L to 500+ locations. Deeply tied to US POS hardware and tobacco/lottery — irrelevant complexity for Nigeria.
- **FuelCloud (US):** transparent flat pricing philosophy ("less than a nice dinner out," no contracts, unlimited users). Its top review complaint is the design problem we must solve: *"delivery guys don't always input deliveries"* — manual entry is the weak link unless submission is mandatory, fast, and audited.
- **Gas Pos (US):** $200/month flat including hardware — evidence that flat monthly bundles beat capex in this industry.

## 4. Feature matrix (condensed)

| Feature | Epump | Smartflow | RockEye | Vendra | Petrosoft IN | Play apps | **This app** |
|---|---|---|---|---|---|---|---|
| Hardware required | ● | ● | ◐ | — | — | — | **—** |
| Real-time pump feed | ● | ● | ● | ◐ | ◐ | — | — (manual figures) |
| Dip-vs-book variance | ● | ● | ● | ● | ● | ◐ | **●** |
| Shift/attendant cash reconciliation | ◐ | — | ● | ● | ● | ◐ | **●** |
| Multi-station owner dashboard | ● | ● | ● | ◐ | ◐ | — | **●** |
| Owner mobile app | ● | ● | ● | ◐ | ● | ● | **●** |
| Offline capture + sync | ◐ | — | ● | — | — | ● | **●** |
| Remote price broadcast | ● | ● | ● | — | — | — | **●** (to managers) |
| Published ₦ pricing | — | — | — | — (USD) | — (₹) | ● | **●** |
| Nigeria-localized | ● | ● | ● | ◐ | — | — | **●** |

### Table stakes (every credible product has these)
Daily/shift sales by product and attendant · tank stock + dip-vs-book variance · cash reconciliation with discrepancy flags · low-stock alerts · reports/export · expense logging · owner/manager roles.

### Differentiators worth building toward
Variance **trend** analytics (theft flags) · remote price broadcast · per-station P&L · WhatsApp/SMS-style alerts · photo/GPS-audited submissions · delivery verification workflow.

## 5. Pricing landscape

| Model | Examples |
|---|---|
| Hardware + hidden SaaS (sales-led) | Epump, Smartflow, RockEye, CStoreOffice |
| Flat published SaaS | Vendra $28/$59/$99 (5 outlets) |
| Flat bundle incl. hardware | Gas Pos $200/mo |
| One-off licence | Petrosoft India ~$200–575 |
| Freemium consumer | Play Store apps |

**Nobody in Nigeria publishes prices.** Transparent per-station/month Naira pricing — with a free single-station tier — would be unique and highly marketable.

## 6. Positioning

> **"Epump-grade visibility without the hardware."**
> Managers submit meter readings, dips, and the cash/POS/transfer count in under 3 minutes, even offline. The owner sees every station's litres, expected cash, and variance on his phone, with alerts on anomalies. No pump controllers, no probes, no installation visit — onboard a station in an afternoon.

Defensible because: the hardware players can't cheaply serve owners unwilling to pay capex; the ledger apps can't do fuel-specific reconciliation or multi-station consolidation; and Vendra-style full POS demands per-transaction entry that Nigerian forecourt reality (queues, outages, cash) resists. The app's moat deepens with per-tank variance baselines and per-attendant shortage history — data the owner can't get anywhere else without hardware.
