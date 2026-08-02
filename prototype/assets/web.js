/* ============================================================
   Weeldrop OS — web console prototype
   Owner / dispatcher / accountant surface. One nav, twelve pages.
   ============================================================ */

const Console = (() => {

  const S = { page:'overview', stationId:'BOD', tripId:'T-2412', custId:'C-103', modal:null };
  const el = id => document.getElementById(id);
  const t = WD.totals();

  const sign = n => (n > 0 ? '+' : n < 0 ? '−' : '') + WD.ngn(Math.abs(n));
  const pct = (a,b) => b ? ((a/b)*100).toFixed(1) + '%' : '—';

  const kpi = (l,n,d,cls='') =>
    `<div class="kpi"><div class="l">${l}</div><div class="n ${cls}">${n}</div>
     <div class="d">${d}</div></div>`;

  /* ---------- charts ---------- */
  function lineChart(series, baseline, w = 720, h = 190){
    const pad = 30;
    const vals = series.map(p => p.v);
    const min = Math.min(...vals, baseline) - .06, max = Math.max(...vals, baseline) + .06;
    const X = i => pad + (i * (w - pad * 1.4)) / (series.length - 1);
    const Y = v => 14 + (1 - (v - min) / (max - min)) * (h - 44);
    const path = series.map((p,i) => `${i?'L':'M'}${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img"
      aria-label="Bodija tank 2 cumulative variance, ${series[0].v}% on ${series[0].d} drifting to ${series[series.length-1].v}% on ${series[series.length-1].d}, against a ${baseline}% baseline">
      ${[0,.25,.5,.75,1].map(f => {
        const y = 14 + f * (h - 44);
        return `<line x1="${pad}" x2="${w-8}" y1="${y}" y2="${y}" stroke="#22344F" stroke-width="1" opacity=".55"/>`;
      }).join('')}
      <line x1="${pad}" x2="${w-8}" y1="${Y(baseline)}" y2="${Y(baseline)}"
        stroke="#16a34a" stroke-width="1.5" stroke-dasharray="6 5"/>
      <text x="${pad+4}" y="${Y(baseline)-7}" fill="#5EE9A0" font-size="11"
        font-family="IBM Plex Mono">baseline ${baseline}%</text>
      <path d="${path} L${X(series.length-1)},${h-16} L${X(0)},${h-16} Z" fill="rgba(239,68,68,.13)"/>
      <path d="${path}" fill="none" stroke="#EF4444" stroke-width="2.4" stroke-linejoin="round"/>
      ${series.map((p,i) => `
        <circle cx="${X(i)}" cy="${Y(p.v)}" r="${i===series.length-1?4.5:3}" fill="#EF4444"/>
        <text x="${X(i)}" y="${h-3}" fill="#66798F" font-size="10" text-anchor="middle"
          font-family="IBM Plex Mono">${p.d}</text>`).join('')}
      <text x="${X(series.length-1)}" y="${Y(series[series.length-1].v)-11}" fill="#FCA5A5"
        font-size="12" text-anchor="end" font-family="IBM Plex Mono" font-weight="600">
        ${series[series.length-1].v}%</text>
    </svg>`;
  }

  function barRow(label, value, max, tone = ''){
    const w = Math.max(2, Math.round((value / max) * 100));
    return `<div style="margin-bottom:9px">
      <div class="row between sm"><span>${label}</span>
        <span class="mono">${WD.ngnShort(value)}</span></div>
      <div class="bar" style="margin-top:4px"><i class="${tone}" style="width:${w}%"></i></div>
    </div>`;
  }

  /* ============================================================
     PAGES
     ============================================================ */

  const pOverview = () => `
    <div class="grid g4">
      ${kpi('Litres sold today', t.litres.toLocaleString('en-NG'), '9 of 10 stations reporting')}
      ${kpi('Revenue', WD.ngnShort(t.revenue), 'PMS + AGO + DPK')}
      ${kpi('Cash on hand', WD.ngnShort(t.cash), 'before banking · ' + pct(t.cash, t.revenue) + ' of takings')}
      ${kpi('Net difference', sign(t.diff), 'expected vs counted', t.diff < 0 ? 'bad' : 'ok')}
    </div>

    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Stations · ${WD.BUSINESS_DATE}</h3>
          <div class="chipbar"><span class="chip on">All</span><span class="chip">Exceptions</span>
            <span class="chip">CNG sites</span></div></div>
        <div class="grid g3" style="gap:11px">
          ${WD.STATIONS.map(s => `
            <div class="stationcard ${s.status}" data-go="station" data-id="${s.id}">
              <div class="row between">
                <div><div class="nm">${s.name}</div><div class="cd">${s.id} · ${s.area}</div></div>
                <span class="dot ${s.status}${s.status==='bad'?' pulse':''}"></span>
              </div>
              <div class="sep" style="margin:9px 0"></div>
              ${s.submittedAt ? `
                <div class="row between tiny"><span class="faint">Litres</span>
                  <span class="mono b">${WD.stationLitres(s).toLocaleString('en-NG')}</span></div>
                <div class="row between tiny"><span class="faint">Revenue</span>
                  <span class="mono b">${WD.ngnShort(WD.stationRevenue(s))}</span></div>
                <div class="row between tiny"><span class="faint">Variance</span>
                  <span class="mono b" style="color:${s.variancePct < -.3 ? '#FCA5A5' : '#5EE9A0'}">${s.variancePct}%</span></div>`
              : `<div class="tiny" style="color:#FBBF24">No submission · ${s.manager}</div>
                 <div class="tiny faint" style="margin-top:4px">51 min past cut-off</div>`}
            </div>`).join('')}
        </div>
      </div>

      <div class="col" style="gap:14px">
        <div class="map">
          <div class="grid-lines"></div>
          ${WD.STATIONS.map(s => `<div class="pin ${s.status}" style="left:${s.x}%;top:${s.y}%"
            title="${s.name}"><div class="p"></div><div class="lb">${s.id}</div></div>`).join('')}
          ${WD.TRUCKS.filter(x => x.status !== 'maintenance').map(x => `
            <div class="pin truck ${x.status === 'alert' ? 'bad' : ''}" style="left:${x.x}%;top:${x.y}%">
              <div class="p"></div><div class="lb">${x.id}</div></div>`).join('')}
          <div style="position:absolute;left:12px;bottom:10px" class="tiny faint mono">
            Ibadan · 10 stations · 7 tankers moving</div>
        </div>
        <div class="card">
          <div class="card-h"><h4>Payment mix</h4><span class="tiny faint">today</span></div>
          ${barRow('Cash', t.cash, t.revenue)}
          ${barRow('POS / card', t.pos, t.revenue)}
          ${barRow('Transfer', t.transfer, t.revenue)}
          ${barRow('Credit', t.credit, t.revenue, 'warn')}
          <div class="anno">9 in 10 Nigerian stations depend on same-day settlement because
            depots demand payment upfront. Cash position is a daily decision, not a monthly report.</div>
        </div>
      </div>
    </div>

    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Exceptions</h3><span class="badge bad">2 critical</span></div>
        <div class="stack">
          ${WD.ALERTS.slice(0,6).map(a => `
            <div class="alertrow ${a.sev}">
              <div class="ic">${a.ic}</div>
              <div class="grow"><div class="t">${a.t}</div><div class="s">${a.s}</div></div>
              <div class="when">${a.when}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h4>Submission status</h4></div>
        <table>
          <tbody>
          ${WD.STATIONS.map(s => `<tr>
            <td>${s.name}</td>
            <td class="num">${s.submittedAt || '—'}</td>
            <td class="right"><span class="badge ${s.submittedAt ? 'ok' : 'warn'}">
              ${s.submittedAt ? 'in' : 'late'}</span></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  const pStation = () => {
    const s = WD.station(S.stationId);
    const tanks = WD.tanksFor(s);
    const nozzles = WD.nozzlesFor(s);
    return `
    <div class="row between wrap" style="margin-bottom:14px">
      <div class="chipbar">
        ${WD.STATIONS.map(x => `<span class="chip ${x.id === s.id ? 'on' : ''}"
          data-go="station" data-id="${x.id}">${x.name}</span>`).join('')}
      </div>
    </div>
    ${s.flag ? `<div class="note ${s.status}" style="margin-bottom:14px"><b>${s.name}:</b> ${s.flag}</div>` : ''}

    <div class="grid g4">
      ${kpi('Litres', WD.stationLitres(s).toLocaleString('en-NG'), s.submittedAt ? 'submitted ' + s.submittedAt : 'not submitted')}
      ${kpi('Revenue', WD.ngnShort(WD.stationRevenue(s)), 'at today’s prices')}
      ${kpi('Difference', sign(WD.stationDiff(s)), 'expected vs counted', WD.stationDiff(s) < -10000 ? 'bad' : 'ok')}
      ${kpi('Tank variance', s.variancePct + '%', s.varianceDays ? s.varianceDays + '-day drift' : 'within normal',
        s.status === 'bad' ? 'bad' : '')}
    </div>

    <div style="height:14px"></div>
    <div class="grid g-1-2">
      <div class="card">
        <div class="card-h"><h4>Tanks</h4><span class="tiny faint">dip · days of stock</span></div>
        <div class="grid g2" style="gap:12px">
          ${tanks.map(tk => {
            const fill = Math.round((tk.level / tk.capacity) * 100);
            const cls = tk.daysStock !== null && tk.daysStock < 2 ? 'crit'
                      : tk.daysStock !== null && tk.daysStock < 3.5 ? 'low' : '';
            return `<div class="tankgauge">
              <div class="row between tiny"><span class="b">${tk.id} · ${tk.product}</span>
                ${tk.flagged ? '<span class="badge bad">flag</span>' : `<span class="faint mono">${tk.daysStock ?? '—'} d</span>`}</div>
              <div class="tube ${cls}"><i style="height:${fill}%"></i>
                <div class="lvl">${tk.level.toLocaleString('en-NG')} L</div></div>
              <div class="tiny faint mono center">var ${tk.variancePct}%</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-h"><h4>Nozzle reconciliation</h4>
          <span class="tiny faint">meter deltas × price vs takings</span></div>
        <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Nozzle</th><th>Product</th><th>Attendant</th>
            <th class="num">Opening</th><th class="num">Closing</th><th class="num">Litres</th>
            <th class="num">Value</th></tr></thead>
          <tbody>
            ${nozzles.map(n => `<tr>
              <td>${n.label}</td><td><span class="badge neutral">${n.product}</span></td>
              <td class="muted">${n.attendant}</td>
              <td class="num faint">${n.opening.toLocaleString('en-NG')}</td>
              <td class="num">${n.closing.toLocaleString('en-NG')}</td>
              <td class="num b">${(n.closing - n.opening).toLocaleString('en-NG')}</td>
              <td class="num">${WD.ngnShort((n.closing - n.opening) * WD.PRICES[n.product].price)}</td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>
    </div>

    ${s.status === 'bad' ? `
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Tank 2 (PMS) · cumulative variance</h3>
          <span class="badge bad">trend break</span></div>
        ${lineChart(WD.BOD_T2_SERIES, WD.BASELINE)}
        <div class="anno">Single-day variance is noise: temperature alone moves petrol volume about
          0.11% per °C, and dip and meter error add more. The signal is a one-direction drift that
          persists — nine consecutive days here.</div>
      </div>
      <div class="card">
        <div class="card-h"><h4>Investigation</h4></div>
        <div class="kv"><span class="k">Unaccounted volume</span><span class="v">≈ 1,240 L</span></div>
        <div class="kv"><span class="k">Value at ₦905/L</span><span class="v">≈ ₦1,122,200</span></div>
        <div class="kv"><span class="k">Meter drift?</span><span class="v">Ruled out — even spread</span></div>
        <div class="kv"><span class="k">Delivery shortfall?</span><span class="v">No T2 delivery in 9 days</span></div>
        <div class="kv"><span class="k">Water ingress / leak?</span><span class="v">Paste test clean</span></div>
        <div class="kv"><span class="k">Shift pattern</span><span class="v t-bad">Shift 2 every day</span></div>
        <div style="height:12px"></div>
        <button class="btn block" data-modal="audit">Order surprise dip now</button>
        <div style="height:8px"></div>
        <button class="btn ghost block" data-modal="evidence">Open photo evidence</button>
      </div>
    </div>` : ''}`;
  };

  const pVariance = () => `
    <div class="grid g4">
      ${kpi('Tanks monitored', '40', '4 per station × 10')}
      ${kpi('Within baseline', '38', 'no action needed', 'ok')}
      ${kpi('Trend breaks', '1', 'Bodija T2', 'bad')}
      ${kpi('Value at risk', '₦1.12m', 'unaccounted, 9 days', 'bad')}
    </div>
    <div style="height:14px"></div>
    <div class="card">
      <div class="card-h"><h3>Per-tank variance against each tank’s own baseline</h3>
        <span class="tiny faint">30-day window</span></div>
      <div style="overflow-x:auto">
      <table>
        <thead><tr><th>Station</th><th>Tank</th><th>Product</th>
          <th class="num">Baseline</th><th class="num">Current</th><th class="num">Delta</th>
          <th class="num">Litres/day</th><th>Verdict</th></tr></thead>
        <tbody>
        ${WD.STATIONS.filter(s => s.submittedAt).flatMap(s =>
          WD.tanksFor(s).map(tk => {
            const base = s.id === 'BOD' && tk.id === 'T2' ? -0.08 : tk.variancePct + 0.01;
            const delta = tk.variancePct - base;
            const brk = delta < -0.1;
            return `<tr class="clickable" data-go="station" data-id="${s.id}">
              <td>${s.name}</td><td class="mono">${tk.id}</td>
              <td><span class="badge neutral">${tk.product}</span></td>
              <td class="num faint">${base.toFixed(2)}%</td>
              <td class="num b" style="${brk?'color:#FCA5A5':''}">${tk.variancePct}%</td>
              <td class="num" style="${brk?'color:#FCA5A5':''}">${delta.toFixed(2)}</td>
              <td class="num faint">${Math.round((s.sales[tk.product]||0) / (tk.product === 'PMS' ? 2 : 1))}</td>
              <td>${brk ? '<span class="badge bad">investigate</span>'
                        : '<span class="badge ok">normal</span>'}</td>
            </tr>`;
          })).join('')}
        </tbody>
      </table></div>
      <div class="anno">Investigation triggers used here follow published wet-stock practice:
        variance worsening 0.1% against the tank’s own monthly normal, an extra 10 L/day,
        or an extra 300 L/month. Chasing zero variance is the beginner’s mistake — every tank
        loses a little to temperature and meter drift.</div>
    </div>

    <div style="height:14px"></div>
    <div class="grid g2">
      <div class="card">
        <div class="card-h"><h3>Attendant shortage league</h3><span class="tiny faint">30 days, all stations</span></div>
        <table>
          <thead><tr><th>Attendant</th><th>Station</th><th class="num">Shifts</th>
            <th class="num">Shortage</th><th class="num">% of takings</th><th>Trend</th></tr></thead>
          <tbody>
            ${WD.SHORTAGES.map(a => `<tr>
              <td>${a.name}</td><td class="mono">${a.station}</td>
              <td class="num faint">${a.shifts}</td>
              <td class="num b" style="${a.shortNGN > 100000 ? 'color:#FCA5A5' : ''}">${WD.ngn(a.shortNGN)}</td>
              <td class="num">${a.pctOfTakings}%</td>
              <td><span class="badge ${a.trend === 'up' ? 'bad' : a.trend === 'down' ? 'ok' : 'neutral'}">${a.trend}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="anno">Cross-station history matters: an attendant dismissed at one site should
          not reappear at another. This table is the record that makes that possible.</div>
      </div>
      <div class="card">
        <div class="card-h"><h3>Bodija · Tank 2 trend</h3><span class="badge bad">−0.41%</span></div>
        ${lineChart(WD.BOD_T2_SERIES, WD.BASELINE, 600, 220)}
      </div>
    </div>`;

  const pDispatch = () => {
    const trip = WD.TRIPS.find(x => x.id === S.tripId) || WD.TRIPS[0];
    const truck = WD.TRUCKS.find(x => x.id === trip.truck);
    return `
    <div class="grid g4">
      ${kpi('Trucks in transit', '4', 'of 8 in the fleet')}
      ${kpi('Litres in motion', '165,000', 'PMS + AGO')}
      ${kpi('Route alerts', '1', 'WD-04 off corridor', 'bad')}
      ${kpi('Deliveries due today', '3', '2 bulk, 1 retail restock')}
    </div>

    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Trips</h3><div class="chipbar">
          <span class="chip on">Active</span><span class="chip">Closed</span></div></div>
        <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Trip</th><th>Truck / driver</th><th>Route</th><th>Product</th>
            <th class="num">Volume</th><th>Seals</th><th>Stage</th><th class="num">ETA</th></tr></thead>
          <tbody>
            ${WD.TRIPS.map(x => `<tr class="clickable" data-go="dispatch" data-trip="${x.id}"
              style="${x.id === trip.id ? 'background:rgba(22,163,74,.07)' : ''}">
              <td class="mono b">${x.id}</td>
              <td>${x.truck}<div class="tiny faint">${x.driver}</div></td>
              <td class="sm">${x.route}<div class="tiny faint">${x.kind}</div></td>
              <td><span class="badge neutral">${x.product}</span></td>
              <td class="num">${x.planned.toLocaleString('en-NG')}</td>
              <td>${x.sealsIntact ? '<span class="badge ok">intact</span>' : '<span class="badge bad">broken</span>'}</td>
              <td><span class="badge ${x.stage === 'alert' ? 'bad' : x.stage === 'closed' ? 'neutral' : 'info'}">${x.stage}</span></td>
              <td class="num ${x.eta === 'overdue' ? 't-bad' : ''}">${x.eta}</td>
            </tr>`).join('')}
          </tbody>
        </table></div>
      </div>

      <div class="col" style="gap:14px">
        <div class="map" style="min-height:250px">
          <div class="grid-lines"></div>
          ${WD.STATIONS.map(s => `<div class="pin ${s.status}" style="left:${s.x}%;top:${s.y}%">
            <div class="p"></div></div>`).join('')}
          ${WD.TRUCKS.filter(x => x.status !== 'maintenance').map(x => `
            <div class="pin truck ${x.status === 'alert' ? 'bad' : ''}" style="left:${x.x}%;top:${x.y}%">
              <div class="p"></div><div class="lb">${x.id}</div></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-h"><h4>Fleet</h4></div>
          ${WD.TRUCKS.map(x => `
            <div class="row between" style="padding:6px 0;border-bottom:1px dashed var(--line-soft)">
              <div><div class="sm b">${x.id}</div><div class="tiny faint">${x.driver}</div></div>
              <span class="badge ${x.status === 'alert' ? 'bad' : x.status === 'in-transit' ? 'info'
                : x.status === 'maintenance' ? 'neutral' : 'ok'}">${x.status}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div style="height:14px"></div>
    <div class="grid g-1-2">
      <div class="card">
        <div class="card-h"><h3>${trip.id}</h3>
          <span class="badge ${trip.stage === 'alert' ? 'bad' : 'info'}">${trip.stage}</span></div>
        ${trip.alert ? `<div class="note bad" style="margin-bottom:10px">${trip.alert}</div>` : ''}
        <div class="kv"><span class="k">Truck</span><span class="v">${trip.truck} · ${truck ? truck.plate : ''}</span></div>
        <div class="kv"><span class="k">Driver</span><span class="v">${trip.driver}</span></div>
        <div class="kv"><span class="k">Product / volume</span><span class="v">${trip.product} · ${trip.planned.toLocaleString('en-NG')} L</span></div>
        <div class="kv"><span class="k">Loaded</span><span class="v">${trip.loadedAt}</span></div>
        <div class="kv"><span class="k">Seals</span><span class="v" style="font-size:11px">${trip.seals.join(' · ')}</span></div>
        ${trip.delivered ? `<div class="kv"><span class="k">Delivered by dip</span><span class="v">${trip.delivered.toLocaleString('en-NG')} L</span></div>
          <div class="kv"><span class="k">Gap vs waybill</span><span class="v t-warn">${trip.gap} L</span></div>` : ''}
        <div style="height:12px"></div>
        <div class="row" style="gap:8px">
          <button class="btn sm grow">Call driver</button>
          <button class="btn ghost sm grow">Immobilise</button>
        </div>
      </div>

      <div class="card">
        <div class="card-h"><h3>Chain of custody</h3><span class="tiny faint">every step photographed</span></div>
        <div class="timeline">
          <div class="tl-item done"><div class="t">Order allocated to truck</div>
            <div class="s">${trip.kind} · ${trip.route}</div></div>
          <div class="tl-item done"><div class="t">Loaded and sealed · ${trip.loadedAt}</div>
            <div class="s">Per-compartment volumes recorded; seal numbers photographed at the gantry</div></div>
          <div class="tl-item done"><div class="t">Departed — geofence exit</div>
            <div class="s">Telematics confirms yard exit; approved corridor set</div></div>
          <div class="tl-item ${trip.stage === 'alert' ? 'now' : trip.stage === 'closed' ? 'done' : 'now'}">
            <div class="t">${trip.stage === 'alert' ? 'Off-route stop' : 'In transit'}</div>
            <div class="s">${trip.alert || 'Within corridor, on schedule'}</div></div>
          <div class="tl-item ${trip.stage === 'closed' ? 'done' : ''}"><div class="t">Arrival seal check</div>
            <div class="s">Seal numbers must match the load record or discharge is blocked</div></div>
          <div class="tl-item ${trip.stage === 'closed' ? 'done' : ''}"><div class="t">Dip before · discharge · dip after</div>
            <div class="s">Delivered volume = after − before, never the waybill figure</div></div>
          <div class="tl-item ${trip.stage === 'closed' ? 'done' : ''}"><div class="t">Proof of delivery &amp; invoice</div>
            <div class="s">Signature, photos, documents released to the customer portal</div></div>
        </div>
        <div class="anno">This is the control that catches diverted loads. A Nasarawa station manager
          received 40,000 L and discharged 13,300 L; the 26,700 L difference was only found afterwards
          because nobody reconciled waybill, compartments and receiving dips at the gate.</div>
      </div>
    </div>`;
  };

  const stageOrder = ['quoted','confirmed','in-transit','delivered'];
  const pOrders = () => `
    <div class="grid g4">
      ${kpi('Open orders', '5', '2 awaiting allocation')}
      ${kpi('Volume today', '120,000 L', 'AGO 75k · PMS 45k')}
      ${kpi('Order value', '₦134.9m', 'gross')}
      ${kpi('Blocked on credit', '1', 'Bower Cement', 'warn')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g4" style="align-items:start">
      ${stageOrder.map(stage => `
        <div class="card flat">
          <div class="card-h"><h4 style="text-transform:capitalize">${stage.replace('-',' ')}</h4>
            <span class="badge neutral">${WD.ORDERS.filter(o => o.stage === stage).length}</span></div>
          <div class="stack">
            ${WD.ORDERS.filter(o => o.stage === stage).map(o => {
              const c = WD.customer(o.customer);
              return `<div class="card" style="padding:11px">
                <div class="row between"><span class="mono b sm">${o.id}</span>
                  <span class="badge ${o.paid ? 'ok' : 'warn'}">${o.paid ? 'paid' : 'unpaid'}</span></div>
                <div class="sm b" style="margin-top:5px">${c.name}</div>
                <div class="tiny faint">${o.dest}</div>
                <div class="sep" style="margin:8px 0"></div>
                <div class="row between tiny"><span class="faint">${o.product}</span>
                  <span class="mono">${o.volume.toLocaleString('en-NG')} L</span></div>
                <div class="row between tiny"><span class="faint">Unit</span>
                  <span class="mono">₦${o.unitPrice}/L</span></div>
                <div class="row between tiny"><span class="faint">Value</span>
                  <span class="mono b">${WD.ngnShort(o.volume * o.unitPrice)}</span></div>
                ${o.trip ? `<div class="row between tiny"><span class="faint">Trip</span>
                  <span class="mono">${o.trip}</span></div>` : ''}
                <div class="tiny faint" style="margin-top:6px">${o.window}</div>
                ${o.flag ? `<div class="note ${o.flag.includes('off-route') ? 'bad' : 'warn'}"
                  style="margin-top:8px;font-size:11px">${o.flag}</div>` : ''}
              </div>`;
            }).join('') || '<div class="tiny faint">Nothing here</div>'}
          </div>
        </div>`).join('')}
    </div>
    <div class="anno">Every order carries its own landed cost and margin. Post-deregulation, a
      mistimed load can put a station underwater — the same arithmetic applies to a bulk trade.</div>`;

  const pCustomers = () => {
    const c = WD.customer(S.custId);
    const totalOut = WD.CUSTOMERS.reduce((s,x) => s + x.outstanding, 0);
    const bucket = k => WD.CUSTOMERS.reduce((s,x) => s + x.ageing[k], 0);
    return `
    <div class="grid g4">
      ${kpi('Receivables', WD.ngnShort(totalOut), 'across 7 accounts')}
      ${kpi('0–30 days', WD.ngnShort(bucket('0-30')), pct(bucket('0-30'), totalOut) + ' of book', 'ok')}
      ${kpi('61–90 days', WD.ngnShort(bucket('61-90')), 'chase now', 'warn')}
      ${kpi('90+ days', WD.ngnShort(bucket('90+')), 'Oyo Water Corp', 'bad')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Bulk accounts</h3><span class="tiny faint">click a row</span></div>
        <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Customer</th><th>Type</th><th>Terms</th>
            <th class="num">Monthly vol</th><th class="num">Limit</th><th class="num">Outstanding</th>
            <th class="num">Used</th><th>Status</th></tr></thead>
          <tbody>
            ${WD.CUSTOMERS.map(x => {
              const used = x.limit ? Math.round(x.outstanding / x.limit * 100) : 0;
              return `<tr class="clickable" data-go="customers" data-cust="${x.id}"
                style="${x.id === c.id ? 'background:rgba(22,163,74,.07)' : ''}">
                <td class="b">${x.name}<div class="tiny faint">${x.contact}</div></td>
                <td class="muted sm">${x.type}</td>
                <td class="sm">${x.terms}</td>
                <td class="num">${(x.monthlyVol/1000)}k L</td>
                <td class="num faint">${x.limit ? WD.ngnShort(x.limit) : '—'}</td>
                <td class="num b">${WD.ngnShort(x.outstanding)}</td>
                <td class="num" style="${used > 85 ? 'color:#FCA5A5' : ''}">${x.limit ? used + '%' : '—'}</td>
                <td>${x.risk ? '<span class="badge bad">watch</span>'
                    : x.note ? '<span class="badge info">prepaid</span>'
                    : '<span class="badge ok">ok</span>'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>
      </div>

      <div class="card">
        <div class="card-h"><h3>${c.name}</h3>
          ${c.risk ? '<span class="badge bad">watch</span>' : '<span class="badge ok">ok</span>'}</div>
        ${c.risk ? `<div class="note warn" style="margin-bottom:10px">${c.risk}</div>` : ''}
        <div class="kv"><span class="k">Contact</span><span class="v" style="font-size:12px">${c.contact}</span></div>
        <div class="kv"><span class="k">Product</span><span class="v">${c.product}</span></div>
        <div class="kv"><span class="k">Terms</span><span class="v">${c.terms}</span></div>
        <div class="kv"><span class="k">Last order</span><span class="v">${c.lastOrder}</span></div>
        ${c.note ? `<div class="kv"><span class="k">Note</span><span class="v" style="font-size:11.5px">${c.note}</span></div>` : ''}
        <div class="sep"></div>
        <div class="tiny faint mono" style="margin-bottom:8px">AGEING</div>
        ${Object.entries(c.ageing).map(([k,v]) => barRow(k + ' days', v, Math.max(1, c.outstanding),
          k === '90+' && v ? 'bad' : k === '61-90' && v ? 'warn' : '')).join('')}
        ${c.tank ? `<div class="sep"></div>
          <div class="tiny faint mono" style="margin-bottom:6px">CUSTOMER TANK</div>
          <div class="bar"><i class="${c.tankLevel/c.tank < .4 ? 'warn' : ''}"
            style="width:${Math.round(c.tankLevel/c.tank*100)}%"></i></div>
          <div class="row between tiny faint" style="margin-top:5px">
            <span>${c.tankLevel.toLocaleString('en-NG')} L</span>
            <span>predicted dry in ${Math.max(1, Math.round(c.tankLevel / (c.monthlyVol/30)))} days</span></div>` : ''}
        <div style="height:12px"></div>
        <button class="btn block sm">Create order</button>
      </div>
    </div>
    <div class="anno">The fleet-card angle matters here: third-party prepaid fuel cards are
      routinely refused at Nigerian pumps. A card Weeldrop issues and honours at its own ten
      stations carries no acceptance risk — that is a real edge, not a me-too feature.</div>`;
  };

  const pAllocation = () => {
    const a = WD.ALLOCATION;
    const allocated = a.claims.reduce((s,c) => s + c.suggest, 0);
    return `
    <div class="grid g4">
      ${kpi('Inbound load', a.inbound.volume.toLocaleString('en-NG') + ' L', a.inbound.truck + ' · ETA ' + a.inbound.eta)}
      ${kpi('Landed cost', '₦' + a.inbound.unitCost + '/L', 'ex-depot + freight')}
      ${kpi('Retail margin', '₦' + (WD.PRICES.PMS.price - a.inbound.unitCost) + '/L', 'at ₦905 pump price', 'ok')}
      ${kpi('Allocated', allocated.toLocaleString('en-NG') + ' L', (a.inbound.volume - allocated).toLocaleString('en-NG') + ' L free')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Claims on this load</h3>
          <span class="tiny faint">ranked by days-of-stock, then margin</span></div>
        <table>
          <thead><tr><th class="num">#</th><th>Target</th><th>Kind</th><th>Need</th>
            <th class="num">Suggested</th><th>Reason</th></tr></thead>
          <tbody>
            ${a.claims.map(c => `<tr>
              <td class="num faint">${c.priority}</td>
              <td class="b">${c.kind === 'station' ? WD.station(c.target).name : WD.customer(c.target).name}</td>
              <td><span class="badge ${c.kind === 'station' ? 'info' : 'neutral'}">${c.kind}</span></td>
              <td class="sm">${c.need}</td>
              <td class="num b">${c.suggest ? c.suggest.toLocaleString('en-NG') + ' L' : '—'}</td>
              <td class="sm muted">${c.reason}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="height:12px"></div>
        <button class="btn">Accept allocation &amp; create 3-drop trip</button>
      </div>
      <div class="card">
        <div class="card-h"><h4>Why this ordering</h4></div>
        <p class="sm muted">Retail and bulk compete for the same product. Without a shared view they
          compete blindly — a bulk order gets filled while a station runs dry, or a station is
          topped up at a lower margin than a waiting contract.</p>
        <div class="sep"></div>
        <div class="kv"><span class="k">Retail margin, PMS</span><span class="v t-ok">₦93/L</span></div>
        <div class="kv"><span class="k">Bulk margin, this quote</span><span class="v">₦33/L</span></div>
        <div class="kv"><span class="k">Stations under 3 days</span><span class="v t-warn">2</span></div>
        <div class="kv"><span class="k">Decision</span><span class="v" style="font-size:12px">Retail first</span></div>
        <div class="anno">This screen is the join between the two halves of the product: it only
          works because the station app knows days-of-stock and the supply platform knows the
          order book.</div>
      </div>
    </div>`;
  };

  const pCompliance = () => `
    <div class="grid g4">
      ${kpi('Items tracked', WD.COMPLIANCE.length, 'stations + fleet')}
      ${kpi('Due in 30 days', WD.COMPLIANCE.filter(c => c.days <= 30).length, 'act now', 'warn')}
      ${kpi('Stations sealed', '0', 'this year', 'ok')}
      ${kpi('Calibration overdue', '0', 'under-dispensing risk', 'ok')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Compliance register</h3></div>
        <table>
          <thead><tr><th>Scope</th><th>Item</th><th>Authority</th><th class="num">Due</th>
            <th class="num">Days</th><th>Status</th></tr></thead>
          <tbody>
            ${WD.COMPLIANCE.map(c => `<tr>
              <td class="mono">${c.station}</td>
              <td>${c.item}</td>
              <td class="muted sm">${c.authority}</td>
              <td class="num">${c.due}</td>
              <td class="num ${c.days <= 20 ? 't-warn' : ''}">${c.days}</td>
              <td><span class="badge ${c.status}">${c.status === 'warn' ? 'due soon' : 'ok'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-h"><h4>Why this page exists</h4></div>
        <div class="note bad">A sealed station is a 100% revenue stop.</div>
        <div style="height:10px"></div>
        <p class="sm muted">NMDPRA’s under-dispensing enforcement sealed 11 stations in Rivers State
          in a single day in February 2026. Weights &amp; Measures seals inaccurate pumps separately.
          Calibration dates and dispensing self-tests are not bureaucracy — they are the cheapest
          insurance in the business.</p>
        <div class="sep"></div>
        <div class="kv"><span class="k">Weekly self-test</span><span class="v">10 stations</span></div>
        <div class="kv"><span class="k">Evidence</span><span class="v" style="font-size:12px">photo + volume log</span></div>
        <div class="kv"><span class="k">Escalation</span><span class="v" style="font-size:12px">owner at T−14 days</span></div>
      </div>
    </div>`;

  const pCNG = () => {
    const o = WD.CNG.liveOps;
    return `
    <div class="grid g4">
      ${kpi('Sites in programme', WD.CNG.target, 'target Q4 2026')}
      ${kpi('kg dispensed today', o.kgToday.toLocaleString('en-NG'), '+' + Math.round((o.kgToday/o.kgYesterday-1)*100) + '% vs yesterday', 'ok')}
      ${kpi('Dispenser uptime', o.uptimePct + '%', o.downtimeMin + ' min lost', 'warn')}
      ${kpi('Inlet pressure', o.inletPressureBar + ' bar', 'pipeline supply')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Build programme</h3><span class="tiny faint">${WD.CNG.note}</span></div>
        ${WD.CNG.sites.map(s => `
          <div style="margin-bottom:14px">
            <div class="row between">
              <div><div class="b">${s.name}</div>
                <div class="tiny faint">${s.dispensers} dispensers · ${s.compressor} · ${s.cascade}</div></div>
              <div class="right"><span class="badge ${s.pct > 70 ? 'ok' : s.pct > 30 ? 'warn' : 'neutral'}">${s.phase}</span>
                <div class="tiny faint mono" style="margin-top:3px">live ${s.live}</div></div>
            </div>
            <div class="bar" style="margin-top:7px"><i style="width:${s.pct}%"></i></div>
            <div class="tiny faint" style="margin-top:4px">${s.note}</div>
          </div>`).join('')}
        <div class="anno">Timing is favourable: Oyo State signed a 20-year CNG mass-transit PPP,
          NIPCO runs conversion centres in Ibadan, and the Sagamu–Ibadan gas pipeline is due
          mid-2026. Demand-side conversions are being subsidised nationally.</div>
      </div>

      <div class="card">
        <div class="card-h"><h3>Sawmill CNG · live</h3><span class="badge ok">operating</span></div>
        <div class="note warn" style="margin-bottom:10px">
          Downtime ${o.downtimeMin} min today — ${o.downtimeReason}</div>
        <div class="kv"><span class="k">Dispensed</span><span class="v">${o.kgToday.toLocaleString('en-NG')} kg</span></div>
        <div class="kv"><span class="k">Revenue at ₦230/kg</span><span class="v">${WD.ngn(o.kgToday * 230)}</span></div>
        <div class="kv"><span class="k">Compressor run hours</span><span class="v">${o.compressorHours} h</span></div>
        <div class="sep"></div>
        <div class="tiny faint mono" style="margin-bottom:8px">CASCADE BANKS</div>
        ${['High','Mid','Low'].map((b,i) => {
          const v = [o.cascadeHigh, o.cascadeMid, o.cascadeLow][i];
          return `<div style="margin-bottom:8px">
            <div class="row between tiny"><span>${b} bank</span><span class="mono">${v}%</span></div>
            <div class="bar" style="margin-top:4px"><i class="${v < 40 ? 'warn' : ''}" style="width:${v}%"></i></div>
          </div>`;
        }).join('')}
        <div class="anno">CNG sells by the kilogram against a mass-flow meter. There is no dip stick
          and no wet-stock variance — the reconciliation model is gas received versus gas dispensed,
          with compressor hours and downtime as the operating signals. It has to be a first-class
          product type, not petrol logic with a different label.</div>
      </div>
    </div>`;
  };

  const pPrices = () => `
    <div class="grid g4">
      ${Object.entries(WD.PRICES).map(([k,p]) => kpi(p.name, '₦' + p.price + '/' + p.unit,
        p.price === p.prev ? 'unchanged' : 'was ₦' + p.prev, p.price !== p.prev ? 'warn' : '')).join('')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Broadcast acknowledgement</h3><span class="badge warn">9 of 10</span></div>
        <table>
          <thead><tr><th>Station</th><th>Manager</th><th class="num">Acknowledged</th><th>Board updated</th></tr></thead>
          <tbody>
            ${WD.STATIONS.map((s,i) => `<tr>
              <td>${s.name}</td><td class="muted sm">${s.manager}</td>
              <td class="num">${s.id === 'JMB' ? '—' : '06:' + String(4 + i * 3).padStart(2,'0')}</td>
              <td>${s.id === 'JMB' ? '<span class="badge warn">outstanding</span>'
                                    : '<span class="badge ok">confirmed</span>'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="anno">The acknowledgement is the audit trail. If NMDPRA inspects, the posted
          board price must equal the approved price — and there is a timestamped record of who
          confirmed it and when.</div>
      </div>
      <div class="card">
        <div class="card-h"><h3>Set new price</h3></div>
        <div class="field"><label>Product</label><select><option>PMS (Petrol)</option>
          <option>AGO (Diesel)</option><option>DPK (Kerosene)</option><option>CNG</option></select></div>
        <div class="field"><label>New pump price (₦/L)</label><input type="number" value="905"></div>
        <div class="field"><label>Effective from</label><select><option>Tomorrow 06:00</option>
          <option>Immediately</option></select></div>
        <div class="field"><label>Apply to</label><select><option>All 10 stations</option>
          <option>Selected stations…</option></select></div>
        <button class="btn block">Broadcast price</button>
        <div class="anno">Margin check at ₦812 landed cost: ₦93/L across 109,900 L/day
          ≈ ₦10.2m gross margin per day network-wide.</div>
      </div>
    </div>`;

  const pAudit = () => `
    <div class="card">
      <div class="card-h"><h3>Audit trail</h3>
        <span class="tiny faint">append-only · nothing is ever edited in place</span></div>
      <div style="overflow-x:auto">
      <table>
        <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Record</th><th>Detail</th><th>Source</th></tr></thead>
        <tbody>
          ${[
            ['21:04','system','ALERT_RAISED','BOD/2026-08-03','Tank 2 trend break −0.41% over 9 days','rule engine'],
            ['21:02','Chidi Okonkwo','SUBMIT','BOD/2026-08-03','17,540 L · ₦16.7m · 5 photos','app · GPS on site'],
            ['21:01','Chidi Okonkwo','PHOTO','BOD/T2/dip','in-app camera · 7.4180, 3.8980','device'],
            ['20:58','Yemi Oladipo','CORRECTION','NHT/2026-08-03','supersedes rec #4417 · cash 3,181,400 → 3,095,000','app'],
            ['12:47','system','ALERT_RAISED','T-2412','WD-04 stationary 41 min, 3.2 km off corridor','telematics feed'],
            ['09:15','system','CREDIT_HOLD','ORD-4473','Bower Cement at 94% of limit — approval required','rule engine'],
            ['08:55','Aliyu Danjuma','LOAD_SEALED','T-2411','3 compartments · seals S-88431/2/3 photographed','driver app'],
            ['06:02','Owner','PRICE_SET','PMS','₦892 → ₦905 effective 06:00','web console'],
            ['05:41','Owner','LOGIN','—','session opened','web console']
          ].map(r => `<tr>
            <td class="mono faint">${r[0]}</td><td>${r[1]}</td>
            <td><span class="badge ${r[2].includes('ALERT') || r[2] === 'CREDIT_HOLD' ? 'bad'
              : r[2] === 'CORRECTION' ? 'warn' : 'neutral'}">${r[2]}</span></td>
            <td class="mono sm">${r[3]}</td><td class="sm muted">${r[4]}</td>
            <td class="tiny faint">${r[5]}</td></tr>`).join('')}
        </tbody>
      </table></div>
      <div class="anno">Managers hold insert-only rights. A correction is a new row carrying a
        <span class="mono">supersedes_id</span>, so the owner always sees both the original and the
        change, with the actor and timestamp attached. Derived figures are never accepted from a
        device — they are recomputed server-side from the raw readings.</div>
    </div>

    <div style="height:14px"></div>
    <div class="grid g3">
      <div class="card"><div class="card-h"><h4>Roles</h4></div>
        <div class="kv"><span class="k">Owner</span><span class="v" style="font-size:12px">read all, set prices</span></div>
        <div class="kv"><span class="k">Manager</span><span class="v" style="font-size:12px">insert own station only</span></div>
        <div class="kv"><span class="k">Dispatcher</span><span class="v" style="font-size:12px">trips + fleet</span></div>
        <div class="kv"><span class="k">Driver</span><span class="v" style="font-size:12px">own trip only</span></div>
        <div class="kv"><span class="k">Accountant</span><span class="v" style="font-size:12px">read-only + export</span></div>
        <div class="kv"><span class="k">Customer</span><span class="v" style="font-size:12px">own orders only</span></div>
      </div>
      <div class="card"><div class="card-h"><h4>Integrity controls</h4></div>
        <div class="kv"><span class="k">Photos</span><span class="v" style="font-size:12px">in-app camera only</span></div>
        <div class="kv"><span class="k">Location</span><span class="v" style="font-size:12px">GPS at capture</span></div>
        <div class="kv"><span class="k">Time</span><span class="v" style="font-size:12px">server authoritative</span></div>
        <div class="kv"><span class="k">Meters</span><span class="v" style="font-size:12px">monotonic across days</span></div>
        <div class="kv"><span class="k">Uniqueness</span><span class="v" style="font-size:12px">one report per station-day</span></div>
        <div class="kv"><span class="k">Offline</span><span class="v" style="font-size:12px">idempotency keys</span></div>
      </div>
      <div class="card"><div class="card-h"><h4>Exports</h4></div>
        <div class="stack">
          ${['Daily station pack (PDF)','Monthly P&L per station (XLSX)','Wet-stock variance (CSV)',
             'Fleet trip log (CSV)','Receivables ageing (XLSX)','Regulator evidence bundle (PDF)']
            .map(x => `<button class="listrow" style="width:100%;text-align:left">
              <div class="lead">▤</div><div class="body"><div class="t">${x}</div></div>
              <span class="badge neutral">export</span></button>`).join('')}
        </div>
      </div>
    </div>`;

  const pPortal = () => {
    const c = WD.customer('C-101');
    return `
    <div class="note" style="margin-bottom:14px">
      Customer-facing view — what Ibadan Flour Mills sees when they log in. Same data, different door.
    </div>
    <div class="grid g4">
      ${kpi('Live order', 'ORD-4471', '45,000 L AGO · ETA 15:10')}
      ${kpi('Tank level', Math.round(c.tankLevel/c.tank*100) + '%', c.tankLevel.toLocaleString('en-NG') + ' L of ' + c.tank.toLocaleString('en-NG'), 'warn')}
      ${kpi('Predicted dry', '6 Aug 2026', 'at 6,000 L/day', 'warn')}
      ${kpi('Account balance', WD.ngnShort(c.outstanding), 'of ' + WD.ngnShort(c.limit) + ' limit')}
    </div>
    <div style="height:14px"></div>
    <div class="grid g-2-1">
      <div class="card">
        <div class="card-h"><h3>Order history</h3><button class="btn sm">New order</button></div>
        <table>
          <thead><tr><th>Order</th><th>Date</th><th>Product</th><th class="num">Volume</th>
            <th class="num">Unit</th><th class="num">Value</th><th>Status</th><th>Documents</th></tr></thead>
          <tbody>
            ${[['ORD-4471','3 Aug 2026','AGO',45000,1128,'in transit'],
               ['ORD-4462','27 Jul 2026','AGO',45000,1134,'delivered'],
               ['ORD-4448','19 Jul 2026','AGO',45000,1141,'delivered'],
               ['ORD-4431','11 Jul 2026','AGO',45000,1119,'delivered']].map(r => `
              <tr><td class="mono b">${r[0]}</td><td>${r[1]}</td>
                <td><span class="badge neutral">${r[2]}</span></td>
                <td class="num">${r[3].toLocaleString('en-NG')} L</td>
                <td class="num">₦${r[4]}</td>
                <td class="num b">${WD.ngnShort(r[3]*r[4])}</td>
                <td><span class="badge ${r[5] === 'delivered' ? 'ok' : 'info'}">${r[5]}</span></td>
                <td class="tiny faint">invoice · waybill · POD</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="anno">Verifiable delivery documents are becoming a compliance requirement for
          corporate buyers under Nigeria’s 2026 tax reforms. Handwritten waybills are a liability
          on their side of the transaction — worth confirming with the client’s accountant.</div>
      </div>
      <div class="card">
        <div class="card-h"><h3>Live tracking</h3><span class="badge info">in transit</span></div>
        <div class="map" style="min-height:180px;margin-bottom:12px">
          <div class="grid-lines"></div>
          <div class="pin" style="left:22%;top:78%"><div class="p"></div><div class="lb">Yard</div></div>
          <div class="pin truck" style="left:52%;top:60%"><div class="p"></div><div class="lb">WD-01</div></div>
          <div class="pin warn" style="left:74%;top:44%"><div class="p"></div><div class="lb">You</div></div>
        </div>
        <div class="timeline">
          <div class="tl-item done"><div class="t">Order confirmed</div><div class="s">08:12 · ₦1,128/L</div></div>
          <div class="tl-item done"><div class="t">Payment received</div><div class="s">08:40 · transfer</div></div>
          <div class="tl-item done"><div class="t">Loaded &amp; sealed</div><div class="s">08:55 · 3 compartments</div></div>
          <div class="tl-item now"><div class="t">In transit</div><div class="s">47 km/h · ETA 15:10</div></div>
          <div class="tl-item"><div class="t">Discharge</div><div class="s">Dip before and after</div></div>
          <div class="tl-item"><div class="t">Documents released</div><div class="s">Invoice + POD</div></div>
        </div>
      </div>
    </div>`;
  };

  /* ---------- nav ---------- */
  const NAV = [
    { grp:'Retail operations' },
    { id:'overview',   ic:'▦', l:'Owner overview', page:pOverview, h:'All stations', crumb:'Retail · ' + WD.BUSINESS_DATE },
    { id:'station',    ic:'◍', l:'Station detail', page:pStation, h:'Station detail', crumb:'Retail · drill-down' },
    { id:'variance',   ic:'▲', l:'Variance & theft', page:pVariance, h:'Variance analysis', crumb:'Retail · controls', cnt:1 },
    { id:'prices',     ic:'₦', l:'Prices', page:pPrices, h:'Price broadcast', crumb:'Retail · pricing' },
    { id:'compliance', ic:'◷', l:'Compliance', page:pCompliance, h:'Compliance register', crumb:'Retail · regulatory' },
    { id:'cng',        ic:'◈', l:'CNG programme', page:pCNG, h:'CNG', crumb:'Retail · Q4 2026' },
    { grp:'Supply & logistics' },
    { id:'dispatch',   ic:'◉', l:'Dispatch & fleet', page:pDispatch, h:'Dispatch', crumb:'Supply · 8 tankers', cnt:1 },
    { id:'orders',     ic:'▤', l:'Bulk orders', page:pOrders, h:'Bulk order book', crumb:'Supply · B2B' },
    { id:'customers',  ic:'◑', l:'Customers & credit', page:pCustomers, h:'Customers', crumb:'Supply · receivables' },
    { id:'allocation', ic:'⇄', l:'Allocation engine', page:pAllocation, h:'Allocation', crumb:'Supply · retail vs bulk' },
    { id:'portal',     ic:'◫', l:'Customer portal view', page:pPortal, h:'Customer portal', crumb:'Supply · customer-facing' },
    { grp:'Governance' },
    { id:'audit',      ic:'⌘', l:'Audit trail & roles', page:pAudit, h:'Audit trail', crumb:'Governance · integrity' }
  ];

  /* ---------- modals ---------- */
  const MODALS = {
    audit: `<div class="mh"><h3>Surprise audit · Bodija</h3>
        <button class="btn ghost sm" data-modal="close">Close</button></div>
      <div class="mb">
        <p class="sm muted">Demand an unscheduled dip and meter reading. The manager has a fixed
          window to respond with fresh, GPS-stamped photos.</p>
        <div style="height:12px"></div>
        <div class="grid g2">
          <div class="field"><label>Scope</label><select><option>Tank 2 dip + PMS meters</option>
            <option>All tanks</option><option>Cash count</option></select></div>
          <div class="field"><label>Deadline</label><select><option>30 minutes</option>
            <option>15 minutes</option><option>1 hour</option></select></div>
        </div>
        <div class="note">Deviation from the daily pattern is itself evidence. An unscheduled dip
          that disagrees with the evening submission is hard to explain away.</div>
        <div style="height:12px"></div>
        <button class="btn block" data-modal="close">Send request to Chidi Okonkwo</button>
      </div>`,
    evidence: `<div class="mh"><h3>Photo evidence · Bodija Tank 2</h3>
        <button class="btn ghost sm" data-modal="close">Close</button></div>
      <div class="mb">
        <div class="grid g3" style="gap:10px">
          ${['3 Aug 21:01','2 Aug 20:58','1 Aug 21:11','31 Jul 20:47','30 Jul 21:03','29 Jul 20:52']
            .map(d => `<div class="photo taken"><div style="font-size:20px">📷</div>
              <div>Dip stick</div><div class="tiny mono">${d}</div></div>`).join('')}
        </div>
        <div class="anno">In-app camera only, GPS at capture, server timestamp. The gallery is
          disabled so a photo cannot be staged elsewhere and uploaded later.</div>
      </div>`
  };

  /* ---------- render ---------- */
  function render(){
    const item = NAV.find(n => n.id === S.page);
    el('side').innerHTML = `
      <div class="brand"><div class="mark">W</div>
        <div><b>Weeldrop OS</b><div class="tiny faint">Ibadan · 10 stations</div></div></div>
      ${NAV.map(n => n.grp
        ? `<div class="grp">${n.grp}</div>`
        : `<div class="nav ${n.id === S.page ? 'on' : ''}" data-go="${n.id}">
             <span class="ic">${n.ic}</span>${n.l}
             ${n.cnt ? `<span class="cnt">${n.cnt}</span>` : ''}</div>`).join('')}
      <div style="margin-top:auto;padding-top:18px">
        <a class="nav" href="mobile.html"><span class="ic">▢</span>Mobile prototype</a>
        <a class="nav" href="index.html"><span class="ic">←</span>Prototype home</a>
      </div>`;

    el('topbar').innerHTML = `
      <div class="grow"><h1>${item.h}</h1><div class="crumb">${item.crumb}</div></div>
      <div class="chipbar">
        <span class="chip on">Today</span><span class="chip">7 days</span><span class="chip">Month</span>
      </div>
      <div class="row" style="gap:8px">
        <span class="badge bad">2 critical</span>
        <span class="badge warn">4 warnings</span>
      </div>`;

    el('page').innerHTML = item.page();
    el('modal-root').innerHTML = S.modal
      ? `<div class="modal-bg" data-modal="close"><div class="modal" data-stop>${MODALS[S.modal]}</div></div>` : '';
    el('page').scrollTop = 0;
  }

  function bind(){
    document.addEventListener('click', e => {
      const m = e.target.closest('[data-modal]');
      if (m){ S.modal = m.dataset.modal === 'close' ? null : m.dataset.modal; render(); return; }
      if (e.target.closest('[data-stop]')) return;

      const go = e.target.closest('[data-go]');
      if (!go) return;
      if (go.dataset.id) S.stationId = go.dataset.id;
      if (go.dataset.trip) S.tripId = go.dataset.trip;
      if (go.dataset.cust) S.custId = go.dataset.cust;
      S.page = go.dataset.go;
      window.scrollTo({ top:0, behavior:'instant' });
      render();
    });
  }

  return { init(){ bind(); render(); } };
})();

document.addEventListener('DOMContentLoaded', Console.init);
