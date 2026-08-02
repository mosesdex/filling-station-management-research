# 05 — App Blueprint: Features, Data Model, Architecture

The build plan. Every design choice here traces to evidence in Docs 1–4.

---

## 1. Personas

| Persona | Device reality | Needs |
|---|---|---|
| **Owner** (the client) | Smartphone, mobile-first, often traveling | See every station now; trust the numbers; be alerted, not buried |
| **Station Manager** | Entry-level Android, prepaid data, outages | Submit the day in <3 minutes, even offline; see own station's history; receive price changes |
| **Cashier/Supervisor** (later) | Shared or personal Android | Enter per-attendant shift figures |
| **Attendants** | Often no app access | Exist as records (shortage history per attendant), not necessarily users |
| **Tech consultant / accountant** (read-only) | Any | Exportable reports, audit trail |

## 2. Feature set

### MVP (phase 1) — the daily loop
1. **Daily submission form** (manager): per-nozzle opening/closing totalizer readings · per-tank opening/closing dips · deliveries (waybill no., volume, unit cost, before/after dips) · takings split: cash / POS / transfer / credit · expenses with categories · notes + required photos (meter displays, dip stick, waybill)
2. **Server-computed results** (never typed): litres sold per nozzle/product · expected takings · per-shift shortage/overage · tank variance vs book stock
3. **Owner dashboard**: all-stations overview (litres, revenue, cash position, variance flags) · per-station drill-down · submission status (who hasn't reported)
4. **Alerts (push)**: missing submission by cutoff · shortage above threshold · tank variance trend break · low stock (days-of-stock estimate)
5. **Nightly digest** to owner: one notification, all stations, exceptions first
6. **Price broadcast**: owner sets pump prices; managers acknowledge; price history is part of the audit trail
7. **Roles & audit**: owner/manager roles, append-only records, full correction history

### Phase 2
Shift-level entry (per-attendant reconciliation live, not end-of-day) · per-attendant shortage league table · compliance calendar (licences, calibration, fire cert) · delivery verification workflow with per-compartment checks · expense approvals · CSV/PDF exports · read-only accountant role · WhatsApp-style report sharing

### Phase 3 (differentiation)
Per-tank statistical variance baselines and trend alerts (the "theft detector") · margin per litre vs actual delivered cost · multi-product P&L per station · surprise-audit requests (owner triggers an ad-hoc dip+photo submission) · POS settlement reconciliation (Paystack Terminal has first-party RN/Flutter guides) · optional ATG integration for stations that grow into hardware

**Deliberately out of scope:** full POS/per-transaction entry (Vendra's weight is the gap we exploit), payroll/HR, hardware.

## 3. The daily form — field spec

Per station-day (all raw inputs; server derives everything else):

```
submissions
  station_id, business_date, shift_id?, submitted_by, submitted_at(server),
  device_time, gps_lat/lng, status: draft|submitted|superseded

meter_readings   nozzle_id, opening, closing, photo_id
tank_dips        tank_id, kind: opening|closing|pre_delivery|post_delivery,
                 dip_mm?, litres, photo_id
deliveries       tank_id, waybill_no, supplier, volume_waybill, volume_measured,
                 unit_cost, photo_id
takings          method: cash|pos|transfer|credit, amount
expenses         category, amount, note, photo_id?
prices           product_id, price, effective_from, set_by   (broadcast, org-level)
```

Validation at entry: closing meter ≥ opening; dip within tank capacity; photo required for meters and dips; warn (don't block) on outliers — connectivity means blocking = lost data.

## 4. Alert rules (initial)

| Rule | Threshold (configurable) |
|---|---|
| Missing submission | Not in by cutoff (e.g. 21:30 WAT) → nag manager; 22:30 → alert owner |
| Cash shortage | Shortage > X% of expected takings or > ₦Y |
| Tank variance | Daily variance > 0.5% of throughput → note; cumulative trend break vs tank baseline (+0.1% monthly, +10 L/day, +300 L/month) → alert |
| Delivery mismatch | Measured vs waybill gap > Z L → alert immediately |
| Low stock | Days-of-stock (avg daily sales) < N days |
| Anomaly | Submission GPS far from station; device time ≠ server time materially |

## 5. Data integrity layer (what makes manual figures trustworthy)

Evidence: FuelCloud's top complaint is unentered deliveries; Nigerian audit checklists test for altered readings and collusion. Countermeasures:

1. **Append-only:** managers get INSERT-only (no UPDATE/DELETE policies). Corrections are new rows with `supersedes_id`; owner sees who/what/when, old vs new.
2. **Photo evidence:** in-app camera only (no gallery), for meter displays, dip stick at the line, waybills. Commercial field-proof bar: network-verified timestamps, GPS on capture.
3. **Server time authoritative;** device time recorded but never trusted.
4. **GPS at capture;** flag submissions far from the station's coordinates.
5. **Server-side math:** manager never types litres-sold, expected cash, or variance.
6. **Cross-checks:** totalizer monotonicity across days (today's opening = yesterday's closing per nozzle — breaks flag missed/faked readings).

## 6. Architecture

**Recommended stack: Expo/React Native + Supabase.** Rationale: JS-skilled small teams onboard fastest on RN (Drids-on-Roids decision matrix); Expo gives OTA updates (EAS) — critical when users won't update store apps; Supabase provides Postgres + row-level security + pg_cron + Edge Functions — one coherent story for relational, role-gated, report-heavy data. Flutter + Firebase is a legitimate alternative if the team is Dart-first; evidence crowns no universal winner. Both Paystack Terminal guides exist first-party for RN and Flutter.

### Offline-first (non-negotiable — Doc 5 evidence: 238 telco outages in Jan 2026 alone; ~70% of disruptions from fibre cuts; POS terminals halt when towers drop)

- Local SQLite (expo-sqlite) is the on-device source of truth
- **Write-ahead submission queue** with idempotency keys; background drain with exponential backoff on reconnect
- Visible per-submission state: `pending / syncing / synced` — managers must see their report is safe
- Conflict story is deliberately trivial: one manager per station per day, server uniqueness on `(station_id, business_date)`; reject-and-flag on collision
- Upgrade path if two-way sync grows complex: PowerSync (Supabase-native) or RxDB
- Lean data use: entry-level Androids, metered prepaid data — no refetch-per-screen

### Multi-tenant RBAC (Supabase RLS)

```
organizations (owner's business)
└── stations
└── memberships (user_id, org_id/station_id, role: owner|manager|viewer)
```

- RLS on **every** table; policies via membership checks
- `security definer` role-lookup functions; wrap `auth.uid()` in `(select auth.uid())`; index every policy column (production-proven patterns: Supabase docs + Makerkit)
- Managers: INSERT-only on own station's submissions; owner: read-all in org; `service_role` (cron jobs) bypasses RLS

### Scheduled digests

`pg_cron` (21:00 WAT) → Edge Function (service_role) → aggregates per station: submitted/missing, totals, variance flags → Expo Push/FCM to owner. Reciprocal cron nags managers who haven't submitted. First-party documented pattern (Supabase cron + schedule-functions docs).

### Security & compliance

- Nigeria Data Protection Act: locally cached data encrypted (SQLCipher via expo-sqlite), data-lifecycle rules
- No secrets in app; standard Supabase auth (phone/email OTP suits managers)
- Photos stored in Supabase Storage with signed URLs, org-scoped policies

## 7. Suggested pricing (market-informed, Doc 4)

- **Free:** 1 station, 30-day history — unique in the Nigerian market, drives word-of-mouth
- **Paid:** per-station/month in Naira, published openly (benchmark: Vendra $99/5 outlets; Gas Pos $200 flat) — e.g. ₦15–25k/station/month territory, priced against one day's leakage
- The client's own deployment can simply be the product's first tenant

## 8. Build roadmap

| Phase | Scope | Outcome |
|---|---|---|
| 1. MVP (4–6 wks) | Daily form + queue/sync, owner dashboard, digests, price broadcast, roles/audit | Client's stations live; daily numbers trustworthy |
| 2. Controls (3–4 wks) | Shift-level entry, delivery verification, compliance calendar, exports, consultant role | Fraud-detection loop closed |
| 3. Intelligence (ongoing) | Variance baselines/trend alerts, margin analytics, surprise audits, POS reconciliation | The moat: data no one else has without hardware |

**Demo-day script for the client:** open the app at 9pm → all stations green except one → tap it → tank 2 variance trending −0.4% for 9 days → tap the dip photo → call the manager. That is the product.
