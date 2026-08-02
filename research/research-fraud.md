# Research: Fraud, Theft & Loss Vectors at Nigerian Filling Stations — and How Owners Detect/Prevent Them

Research date: 2026-08-02. Method: firecrawl search + scrape (9 searches, ~11 scrapes). Purpose: defensive/detection requirements for multi-station monitoring software. Each claim carries source URL(s) and a quality note. Uncertainty flags marked **[UNCERTAIN]** or **[VENDOR CLAIM]**.

---

## 1. Attendant-level fraud

### 1.1 Not resetting the pump / "selling on top of" a previous sale
The single most-reported trick in Nigerian first-hand accounts. Attendant starts dispensing while the meter still shows the previous customer's amount (e.g. meter at N500 when you drive in; your N2,000 purchase actually delivers ~N1,500 worth), or "recalls" a past sale on digital pumps so the display shows a completed amount without fuel flowing.
- Source: Nairaland thread "Numerous Ways Fuel Attendants In Nigeria Cheat On Motorist" (first-hand victim accounts, Feb 2021) — https://www.nairaland.com/6433076/numerous-ways-fuel-attendants-nigeria — Quality: primary anecdotes from consumers; consistent across many posters; not systematically verified.
- Corroboration: Daily Times Nigeria "How attendants in filling stations cheat customers" (recall-past-sales trick on digital pumps) — https://www.facebook.com/dailytimesnigeria/posts/1046775204142544/ (snippet only; FB not scrapeable) — Quality: national paper summary, seen only via search snippet.
- Corroboration: TVC News "Man exposes alleged fuel station scam with smart glass" (viral video, Lagos) — https://www.facebook.com/tvcnewsng/posts/1359491679545300/ — Quality: news-reported viral video; alleged.

### 1.2 The documented trick inventory (from the same Nairaland thread — richest single list)
One poster ("Fixed") enumerated mechanisms; all are detection-relevant:
- Engage the customer in distracting conversation while meter runs from a prior sale.
- Collusion with hawkers (car chargers, air fresheners) to distract customers on arrival.
- Use the pump hose to physically block the meter display.
- Start dispensing the moment the customer bends to open the fuel cap, before meter reset can be confirmed.
- After a sale, hang the nozzle without hooking it so the meter does not reset on next lift.
- Use a pump whose display faces away from the customer's queue.
- Ask the customer to "drive forward a bit" out of sight of the display, then start selling.
- During power cuts mid-dispense, call out an arbitrary "amount already sold" and wipe the display when power returns.
- Systematic short-changing of amounts under N100 across dozens of vehicles per day.
- Claiming "fuel fully dispensed" when a keyed-in preset amount is blinking after a reset/power interruption (blinking = jumped to preset, not actually dispensed — poster "seunoj").
- Counterfeit-note swap: attendant claims customer's genuine notes were fake and returns pre-held counterfeits, demanding replacement (poster "obatreasure", manager intervened and confirmed the racket).
- Source: https://www.nairaland.com/6433076/numerous-ways-fuel-attendants-nigeria — Quality: consumer anecdotes; high consistency; excellent for threat-modelling, not for prevalence statistics.

### 1.3 Physical pump/nozzle tampering
- A hidden screw in the nozzle cradle prevents the pump registering nozzle replacement, so dispensing can continue/accrue against another sale. Reported by US police departments (Timberville PD, Fowlerville PD, 2026). **[UNCERTAIN — US reports; no Nigerian case found in this research, but mechanically applicable anywhere]**
  - https://www.fox10tv.com/2026/06/10/new-tampering-scam-is-popping-up-some-gas-pumps-heres-what-experts-say-look-out/
  - https://www.cbsnews.com/detroit/news/gas-pump-nozzle-holder-screw-scam/
- Nigerian regulators treat "pump tampering" and tampering with NMDPRA seals as distinct sanctionable offences (see §5), implying calibration tampering is a known local practice.

