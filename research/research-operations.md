# How a Nigerian Petrol/Filling Station Operates Day to Day — Research Findings

Research date: 2026-08-02. Method: 10 firecrawl web searches + 10 page scrapes (8 successful; LinkedIn pages blocked scraping and are cited from search snippets) covering Nigerian job postings, operator forums (Nairaland, Facebook business groups), a national newspaper investigation (Punch), Nigerian equipment/training/ATG vendors (Megatec, SmartFlow), fuel-retail software vendors (FuelSetu), a regulator wetstock guide (EPA Ireland), and Nigerian payments-industry data (Moniepoint/TechNext). Where Nigerian-specific sources are thin, global fuel-retail standard practice is cited and flagged as such.

Source-quality legend:
- [NG-primary] Nigerian source with direct operational detail (job ads, Nigerian vendors, Nigerian practitioner posts)
- [NG-secondary] Nigerian source, but promotional/AI-assisted/uncorroborated forum content
- [GLOBAL] Non-Nigerian source describing standard fuel-retail practice; assumed transferable, flagged

---

## 1. Staff structure and roles

**Typical roles at a Nigerian station: Station Manager, Supervisor, Cashier(s), Pump Attendants, Security, plus support staff (cleaners, lube-bay/car-wash staff where present).**

- Pump Attendant (Fatgbems Petroleum job ad, Lagos, scraped in full): full-service model — the attendant personally dispenses AND takes payment at the pump (unlike self-service markets). Listed responsibilities: dispense petrol, diesel and other products accurately and safely; greet customers; collect cash, POS, or other electronic payments and issue receipts; verify the amount dispensed and ensure correct pricing; maintain cleanliness of pumps/forecourt; monitor pumps for leaks, malfunctions or safety hazards and report immediately; assist customer inquiries; comply with HSE regulations; participate in stock-taking and inventory checks when required; support other station operations as assigned by the supervisor. Requirements: minimum SSCE/WASSCE, basic numeracy and cash-handling, flexible shifts including weekends/public holidays. [NG-primary]
  - Source: https://www.myjobmag.com/job/pump-attendant-fatgbems-petroleum-company-limited-1 (job listing; high reliability for role definition)
- Station Cashier (job ad, Agbor, Delta State): "Collect and account for all daily cash sales from pump attendants and supervisors. Reconcile pump readings and sales figures to ensure accuracy." Cashier is the aggregation point: attendants remit takings to the cashier, who reconciles against pump readings. [NG-primary]
  - Source: https://x.com/Jobnetworkng/status/2070065838783180813 (job posting via job-network account)
- Supervisor/Manager daily priorities (Nairaland practitioner-guide post, Jan 2025): (1) inspect pumps for accuracy and leaks; (2) verify fuel deliveries (check meter tickets and quality); (3) brief staff on safety and current pricing; (4) monitor queues and customer behaviour; (5) reconcile cash and POS transactions; (6) document incidents (theft, spills, conflicts). [NG-secondary — the post reads as AI-generated/compiled content posted to the forum; treat as a plausible checklist, not authoritative]
  - Source: https://www.nairaland.com/8330316/filling-station-manager-supervisor
- Same Nairaland source on staffing realities: many Nigerian stations rely on casual/temporary attendants; multilingual staff (English, Pidgin, local languages) valued; night guards/security "often mandatory in high-risk areas"; CCTV common; protective gear for fume exposure noted as a welfare issue. [NG-secondary]
- Megatec Pumps (Lagos-based dispenser vendor) trains "forecourt staff" as a distinct team and treats attendants as operators responsible for meter readings, loss prevention, and upselling lubricants — confirming the attendant role is broader than dispensing. [NG-primary]
  - Source: https://megatecpumps.com/training-and-capacity-building-for-operators/

