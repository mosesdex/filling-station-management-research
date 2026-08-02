# 01 — Industry Context: Nigeria's Downstream Fuel Market (2023–2026)

How the regulatory and market environment shapes what a station owner needs from management software. Sources are linked inline; claims flagged **[UNCERTAIN]** rest on single or lower-quality sources.

---

## 1. The regulator: NMDPRA

The **Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA)** was created by the [Petroleum Industry Act (PIA) 2021](https://pia.gov.ng/wp-content/uploads/2022/08/PIA-2021_compressed-1.pdf), s.29, replacing the old DPR for everything from refining to retail. It is both the safety/technical regulator and the market-conduct supervisor. Operating any downstream business without the relevant NMDPRA licence is a criminal offence (PIA s.125) ([Advocaat Law Practice via Mondaq](https://www.mondaq.com/nigeria/oil-gas-electricity/1747608/)).

Licensing runs on NMDPRA's e-portals — **CELPS** (Central Electronic Licensing and Permit System) and **ROMS** (Retail Outlet Management System) at [celps.nmdpra.gov.ng](https://celps.nmdpra.gov.ng/).

### Licensing chain for a retail station

1. **Site suitability / pre-approval** — legacy siting rules (≥400 m from an existing station, ≥15 m road setback, max 4 stations per 2 km, EIA by accredited consultant) **[UNCERTAIN — blog-grade source; governing text is now the Midstream & Downstream Petroleum Operations Regulations 2025, not directly reviewed]**
2. **Licence to Establish (LTE)** → **Licence to Construct (LTC)** — incorporation docs, tax clearance, fire certificate, approved building plan, EIA for storage >270,000 L
3. **Licence to Operate (LTO)** — tank pressure-test/leak-detection certificates, trained attendants, physical requirements (fire extinguishers + sand buckets per island, signage, canopy, price billboard, perimeter wall, standby generator)
4. Ongoing: manager always on site, accurate dispensing, price display, renewals

### Official fees (2024 Fees Regulations — official gazette)

From the [Midstream and Downstream Petroleum Fees Regulations 2024](https://faolex.fao.org/docs/pdf/nig232456.pdf):

| Item | Fee |
|---|---|
| Licence to Establish (LTE) | ₦100,000 |
| Licence to Construct (LTC) | ₦200,000 |
| Licence to Operate — new | ₦100,000 first 20,000 L storage; +₦50,000 per extra 20,000 L |
| Licence to Operate — renewal | ₦100,000 first 20,000 L; +₦5,000 per extra 20,000 L |
| Modification authorisation | ₦300,000 per outlet |
| Storage tank calibration authorisation | ₦10,000 per tank |
| Licence transfer | ₦500,000 or 5% of transaction value (whichever higher) |
| Environmental site assessment / audit / EMP | ₦80,000 / ₦40,000 / ₦100,000 |

Renewal cycle wording conflicts between sources (1-year vs 2-year LTO) **[CONFLICTING]** — practical takeaway: renewals are a recurring, dated compliance obligation per station.

**App implication:** a per-station compliance calendar (licence expiry, calibration dates, fire certificate, environmental filings) is cheap to build and directly protects revenue — a lapsed licence or failed inspection means a sealed station.

## 2. Deregulation: the 2023–2026 shock

- **29 May 2023** — "subsidy is gone." Pump price roughly tripled within days (₦185–195 → ₦500–540/L); by 18 July 2023, ₦617/L ([Reuters](https://www.reuters.com/world/africa/nigeria-petrol-prices-soar-record-high-after-subsidy-removal-2023-07-18/)). Subsidy had cost ~$10bn in 2022.
- **56 private import licences** ended NNPC's import monopoly.
- With naira depreciation, pump prices moved in a **₦865–1,250/L band** through 2025–26 ([Guardian](https://guardian.ng/news/petrol-price-may-hit-n1400-litre-as-dangote-refinery-loading-stalls/), MEMAN data).
- Deregulation is not politically irreversible: 2025 saw state-level price-cap episodes that pushed retail margins below breakeven for weeks, and an October 2025 15% import tariff **[UNCERTAIN — single market-research source (Mordor)]**.

## 3. The Dangote factor

The 650,000 bpd Dangote refinery (petrol from Sept 2024) now dominates supply ([Dataphyte](https://www.dataphyte.com/issue/marina-maitama/2025/09/nupeng-vs-dangote-refinery-a-brewing-clash-over-union-rights-and-fuel-distribution)):

- Two price channels: **coastal** (marine to depots) vs **gantry** (truck loading at the refinery); the spread and the Dangote-vs-import advantage **flipped at least four times in nine months** (MEMAN Energy Bulletin data).
- **Free direct delivery to registered stations** (CNG truck fleet) is disintermediating depots — and triggered the Sept 2025 NUPENG strike that shut stations nationwide.
- **Single-source concentration risk is real:** when Dangote suspended gantry loading (Mar 2026), depot prices spiked toward ₦1,400/L and many marketers simply could not load.

**App implication:** cost price changes per truckload, not per quarter. The app must let the owner record each delivery's actual unit cost and broadcast pump-price changes to all stations instantly — margin per litre is now a daily-moving number worth showing on the dashboard.

## 4. Industry bodies (who the client deals with)

| Body | Who | Why it matters |
|---|---|---|
| **MEMAN** | 6 major marketers (~⅓ of market) | Publishes the Energy Bulletin price benchmarks |
| **IPMAN** | Independent marketers (~60% of ~31,220 stations) | The association most independent owners belong to; negotiated direct Dangote purchase deals |
| **PETROAN** | Retail outlet owners | Lobbies on price-stability and support grants |
| **NUPENG** | Tanker drivers / station workers' union | Strikes shut stations nationwide (Sept 2025) |
| **Weights & Measures Dept.** (FMITI) | Legal metrology | Seals under-dispensing pumps — separate from NMDPRA |

## 5. Station economics in the deregulated era

Figures below are from [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/nigeria-petrol-station-market) unless noted — single market-research source, treat point values as indicative **[UNCERTAIN]**:

- ~**31,220 stations** nationwide; independents run ~60%. Lagos ~3,000 sites.
- Throughput: Lagos **40–50k L/month/station** (saturated) vs **80–100k L/month** in Abuja/Port Harcourt.
- **Fuel gross margin ~8–12%**; observable ex-depot-to-pump spreads of roughly **₦30–80/L** (Guardian market checks, Dangote partner-station pricing). Non-fuel retail (shop, lubricants, LPG) earns 20–25%.
- Working capital strain: retailers now hold **7–10 days of inventory** (vs 3–5 global norm) because supply is uncertain; a truckload bought at the wrong moment can be unprofitable end-to-end.
- Even ₦10–20/L price differences move traffic between stations — commercial drivers shop around.
- Diversification: LPG/CNG (23.8% CAGR), convenience retail, and digital payments are the margin defence.

**App implication:** the owner's dashboard should show, per station: litres sold by product, gross margin per litre (pump price − last delivered unit cost), cash position, and stock days remaining. Those four numbers are the business.

---

*Full per-claim source list and quality notes: see the research annexes in [`research/`](../research/). Key uncertainties: siting standards (blog-sourced), licence renewal cycle (conflicting), all Mordor point estimates, and any naira price (volatile snapshots).*