### 1.4 Motive and context
- Attendant wages are very low (one 2021 Nairaland poster: "fuel attendants don't earn up to 10k monthly, so they are mostly out to play smart"). **[UNCERTAIN — dated, single anecdote; supports "incentive design matters" not a payroll figure]**
- Widespread consumer distrust: "90% of them have scammed you even before you buy the fuel" (hyperbole, but reflects reputational stakes for a legitimate owner). Same thread.
- Selling from jerry cans / black-market diversion during scarcity is a recognized practice managers are told to prevent ("Never allow attendants to sell fuel in jerrycans — illegal and dangerous"). Source: Nairaland "Filling Station Manager Or Supervisor" guide post — https://www.nairaland.com/8330316/filling-station-manager-supervisor — Quality: **[LOW — post reads as AI-generated checklist content; use as practice inventory only]**

## 2. Manager-level fraud (fraud against the owner)

### 2.1 Diversion of sales cash — real EFCC case
- EFCC arrested Abdulazeez Gbadebo, station manager of Emadeb Energy Services Ltd, for alleged criminal breach of trust and diversion of ~N500 million belonging to his employer (Oct 2025). A separate viral report describes a manager arrested weeks into the job after diverting sales funds, with recovered cash on video.
  - https://x.com/officialEFCC/status/1973826270762074248 (EFCC official account)
  - https://www.youtube.com/watch?v=lFMTtBwiDxU (Channels TV)
  - https://www.facebook.com/GistReelOnline/posts/1093279392933326/ (viral case; **[UNCERTAIN — tabloid source]**)
  - Quality: EFCC/Channels = strong; allegation stage, not conviction.

### 2.2 Diverted deliveries / collusion with tanker logistics — real NSCDC case
- Manager of Lamido Petroleum (New Nyanya, Nasarawa) took delivery of a 40,000-litre truck but discharged only 13,300 litres from one of three compartments, diverting ~26,700 litres to a station in Akwanga to sell at a higher price (fuel-scarcity arbitrage). Arrested by NSCDC; disclosed by NNPC (Feb 2018).
  - https://www.premiumtimesng.com/news/more-news/258384-nscdc-arrest-petrol-station-manager-fuel-diversion.html
  - Corroboration: https://www.vanguardngr.com/2018/02/fuel-queues-petrol-station-manager-arrested-alleged-diversion/amp/
  - Quality: two reputable national papers; strong. Detection lesson: delivery verification must reconcile ordered vs waybill vs per-compartment discharge vs before/after tank dips.
- Driver-side siphoning en route is common enough that owners fit tankers with CCTV + solar panels (viral video) and one Ethiopian case saw a truck impounded over 4 litres siphoned — indicating regional norm of in-transit shrinkage. **[UNCERTAIN — social-media anecdotes]**
  - https://www.instagram.com/reel/DX_Ybjst1Xd/ ; https://www.facebook.com/FortuneAddis/posts/1615392610597422/

### 2.3 Under-reporting sales / ghost entries / falsified records
- Auditor guidance for Nigerian petrol stations explicitly tests for: altered meter readings, collusion between attendants and manager to under-report sales, and matching of cash + POS + transfer settlements to fuel/lubricant/shop sales.
  - https://www.linkedin.com/posts/idongesit-ekanem-aca-068014189_how-to-audit-a-petrol-station... and https://www.linkedin.com/posts/uche-egbuiwe-aca-7bb838162_how-to-audit-a-petrol-station... (both LinkedIn; **scrape blocked — content from search snippets only**); same checklist circulating in Nigerian accounting Facebook groups (https://www.facebook.com/groups/panetwork/posts/2043560396378713/).
  - Quality: practitioner (ACA) checklists; snippet-level evidence. **[UNCERTAIN — full text not captured]**