- Pay benchmarks from 2025-26 job ads (search snippets): Station Manager ₦150,000–₦200,000+/month gross (multiple ads: Facebook recruiting post for stations in Ozubulu/Jos/Awka/Suleja at ₦200k; Instagram ad at ₦150k; Indeed Lagos listing "from ₦200,000/month"); manager ads ask for HND/BSc plus ~3 years station or retail management experience. Attendant pay anecdotally cited around ₦30k/month in social commentary (low confidence). [NG-primary for manager ads; NG-secondary for attendant figure]
  - Sources: https://ng.indeed.com/q-filling-station-jobs.html ; https://www.instagram.com/p/DTce37SDeMk/ ; https://www.facebook.com/61559205130507/posts/122229091598306837/
- Practitioner staffing list ("If your plan is to run a petroleum filling station business", Facebook): a good filling station should have cashier, supervisor, manager (plus attendants/security) — matches the job-ad picture. [NG-secondary, snippet only]
  - Source: https://www.facebook.com/henry.ekele.1/posts/3605051166306613/

Uncertainty: no single authoritative org-chart source found; structure is assembled from job ads + forum + vendor material. Head-count norms per station (e.g., attendants per island) not found in sources — flag as UNVERIFIED.

## 2. Daily opening/closing procedures

- Dipping + meter reading are the two core daily controls. Nigerian practitioner (LinkedIn, Emmanuel Okwori): "Dipping and meter reading are critical processes in managing a filling station's fuel inventory effectively." [NG-primary]
  - Source: https://www.linkedin.com/posts/emmanuel-okwori-27555894_dipping-purpose-procedure-activity-7251985043835785217-sIxa
- Nigerian audit checklist (Facebook business group "HOW TO AUDIT A PETROL STATION"): perform physical dip of tanks; check daily fuel logs and meter readings; match fuel sales to cash and POS receipts; trace fuel deliveries — check waybills and depot documents; verify litres delivered match the stock book. [NG-primary, practitioner content]
  - Sources: https://www.facebook.com/groups/522644301180063/posts/9728848550559546/ ; https://www.facebook.com/groups/panetwork/posts/2072906573444095/ ; mirrored by a Nigerian chartered accountant on LinkedIn: https://www.linkedin.com/posts/uche-egbuiwe-aca-7bb838162_how-to-audit-a-petrol-station-1-understand-activity-7409916222622027776-G_i-
- Supervisors brief staff on "current pricing" daily and display approved NMDPRA price lists visibly (price changes are frequent post-subsidy-removal; price board must match the approved/posted price). [NG-secondary — Nairaland guide]
- Standard practice (GLOBAL, FuelSetu): record opening nozzle readings at shift start, closing readings at shift end; sales = closing − opening; generate a shift report before handover.
  - Source: https://fuelsetu.com/petrol-pump-shift-reconciliation-guide (Indian fuel-retail ERP vendor; well-structured, matches Nigerian practice described in audit posts)
