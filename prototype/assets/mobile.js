/* ============================================================
   Weeldrop OS — mobile prototype
   Four role apps in one shell: Manager, Owner, Driver, Bulk customer.
   Screens are pure render functions over WD (data.js) + local state.
   ============================================================ */

const App = (() => {

  const BOD = WD.station('BOD');

  /* ---------- wizard fixtures (Bodija, 3 Aug 2026) ---------- */
  const WIZ_NOZZLES = [
    { id:'N1', label:'Pump 1 · Nozzle 1', product:'PMS', opening:418_204, sold:3_600, attendant:'Sadiq Bello' },
    { id:'N2', label:'Pump 1 · Nozzle 2', product:'PMS', opening:392_881, sold:3_450, attendant:'Sadiq Bello' },
    { id:'N3', label:'Pump 2 · Nozzle 3', product:'PMS', opening:501_337, sold:3_700, attendant:'Peter Ojo' },
    { id:'N4', label:'Pump 2 · Nozzle 4', product:'PMS', opening:466_015, sold:3_350, attendant:'Peter Ojo' },
    { id:'N5', label:'Pump 3 · Nozzle 5', product:'AGO', opening:288_460, sold:1_500, attendant:'Blessing Eze' },
    { id:'N6', label:'Pump 3 · Nozzle 6', product:'AGO', opening:274_119, sold:1_300, attendant:'Blessing Eze' },
    { id:'N7', label:'Pump 4 · Nozzle 7', product:'DPK', opening:132_744, sold:640, attendant:'Zainab Lawal' }
  ];

  const WIZ_TANKS = [
    { id:'T1', product:'PMS', cap:45000, opening:21_400, delivered:15_000, actual:29_310 },
    { id:'T2', product:'PMS', cap:45000, opening:18_600, delivered:0, actual:11_492, watch:true },
    { id:'T3', product:'AGO', cap:33000, opening:14_200, delivered:0, actual:11_388 },
    { id:'T4', product:'DPK', cap:20000, opening:6_900, delivered:0, actual:6_252 }
  ];

  const PHOTO_SLOTS = [
    { id:'p1', label:'Pump bank 1–2 · closing meters' },
    { id:'p2', label:'Pump bank 3–4 · closing meters' },
    { id:'p3', label:'Tank 2 dip stick at the line' },
    { id:'p4', label:'Waybill WB-77420' },
    { id:'p5', label:'Cash count on the desk' }
  ];

  /* ---------- state ---------- */
  const S = {
    role: 'manager',
    screen: 'm-home',
    tab: 'home',
    sync: 'synced',              // synced | pending | syncing
    queued: 0,
    wiz: {
      step: 1,
      meters: Object.fromEntries(WIZ_NOZZLES.map(n => [n.id, n.opening + n.sold])),
      dips: Object.fromEntries(WIZ_TANKS.map(t => [t.id, t.actual])),
      delivery: { waybill:'WB-77420', supplier:'Ibafo Depot · Trip T-2408', tank:'T1',
                  volumeWaybill:15000, volumeMeasured:14_940, unitCost:812,
                  compartments:[5000,5000,5000], seals:'S-88401 / S-88402 / S-88403' },
      takings: { cash:BOD.cash, pos:BOD.pos, transfer:BOD.transfer, credit:BOD.credit },
      expenses: [
        { cat:'Generator diesel', amount:96_000, note:'118 L @ ₦1,180 (own AGO, internal transfer)' },
        { cat:'Casual labour', amount:34_000, note:'2 hands, forecourt wash' },
        { cat:'Repairs', amount:33_000, note:'Nozzle 4 swivel replacement' }
      ],
      photos: {}
    },
    driverAck: false,
    audit: null
  };

  const PRICE = p => WD.PRICES[p].price;
  const el = id => document.getElementById(id);

  /* ---------- derived wizard math (mirrors the server-side rules) ---------- */
  function metersDerived(){
    const rows = WIZ_NOZZLES.map(n => {
      const closing = +S.wiz.meters[n.id];
      const litres = closing - n.opening;
      return { ...n, closing, litres, invalid: !(closing >= n.opening) };
    });
    const byProduct = {};
    rows.forEach(r => { byProduct[r.product] = (byProduct[r.product] || 0) + Math.max(0, r.litres); });
    const litres = rows.reduce((s,r) => s + Math.max(0, r.litres), 0);
    const expected = Object.entries(byProduct).reduce((s,[p,v]) => s + v * PRICE(p), 0);
    return { rows, byProduct, litres, expected, anyInvalid: rows.some(r => r.invalid) };
  }

  function tanksDerived(){
    const { byProduct } = metersDerived();
    // per-product metered sales split evenly across that product's tanks
    const perProductTanks = {};
    WIZ_TANKS.forEach(t => { perProductTanks[t.product] = (perProductTanks[t.product] || 0) + 1; });
    return WIZ_TANKS.map(t => {
      const sold = (byProduct[t.product] || 0) / perProductTanks[t.product];
      const book = t.opening + t.delivered - sold;
      const actual = +S.wiz.dips[t.id];
      const variance = actual - book;
      const pct = sold > 0 ? (variance / sold) * 100 : 0;
      return { ...t, sold, book, actual, variance, pct };
    });
  }

  function takingsDerived(){
    const { expected } = metersDerived();
    const t = S.wiz.takings;
    const counted = (+t.cash || 0) + (+t.pos || 0) + (+t.transfer || 0) + (+t.credit || 0);
    return { expected, counted, diff: counted - expected };
  }

  const expensesTotal = () => S.wiz.expenses.reduce((s,e) => s + e.amount, 0);
  const photosTaken = () => Object.keys(S.wiz.photos).length;

  /* ---------- tiny view helpers ---------- */
  const sign = n => (n > 0 ? '+' : n < 0 ? '−' : '') + WD.ngn(Math.abs(n)).replace('₦','₦');
  const signL = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(Math.round(n)).toLocaleString('en-NG') + ' L';
  const tone = n => n < -1000 ? 'bad' : n < 0 ? 'warn' : 'ok';

  const statBox = (l, n, d, cls='') => `
    <div class="statbox"><div class="l">${l}</div><div class="n ${cls}">${n}</div>
    ${d ? `<div class="d muted">${d}</div>` : ''}</div>`;

  const sparkline = (series, baseline) => {
    const w = 300, h = 74, pad = 6;
    const vals = series.map(p => p.v);
    const min = Math.min(...vals, baseline) - 0.05, max = Math.max(...vals, baseline) + 0.05;
    const X = i => pad + (i * (w - pad * 2)) / (series.length - 1);
    const Y = v => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
    const path = series.map((p,i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    const area = `${path} L${X(series.length-1).toFixed(1)},${h-pad} L${X(0).toFixed(1)},${h-pad} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img"
      aria-label="Tank 2 cumulative variance trend over ${series.length} days, drifting from ${baseline}% to ${series[series.length-1].v}%">
      <path d="${area}" fill="rgba(239,68,68,.14)"/>
      <line x1="${pad}" x2="${w-pad}" y1="${Y(baseline)}" y2="${Y(baseline)}"
        stroke="#16a34a" stroke-width="1" stroke-dasharray="4 4" opacity=".7"/>
      <path d="${path}" fill="none" stroke="#EF4444" stroke-width="2.2"
        stroke-linejoin="round" stroke-linecap="round"/>
      ${series.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.v)}" r="${i===series.length-1?3.4:1.8}"
        fill="${i===series.length-1?'#EF4444':'#F87171'}"/>`).join('')}
    </svg>
    <div class="row between tiny faint mono"><span>${series[0].d}</span>
      <span style="color:#5EE9A0">baseline ${baseline}%</span><span>${series[series.length-1].d}</span></div>`;
  };

  const num = (bind, val, extra='') =>
    `<input type="number" inputmode="decimal" data-bind="${bind}" value="${val}" ${extra}>`;

  /* ============================================================
     MANAGER APP — Chidi Okonkwo, Bodija
     ============================================================ */
  const managerHome = () => {
    const t = takingsDerived();
    return `
    <div class="card" style="background:linear-gradient(150deg,#12693d,#0d4f2e)">
      <div class="row between">
        <div><div class="kicker" style="color:#bbf7d0">Business date</div>
          <div style="font-size:19px;font-weight:700">${WD.BUSINESS_DATE}</div></div>
        <span class="badge" style="background:rgba(255,255,255,.16);color:#fff">Shift 2 open</span>
      </div>
      <div class="sep" style="background:rgba(255,255,255,.18)"></div>
      <div class="row between sm"><span>Day report</span>
        <span class="b">${S.sync === 'synced' ? 'Submitted 21:02' : 'Not submitted'}</span></div>
      <div class="row between sm"><span>Cut-off</span><span class="b mono">21:30 WAT</span></div>
    </div>

    <div style="height:12px"></div>
    <button class="btn block" data-go="m-w1">
      ${S.sync === 'synced' ? 'Open today’s report' : 'Submit today’s figures'} →</button>
    <div class="anno">Target: under 3 minutes, offline-tolerant. The manager types only raw
      readings — every derived number is computed and stored server-side.</div>

    <div style="height:14px"></div>
    <div class="statgrid">
      ${statBox('Litres today', WD.stationLitres(BOD).toLocaleString('en-NG'), 'PMS + AGO + DPK')}
      ${statBox('Expected takings', WD.ngnShort(t.expected), 'litres × price')}
      ${statBox('Counted', WD.ngnShort(t.counted), 'cash + POS + transfer')}
      ${statBox('Difference', sign(t.diff), 'shortage', t.diff < 0 ? 'bad' : 'ok')}
    </div>

    <div style="height:14px"></div>
    <div class="card">
      <div class="card-h"><h4>Price broadcast</h4><span class="badge warn">Acknowledge</span></div>
      <div class="kv"><span class="k">PMS</span><span class="v">₦905 <span class="faint tiny">was ₦892</span></span></div>
      <div class="kv"><span class="k">AGO</span><span class="v">₦1,180</span></div>
      <div class="kv"><span class="k">DPK</span><span class="v">₦1,045</span></div>
      <div style="height:10px"></div>
      <button class="btn ghost block sm" data-go="m-price">Review &amp; acknowledge</button>
    </div>

    <div style="height:14px"></div>
    <div class="card">
      <div class="card-h"><h4>Attention</h4></div>
      <div class="alertrow bad"><div class="ic">▲</div><div>
        <div class="t">Tank 2 variance is drifting</div>
        <div class="s">−0.41% cumulative over 9 days. The owner has been alerted. A dip photo is required tonight.</div>
      </div></div>
      <div style="height:8px"></div>
      <div class="alertrow warn"><div class="ic">₦</div><div>
        <div class="t">Sadiq Bello · shortage ₦18,700</div>
        <div class="s">Shift 2. 30-day total ₦151,200 across 26 shifts.</div>
      </div></div>
    </div>`;
  };

  const wizChrome = (step, title, body, nextLabel, nextTo, backTo) => `
    <div class="row between tiny faint mono"><span>STEP ${step} OF 7</span><span>${title}</span></div>
    <div style="height:6px"></div>
    <div class="progress"><i style="transform:scaleX(${step/7})"></i></div>
    <div style="height:14px"></div>
    ${body}
    <div style="height:16px"></div>
    <div class="row">
      ${backTo ? `<button class="btn ghost" data-go="${backTo}">Back</button>` : ''}
      ${nextLabel ? `<button class="btn grow" data-go="${nextTo}">${nextLabel}</button>` : ''}
    </div>`;

  const w1Meters = () => {
    const d = metersDerived();
    return wizChrome(1, 'Pump meters', `
      <div class="note">Enter the <b>closing totalizer</b> from each nozzle. Opening is carried
        forward from yesterday’s closing and cannot be edited.</div>
      <div style="height:10px"></div>
      ${d.rows.map(r => `
        <div class="card" style="margin-bottom:9px">
          <div class="row between">
            <div><div class="b sm">${r.label}</div>
              <div class="tiny faint">${r.product} · ${r.attendant}</div></div>
            <span class="badge neutral">${r.product}</span>
          </div>
          <div class="row" style="margin-top:9px;gap:8px">
            <div class="grow"><label class="tiny faint">Opening</label>
              <div class="mono b" style="padding:9px 0">${r.opening.toLocaleString('en-NG')}</div></div>
            <div class="grow"><label class="tiny faint">Closing</label>
              ${num(`meters.${r.id}`, r.closing)}</div>
          </div>
          <div class="row between" style="margin-top:8px">
            <span class="tiny faint">Litres sold (computed)</span>
            <span class="mono b ${r.invalid ? 'bad' : ''}" style="${r.invalid?'color:#FCA5A5':'color:#5EE9A0'}">
              ${r.invalid ? 'closing < opening' : r.litres.toLocaleString('en-NG') + ' L'}</span>
          </div>
        </div>`).join('')}
      <div class="derived">
        <div class="lbl">Computed by the server</div>
        <div class="kv"><span class="k">PMS</span><span class="v">${(d.byProduct.PMS||0).toLocaleString('en-NG')} L</span></div>
        <div class="kv"><span class="k">AGO</span><span class="v">${(d.byProduct.AGO||0).toLocaleString('en-NG')} L</span></div>
        <div class="kv"><span class="k">DPK</span><span class="v">${(d.byProduct.DPK||0).toLocaleString('en-NG')} L</span></div>
        <div class="kv"><span class="k b">Expected takings</span><span class="v">${WD.ngn(d.expected)}</span></div>
      </div>
      <div class="anno">Cross-check: today’s opening must equal yesterday’s closing on every
        nozzle. A break flags a missed or fabricated reading.</div>
    `, 'Next: tank dips', 'm-w2', 'm-home');
  };

  const w2Dips = () => {
    const rows = tanksDerived();
    return wizChrome(2, 'Tank dips', `
      <div class="note">Dip each tank and enter the litres from the calibration chart.
        Book stock and variance are computed — never typed.</div>
      <div style="height:10px"></div>
      ${rows.map(t => `
        <div class="card" style="margin-bottom:9px">
          <div class="row between">
            <div class="b sm">Tank ${t.id.slice(1)} · ${t.product}</div>
            ${t.watch ? '<span class="badge bad">Under watch</span>' : `<span class="badge neutral">${(t.cap/1000)}k L</span>`}
          </div>
          <div class="kv"><span class="k">Opening dip</span><span class="v">${t.opening.toLocaleString('en-NG')} L</span></div>
          <div class="kv"><span class="k">Delivered today</span><span class="v">${t.delivered.toLocaleString('en-NG')} L</span></div>
          <div class="kv"><span class="k">Metered sales</span><span class="v">${Math.round(t.sold).toLocaleString('en-NG')} L</span></div>
          <div class="kv"><span class="k b">Book stock</span><span class="v">${Math.round(t.book).toLocaleString('en-NG')} L</span></div>
          <div style="height:9px"></div>
          <label class="tiny faint">Actual dip (litres)</label>
          ${num(`dips.${t.id}`, t.actual)}
          <div class="row between" style="margin-top:9px">
            <span class="tiny faint">Variance</span>
            <span class="mono b" style="color:${t.variance < -30 ? '#FCA5A5' : '#5EE9A0'}">
              ${signL(t.variance)} · ${t.pct.toFixed(2)}%</span>
          </div>
        </div>`).join('')}
      <div class="note warn">Tank 2 is <b>${rows[1].pct.toFixed(2)}%</b> today against a −0.08% baseline.
        A dip-stick photo is mandatory for this tank tonight.</div>
    `, 'Next: delivery', 'm-w3', 'm-w1');
  };

  const w3Delivery = () => {
    const d = S.wiz.delivery;
    const gap = (+d.volumeMeasured) - (+d.volumeWaybill);
    return wizChrome(3, 'Delivery', `
      <div class="note">One truck received today. Measured volume comes from the receiving
        tank dip before and after discharge — not from the waybill.</div>
      <div style="height:10px"></div>
      <div class="card">
        <div class="kv"><span class="k">Waybill</span><span class="v">${d.waybill}</span></div>
        <div class="kv"><span class="k">Source</span><span class="v" style="font-size:12px">${d.supplier}</span></div>
        <div class="kv"><span class="k">Receiving tank</span><span class="v">${d.tank} · PMS</span></div>
        <div class="kv"><span class="k">Seals</span><span class="v" style="font-size:11.5px">${d.seals}</span></div>
      </div>
      <div style="height:10px"></div>
      <div class="card">
        <div class="b sm" style="margin-bottom:8px">Per-compartment discharge</div>
        ${d.compartments.map((c,i) => `
          <div class="kv"><span class="k">Compartment ${i+1}</span>
            <span class="v">${c.toLocaleString('en-NG')} L</span></div>`).join('')}
        <div style="height:10px"></div>
        <div class="field"><label>Volume on waybill (L)</label>${num('delivery.volumeWaybill', d.volumeWaybill)}</div>
        <div class="field"><label>Measured by dip: after − before (L)</label>${num('delivery.volumeMeasured', d.volumeMeasured)}</div>
        <div class="field"><label>Unit cost (₦/L)</label>${num('delivery.unitCost', d.unitCost)}</div>
        <div class="derived">
          <div class="lbl">Computed</div>
          <div class="kv"><span class="k">Waybill vs measured</span>
            <span class="v" style="color:${gap < -100 ? '#FCA5A5' : '#5EE9A0'}">${signL(gap)}</span></div>
          <div class="kv"><span class="k">Landed cost of this load</span>
            <span class="v">${WD.ngn(d.volumeMeasured * d.unitCost)}</span></div>
          <div class="kv"><span class="k">Margin at ₦905/L</span>
            <span class="v">₦${(905 - d.unitCost).toFixed(0)}/L</span></div>
        </div>
      </div>
      <div class="anno">This is the control that catches diverted loads: waybill volume,
        per-compartment discharge and before/after dips must agree. A 26,700 L diversion
        in Nasarawa passed because nobody reconciled these three.</div>
    `, 'Next: takings', 'm-w4', 'm-w2');
  };

  const w4Takings = () => {
    const t = takingsDerived();
    const k = S.wiz.takings;
    const pct = v => t.counted ? ((v / t.counted) * 100).toFixed(1) + '%' : '0%';
    return wizChrome(4, 'Takings', `
      <div class="note">Split by payment method. Nigerian station mix runs roughly
        cash 34% / card 27% / transfer 14% — the form captures it natively.</div>
      <div style="height:10px"></div>
      <div class="field"><label>Cash counted (₦) · ${pct(k.cash)}</label>${num('takings.cash', k.cash)}</div>
      <div class="field"><label>POS settled (₦) · ${pct(k.pos)}</label>${num('takings.pos', k.pos)}</div>
      <div class="field"><label>Bank transfer (₦) · ${pct(k.transfer)}</label>${num('takings.transfer', k.transfer)}</div>
      <div class="field"><label>Authorised credit (₦) · ${pct(k.credit)}</label>${num('takings.credit', k.credit)}</div>
      <div class="derived">
        <div class="lbl">Reconciliation</div>
        <div class="kv"><span class="k">Expected (litres × price)</span><span class="v">${WD.ngn(t.expected)}</span></div>
        <div class="kv"><span class="k">Counted</span><span class="v">${WD.ngn(t.counted)}</span></div>
        <div class="kv"><span class="k b">${t.diff < 0 ? 'Shortage' : 'Overage'}</span>
          <span class="v" style="color:${t.diff < 0 ? '#FCA5A5' : '#5EE9A0'}">${sign(t.diff)}</span></div>
      </div>
      ${t.diff < -10000 ? `<div style="height:10px"></div>
        <div class="note bad">Shortage exceeds the ₦10,000 threshold. A reason is required and
        the owner is notified tonight.</div>
        <div style="height:8px"></div>
        <div class="field"><label>Reason (required)</label>
          <textarea rows="2" placeholder="e.g. Nozzle 4 disputed sale, ₦18,700 — CCTV reviewed"></textarea></div>` : ''}
    `, 'Next: expenses', 'm-w5', 'm-w3');
  };

  const w5Expenses = () => wizChrome(5, 'Expenses', `
      <div class="note">Generator diesel is a real cost line at a Nigerian station —
        logged here so it lands in station P&amp;L rather than vanishing into cash.</div>
      <div style="height:10px"></div>
      ${S.wiz.expenses.map((e,i) => `
        <div class="listrow" style="margin-bottom:8px">
          <div class="lead">${i+1}</div>
          <div class="body"><div class="t">${e.cat}</div><div class="s">${e.note}</div></div>
          <div class="mono b sm">${WD.ngn(e.amount)}</div>
        </div>`).join('')}
      <button class="btn ghost block sm" data-act="add-expense">+ Add expense</button>
      <div style="height:12px"></div>
      <div class="derived"><div class="lbl">Computed</div>
        <div class="kv"><span class="k">Total expenses</span><span class="v">${WD.ngn(expensesTotal())}</span></div>
        <div class="kv"><span class="k">Net cash to bank</span>
          <span class="v">${WD.ngn(S.wiz.takings.cash - expensesTotal())}</span></div>
      </div>
    `, 'Next: photos', 'm-w6', 'm-w4');

  const w6Photos = () => wizChrome(6, 'Photo evidence', `
      <div class="note">In-app camera only — no gallery uploads. Each photo carries GPS and a
        server timestamp, so it cannot be staged after the fact.</div>
      <div style="height:10px"></div>
      <div class="grid" style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
        ${PHOTO_SLOTS.map(p => {
          const taken = S.wiz.photos[p.id];
          return `<button class="photo ${taken ? 'taken' : ''}" data-act="photo" data-id="${p.id}">
            <div style="font-size:19px">${taken ? '✓' : '⬚'}</div>
            <div>${p.label}</div>
            ${taken ? '<div class="tiny mono">GPS ok · 21:0'+(1+Object.keys(S.wiz.photos).indexOf(p.id))+'</div>' : '<div class="tiny">Tap to capture</div>'}
          </button>`;
        }).join('')}
      </div>
      <div style="height:12px"></div>
      <div class="row between sm"><span class="muted">Captured</span>
        <span class="mono b">${photosTaken()} / ${PHOTO_SLOTS.length}</span></div>
      <div class="progress" style="margin-top:6px"><i style="transform:scaleX(${photosTaken()/PHOTO_SLOTS.length})"></i></div>
      ${photosTaken() < 3 ? '<div style="height:10px"></div><div class="note warn">Meter and dip photos are mandatory before submission.</div>' : ''}
    `, 'Review submission', 'm-w7', 'm-w5');

  const w7Review = () => {
    const m = metersDerived(), t = takingsDerived(), tanks = tanksDerived();
    return wizChrome(7, 'Review', `
      <div class="card">
        <div class="card-h"><h4>Bodija · ${WD.BUSINESS_DATE}</h4><span class="badge info">Draft</span></div>
        <div class="kv"><span class="k">Litres sold</span><span class="v">${m.litres.toLocaleString('en-NG')} L</span></div>
        <div class="kv"><span class="k">Expected takings</span><span class="v">${WD.ngn(m.expected)}</span></div>
        <div class="kv"><span class="k">Counted</span><span class="v">${WD.ngn(t.counted)}</span></div>
        <div class="kv"><span class="k">Difference</span>
          <span class="v" style="color:${t.diff<0?'#FCA5A5':'#5EE9A0'}">${sign(t.diff)}</span></div>
        <div class="kv"><span class="k">Delivery received</span><span class="v">${(+S.wiz.delivery.volumeMeasured).toLocaleString('en-NG')} L</span></div>
        <div class="kv"><span class="k">Expenses</span><span class="v">${WD.ngn(expensesTotal())}</span></div>
        <div class="kv"><span class="k">Photos</span><span class="v">${photosTaken()} attached</span></div>
      </div>
      <div style="height:10px"></div>
      <div class="card">
        <div class="b sm" style="margin-bottom:6px">Tank variance</div>
        ${tanks.map(t2 => `<div class="kv"><span class="k">Tank ${t2.id.slice(1)} · ${t2.product}</span>
          <span class="v" style="color:${t2.pct < -0.3 ? '#FCA5A5' : '#5EE9A0'}">${t2.pct.toFixed(2)}%</span></div>`).join('')}
      </div>
      <div style="height:10px"></div>
      <div class="note bad"><b>This submission will trigger an owner alert.</b>
        Tank 2 cumulative variance reaches −0.41% over 9 days against a −0.08% baseline.</div>
      <div style="height:10px"></div>
      <div class="card flat">
        <div class="tiny faint mono">RECORD METADATA</div>
        <div class="kv"><span class="k">Submitted by</span><span class="v" style="font-size:12px">Chidi Okonkwo</span></div>
        <div class="kv"><span class="k">GPS at capture</span><span class="v" style="font-size:12px">7.4180, 3.8980 · on site</span></div>
        <div class="kv"><span class="k">Device time</span><span class="v" style="font-size:12px">21:02 · recorded, not trusted</span></div>
        <div class="kv"><span class="k">Server time</span><span class="v" style="font-size:12px">authoritative</span></div>
        <div class="kv"><span class="k">Record mode</span><span class="v" style="font-size:12px">append-only</span></div>
      </div>
      <div style="height:14px"></div>
      <button class="btn block" data-act="submit">Submit day report</button>
      <div class="anno">Nothing is editable after submission. A correction is a new record
        that supersedes this one, and the owner sees both.</div>
    `, '', null, 'm-w6');
  };

  const mSubmitted = () => `
    <div class="center" style="padding:24px 0 8px">
      <div style="font-size:44px">${S.sync === 'synced' ? '✓' : '⇅'}</div>
      <h3 style="margin-top:8px">${S.sync === 'synced' ? 'Report synced' : 'Saved on this phone'}</h3>
      <p class="muted sm" style="margin-top:6px">
        ${S.sync === 'synced'
          ? 'Stored server-side and included in tonight’s owner digest.'
          : 'No network. The report is queued locally and will upload by itself when signal returns.'}</p>
    </div>
    <div class="card">
      <div class="kv"><span class="k">Queue state</span>
        <span class="v">${S.sync === 'synced' ? 'synced' : S.sync === 'syncing' ? 'syncing…' : 'pending'}</span></div>
      <div class="kv"><span class="k">Idempotency key</span><span class="v" style="font-size:11px">BOD-2026-08-03-01</span></div>
      <div class="kv"><span class="k">Local store</span><span class="v" style="font-size:12px">SQLite, encrypted</span></div>
      <div class="kv"><span class="k">Photos pending</span><span class="v">${S.sync === 'synced' ? '0' : photosTaken()}</span></div>
    </div>
    <div style="height:12px"></div>
    ${S.sync !== 'synced'
      ? `<button class="btn block" data-act="sync">Retry upload now</button>
         <div class="anno">238 telco outages hit Nigeria in January 2026 alone. Offline capture
         is a requirement, not a nicety — blocking on network means losing the day’s data.</div>`
      : `<button class="btn ghost block" data-go="m-history">View submission history</button>`}`;

  const mHistory = () => {
    const rows = [
      { d:'3 Aug 2026', l:17540, v:-0.41, s:'flagged' },
      { d:'2 Aug 2026', l:16980, v:-0.40, s:'flagged' },
      { d:'1 Aug 2026', l:17210, v:-0.38, s:'flagged' },
      { d:'31 Jul 2026', l:16440, v:-0.35, s:'flagged' },
      { d:'30 Jul 2026', l:15980, v:-0.31, s:'ok' },
      { d:'29 Jul 2026', l:17020, v:-0.28, s:'ok' },
      { d:'28 Jul 2026', l:16330, v:-0.24, s:'ok' }
    ];
    return `<div class="stack">
      ${rows.map(r => `<div class="listrow">
        <div class="lead">${r.d.split(' ')[0]}</div>
        <div class="body"><div class="t">${r.d}</div>
          <div class="s">${r.l.toLocaleString('en-NG')} L · variance ${r.v}%</div></div>
        <span class="badge ${r.s === 'flagged' ? 'bad' : 'ok'}">${r.s}</span>
      </div>`).join('')}
    </div>
    <div class="anno">Managers read their own station’s history; they cannot alter it.
      Corrections appear as superseding records with full attribution.</div>`;
  };

  const mPrice = () => `
    <div class="card">
      <div class="card-h"><h4>Effective 06:00, ${WD.BUSINESS_DATE}</h4><span class="badge info">New</span></div>
      <div class="kv"><span class="k">PMS</span><span class="v">₦905 <span class="faint">← ₦892</span></span></div>
      <div class="kv"><span class="k">AGO</span><span class="v">₦1,180 <span class="faint">unchanged</span></span></div>
      <div class="kv"><span class="k">DPK</span><span class="v">₦1,045 <span class="faint">unchanged</span></span></div>
      <div class="kv"><span class="k">Set by</span><span class="v" style="font-size:12px">Owner · 05:41</span></div>
    </div>
    <div style="height:12px"></div>
    <div class="note">Acknowledging confirms the forecourt price board has been changed to match.
      The acknowledgement is timestamped and forms part of the audit trail — the posted price
      must equal the approved price if NMDPRA inspects.</div>
    <div style="height:12px"></div>
    <button class="btn block" data-act="ack-price">Price board updated — acknowledge</button>
    <div style="height:10px"></div>
    <div class="card flat"><div class="tiny faint mono">NETWORK ACKNOWLEDGEMENT</div>
      <div class="kv"><span class="k">Acknowledged</span><span class="v">9 of 10</span></div>
      <div class="kv"><span class="k">Outstanding</span><span class="v" style="font-size:12px">Jembewon Road</span></div>
    </div>`;

  /* ============================================================
     OWNER APP
     ============================================================ */
  const ownerBoard = () => {
    const t = WD.totals();
    return `
    <div class="statgrid">
      ${statBox('Litres today', t.litres.toLocaleString('en-NG'), '9 of 10 reporting')}
      ${statBox('Revenue', WD.ngnShort(t.revenue), 'all stations')}
      ${statBox('Cash on hand', WD.ngnShort(t.cash), 'before banking')}
      ${statBox('Net difference', sign(t.diff), 'expected vs counted', t.diff < 0 ? 'bad' : 'ok')}
    </div>
    <div style="height:14px"></div>
    <div class="row between"><div class="kicker">Stations</div>
      <div class="tiny faint">tap to drill down</div></div>
    <div style="height:8px"></div>
    <div class="stack">
      ${WD.STATIONS.map(s => `
        <div class="listrow" data-go="o-station" data-id="${s.id}">
          <div class="lead">${s.id}</div>
          <div class="body">
            <div class="t">${s.name}</div>
            <div class="s">${s.submittedAt
              ? WD.stationLitres(s).toLocaleString('en-NG') + ' L · ' + WD.ngnShort(WD.stationRevenue(s)) + ' · var ' + s.variancePct + '%'
              : 'no submission · ' + s.manager}</div>
          </div>
          <span class="dot ${s.status}${s.status === 'bad' ? ' pulse' : ''}"></span>
        </div>`).join('')}
    </div>
    <div class="anno">Ten comparable Ibadan sites make outlier detection statistically real.
      A single-station owner has no baseline; this network does.</div>`;
  };

  const ownerStation = () => {
    const s = WD.station(S.stationId || 'BOD');
    const tanks = WD.tanksFor(s);
    return `
    <div class="card ${s.status === 'bad' ? '' : ''}">
      <div class="row between">
        <div><h3 style="font-size:17px">${s.name}</h3>
          <div class="tiny faint">${s.area} · ${s.manager}</div></div>
        <span class="badge ${s.status}">${s.status === 'bad' ? 'Investigate' : s.status === 'warn' ? 'Watch' : 'Normal'}</span>
      </div>
      ${s.flag ? `<div style="height:10px"></div><div class="note ${s.status}">${s.flag}</div>` : ''}
    </div>
    <div style="height:12px"></div>
    <div class="statgrid">
      ${statBox('Litres', WD.stationLitres(s).toLocaleString('en-NG'), s.submittedAt ? 'submitted ' + s.submittedAt : 'not submitted')}
      ${statBox('Revenue', WD.ngnShort(WD.stationRevenue(s)), 'today')}
      ${statBox('Difference', sign(WD.stationDiff(s)), 'expected vs counted', WD.stationDiff(s) < -10000 ? 'bad' : 'ok')}
      ${statBox('Variance', s.variancePct + '%', s.varianceDays ? s.varianceDays + ' day drift' : 'within normal', s.status === 'bad' ? 'bad' : '')}
    </div>
    <div style="height:14px"></div>
    <div class="card">
      <div class="card-h"><h4>Tanks</h4><span class="tiny faint">level · days of stock</span></div>
      ${tanks.map(t => {
        const pct = Math.round((t.level / t.capacity) * 100);
        const cls = t.daysStock !== null && t.daysStock < 2 ? 'bad' : t.daysStock !== null && t.daysStock < 3.5 ? 'warn' : '';
        return `<div style="margin-bottom:10px">
          <div class="row between sm"><span>${t.id} · ${t.product}${t.flagged ? ' <span class="badge bad">flagged</span>' : ''}</span>
            <span class="mono">${t.level.toLocaleString('en-NG')} L · ${t.daysStock ?? '—'} d</span></div>
          <div class="bar" style="margin-top:5px"><i class="${cls}" style="width:${pct}%"></i></div>
        </div>`;
      }).join('')}
    </div>
    ${s.status === 'bad' ? `<div style="height:12px"></div>
      <button class="btn block" data-go="o-variance">Open variance investigation →</button>` : ''}
    <div style="height:10px"></div>
    <button class="btn ghost block" data-go="o-audit">Request surprise audit</button>`;
  };

  const ownerVariance = () => `
    <div class="card">
      <div class="card-h"><h4>Bodija · Tank 2 (PMS)</h4><span class="badge bad">−0.41%</span></div>
      ${sparkline(WD.BOD_T2_SERIES, WD.BASELINE)}
      <div class="sep"></div>
      <div class="kv"><span class="k">Tank baseline</span><span class="v">−0.08%</span></div>
      <div class="kv"><span class="k">Cumulative now</span><span class="v" style="color:#FCA5A5">−0.41%</span></div>
      <div class="kv"><span class="k">Drift duration</span><span class="v">9 days</span></div>
      <div class="kv"><span class="k">Unaccounted volume</span><span class="v">≈ 1,240 L</span></div>
      <div class="kv"><span class="k">Value at ₦905/L</span><span class="v">≈ ₦1,122,200</span></div>
    </div>
    <div style="height:12px"></div>
    <div class="note warn">Single-day variance is noise — temperature alone moves petrol volume
      about 0.11% per °C. A one-direction drift sustained over nine days is not noise.</div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Evidence</h4></div>
      <div class="photo taken" style="aspect-ratio:16/10">
        <div style="font-size:22px">📷</div>
        <div>Tank 2 dip stick · 3 Aug 21:01</div>
        <div class="tiny mono">GPS 7.4180, 3.8980 · in-app camera</div>
      </div>
      <div style="height:8px"></div>
      <div class="row" style="gap:8px">
        <button class="btn ghost sm grow">All 9 dip photos</button>
        <button class="btn ghost sm grow">Meter photos</button>
      </div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Rule out first</h4></div>
      <div class="kv"><span class="k">Meter drift on one pump?</span><span class="v" style="font-size:12px">No — spread even</span></div>
      <div class="kv"><span class="k">Recent delivery shortfall?</span><span class="v" style="font-size:12px">No delivery to T2 in 9 days</span></div>
      <div class="kv"><span class="k">Tank leak?</span><span class="v" style="font-size:12px">Water paste clean</span></div>
      <div class="kv"><span class="k">Same shift each time?</span><span class="v" style="font-size:12px;color:#FCA5A5">Yes — Shift 2</span></div>
    </div>
    <div style="height:14px"></div>
    <a class="btn block" href="tel:+2348134442009">Call Chidi Okonkwo</a>
    <div style="height:8px"></div>
    <button class="btn ghost block" data-go="o-audit">Order a surprise dip now</button>`;

  const ownerAlerts = () => `
    <div class="stack">
      ${WD.ALERTS.map(a => `
        <div class="alertrow ${a.sev}">
          <div class="ic">${a.ic}</div>
          <div class="grow"><div class="t">${a.t}</div><div class="s">${a.s}</div></div>
          <div class="when">${a.when}</div>
        </div>`).join('')}
    </div>
    <div class="anno">Alerts are exceptions, not a feed of everything. Nine normal stations
      generate no notifications at all.</div>`;

  const ownerFleet = () => `
    <div class="statgrid">
      ${statBox('In transit', '4', 'of 8 tankers')}
      ${statBox('Litres moving', '165,000', 'PMS + AGO')}
      ${statBox('Route alerts', '1', 'WD-04', 'bad')}
      ${statBox('Idle / workshop', '2', 'WD-05, WD-07')}
    </div>
    <div style="height:12px"></div>
    <div class="map" style="height:210px">
      <div class="grid-lines"></div>
      ${WD.STATIONS.map(s => `<div class="pin ${s.status}" style="left:${s.x}%;top:${s.y}%">
        <div class="p"></div></div>`).join('')}
      ${WD.TRUCKS.filter(t => t.status !== 'maintenance').map(t => `
        <div class="pin truck ${t.status === 'alert' ? 'bad' : ''}" style="left:${t.x}%;top:${t.y}%">
          <div class="p"></div><div class="lb">${t.id}</div></div>`).join('')}
    </div>
    <div style="height:12px"></div>
    <div class="stack">
      ${WD.TRUCKS.map(t => `
        <div class="listrow" data-go="o-truck" data-id="${t.id}">
          <div class="lead">${t.id.split('-')[1]}</div>
          <div class="body"><div class="t">${t.id} · ${t.driver}</div>
            <div class="s">${t.task}</div></div>
          <span class="badge ${t.status === 'alert' ? 'bad' : t.status === 'in-transit' ? 'info' :
            t.status === 'maintenance' ? 'neutral' : 'ok'}">${t.status}</span>
        </div>`).join('')}
    </div>`;

  const ownerTruck = () => {
    const t = WD.TRUCKS.find(x => x.id === (S.truckId || 'WD-04'));
    const trip = WD.TRIPS.find(x => x.truck === t.id && x.stage !== 'closed');
    return `
    <div class="card">
      <div class="row between">
        <div><h3 style="font-size:17px">${t.id}</h3>
          <div class="tiny faint mono">${t.plate} · ${(t.capacity/1000)}k L · ${t.comps.length} compartments</div></div>
        <span class="badge ${t.status === 'alert' ? 'bad' : 'info'}">${t.status}</span>
      </div>
      ${t.alert ? `<div style="height:10px"></div><div class="note bad">${t.alert}</div>` : ''}
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="kv"><span class="k">Driver</span><span class="v" style="font-size:12px">${t.driver}</span></div>
      <div class="kv"><span class="k">Task</span><span class="v" style="font-size:11.5px;max-width:60%;text-align:right">${t.task}</span></div>
      <div class="kv"><span class="k">Speed</span><span class="v">${t.speed} km/h</span></div>
      <div class="kv"><span class="k">Last ping</span><span class="v" style="font-size:12px">${t.lastPing}</span></div>
      ${trip ? `<div class="kv"><span class="k">Seals</span><span class="v" style="font-size:11px">${trip.seals.join(' / ')}</span></div>` : ''}
    </div>
    ${trip ? `<div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Chain of custody · ${trip.id}</h4></div>
      <div class="timeline">
        <div class="tl-item done"><div class="t">Loaded ${trip.loadedAt}</div>
          <div class="s">${trip.planned.toLocaleString('en-NG')} L ${trip.product} · seals photographed</div></div>
        <div class="tl-item done"><div class="t">Departed yard</div>
          <div class="s">Geofence exit confirmed</div></div>
        <div class="tl-item ${t.status === 'alert' ? 'now' : 'done'}">
          <div class="t">${t.status === 'alert' ? 'Off-route stop' : 'In transit'}</div>
          <div class="s">${t.alert || 'On approved corridor'}</div></div>
        <div class="tl-item"><div class="t">Arrival &amp; seal check</div>
          <div class="s">Pending — seal numbers must match load</div></div>
        <div class="tl-item"><div class="t">Discharge &amp; receiving dip</div>
          <div class="s">Pending</div></div>
      </div>
    </div>` : ''}
    <div style="height:12px"></div>
    <div class="row" style="gap:8px">
      <button class="btn grow">Call driver</button>
      <button class="btn ghost grow">Immobilise</button>
    </div>
    <div class="anno">Telematics is integrated, not built. Nigerian vendors already sell
      route deviation, idling and fuel-level feeds — the app consumes them and ties each
      signal to the trip and the order it belongs to.</div>`;
  };

  const ownerDigest = () => {
    const t = WD.totals();
    return `
    <div class="card flat">
      <div class="row between tiny faint mono"><span>PUSH NOTIFICATION</span><span>21:00 WAT</span></div>
      <div style="height:8px"></div>
      <div class="b">Weeldrop · nightly digest</div>
      <div class="sm muted">9 of 10 reported · ${t.litres.toLocaleString('en-NG')} L ·
        ${WD.ngnShort(t.revenue)} · 2 exceptions</div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Exceptions first</h4></div>
      ${WD.ALERTS.filter(a => a.sev !== 'info').slice(0,4).map(a => `
        <div class="alertrow ${a.sev}" style="margin-bottom:8px">
          <div class="ic">${a.ic}</div><div><div class="t">${a.t}</div></div>
        </div>`).join('')}
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Network totals</h4></div>
      <div class="kv"><span class="k">Litres</span><span class="v">${t.litres.toLocaleString('en-NG')} L</span></div>
      <div class="kv"><span class="k">Revenue</span><span class="v">${WD.ngn(t.revenue)}</span></div>
      <div class="kv"><span class="k">Cash</span><span class="v">${WD.ngn(t.cash)}</span></div>
      <div class="kv"><span class="k">POS</span><span class="v">${WD.ngn(t.pos)}</span></div>
      <div class="kv"><span class="k">Transfer</span><span class="v">${WD.ngn(t.transfer)}</span></div>
      <div class="kv"><span class="k">Expenses</span><span class="v">${WD.ngn(t.expenses)}</span></div>
      <div class="kv"><span class="k b">Net difference</span>
        <span class="v" style="color:#FCA5A5">${sign(t.diff)}</span></div>
    </div>
    <div class="anno">One notification a night. The digest is generated by a scheduled job,
      not by the phone — it arrives whether or not the owner opens the app.</div>`;
  };

  const ownerAudit = () => S.audit ? `
    <div class="center" style="padding:26px 0 10px">
      <div style="font-size:42px">✓</div>
      <h3 style="margin-top:8px">Audit requested</h3>
      <p class="muted sm">Chidi Okonkwo has 30 minutes to submit a dip and meter reading
        with fresh photos.</p>
    </div>
    <div class="card">
      <div class="kv"><span class="k">Station</span><span class="v">Bodija</span></div>
      <div class="kv"><span class="k">Scope</span><span class="v" style="font-size:12px">Tank 2 dip + PMS meters</span></div>
      <div class="kv"><span class="k">Requested</span><span class="v">now</span></div>
      <div class="kv"><span class="k">Deadline</span><span class="v">+30 min</span></div>
      <div class="kv"><span class="k">Manager notified</span><span class="v">push + SMS</span></div>
    </div>
    <div style="height:12px"></div>
    <div class="note">Deviation from the daily pattern is itself a signal. An unscheduled dip
      that disagrees with the evening submission is hard to explain away.</div>` : `
    <div class="card">
      <div class="card-h"><h4>Surprise audit</h4></div>
      <p class="sm muted">Demand an unscheduled reading from any station, right now,
        from your phone.</p>
      <div style="height:12px"></div>
      <div class="field"><label>Station</label>
        <select><option>Bodija</option><option>Nihort Road</option><option>Sawmill</option></select></div>
      <div class="field"><label>Scope</label>
        <select><option>Tank 2 dip + PMS meters</option><option>All tanks</option>
        <option>Cash count only</option></select></div>
      <div class="field"><label>Deadline</label>
        <select><option>30 minutes</option><option>15 minutes</option><option>1 hour</option></select></div>
      <button class="btn block" data-act="audit">Send audit request</button>
    </div>`;

  /* ============================================================
     DRIVER APP — Ibrahim Sanni, WD-04
     ============================================================ */
  const driverTrip = () => `
    <div class="card" style="background:linear-gradient(150deg,#12693d,#0d4f2e)">
      <div class="kicker" style="color:#bbf7d0">Trip T-2412</div>
      <div style="font-size:18px;font-weight:700;margin-top:3px">Sunshine Poultry, Iseyin</div>
      <div class="sm" style="opacity:.85">30,000 L AGO · order ORD-4472</div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="kv"><span class="k">Truck</span><span class="v">WD-04 · IBD-315-LM</span></div>
      <div class="kv"><span class="k">Compartments</span><span class="v">2 × 15,000 L</span></div>
      <div class="kv"><span class="k">Loaded</span><span class="v">08:02 · Sawmill yard</span></div>
      <div class="kv"><span class="k">Seals</span><span class="v" style="font-size:11.5px">S-88440 / S-88441</span></div>
      <div class="kv"><span class="k">Delivery window</span><span class="v">13:00–16:00</span></div>
    </div>
    <div style="height:12px"></div>
    <div class="note bad"><b>Dispatch is asking about your stop.</b> You have been stationary
      41 minutes, 3.2 km off the approved route. Give a reason or resume the route.</div>
    <div style="height:12px"></div>
    ${S.driverAck ? `<div class="card"><div class="kv"><span class="k">Reason logged</span>
      <span class="v" style="font-size:12px">Tyre blowout · photo attached</span></div>
      <div class="kv"><span class="k">Dispatch notified</span><span class="v">12:51</span></div></div>`
      : `<button class="btn block" data-act="driver-ack">Log a reason for this stop</button>`}
    <div style="height:12px"></div>
    <button class="btn ghost block" data-go="d-load">View load record</button>
    <div style="height:8px"></div>
    <button class="btn ghost block" data-go="d-discharge">Start discharge</button>`;

  const driverLoad = () => `
    <div class="note">Captured at the gantry before departure. Seals are photographed at load
      and re-checked on arrival; a mismatch stops the discharge.</div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Compartment 1</h4><span class="badge ok">Sealed</span></div>
      <div class="kv"><span class="k">Seal</span><span class="v">S-88440</span></div>
      <div class="kv"><span class="k">Loaded</span><span class="v">15,000 L</span></div>
      <div class="kv"><span class="k">Ullage check</span><span class="v">pass</span></div>
    </div>
    <div style="height:10px"></div>
    <div class="card">
      <div class="card-h"><h4>Compartment 2</h4><span class="badge ok">Sealed</span></div>
      <div class="kv"><span class="k">Seal</span><span class="v">S-88441</span></div>
      <div class="kv"><span class="k">Loaded</span><span class="v">15,000 L</span></div>
      <div class="kv"><span class="k">Ullage check</span><span class="v">pass</span></div>
    </div>
    <div style="height:10px"></div>
    <div class="grid" style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
      <div class="photo taken"><div style="font-size:18px">✓</div><div>Seal S-88440</div></div>
      <div class="photo taken"><div style="font-size:18px">✓</div><div>Seal S-88441</div></div>
      <div class="photo taken"><div style="font-size:18px">✓</div><div>Waybill WB-77455</div></div>
      <div class="photo taken"><div style="font-size:18px">✓</div><div>Gantry meter ticket</div></div>
    </div>`;

  const driverDischarge = () => `
    <div class="note">Delivered volume is the customer’s tank dip after minus before —
      never the waybill figure.</div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Customer tank · Sunshine Poultry</h4></div>
      <div class="field"><label>Dip before discharge (L)</label>
        <input type="number" value="6100" data-bind="noop"></div>
      <div class="field"><label>Seal check on arrival</label>
        <select><option>Both intact — S-88440, S-88441</option><option>Mismatch — stop discharge</option></select></div>
      <div class="field"><label>Dip after settling, 5 min (L)</label>
        <input type="number" value="35980" data-bind="noop"></div>
      <div class="derived">
        <div class="lbl">Computed</div>
        <div class="kv"><span class="k">Delivered by dip</span><span class="v">29,880 L</span></div>
        <div class="kv"><span class="k">On waybill</span><span class="v">30,000 L</span></div>
        <div class="kv"><span class="k">Gap</span><span class="v" style="color:#FBBF24">−120 L · 0.40%</span></div>
      </div>
    </div>
    <div style="height:10px"></div>
    <div class="note warn">Gap is within the 0.5% tolerance but is logged against the trip
      and the driver. Repeated small gaps on one driver form a pattern.</div>
    <div style="height:12px"></div>
    <button class="btn block" data-go="d-pod">Capture proof of delivery</button>`;

  const driverPod = () => `
    <div class="card">
      <div class="card-h"><h4>Proof of delivery</h4><span class="badge ok">Ready</span></div>
      <div class="kv"><span class="k">Order</span><span class="v">ORD-4472</span></div>
      <div class="kv"><span class="k">Customer</span><span class="v" style="font-size:12px">Sunshine Poultry Farms</span></div>
      <div class="kv"><span class="k">Delivered</span><span class="v">29,880 L AGO</span></div>
      <div class="kv"><span class="k">Received by</span><span class="v" style="font-size:12px">Mrs. Ngozi Eze</span></div>
    </div>
    <div style="height:10px"></div>
    <div class="card">
      <div class="tiny faint mono" style="margin-bottom:6px">SIGNATURE</div>
      <div style="height:88px;border:1px dashed var(--line);border-radius:9px;
        display:flex;align-items:center;justify-content:center;color:var(--fg-faint);
        font-family:'Exo',cursive;font-size:24px;font-style:italic">N. Eze</div>
    </div>
    <div style="height:10px"></div>
    <div class="grid" style="display:grid;grid-template-columns:1fr 1fr;gap:9px">
      <div class="photo taken"><div style="font-size:18px">✓</div><div>Dip after discharge</div></div>
      <div class="photo taken"><div style="font-size:18px">✓</div><div>Signed waybill</div></div>
    </div>
    <div style="height:12px"></div>
    <button class="btn block" data-act="pod">Close trip &amp; release invoice</button>
    <div class="anno">Closing the trip triggers the customer invoice automatically — the same
      record serves dispatch, the customer portal and the accounts ledger.</div>`;

  /* ============================================================
     BULK CUSTOMER APP — Ibadan Flour Mills
     ============================================================ */
  const custHome = () => {
    const c = WD.customer('C-101');
    const pct = Math.round((c.tankLevel / c.tank) * 100);
    return `
    <div class="card" style="background:linear-gradient(150deg,#12693d,#0d4f2e)">
      <div class="kicker" style="color:#bbf7d0">Live order</div>
      <div style="font-size:17px;font-weight:700;margin-top:2px">ORD-4471 · 45,000 L AGO</div>
      <div class="sm" style="opacity:.85">WD-01 in transit · ETA 15:10</div>
      <div style="height:10px"></div>
      <button class="btn block" style="background:rgba(255,255,255,.16)" data-go="c-track">Track delivery →</button>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Your tank</h4><span class="badge ${pct < 40 ? 'warn' : 'ok'}">${pct}%</span></div>
      <div class="bar"><i class="${pct < 40 ? 'warn' : ''}" style="width:${pct}%"></i></div>
      <div class="row between tiny faint" style="margin-top:6px">
        <span>${c.tankLevel.toLocaleString('en-NG')} L</span>
        <span>capacity ${c.tank.toLocaleString('en-NG')} L</span></div>
      <div class="sep"></div>
      <div class="kv"><span class="k">Average burn</span><span class="v">6,000 L/day</span></div>
      <div class="kv"><span class="k">Predicted dry</span><span class="v" style="color:#FBBF24">6 Aug 2026</span></div>
    </div>
    <div style="height:12px"></div>
    <button class="btn block" data-go="c-order">Order fuel</button>
    <div style="height:8px"></div>
    <button class="btn ghost block" data-go="c-account">Account &amp; invoices</button>
    <div class="anno">Consumption history drives a stock-out prediction, so the reorder prompt
      arrives before the customer notices. That is the switching cost.</div>`;
  };

  const custOrder = () => `
    <div class="card">
      <div class="card-h"><h4>New order</h4><span class="badge info">Contract price</span></div>
      <div class="field"><label>Product</label><select><option>AGO (Diesel)</option>
        <option>PMS (Petrol)</option><option>DPK (Kerosene)</option></select></div>
      <div class="field"><label>Volume (litres)</label><input type="number" value="45000"></div>
      <div class="field"><label>Deliver to</label>
        <select><option>Ibadan Flour Mills, Oluyole</option><option>Add new site…</option></select></div>
      <div class="field"><label>Window</label>
        <select><option>Tomorrow 09:00–12:00</option><option>Tomorrow 13:00–17:00</option>
        <option>Today, next available</option></select></div>
      <div class="derived">
        <div class="lbl">Quote</div>
        <div class="kv"><span class="k">Unit price</span><span class="v">₦1,128 / L</span></div>
        <div class="kv"><span class="k">45,000 L</span><span class="v">₦50,760,000</span></div>
        <div class="kv"><span class="k">Haulage</span><span class="v">included</span></div>
        <div class="kv"><span class="k">Terms</span><span class="v">30 days</span></div>
        <div class="kv"><span class="k b">Credit after this order</span>
          <span class="v" style="color:#FBBF24">₦192.4m of ₦220m</span></div>
      </div>
    </div>
    <div style="height:12px"></div>
    <button class="btn block" data-act="order">Place order</button>
    <div style="height:8px"></div>
    <button class="btn ghost block">Repeat last order</button>`;

  const custTrack = () => `
    <div class="map" style="height:190px">
      <div class="grid-lines"></div>
      <div class="pin" style="left:22%;top:78%"><div class="p"></div><div class="lb">Yard</div></div>
      <div class="pin truck" style="left:52%;top:60%"><div class="p"></div><div class="lb">WD-01</div></div>
      <div class="pin warn" style="left:74%;top:44%"><div class="p"></div><div class="lb">You</div></div>
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>ORD-4471</h4><span class="badge info">In transit</span></div>
      <div class="timeline">
        <div class="tl-item done"><div class="t">Order confirmed</div><div class="s">3 Aug 08:12 · ₦1,128/L</div></div>
        <div class="tl-item done"><div class="t">Payment received</div><div class="s">3 Aug 08:40 · transfer</div></div>
        <div class="tl-item done"><div class="t">Loaded &amp; sealed</div>
          <div class="s">08:55 · seals S-88431 / S-88432 / S-88433</div></div>
        <div class="tl-item now"><div class="t">In transit</div>
          <div class="s">WD-01 · Aliyu Danjuma · 47 km/h · ETA 15:10</div></div>
        <div class="tl-item"><div class="t">Seal check &amp; discharge</div>
          <div class="s">Dip your tank before and after</div></div>
        <div class="tl-item"><div class="t">Proof of delivery</div><div class="s">Signature + documents</div></div>
      </div>
    </div>
    <div style="height:10px"></div>
    <div class="row" style="gap:8px">
      <button class="btn ghost grow sm">Call driver</button>
      <button class="btn ghost grow sm">Share tracking</button>
    </div>`;

  const custAccount = () => {
    const c = WD.customer('C-101');
    return `
    <div class="statgrid">
      ${statBox('Outstanding', WD.ngnShort(c.outstanding), 'of ' + WD.ngnShort(c.limit) + ' limit')}
      ${statBox('Utilisation', Math.round(c.outstanding / c.limit * 100) + '%', 'credit line')}
      ${statBox('Terms', c.terms, 'net')}
      ${statBox('This month', (c.monthlyVol/1000) + 'k L', 'AGO')}
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Ageing</h4></div>
      ${Object.entries(c.ageing).map(([k,v]) => `
        <div class="kv"><span class="k">${k} days</span>
          <span class="v" style="${k === '90+' && v ? 'color:#FCA5A5' : ''}">${WD.ngn(v)}</span></div>`).join('')}
    </div>
    <div style="height:12px"></div>
    <div class="card">
      <div class="card-h"><h4>Documents</h4><span class="tiny faint">tax-ready</span></div>
      ${['Invoice INV-8841 · ₦50.7m','Waybill WB-77401','Delivery certificate DC-2411',
         'Product quality certificate','Monthly statement · July 2026'].map(d => `
        <div class="listrow" style="margin-bottom:7px">
          <div class="lead">▤</div><div class="body"><div class="t" style="font-size:12.5px">${d}</div></div>
          <span class="badge neutral">PDF</span></div>`).join('')}
    </div>
    <div class="anno">Verifiable digital delivery documents matter to corporate buyers under
      Nigeria’s 2026 tax reforms — handwritten receipts are becoming a liability for them.</div>`;
  };

  /* ============================================================
     SCREEN REGISTRY
     ============================================================ */
  const SCREENS = {
    // manager
    'm-home':   { role:'manager', tab:'home',    title:'Bodija', sub:'Chidi Okonkwo · Manager', render:managerHome },
    'm-w1':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 1 · pump meters', render:w1Meters, back:'m-home' },
    'm-w2':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 2 · tank dips', render:w2Dips, back:'m-w1' },
    'm-w3':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 3 · delivery', render:w3Delivery, back:'m-w2' },
    'm-w4':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 4 · takings', render:w4Takings, back:'m-w3' },
    'm-w5':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 5 · expenses', render:w5Expenses, back:'m-w4' },
    'm-w6':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 6 · photos', render:w6Photos, back:'m-w5' },
    'm-w7':     { role:'manager', tab:'submit',  title:'Daily report', sub:'Step 7 · review', render:w7Review, back:'m-w6' },
    'm-done':   { role:'manager', tab:'submit',  title:'Submission', sub:'offline queue', render:mSubmitted, back:'m-home' },
    'm-history':{ role:'manager', tab:'history', title:'History', sub:'Bodija · last 7 days', render:mHistory },
    'm-price':  { role:'manager', tab:'price',   title:'Prices', sub:'owner broadcast', render:mPrice },
    // owner
    'o-board':   { role:'owner', tab:'board',  title:'All stations', sub:WD.BUSINESS_DATE + ' · 9 of 10 in', render:ownerBoard },
    'o-station': { role:'owner', tab:'board',  title:'Station', sub:'drill-down', render:ownerStation, back:'o-board' },
    'o-variance':{ role:'owner', tab:'board',  title:'Variance', sub:'Bodija · Tank 2', render:ownerVariance, back:'o-station' },
    'o-alerts':  { role:'owner', tab:'alerts', title:'Alerts', sub:'exceptions only', render:ownerAlerts },
    'o-fleet':   { role:'owner', tab:'fleet',  title:'Fleet', sub:'8 tankers · 1 alert', render:ownerFleet },
    'o-truck':   { role:'owner', tab:'fleet',  title:'Tanker', sub:'chain of custody', render:ownerTruck, back:'o-fleet' },
    'o-digest':  { role:'owner', tab:'digest', title:'Nightly digest', sub:'21:00 WAT', render:ownerDigest },
    'o-audit':   { role:'owner', tab:'board',  title:'Surprise audit', sub:'ad-hoc reading', render:ownerAudit, back:'o-station' },
    // driver
    'd-trip':      { role:'driver', tab:'trip',   title:'Trip T-2412', sub:'Ibrahim Sanni · WD-04', render:driverTrip },
    'd-load':      { role:'driver', tab:'trip',   title:'Load record', sub:'seals & compartments', render:driverLoad, back:'d-trip' },
    'd-discharge': { role:'driver', tab:'disch',  title:'Discharge', sub:'receiving dip', render:driverDischarge, back:'d-trip' },
    'd-pod':       { role:'driver', tab:'disch',  title:'Proof of delivery', sub:'sign & close', render:driverPod, back:'d-discharge' },
    // customer
    'c-home':    { role:'customer', tab:'home',    title:'Ibadan Flour Mills', sub:'bulk account C-101', render:custHome },
    'c-order':   { role:'customer', tab:'order',   title:'Order fuel', sub:'contract pricing', render:custOrder, back:'c-home' },
    'c-track':   { role:'customer', tab:'track',   title:'Track', sub:'ORD-4471', render:custTrack, back:'c-home' },
    'c-account': { role:'customer', tab:'account', title:'Account', sub:'credit & documents', render:custAccount, back:'c-home' }
  };

  const TABS = {
    manager: [ {id:'home',ic:'⌂',l:'Home',go:'m-home'}, {id:'submit',ic:'✎',l:'Report',go:'m-w1'},
               {id:'history',ic:'▤',l:'History',go:'m-history'}, {id:'price',ic:'₦',l:'Prices',go:'m-price'} ],
    owner:   [ {id:'board',ic:'▦',l:'Stations',go:'o-board'}, {id:'alerts',ic:'!',l:'Alerts',go:'o-alerts'},
               {id:'fleet',ic:'◉',l:'Fleet',go:'o-fleet'}, {id:'digest',ic:'☾',l:'Digest',go:'o-digest'} ],
    driver:  [ {id:'trip',ic:'▸',l:'Trip',go:'d-trip'}, {id:'disch',ic:'⇩',l:'Discharge',go:'d-discharge'} ],
    customer:[ {id:'home',ic:'⌂',l:'Home',go:'c-home'}, {id:'order',ic:'+',l:'Order',go:'c-order'},
               {id:'track',ic:'◉',l:'Track',go:'c-track'}, {id:'account',ic:'▤',l:'Account',go:'c-account'} ]
  };

  const ROLE_META = {
    manager:  { label:'Station Manager', who:'Chidi Okonkwo · Bodija',
      note:'Submits the day. Types raw readings only, works offline, cannot edit history.' },
    owner:    { label:'Owner', who:'Weeldrop Petroleum & Logistics',
      note:'Sees all 10 stations and 8 tankers. Gets exceptions, not a feed.' },
    driver:   { label:'Tanker Driver', who:'Ibrahim Sanni · WD-04',
      note:'Carries the chain of custody: seals at load, dips at discharge, POD at the gate.' },
    customer: { label:'Bulk Customer', who:'Ibadan Flour Mills Ltd',
      note:'Orders, tracks the truck, pulls invoices and delivery documents.' }
  };

  const HOME_OF = { manager:'m-home', owner:'o-board', driver:'d-trip', customer:'c-home' };

  /* ---------- render ---------- */
  function render(){
    const scr = SCREENS[S.screen];
    const tabs = TABS[S.role];
    const focus = document.activeElement;
    const focusBind = focus && focus.dataset ? focus.dataset.bind : null;
    const caret = focus && focus.selectionStart;

    el('phone-body').innerHTML = `
      <div class="statusbar">
        <span class="mono">21:0${S.role === 'driver' ? '2' : '4'}</span>
        <span class="row" style="gap:6px">
          <span class="tiny">${S.sync === 'synced' ? 'MTN 4G' : 'MTN · no service'}</span>
          <span class="tiny">▮▮▮</span></span>
      </div>
      <div class="appbar">
        ${scr.back ? `<button class="icon-btn" data-go="${scr.back}">‹</button>` : ''}
        <div class="grow"><div class="title">${scr.title}</div><div class="sub">${scr.sub}</div></div>
        ${S.role === 'owner' ? '<button class="icon-btn" data-go="o-alerts">!</button>' : ''}
      </div>
      ${S.sync !== 'synced' && S.role === 'manager'
        ? `<div class="syncbar"><span class="dot warn pulse"></span>
             Offline · ${S.queued} report queued on this phone</div>` : ''}
      <div class="screen" id="screen">${scr.render()}</div>
      ${tabs ? `<div class="tabbar">${tabs.map(t => `
        <button data-go="${t.go}" class="${scr.tab === t.id ? 'on' : ''}">
          <span class="ic">${t.ic}</span>${t.l}</button>`).join('')}</div>` : ''}`;

    // role rail + context panel
    el('rolebar').innerHTML = Object.entries(ROLE_META).map(([k,v]) => `
      <button class="chip ${S.role === k ? 'on' : ''}" data-role="${k}">${v.label}</button>`).join('');
    el('ctx').innerHTML = `
      <div class="kicker">Current persona</div>
      <div class="b" style="margin-top:4px">${ROLE_META[S.role].label}</div>
      <div class="sm muted">${ROLE_META[S.role].who}</div>
      <div class="sm muted" style="margin-top:8px">${ROLE_META[S.role].note}</div>
      <div class="sep"></div>
      <div class="kicker">Screens</div>
      <div class="stack" style="margin-top:8px">
        ${Object.entries(SCREENS).filter(([,v]) => v.role === S.role).map(([k,v]) => `
          <button class="listrow" data-go="${k}" style="${S.screen === k ? 'border-color:var(--brand-400)' : ''}">
            <div class="body"><div class="t">${v.title}</div><div class="s">${v.sub}</div></div>
            ${S.screen === k ? '<span class="dot ok"></span>' : ''}
          </button>`).join('')}
      </div>`;

    if (focusBind){
      const back = document.querySelector(`[data-bind="${focusBind}"]`);
      if (back){ back.focus(); try { back.setSelectionRange(caret, caret); } catch(e){} }
    }
  }

  function setPath(path, value){
    const parts = path.split('.');
    let o = S.wiz;
    for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    o[parts[parts.length - 1]] = value === '' ? '' : +value;
  }

  /* ---------- events ---------- */
  function bind(){
    document.addEventListener('click', e => {
      const go = e.target.closest('[data-go]');
      if (go){
        S.screen = go.dataset.go;
        if (go.dataset.id){
          if (S.screen === 'o-station') S.stationId = go.dataset.id;
          if (S.screen === 'o-truck') S.truckId = go.dataset.id;
        }
        el('screen') && (el('screen').scrollTop = 0);
        render(); return;
      }
      const role = e.target.closest('[data-role]');
      if (role){ S.role = role.dataset.role; S.screen = HOME_OF[S.role]; render(); return; }

      const act = e.target.closest('[data-act]');
      if (!act) return;
      switch (act.dataset.act){
        case 'photo':
          S.wiz.photos[act.dataset.id] = true; render(); break;
        case 'add-expense':
          S.wiz.expenses.push({ cat:'Sundry', amount:12_000, note:'Added in prototype' }); render(); break;
        case 'submit':
          S.sync = 'pending'; S.queued = 1; S.screen = 'm-done'; render();
          setTimeout(() => { S.sync = 'syncing'; render(); }, 1400);
          setTimeout(() => { S.sync = 'synced'; S.queued = 0; render(); }, 3200);
          break;
        case 'sync':
          S.sync = 'syncing'; render();
          setTimeout(() => { S.sync = 'synced'; S.queued = 0; render(); }, 1200); break;
        case 'ack-price':
          act.outerHTML = '<div class="note" style="text-align:center">Acknowledged 21:06 · logged to the audit trail</div>'; break;
        case 'audit':
          S.audit = true; render(); break;
        case 'driver-ack':
          S.driverAck = true; render(); break;
        case 'order':
          act.outerHTML = '<div class="note" style="text-align:center">Order ORD-4476 placed · awaiting allocation</div>'; break;
        case 'pod':
          act.outerHTML = '<div class="note" style="text-align:center">Trip closed · invoice INV-8846 released to the customer</div>'; break;
      }
    });

    document.addEventListener('input', e => {
      const b = e.target.dataset.bind;
      if (!b || b === 'noop') return;
      setPath(b, e.target.value);
      render();
    });
  }

  return { init(){ bind(); render(); } };
})();

document.addEventListener('DOMContentLoaded', App.init);