- Fuelmetrics co-founder (BusinessDay interview, Jan 2025): before automation the sector was "heavily reliant on manual processes, which led to many thefts and inventory discrepancies... poor record keeping, poor accounting, and poor data."
  - https://businessday.ng/interview/article/ai-to-boost-fraud-detection-automate-decisions-in-fuel-stations/ — Quality: reputable business paper, but interviewee is a vendor.
- Fraud taxonomy repeated across Nigerian fuel-tech writing: pump manipulation, ghost sales, fuel siphoning, inflated invoices, manipulated manual reports.
  - https://medium.com/@fuelpricewatchteam/the-technology-revolution-transforming-nigerias-fuel-market-how-digital-solutions-are-ending-8ef3c20cf087 — Quality: **[PROMOTIONAL — Medium post by a fuel-price app team; use for taxonomy, not facts]**
- Claimed scale: "a 2024 industry study found Nigerian companies lose an average of 30% of their fuel budget to fraud and inefficiency" (fleet-side, not station-side). **[UNCERTAIN — study not named; found only in the promotional Medium piece]**

### 2.4 Falsified dip readings
- No direct Nigerian news case found for falsified dips specifically; the vector is implied by (a) audit checklists requiring independent dip verification, (b) the wetstock literature treating "inaccurate dip readings" and "employee manipulation" as core reconciliation challenges (see §3), and (c) daily-priorities guidance for Nigerian supervisors ("Audit daily sales and fuel dips to catch discrepancies"). **[UNCERTAIN — inference from control literature rather than documented case]**

## 3. Wet-stock variance analysis as the core detection mechanism

Primary technical source: "Wetstock Reconciliation at Fuel Storage Facilities" (Irish EPA-aligned guidance PDF, scraped in full) — https://www.besmart.ie/fs/doc/Small_Business/Documents/Wetstock_Reconciliation_at_Fuel_Storage_Facilities.pdf — Quality: authoritative technical guidance; jurisdiction is Ireland but method is universal.

Key method (directly implementable in software):
- **Daily variance**: Book Stock = Opening Stock + Deliveries − Sales; Variance = Closing (dip/ATG) − Book Stock. Worked worksheet examples included per tank per day.
- **Cumulative % variance** = Cumulative Variance ÷ Cumulative Sales × 100, plotted over time to establish each tank's **"normal" variance trend**; theft/leak detection = statistically abnormal deviation from that trend, not any single bad day.
- **Known benign variance drivers** the model must account for: pump meter calibration drift (legal tolerance in the Irish source: +1% to −0.5% — Nigerian tolerance set by NMDPRA/SON differs **[UNCERTAIN — exact Nigerian bandwidth not found]**), ATG/dipstick calibration error, tank tilt/chart error, temperature (petrol expands ~0.11% per +1°C), vapour recovery, and delivery measurement error.
- **Delivery verification best practice**: dip before and after each delivery, allow ~5 minutes settling, compare to delivery ticket; note fuel temperature (warm fuel shrinks after drop); confirm product dropped into correct tank.
- **Escalation logic**: "If your data is correct and you still see losses — you may have a leak, or you may have had a theft."
- Statistical Inventory Reconciliation (SIR) by third parties; enhanced versions reconcile every transaction in near-real-time.