- Daily closing checklist, 7 areas (GLOBAL, FuelSetu, scraped): (1) sales summary; (2) cash reconciliation; (3) digital payments; (4) credit sales review; (5) inventory reconciliation; (6) expense recording (day's petty/operating expenses booked before close); (7) shift report generation.
  - Source: https://fuelsetu.com/petrol-pump-daily-closing-checklist
- Confirm pump prices against official retail price daily (Kenyan/Nigerian audit-checklist variants: "Confirm pump prices against official retail price"); in Nigeria the posted price board must match the NMDPRA-communicated/company price, and price changes are frequent post-deregulation. [NG/African practitioner posts]
  - Source: https://www.linkedin.com/posts/martine-lukorito_how-to-audit-a-petrol-station-in-a-previous-activity-7409240559778914305-w1pW

## 3. Shift management and per-attendant reconciliation

- Core formula (GLOBAL + confirmed by Nigerian audit posts): Closing meter reading − Opening meter reading = litres sold; litres × pump price = expected takings; compare with cash + POS + transfers + authorized credit remitted by the attendant. Shortages are the attendant's accountability.
  - Sources: https://fuelsetu.com/petrol-pump-shift-reconciliation-guide ; Nigerian audit posts above.
- FuelSetu 7-step shift closure (GLOBAL, transferable): (1) record opening nozzle readings; (2) record closing readings; (3) verify fuel sales vs transactions; (4) reconcile collections by payment method; (5) verify credit transactions tied to right customer; (6) confirm inventory movement matches sales and deliveries; (7) generate shift report before handover.
- Cashier reconciles attendants' figures ("Reconcile pump readings and sales figures" — Delta State cashier job ad). [NG-primary]
- Common reconciliation problems (GLOBAL): counting errors, delayed entries, wrong nozzle readings, credit sales not booked to the right customer, manual/paper process risk.
- Nigerian context: reconciliation must split cash vs POS vs bank transfer (see section 6); attendants handle all three at the pump. [NG-primary — Fatgbems job ad, Moniepoint data]

Uncertainty: typical shift patterns (e.g., 2 shifts of 12h vs 3 of 8h, 24h operation) not directly documented in scraped sources — flag as UNVERIFIED; forum/job-ad hints suggest morning/afternoon shifts with a night skeleton crew or closure depending on location and security.

## 4. Wet stock management (dipping vs book stock, losses, tolerances)

- Daily variance method (GLOBAL, EPA Ireland wetstock reconciliation guide, scraped in full): per tank, Book Stock = Opening Stock + Deliveries − Metered Sales; Daily Variance = Closing (dipped) Stock − Book Stock. Track a Cumulative Variance and express it as Cumulative % Variance = (Cumulative Variance / Cumulative Sales) × 100 to see the tank's trend; each tank has a "normal" variance trend (typically a small persistent loss) and the control objective is detecting a CHANGE from normal, not zero variance.
- Concrete "significant change" thresholds from the same guide (best-practice tip, absent expert help): (1) an increase of 0.1% from the monthly normal variance; (2) an increase of 10 litres/day over a month; (3) an increase in monthly loss of more than 300 litres. Any of these should trigger investigation/escalation.
- Other mechanics from the guide: daily figures catch major leaks and data errors, cumulative trends catch slow ones; temperature matters (petrol volume changes with temperature; automatic temperature compensation on dispensers changes the variance pattern seasonally); statistical inventory reconciliation (SIR) systems are the higher-assurance tier above manual worksheets.
  - Source: https://www.besmart.ie/fs/doc/Small_Business/Documents/Wetstock_Reconciliation_at_Fuel_Storage_Facilities.pdf
- Sources of "normal" variance (GLOBAL, Veeder-Root / wetstock industry): temperature-related volume change, evaporation (esp. petrol), meter calibration drift ("creep"), delivery measurement differences; persistent one-direction variance signals leak or theft.
  - Source: https://www.veeder.com/us/blog/detecting-and-reducing-loss-your-fueling-system
- Nigerian angle: Megatec training explicitly covers "identifying signs of meter malfunction or creep" and "techniques to prevent product theft and spillage during dispensing" — theft/creep monitoring is a live concern in Nigerian operations. [NG-primary]
- Nigerian audit posts: match physical dip vs stock records vs sales daily; discrepancies = red flag for pilferage or unrecorded sales. [NG-primary]
- Automatic tank gauging exists at scale in Nigeria: SmartFlow Technologies (Lagos) claims "1000+ working probes around Nigeria" and offers "wetstock inventory & reconciliation per site or network" — larger marketers use ATG probes instead of/alongside manual dip sticks; manual dipping remains the norm at independent stations. [NG-primary for vendor claim; the manual-vs-ATG split is INFERENCE]
  - Source: https://www.smartflowtech.com/
- Attendant-level fraud patterns documented by Nigerian motorists (Nairaland thread "Numerous ways fuel attendants in Nigeria cheat on motorists"): not resetting the meter to zero before dispensing (continuing from the previous sale), distracting the customer during dispensing, blocking the meter display with the hose, exploiting power outages mid-dispense to call out inflated figures, short-changing, and swapping counterfeit notes. Management counter-controls: meter-reset discipline ("check the pump meter before dispensing"), CCTV, manager arbitration of disputes. Relevant to station ops because these same behaviours show up as unexplained gains at reconciliation (attendant pockets the difference). [NG-primary — customer accounts, anecdotal but numerous and consistent]
  - Source: https://www.nairaland.com/6433076/numerous-ways-fuel-attendants-nigeria
- Acceptable-loss tolerance figures for Nigeria specifically NOT found in scraped sources. Global rule-of-thumb commonly cited in wetstock literature is variance within roughly 0.5% of throughput (and statutory leak-detection thresholds much tighter); Nigerian regulatory tolerance (NMDPRA) unverified — flag as UNVERIFIED / standard-practice extrapolation.

## 5. Product lines: PMS, AGO, DPK, lubricants, LPG

- Nigerian product naming confirmed across sources: PMS = Premium Motor Spirit (petrol), AGO = Automotive Gas Oil (diesel), DPK = Dual Purpose Kerosene, plus LPG (cooking gas) and lubricants. Megatec (Lagos vendor) sells and trains on PMS/AGO/LPG dispensers, and lists LPG and CNG dispensers as distinct product categories requiring specific safety protocols. [NG-primary]
  - Source: https://megatecpumps.com/training-and-capacity-building-for-operators/
- Each product has dedicated underground tank(s) and dispensers; LPG requires a separate skid/plant and its own safety protocols (Megatec Module 1: "specific safety protocols for dispensing Petrol (PMS), Diesel (AGO), and Liquefied Petroleum Gas (LPG)"). [NG-primary]
- Lubricants sold from the forecourt shop/kiosk; attendants trained to upsell lubricants and car-care products (Megatec Module 5). [NG-primary]
- Pricing: PMS historically price-regulated/subsidized; since 2023 subsidy removal, prices float and change frequently; NMDPRA-approved price lists must be displayed. AGO deregulated earlier; diesel is a major business-to-business line (generators). [NG-secondary for the operational implication; macro facts are well established]
- DPK (kerosene) demand has declined with LPG adoption; many stations have repurposed or idle kerosene pumps — inference from market context, flag as INFERENCE (not directly in scraped sources).

## 6. Cash handling: cash vs POS vs transfers, banking, float

- Moniepoint "Fueling the Nation" report (Dec 2025, Nigerian fintech with large fuel-station POS footprint), as reported by TechNext (article scraped in full):
  - 43% of payments at Nigerian fuel stations are digital; 57% cash and other. Breakdown: Cash 33.6%, Card 27.3%, Transfers 13.6%, Mobile money 3.6%.
  - 91% of fuel stations use POS terminals — POS is standard equipment, not optional.
  - Settlement timing is an operational pain point: legacy bank rails settle T+1 (or 24–72h); "9 in 10 fuel stations rely on same-day settlement to manage their daily operations" because depots demand upfront payment. Quote from the report: when settlement is delayed or terminals go down, managers must choose between delaying supplier payments (risking stockouts) or paying suppliers from stored cash (reducing working capital).
  - The shift to digital was accelerated by the FG's 2023 directive instructing all petrol stations to accept POS and bank transfers. [NG-primary — industry data, though vendor-published]
  - Sources: https://technext24.com/reviews/digital-payment-nigerian-fuel-stations/ ; https://casestudies.moniepoint.com/documents/fueling-the-nation-how-moniepoint-powers-nigerias-oil-and-gas-industry.pdf
- Regulatory push: Federal Government/NMDPRA directive ordering all retail outlets to accept POS and bank transfer for petroleum product sales (during cash scarcity episodes), with sanction threats. [NG-primary — news]
  - Source: https://www.linkedin.com/pulse/fg-orders-filling-stations-accept-bank-transfer-pos-payments-
- Operational cash controls (NG-secondary — Nairaland guide, consistent with global practice): limit cash held on-site (robbery risk), use drop safes, train attendants to spot counterfeit naira, keep manual fallback for POS network failures, reconcile cash + POS daily.
- Cashier collects and accounts for all daily cash from attendants (Delta cashier job ad); manager reconciles and banks takings — banking cadence (daily vs per-shift) not directly documented; daily banking is standard practice. [Partially UNVERIFIED]
- Float: attendants need change float for cash sales; explicit Nigerian float-management procedure not found in sources — flag as UNVERIFIED; standard practice is a fixed opening float issued and counted back at shift end.

## 7. Restocking: depot ordering and tanker delivery verification

- Delivery verification chain (LinkedIn pulse article "Fuel Offloading: The Actual Procedure Behind Every Delivery"): first step on tanker arrival is verification "ensuring that the product delivered has arrived exactly as it left the depot" — check waybill/meter ticket against compartment contents before offloading. [GLOBAL/African fuel-logistics content]
  - Source: https://www.linkedin.com/pulse/fuel-offloading-actual-procedure-behind-jpmuf
- Nigerian audit checklist: "Check waybills and depot documents. Verify that the litres delivered match the ones recorded in the stock book." [NG-primary]
  - Source: https://www.facebook.com/groups/522644301180063/posts/9728848550559546/
- Nairaland supervisor guide: "Verify fuel deliveries (check meter tickets and quality)" as a daily priority; source only from licensed suppliers to avoid adulterated ("off-spec") product. [NG-secondary]
- Standard delivery procedure (GLOBAL, corroborated by fuel-logistics content): dip receiving tank before discharge; check tanker compartment seals and dip/ullage each compartment against the waybill; discharge one compartment at a time; dip tank again after settling; delivered volume = after-dip − before-dip; sign waybill/delivery note; record delivery in tank stock book. Water-paste check for water bottom before and after delivery. [GLOBAL — flagged; consistent with Nigerian audit posts but full step list not from a Nigerian source]
- Supply chain context: stations buy from NNPC Retail depots, private depots (Lagos/Apapa, Warri, Port Harcourt, Calabar axis), or major/independent marketers; supply relationships matter during scarcity ("build relationships with NNPC and licensed marketers to secure supply during shortages" — Nairaland guide). Depots typically require payment before loading (Moniepoint case study emphasizes upfront-payment cash-flow pressure). [NG-primary/secondary mix]
- IPMAN (Independent Petroleum Marketers Association of Nigeria) is the trade association most independent station owners belong to; NMDPRA is the regulator (retail licence, price display, safety); SON certifies pump calibration. [NG-secondary — Nairaland guide; regulator names are well-established fact]
- Current supply-chain shape (2025-26 news snippets): Dangote Refinery is now a major PMS source — marketers load at its gantry or buy through private depots; ex-depot PMS prices are published/tracked daily by marketers (e.g., ~₦872–877/L in one late-2025 snapshot, spiking to ₦1,200+ when Dangote suspended gantry loading); NNPC is no longer the sole off-taker. Depot price volatility drives station repricing decisions day to day. [NG-primary news snippets; prices dated and volatile — use as illustration only]
  - Sources: https://www.legit.ng/business-economy/energy/1720461-new-petrol-price-depots-announce-rates-dangote-suspends-gantry-loading/ ; Punch/Channels social snippets from search results

## 8. Nigeria-specific operating realities (cross-cutting)

From the Nairaland supervisor guide [NG-secondary] and corroborating context:
- Fuel scarcity cycles: queue management, rationing, anti-hoarding vigilance, and jerrycan-sales bans are recurring operational tasks.
- Power supply: stations run generators/inverters to keep pumps running; diesel self-consumption is a major operating cost.
- Security: CCTV, night guards, anti-siphoning measures on tanks; robbery risk shapes cash handling.
- Community relations: goodwill with local leaders/youths; discounts to police/taxi drivers noted as common informal practice.
- Compliance: NMDPRA retail licence displayed; SON-certified calibrated pumps; VAT/withholding tax to FIRS; environmental spill rules (sand/sawdust for spills, report major spills to NMDPRA).
- Employee theft is a named top risk: "Audit daily sales and fuel dips to catch discrepancies."

**Meter fraud and under-dispensing (Sunday PUNCH investigation, scraped in full):** Sunday PUNCH documented "widespread manipulation of fuel dispensers and tampering with meters in many filling stations" — attendant-level tricks (distraction accomplices such as snack hawkers, not resetting the meter, overselling/"pumping air" past the requested amount) and station-level under-dispensing. Regulatory enforcement is episodic: NMDPRA/DPR have sealed stations for hoarding, adulteration, and under-dispensing (e.g., 8 FCT stations in Mar 2021; 55 Port Harcourt-zone stations in six weeks in 2019; 4 Anambra stations in 2022 for methanol-contaminated PMS). Experts quoted blame weak, inconsistent regulatory monitoring. Operational implication: a serious station's controls (calibration checks, meter-reset discipline, CCTV, dip-vs-meter reconciliation) exist against a backdrop where cheating is common enough that customers actively watch the meter. [NG-primary — national newspaper investigation]
  - Source: https://punchng.com/meter-scam-fuel-attendants-drivers-in-battle-of-wits/

---

## Source list and quality notes

| # | Source | Type | Quality |
|---|--------|------|---------|
| 1 | myjobmag.com Fatgbems Pump Attendant job ad | NG job listing | High for role definition |
| 2 | x.com/Jobnetworkng station cashier ad (Agbor, Delta) | NG job listing | High for role definition (search snippet only; page not scraped) |
| 3 | nairaland.com/8330316 filling station manager/supervisor guide | NG forum post | Medium-low: appears AI-compiled; checklist plausible and consistent with other sources |
| 4 | megatecpumps.com operator training page | NG vendor (Lagos) | High for what Nigerian operators are trained on |
| 5 | linkedin.com Emmanuel Okwori post on dipping | NG practitioner | Medium (snippet; full post gated) |
| 6 | facebook.com "How to audit a petrol station" posts (x2 groups) | NG practitioner/business groups | Medium-high: concrete, repeated across groups and by an ACA on LinkedIn (snippets; full posts login-gated) |
| 7 | fuelsetu.com shift reconciliation guide | Fuel-retail ERP vendor (India) | High for standard practice; GLOBAL flag |
| 8 | besmart.ie EPA wetstock reconciliation PDF | Regulator guide (Ireland) | High for method; GLOBAL flag |
| 9 | veeder.com loss detection blog | Industry vendor (US) | Medium-high; GLOBAL flag |
| 10 | technext24.com digital payments at Nigerian fuel stations | NG tech media reporting Moniepoint study | Medium-high (single-study basis, vendor-sponsored data) |
| 11 | casestudies.moniepoint.com "Fueling the Nation" PDF | NG fintech industry report | Medium-high (vendor-published) |
| 12 | linkedin.com/pulse fuel offloading procedure | Fuel logistics article | Medium; GLOBAL/Africa flag |
| 13 | linkedin.com/pulse FG orders stations to accept transfers/POS | NG news summary | Medium |
| 14 | punchng.com "Meter scam: fuel attendants, drivers in battle of wits" | NG national newspaper investigation | High for fraud/enforcement landscape |
| 15 | fuelsetu.com daily closing checklist | Fuel-retail ERP vendor (India) | High for standard practice; GLOBAL flag |
| 16 | nairaland.com/6433076 attendant cheating thread | NG forum (customer anecdotes) | Medium: anecdotal but numerous, consistent, and matching the Punch investigation |
| 17 | smartflowtech.com | NG wetstock/ATG vendor (Lagos) | High for vendor capability claims |
| 18 | NG job ads: Indeed/Instagram/Facebook manager & cashier postings | NG job listings (snippets) | Medium-high for salary/role data |
| 19 | legit.ng depot price news | NG news | Medium; prices highly volatile, use as illustration |

## Open gaps / flagged uncertainties

1. Attendants-per-island and shift-pattern norms: UNVERIFIED (no direct source).
2. NMDPRA/DPR acceptable wetstock loss tolerance percentage for Nigeria: UNVERIFIED. Documented global practice (EPA Ireland guide): track cumulative % variance vs each tank's own "normal" trend, and investigate on +0.1% change from monthly normal, +10 L/day over a month, or +300 L extra loss in a month. Nigerian regulatory equivalents not found.
3. Banking cadence and float amounts: standard practice assumed, not documented for Nigeria.
4. DPK decline/idle kerosene pumps: inference from market context.
5. Facebook/LinkedIn sources were login-gated; claims rest on search-result snippets plus cross-corroboration.
