/* ============================================================
   Weeldrop OS — prototype dataset
   Fictional but internally consistent operating data for
   Weeldrop Petroleum & Logistics (10 Ibadan stations + fleet).
   All figures are illustrative demo data, not client records.
   ============================================================ */

const WD = (() => {

  const BUSINESS_DATE = '3 Aug 2026';
  const PREV_DATE = '2 Aug 2026';

  /* ---------- products & prices (owner-broadcast) ---------- */
  const PRICES = {
    PMS: { name: 'Petrol (PMS)', price: 905, prev: 892, unit: 'L' },
    AGO: { name: 'Diesel (AGO)', price: 1180, prev: 1180, unit: 'L' },
    DPK: { name: 'Kerosene (DPK)', price: 1045, prev: 1045, unit: 'L' },
    CNG: { name: 'CNG', price: 230, prev: 230, unit: 'kg' }
  };

  /* ---------- 10 retail stations ----------
     status: ok | warn | bad   ·  x/y are % positions on the Ibadan schematic map
     `diff` is the day's shortage (−) or overage (+) in ₦. Cash / POS / transfer /
     credit are DERIVED below from litres × price + diff, so every number on every
     screen reconciles — the same rule the real app enforces server-side.        */
  const STATIONS = [
    { id:'SWM', name:'Sawmill', area:'Lagos–Ibadan Expressway', manager:'Tunde Adeyemi',
      staff:14, x:22, y:78, status:'ok', submittedAt:'20:42',
      sales:{PMS:21400, AGO:6200, DPK:900}, diff:-12_400, mix:{cash:.34,pos:.31,transfer:.27},
      expenses:214_000, variancePct:-0.08, varianceDays:0, hasCNG:true },

    { id:'AGD', name:'Iyana Oke-Adu', area:'Agodi Gate', manager:'Bisi Ogunleye',
      staff:9, x:48, y:41, status:'ok', submittedAt:'21:05',
      sales:{PMS:13800, AGO:2400, DPK:600}, diff:4_100, mix:{cash:.36,pos:.33,transfer:.31},
      expenses:141_000, variancePct:-0.11, varianceDays:0, hasCNG:false },

    { id:'ASH', name:'Ashi', area:'Iwo–Ojo Expressway', manager:'Kunle Salami',
      staff:8, x:36, y:22, status:'ok', submittedAt:'20:55',
      sales:{PMS:11200, AGO:1900, DPK:450}, diff:-6_800, mix:{cash:.39,pos:.32,transfer:.29},
      expenses:118_000, variancePct:-0.06, varianceDays:0, hasCNG:false },

    { id:'OLG', name:'Olaogun', area:'Old Ife Road', manager:'Grace Ilori',
      staff:8, x:60, y:39, status:'ok', submittedAt:'21:18',
      sales:{PMS:9600, AGO:1500, DPK:380}, diff:2_300, mix:{cash:.37,pos:.34,transfer:.29},
      expenses:96_000, variancePct:-0.14, varianceDays:0, hasCNG:false },

    { id:'BRW', name:'Breweries', area:'New Ife Road', manager:'Segun Ajayi',
      staff:11, x:76, y:33, status:'ok', submittedAt:'20:38',
      sales:{PMS:12700, AGO:3100, DPK:520}, diff:-9_600, mix:{cash:.33,pos:.32,transfer:.27},
      expenses:152_000, variancePct:-0.09, varianceDays:0, hasCNG:true },

    { id:'AKB', name:'Akobo', area:'Akobo', manager:'Halima Yusuf',
      staff:9, x:66, y:20, status:'ok', submittedAt:'21:22',
      sales:{PMS:10400, AGO:1700, DPK:410}, diff:-3_100, mix:{cash:.38,pos:.33,transfer:.29},
      expenses:104_000, variancePct:-0.12, varianceDays:0, hasCNG:false },

    { id:'LAM', name:'Lam Adeshina Way', area:'Agodi / Secretariat', manager:'Femi Bakare',
      staff:7, x:44, y:36, status:'ok', submittedAt:'20:49',
      sales:{PMS:8900, AGO:1350, DPK:300}, diff:1_900, mix:{cash:.40,pos:.31,transfer:.29},
      expenses:88_000, variancePct:-0.07, varianceDays:0, hasCNG:false },

    { id:'BOD', name:'Bodija', area:'Bodija Market', manager:'Chidi Okonkwo',
      staff:12, x:40, y:26, status:'bad', submittedAt:'21:02',
      sales:{PMS:14100, AGO:2800, DPK:640}, diff:-18_700, mix:{cash:.35,pos:.33,transfer:.28},
      expenses:163_000, variancePct:-0.41, varianceDays:9, hasCNG:true,
      flag:'Tank 2 (PMS) cumulative variance −0.41% over 9 days vs −0.08% baseline' },

    { id:'NHT', name:'Nihort Road', area:'Idi-Ishin / Jericho', manager:'Yemi Oladipo',
      staff:7, x:20, y:34, status:'warn', submittedAt:'21:30',
      sales:{PMS:7800, AGO:1200, DPK:260}, diff:-86_400, mix:{cash:.36,pos:.34,transfer:.30},
      expenses:79_000, variancePct:-0.10, varianceDays:0, hasCNG:false,
      flag:'Cash shortage ₦86,400 on Shift 2 — attendant Musa I. (3rd this month)' },

    { id:'JMB', name:'Jembewon Road', area:'Jembewon', manager:'Rita Nwosu',
      staff:6, x:32, y:52, status:'warn', submittedAt:null,
      sales:{PMS:0, AGO:0, DPK:0}, diff:0, mix:{cash:0,pos:0,transfer:0},
      expenses:0, variancePct:0, varianceDays:0, hasCNG:false,
      flag:'No submission — 51 minutes past the 21:30 cut-off' }
  ];

  // Derive the payment split so takings always tie back to litres × price + diff.
  STATIONS.forEach(st => {
    const rev = Object.entries(st.sales).reduce((s,[p,v]) => s + v * PRICES[p].price, 0);
    const takings = rev + st.diff;
    st.cash = Math.round(takings * st.mix.cash);
    st.pos = Math.round(takings * st.mix.pos);
    st.transfer = Math.round(takings * st.mix.transfer);
    st.credit = Math.max(0, takings - st.cash - st.pos - st.transfer); // remainder = credit sales
  });

  /* ---------- tanks & nozzles (generated per station, deterministic) ---------- */
  const TANK_SPEC = [
    { id:'T1', product:'PMS', capacity:45000 },
    { id:'T2', product:'PMS', capacity:45000 },
    { id:'T3', product:'AGO', capacity:33000 },
    { id:'T4', product:'DPK', capacity:20000 }
  ];

  function tanksFor(st){
    const share = { PMS:0.5, AGO:1, DPK:1 };
    return TANK_SPEC.map((t, i) => {
      const dailyPull = (st.sales[t.product] || 0) * (t.product === 'PMS' ? share.PMS : 1);
      // deterministic pseudo-level from station id + tank index
      const seed = (st.id.charCodeAt(0) + st.id.charCodeAt(2) + i * 37) % 100;
      const fillPct = 0.22 + (seed / 100) * 0.62;
      const level = Math.round(t.capacity * fillPct);
      const daysStock = dailyPull > 0 ? +(level / dailyPull).toFixed(1) : null;
      const isBadTank = st.status === 'bad' && t.id === 'T2';
      return {
        ...t, level, daysStock,
        variancePct: isBadTank ? -0.41 : +(st.variancePct + (i - 1.5) * 0.02).toFixed(2),
        flagged: isBadTank
      };
    });
  }

  function nozzlesFor(st){
    const list = [];
    const layout = [['PMS',4],['AGO',2],['DPK',1]];
    let n = 1;
    layout.forEach(([product, count]) => {
      for (let i = 0; i < count; i++){
        const daily = Math.round((st.sales[product] || 0) / count);
        const opening = 100000 + (st.id.charCodeAt(1) * 977 + n * 4211) % 500000;
        list.push({
          id:`N${n}`, label:`Pump ${Math.ceil(n/2)} · Nozzle ${n}`, product,
          opening, closing: opening + daily, attendant: ATTENDANTS[(n + st.id.charCodeAt(0)) % ATTENDANTS.length]
        });
        n++;
      }
    });
    return list;
  }

  const ATTENDANTS = ['Musa Ibrahim','Blessing Eze','Sadiq Bello','Toyin Alabi',
                      'Ifeanyi Nwachi','Zainab Lawal','Peter Ojo'];

  /* ---------- attendant shortage league (cross-station, 30 days) ---------- */
  const SHORTAGES = [
    { name:'Musa Ibrahim', station:'NHT', shifts:24, shortNGN:214_600, pctOfTakings:0.42, trend:'up' },
    { name:'Sadiq Bello', station:'BOD', shifts:26, shortNGN:151_200, pctOfTakings:0.19, trend:'up' },
    { name:'Peter Ojo', station:'BOD', shifts:22, shortNGN:96_800, pctOfTakings:0.14, trend:'flat' },
    { name:'Toyin Alabi', station:'SWM', shifts:27, shortNGN:41_300, pctOfTakings:0.04, trend:'down' },
    { name:'Blessing Eze', station:'AGD', shifts:25, shortNGN:12_900, pctOfTakings:0.02, trend:'flat' },
    { name:'Zainab Lawal', station:'BRW', shifts:26, shortNGN:8_400, pctOfTakings:0.01, trend:'down' }
  ];

  /* ---------- 9-day variance series for the Bodija T2 story ---------- */
  const BOD_T2_SERIES = [
    { d:'25 Jul', v:-0.09 },{ d:'26 Jul', v:-0.07 },{ d:'27 Jul', v:-0.19 },
    { d:'28 Jul', v:-0.24 },{ d:'29 Jul', v:-0.28 },{ d:'30 Jul', v:-0.31 },
    { d:'31 Jul', v:-0.35 },{ d:'1 Aug', v:-0.38 },{ d:'2 Aug', v:-0.40 },{ d:'3 Aug', v:-0.41 }
  ];
  const BASELINE = -0.08;

  /* ---------- tanker fleet ---------- */
  const TRUCKS = [
    { id:'WD-01', plate:'IBD-441-XA', capacity:45000, comps:[15000,15000,15000], driver:'Aliyu Danjuma',
      status:'in-transit', task:'Trip T-2411 · AGO 45,000 L → Ibadan Flour Mills',
      x:52, y:60, speed:47, lastPing:'2 min ago', progress:0.62 },
    { id:'WD-02', plate:'IBD-778-XY', capacity:33000, comps:[11000,11000,11000], driver:'Sule Adamu',
      status:'loading', task:'Loading at Ibafo depot · PMS 33,000 L → SWM + BOD',
      x:8, y:88, speed:0, lastPing:'just now', progress:0.18 },
    { id:'WD-03', plate:'IBD-092-KJ', capacity:45000, comps:[15000,15000,15000], driver:'Emeka Umeh',
      status:'discharging', task:'Trip T-2409 · discharging PMS at Breweries',
      x:76, y:33, speed:0, lastPing:'1 min ago', progress:0.9 },
    { id:'WD-04', plate:'IBD-315-LM', capacity:45000, comps:[15000,15000,15000], driver:'Ibrahim Sanni',
      status:'alert', task:'Trip T-2412 · AGO 30,000 L → Sunshine Poultry, Iseyin',
      x:14, y:14, speed:0, lastPing:'40 min stationary', progress:0.44,
      alert:'Stopped 41 min · 3.2 km off approved route, outside Iwo' },
    { id:'WD-05', plate:'IBD-660-RT', capacity:33000, comps:[11000,11000,11000], driver:'Yakubu Musa',
      status:'idle', task:'Available at Sawmill yard', x:22, y:78, speed:0, lastPing:'6 min ago', progress:0 },
    { id:'WD-06', plate:'IBD-204-BN', capacity:45000, comps:[15000,15000,15000], driver:'Chuka Obi',
      status:'in-transit', task:'Trip T-2410 · PMS 45,000 L → AKB, ASH, NHT (3-drop)',
      x:44, y:28, speed:31, lastPing:'1 min ago', progress:0.71 },
    { id:'WD-07', plate:'IBD-877-GH', capacity:33000, comps:[11000,11000,11000], driver:'—',
      status:'maintenance', task:'Workshop · brake overhaul, due back 5 Aug',
      x:22, y:80, speed:0, lastPing:'—', progress:0 },
    { id:'WD-08', plate:'IBD-501-QD', capacity:45000, comps:[15000,15000,15000], driver:'Ahmed Bello',
      status:'in-transit', task:'Trip T-2413 · AGO 45,000 L → Bower Cement, Ilorin',
      x:64, y:8, speed:58, lastPing:'3 min ago', progress:0.35 }
  ];

  /* ---------- bulk B2B customers ---------- */
  const CUSTOMERS = [
    { id:'C-101', name:'Ibadan Flour Mills Ltd', type:'Manufacturing', contact:'Mr. Adeola Fashola',
      product:'AGO', monthlyVol:180000, terms:'30 days', limit:220_000_000,
      outstanding:141_600_000, ageing:{ '0-30':98_400_000, '31-60':43_200_000, '61-90':0, '90+':0 },
      lastOrder:'2 Aug 2026', tank:60000, tankLevel:19400 },
    { id:'C-102', name:'Sunshine Poultry Farms', type:'Agriculture', contact:'Mrs. Ngozi Eze',
      product:'AGO', monthlyVol:64000, terms:'14 days', limit:60_000_000,
      outstanding:38_900_000, ageing:{ '0-30':38_900_000, '31-60':0, '61-90':0, '90+':0 },
      lastOrder:'1 Aug 2026', tank:30000, tankLevel:6100 },
    { id:'C-103', name:'Bower Cement Depot, Ilorin', type:'Construction', contact:'Alhaji Musa Yaro',
      product:'AGO', monthlyVol:220000, terms:'21 days', limit:280_000_000,
      outstanding:262_400_000, ageing:{ '0-30':160_000_000, '31-60':71_200_000, '61-90':31_200_000, '90+':0 },
      lastOrder:'3 Aug 2026', tank:80000, tankLevel:41000, risk:'Near limit · 94% utilised' },
    { id:'C-104', name:'Oyo State Water Corporation', type:'Public sector', contact:'Engr. T. Afolabi',
      product:'AGO', monthlyVol:48000, terms:'45 days', limit:70_000_000,
      outstanding:52_100_000, ageing:{ '0-30':21_000_000, '31-60':18_900_000, '61-90':7_400_000, '90+':4_800_000 },
      lastOrder:'28 Jul 2026', tank:25000, tankLevel:11200, risk:'₦4.8m over 90 days' },
    { id:'C-105', name:'Premier Feed Mills', type:'Manufacturing', contact:'Mr. K. Oyelaran',
      product:'AGO', monthlyVol:52000, terms:'30 days', limit:65_000_000,
      outstanding:19_400_000, ageing:{ '0-30':19_400_000, '31-60':0, '61-90':0, '90+':0 },
      lastOrder:'30 Jul 2026', tank:30000, tankLevel:13800 },
    { id:'C-106', name:'Alpha Marketers Ltd', type:'Petroleum marketer', contact:'Mr. S. Danladi',
      product:'PMS', monthlyVol:450000, terms:'Prepaid', limit:0,
      outstanding:0, ageing:{ '0-30':0, '31-60':0, '61-90':0, '90+':0 },
      lastOrder:'2 Aug 2026', tank:null, tankLevel:null, note:'Prepaid wallet · balance ₦86.4m' },
    { id:'C-107', name:'Fresh Foods Cold Chain', type:'Logistics', contact:'Ms. A. Bamidele',
      product:'AGO', monthlyVol:38000, terms:'Fleet card', limit:12_000_000,
      outstanding:4_600_000, ageing:{ '0-30':4_600_000, '31-60':0, '61-90':0, '90+':0 },
      lastOrder:'3 Aug 2026', tank:null, tankLevel:null, note:'Weeldrop fleet card · 22 vehicles' }
  ];

  /* ---------- bulk orders ---------- */
  const ORDERS = [
    { id:'ORD-4471', customer:'C-101', product:'AGO', volume:45000, unitPrice:1128,
      stage:'in-transit', trip:'T-2411', placed:'3 Aug 08:12', window:'3 Aug, 14:00–17:00',
      dest:'Ibadan Flour Mills, Oluyole', paid:true },
    { id:'ORD-4472', customer:'C-102', product:'AGO', volume:30000, unitPrice:1136,
      stage:'in-transit', trip:'T-2412', placed:'3 Aug 07:40', window:'3 Aug, 13:00–16:00',
      dest:'Sunshine Poultry, Iseyin', paid:true, flag:'Truck WD-04 off-route' },
    { id:'ORD-4473', customer:'C-103', product:'AGO', volume:45000, unitPrice:1124,
      stage:'in-transit', trip:'T-2413', placed:'3 Aug 06:55', window:'3 Aug, 15:00–18:00',
      dest:'Bower Cement Depot, Ilorin', paid:false, flag:'Credit 94% utilised — approval required' },
    { id:'ORD-4474', customer:'C-105', product:'AGO', volume:22000, unitPrice:1140,
      stage:'confirmed', trip:null, placed:'3 Aug 09:31', window:'4 Aug, 09:00–12:00',
      dest:'Premier Feed Mills, Ojoo', paid:false },
    { id:'ORD-4475', customer:'C-106', product:'PMS', volume:45000, unitPrice:872,
      stage:'quoted', trip:null, placed:'3 Aug 10:04', window:'4 Aug, 06:00–09:00',
      dest:'Alpha Marketers depot, Ogbomoso', paid:false },
    { id:'ORD-4470', customer:'C-104', product:'AGO', volume:18000, unitPrice:1142,
      stage:'delivered', trip:'T-2405', placed:'28 Jul 11:20', window:'29 Jul, 10:00–13:00',
      dest:'Oyo Water Corp, Eleyele', paid:false }
  ];

  /* ---------- trips (dispatch board) ---------- */
  const TRIPS = [
    { id:'T-2409', truck:'WD-03', driver:'Emeka Umeh', kind:'Retail restock',
      route:'Ibafo depot → Breweries', product:'PMS', planned:45000, stage:'discharging',
      loadedAt:'06:10', seals:['S-88412','S-88413','S-88414'], sealsIntact:true,
      dipBefore:8200, dipAfter:null, eta:'—' },
    { id:'T-2410', truck:'WD-06', driver:'Chuka Obi', kind:'Retail restock (3-drop)',
      route:'Ibafo depot → AKB → ASH → NHT', product:'PMS', planned:45000, stage:'in-transit',
      loadedAt:'07:25', seals:['S-88420','S-88421','S-88422'], sealsIntact:true,
      dipBefore:null, dipAfter:null, eta:'14:35' },
    { id:'T-2411', truck:'WD-01', driver:'Aliyu Danjuma', kind:'Bulk delivery',
      route:'Sawmill yard → Ibadan Flour Mills', product:'AGO', planned:45000, stage:'in-transit',
      loadedAt:'08:55', seals:['S-88431','S-88432','S-88433'], sealsIntact:true,
      dipBefore:null, dipAfter:null, eta:'15:10' },
    { id:'T-2412', truck:'WD-04', driver:'Ibrahim Sanni', kind:'Bulk delivery',
      route:'Sawmill yard → Sunshine Poultry, Iseyin', product:'AGO', planned:30000, stage:'alert',
      loadedAt:'08:02', seals:['S-88440','S-88441'], sealsIntact:true,
      dipBefore:null, dipAfter:null, eta:'overdue',
      alert:'Stationary 41 min, 3.2 km off approved route outside Iwo' },
    { id:'T-2413', truck:'WD-08', driver:'Ahmed Bello', kind:'Bulk delivery',
      route:'Ibafo depot → Bower Cement, Ilorin', product:'AGO', planned:45000, stage:'in-transit',
      loadedAt:'06:40', seals:['S-88450','S-88451','S-88452'], sealsIntact:true,
      dipBefore:null, dipAfter:null, eta:'16:20' },
    { id:'T-2405', truck:'WD-01', driver:'Aliyu Danjuma', kind:'Bulk delivery',
      route:'Sawmill yard → Oyo Water Corp', product:'AGO', planned:18000, stage:'closed',
      loadedAt:'29 Jul 08:15', seals:['S-88310','S-88311'], sealsIntact:true,
      dipBefore:3100, dipAfter:20950, eta:'—', delivered:17850, gap:-150 }
  ];

  /* ---------- alerts feed ---------- */
  const ALERTS = [
    { sev:'bad', ic:'▲', t:'Bodija · Tank 2 variance trend break',
      s:'Cumulative −0.41% over 9 days against a −0.08% baseline. ≈ 1,240 L unaccounted, ≈ ₦1.12m at today\'s price.',
      when:'21:04', ctx:'station', ref:'BOD' },
    { sev:'bad', ic:'◉', t:'WD-04 stopped off-route near Iwo',
      s:'41 minutes stationary, 3.2 km outside the approved corridor. Trip T-2412 carrying 30,000 L AGO for Sunshine Poultry.',
      when:'12:47', ctx:'fleet', ref:'WD-04' },
    { sev:'warn', ic:'⏱', t:'Jembewon Road · no submission',
      s:'51 minutes past the 21:30 cut-off. Manager Rita Nwosu nagged at 21:30 and 21:45.',
      when:'22:21', ctx:'station', ref:'JMB' },
    { sev:'warn', ic:'₦', t:'Nihort Road · cash shortage ₦86,400',
      s:'Shift 2, attendant Musa Ibrahim. Third shortage above threshold this month; 30-day total ₦214,600.',
      when:'21:31', ctx:'station', ref:'NHT' },
    { sev:'warn', ic:'▤', t:'Bower Cement credit at 94% of limit',
      s:'₦262.4m outstanding against a ₦280m limit, with ₦31.2m in the 61–90 day bucket. ORD-4473 needs approval.',
      when:'09:15', ctx:'credit', ref:'C-103' },
    { sev:'warn', ic:'⛽', t:'Nihort Road · PMS at 1.6 days of stock',
      s:'Tank 1 at 12,400 L against 7,800 L/day average. Next allocation not scheduled.',
      when:'18:30', ctx:'stock', ref:'NHT' },
    { sev:'info', ic:'◷', t:'Pump calibration due — Akobo, 3 nozzles',
      s:'Weights & Measures certificates expire 19 Aug 2026. NMDPRA under-dispensing sweeps are active.',
      when:'08:00', ctx:'compliance', ref:'AKB' },
    { sev:'info', ic:'⇅', t:'Price broadcast acknowledged by 9 of 10 stations',
      s:'PMS ₦905/L effective 06:00 today. Jembewon Road has not acknowledged.',
      when:'06:02', ctx:'price', ref:null }
  ];

  /* ---------- compliance register ---------- */
  const COMPLIANCE = [
    { station:'AKB', item:'Pump calibration (3 nozzles)', authority:'Weights & Measures', due:'19 Aug 2026', days:16, status:'warn' },
    { station:'JMB', item:'Fire safety certificate', authority:'Federal Fire Service', due:'2 Sep 2026', days:30, status:'warn' },
    { station:'BOD', item:'NMDPRA retail outlet licence', authority:'NMDPRA', due:'14 Oct 2026', days:72, status:'ok' },
    { station:'SWM', item:'NMDPRA retail outlet licence', authority:'NMDPRA', due:'3 Nov 2026', days:92, status:'ok' },
    { station:'ALL', item:'Dispensing-accuracy self-test (weekly)', authority:'Internal / NMDPRA', due:'8 Aug 2026', days:5, status:'warn' },
    { station:'FLEET', item:'Tanker roadworthiness — WD-07', authority:'FRSC / DoT', due:'22 Aug 2026', days:19, status:'warn' },
    { station:'FLEET', item:'Tanker calibration certificate — WD-02', authority:'Weights & Measures', due:'11 Dec 2026', days:130, status:'ok' }
  ];

  /* ---------- CNG programme (Q4 2026) ---------- */
  const CNG = {
    target: 3, note: '3 CNG stations across Ibadan by Q4 2026 (client roadmap)',
    sites: [
      { station:'SWM', name:'Sawmill', phase:'Commissioning', pct:82, live:'15 Sep 2026',
        dispensers:4, compressor:'2 × 400 Nm³/h', cascade:'3-bank', note:'Gas supply agreement signed' },
      { station:'BRW', name:'Breweries', phase:'Civil works', pct:45, live:'20 Nov 2026',
        dispensers:3, compressor:'1 × 400 Nm³/h', cascade:'3-bank', note:'Awaiting Sagamu–Ibadan pipeline tie-in' },
      { station:'BOD', name:'Bodija', phase:'Permitting', pct:18, live:'Q1 2027',
        dispensers:2, compressor:'1 × 250 Nm³/h', cascade:'2-bank', note:'NMDPRA siting approval pending' }
    ],
    liveOps: { kgToday:1840, kgYesterday:1712, dispensers:4, uptimePct:96.2,
      compressorHours:11.4, inletPressureBar:21.6, cascadeHigh:78, cascadeMid:52, cascadeLow:31,
      downtimeMin:52, downtimeReason:'Compressor 2 auto-trip on low inlet pressure, 13:12–14:04' }
  };

  /* ---------- allocation engine ---------- */
  const ALLOCATION = {
    inbound: { truck:'WD-02', product:'PMS', volume:33000, eta:'16:40', unitCost:812 },
    claims: [
      { target:'NHT', kind:'station', need:'1.6 days stock', priority:1, suggest:12000, reason:'Lowest days-of-stock in the network' },
      { target:'JMB', kind:'station', need:'2.1 days stock', priority:2, suggest:9000, reason:'Below 3-day floor' },
      { target:'BOD', kind:'station', need:'3.4 days stock', priority:3, suggest:12000, reason:'Highest PMS throughput of the three' },
      { target:'C-106', kind:'bulk', need:'ORD-4475 quote 45,000 L', priority:4, suggest:0,
        reason:'Margin ₦33/L vs retail ₦93/L — retail wins this load' }
    ]
  };

  /* ---------- helpers ---------- */
  const ngn = n => '₦' + Math.round(n).toLocaleString('en-NG');
  const ngnShort = n => {
    const a = Math.abs(n);
    if (a >= 1e9) return '₦' + (n/1e9).toFixed(2) + 'bn';
    if (a >= 1e6) return '₦' + (n/1e6).toFixed(1) + 'm';
    if (a >= 1e3) return '₦' + Math.round(n/1e3) + 'k';
    return '₦' + Math.round(n);
  };
  const L = n => Math.round(n).toLocaleString('en-NG') + ' L';

  const stationRevenue = st =>
    Object.entries(st.sales).reduce((s,[p,v]) => s + v * PRICES[p].price, 0);
  const stationTakings = st => st.cash + st.pos + st.transfer + st.credit;
  const stationLitres = st => Object.values(st.sales).reduce((a,b)=>a+b,0);
  const stationDiff = st => stationTakings(st) - stationRevenue(st);

  const totals = () => {
    const live = STATIONS.filter(s => s.submittedAt);
    return {
      litres: STATIONS.reduce((s,st)=>s+stationLitres(st),0),
      revenue: STATIONS.reduce((s,st)=>s+stationRevenue(st),0),
      cash: STATIONS.reduce((s,st)=>s+st.cash,0),
      pos: STATIONS.reduce((s,st)=>s+st.pos,0),
      transfer: STATIONS.reduce((s,st)=>s+st.transfer,0),
      credit: STATIONS.reduce((s,st)=>s+st.credit,0),
      expenses: STATIONS.reduce((s,st)=>s+st.expenses,0),
      diff: STATIONS.reduce((s,st)=>s+stationDiff(st),0),
      submitted: live.length,
      receivable: CUSTOMERS.reduce((s,c)=>s+c.outstanding,0)
    };
  };

  const station = id => STATIONS.find(s => s.id === id);
  const customer = id => CUSTOMERS.find(c => c.id === id);

  return { BUSINESS_DATE, PREV_DATE, PRICES, STATIONS, TANK_SPEC, tanksFor, nozzlesFor,
           ATTENDANTS, SHORTAGES, BOD_T2_SERIES, BASELINE, TRUCKS, CUSTOMERS, ORDERS, TRIPS,
           ALERTS, COMPLIANCE, CNG, ALLOCATION,
           ngn, ngnShort, L, stationRevenue, stationTakings, stationLitres, stationDiff,
           totals, station, customer };
})();