Supporting sources:
- Continuous reconciliation "can detect variances in a fuel system, isolate to certain dispensers, and diagnose when meter drift appears to be excessive" — Warren Rogers (US wetstock analytics firm) — https://warrenrogers.com/can-continuous-wet-stock-inventory-reconciliation-cr-help-to-tame-the-fuel-profitability-monster/ — Quality: vendor but technically credible.
- Wetstock management defined as addressing "all potential sources of variance including tank charts, meters, deliveries, temperature, theft, and leaks"; customer case: reduced delivery variances 60%, fuel sales +3%/site after automating. — https://www.titancloud.com/blog/what-is-wetstock-management-and-why-should-you-care/ — **[VENDOR CLAIM]**
- Daily reconciliation guide (steps, challenges: manual entry errors, inaccurate dips, delayed reporting, employee manipulation; best practices: daily without fail, automated capture, acceptable variance limits, audit trails) — https://petrolbunksoftware.com/blog/daily-fuel-reconciliation-guide — Quality: vendor (India) but a clean articulation of the standard process.
- Public-sector fuel audit example: acceptable variance set at 50 gal per 3,000-gal delivery (~1.7%); recommends monthly reconciliations + physical security; notes contractor control program incl. driver vetting and metered delivery tickets — https://www.sfwmd.gov/sites/default/files/documents/final%20%20fuel%20report.pdf — Quality: official inspector-general report (US).

## 4. Controls stack (what real operators deploy)

### 4.1 Hardware/automation layer (Nigerian vendors — proof this market exists locally)
- **Smartflow Technologies (Lagos)**: ATGs with web/remote access, alarms (high/low/water/overfill/reorder) with e-mail/SMS notification; forecourt controllers ("FuelNet Manager") giving real-time cloud monitoring/control of dispensers, price signs, ATGs, and "wetstock inventory & reconciliation per site or network," explicitly designed so no on-site staff are needed to report performance; remote diagnostics. Data hosted on remote server, no customer IT infrastructure.
  - https://www.smartflowtech.com/service/fuel-management-products/ — Quality: vendor site; feature list credible.
- **Epump / Fuelmetrics (Lagos)**: hardware on dispensers + tanks, cloud-connected; claims 99.9%-accurate real-time per-litre monitoring; 3,000+ stations automated across Africa; "Always-On" offline-tolerant mode (Sept 2025) for Nigerian connectivity gaps; positions itself as eliminating pump manipulation, ghost sales, siphoning, inflated invoices.
  - https://www.epump.com.ng/ ; https://africa.businessinsider.com/local/markets/epump-bridging-the-technological-gaps-for-business-in-africa/ll5lpxy ; Medium piece above — **[VENDOR CLAIMS]**
- **Multi-station scaling evidence** (BusinessDay interview): one Epump customer grew from 18 to 89 stations after automating (2018–2025); another with 73 outlets had leased some out "because they could not entirely manage the network," then took them back post-automation and grew to 176. Direct quote: "companies can manage their retail network remotely... they still have their people on the ground... but it makes management easy."
  - https://businessday.ng/interview/article/ai-to-boost-fraud-detection-automate-decisions-in-fuel-stations/ — **[VENDOR CLAIM but specific and dated; strongest available evidence of Nigerian multi-station remote-monitoring practice]**

### 4.2 Process/control layer (from audit checklists + manager guidance)
- Daily: reconcile cash + POS + bank transfers against pump meter readings (opening/closing totalizers) per nozzle per shift; document incidents.
- Delivery: verify volumes on arrival (per compartment), check meter tickets and quality, dip before/after.
- Dual verification of dips and independent/surprise audits: practitioner checklists test for altered meter readings and manager–attendant collusion, implying the control is dips/readings taken or verified by someone other than the person who reports sales. **[UNCERTAIN — inferred; full checklist text not captured]**
- Cash handling: drop safes, limit cash on site, counterfeit-note training; POS/cashless preferred with manual fallback for network failures.
- Physical: CCTV and night guards; secure tanks/pumps against siphoning ("common in poorly lit stations").
- Sources: LinkedIn/Facebook ACA audit posts (snippets), Nairaland manager guide (**[LOW quality — likely AI-generated]**), FuelSetu shift-reconciliation guide (vendor, India) — https://fuelsetu.com/petrol-pump-shift-reconciliation-guide (7-step shift closure: nozzle readings → collections → credit → inventory → variance → sign-off).

## 5. Nigerian regulatory context (NMDPRA)

- NMDPRA runs **"Operation One Litre for One Litre"** surveillance: sealed 11 petrol stations in Rivers State (Obio-Akpor & Port Harcourt City LGAs) in one day for under-dispensing, failed pumps and other infractions; stations "remain sealed until the integrity of those pumps is confirmed." Regional Coordinator quote: "It is either you're dispensing within the bandwidth or we shut you down." (Feb 2026)
  - https://punchng.com/nmdpra-seals-11-petrol-stations-in-rivers-for-under-dispensing-product-others/ — Quality: strong (Punch, named officials).
- NMDPRA sealed 2 Ogun stations for under-dispensing/sharp practices under the Petroleum Industry Act 2021; warned operators against under-dispensing and against **tampering with the authority's seals**.
  - https://thesun.ng/nmdpra-seals-2-ogun-filling-stations-over-fuel-under-dispensing/ ; https://www.facebook.com/punchnewspaper/posts/1491745836322928/ — Quality: national papers.
- Pumps must be SON-certified and calibrated; NMDPRA price lists must be displayed. (Nairaland manager guide — **[LOW]**; consistent with regulator practice.)
- Even NNPC-branded stations face public under-dispensing allegations (Lapai, Niger State), with the manager publicly urging customers to verify pump meters — reputational risk cuts across brands.
  - https://www.facebook.com/lapaidigitaltv/posts/1061976166733580/ — **[UNCERTAIN — local FB news page]**
- Software implication: a station owner's own monitoring (dispensing accuracy within NMDPRA bandwidth, calibration logs, seal integrity) is not just anti-theft but regulatory-survival: sanctions = sealed station = total revenue stop.

## 6. Implications for monitoring software (synthesis)

1. **Per-shift, per-nozzle reconciliation** is the atomic unit: opening/closing totalizer readings × price vs (cash + POS + transfer + credit) per attendant. Catches cash skimming and unrecorded sales.
2. **Daily wetstock variance per tank** (opening + deliveries − meter sales vs closing dip/ATG), with **cumulative % variance trend** and per-tank "normal" baselines; alert on trend breaks, not single-day noise. Distinguish meter drift (variance moves when a specific pump's share of sales rises) from tank loss (constant) from temperature (seasonal).
3. **Delivery verification workflow**: expected volume vs waybill vs per-compartment discharge vs before/after dips (with settling time + temperature note). This is the control that would have caught the 26,700-litre Nasarawa diversion.
4. **Dual-entry dips**: dip recorded by attendant + verified by second person or ATG; flag divergence between manual dip and ATG.
5. **Anti-collusion design**: separate the roles of who dispenses, who counts cash, who dips, who reports; surprise remote-triggered audits; immutable audit trail of edits to readings.
6. **Cashless bias**: POS/transfer reduces skimmable cash, but design for network failure (Nigerian reality; Epump built "Always-On" for this).
7. **Regulatory dashboard**: calibration due-dates, dispensing-accuracy checks, NMDPRA seal status — because the regulator seals first and asks later.

## Source quality summary
- Strong (news/regulatory): Punch, Premium Times, Vanguard, The Sun, EFCC official X, Channels TV, BusinessDay.
- Strong (technical method): besmart.ie wetstock PDF, SFWMD audit report, Warren Rogers.
- Vendor/promotional (feature evidence, treat claims cautiously): Smartflow, Epump/Fuelmetrics, Titan Cloud, Petrosoft/petrolbunksoftware, FuelSetu, Medium fuel-tech piece.
- Forum/anecdotal (threat modelling gold, no prevalence value): Nairaland threads 6433076, 8330316, 7820970; Facebook/Instagram viral posts.
- Not scrapeable (snippets only): LinkedIn ACA audit checklists, Facebook posts (Daily Times, Punch FB, audit groups).
- Gaps: exact NMDPRA dispensing tolerance ("bandwidth") figure not found; no named Nigerian court case on falsified dip readings; the "30% fuel budget lost to fraud" study is uncited.
