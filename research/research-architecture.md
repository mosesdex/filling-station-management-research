# Architecture Research: Multi-Location Field Data Collection App (Nigerian Filling Stations)

Research date: 2026-08-02. Method: firecrawl web search (10 searches) + scrape (9 pages). Each claim carries a source URL and a quality note. Uncertainty flags marked **[UNCERTAIN]**.

Scenario: station managers submit daily sales/stock figures from multiple filling stations; a single owner monitors all stations from a dashboard.

---

## 1. Offline-first architecture: why it is the baseline in Nigeria

### Connectivity reality (Nigeria-specific evidence)

Source: "Why Offline-First Architecture Is Non-Negotiable for Mobile Apps in Nigeria" — https://wise-hustlers.com/blog/offline-first-mobile-apps-nigeria-connectivity (agency blog, Aug 2026; secondary source but cites primary Nigerian press/NCC/GSMA reporting — its own source list includes Vanguard, ThisDay, Dabafinance, Guardian NG, GSMA Mobile Economy Africa).

Claims (each attributed within that article to the cited primary source):
- NCC-reported broadband penetration was 55.67% in April 2026; ~120.7M active broadband subscriptions; ~154.7M total internet subscribers; ~188M active mobile subscriptions. NCC's own target is 70% penetration — not yet met; rural/peri-urban areas lag. (Attributed to Vanguard/ThisDay coverage of NCC data.) **[UNCERTAIN: figures relayed second-hand; verify against ncc.gov.ng industry statistics before quoting in a deliverable.]**
- Telcos suffered 238 network outages in January 2026 alone, up 101.7% from 118 the previous December (attributed to Dabafinance industry monitoring). Power failure at tower sites accounted for 59 disruption cases in a single month (diesel supply cuts, erratic grid power, battery/generator failures). ~70% of network disruptions trace to fibre cuts (road construction, vandalism).
- Documented knock-on failure mode directly relevant to this app's domain: when a tower goes down, PoS terminals in markets stop working and micro-transactions halt immediately.
- GSMA Sub-Saharan Africa context: a basic 4G smartphone costs ~26% of monthly GDP per capita (vs 16% average in other LMICs); ~85% of population lives within 3G/4G signal reach but only ~25% are online; smartphone adoption ~40–54% depending on survey. Practical consequence: expect entry-level Android devices, limited RAM/storage, metered prepaid data — an app that re-fetches on every screen is expensive for the user.
- USSD evidence that offline-tolerant design wins in Nigeria: 630.6M USSD transactions worth ₦4.84T in 2023; 252.06M worth ₦2.19T in H1-2024 alone. Moniepoint/OPay/Paga succeed by layering app flows over USSD fallbacks and agent networks.
- Nigeria Data Protection Act note: locally cached data must be treated with the same care as transmitted data — offline-first must be paired with local encryption and data-lifecycle rules.

Quality note: single best Nigeria-specific synthesis found; it is a vendor content-marketing piece (Indian agency), so treat exact numbers as "reported" and re-verify NCC figures for anything customer-facing. Direct NCC search results were dominated by social-media reposts (Facebook/Instagram) — the NCC statistics portal itself was not scraped. **[GAP: no primary NCC page scraped.]**

### Offline-first sync patterns (general engineering guidance)

Source: Google's official offline-first architecture guide — https://developer.android.com/topic/architecture/data-layer/offline-first (first-party, authoritative; Android-specific but patterns are platform-neutral). Scraped in full.
- Local database as source of truth; network is an eventually-available sync layer.
- Reads: exponential backoff when retrying network reads.
- Writes: **queue writes locally ("write-ahead queue"), drain the queue with exponential backoff when back online**; on Android use WorkManager for persistent background sync (Expo equivalent: background tasks + on-foreground drain).
- Push-based synchronization tradeoff table: app can remain offline indefinitely, minimal data use, works well for relational data — but "Versioning data for conflict resolution is nontrivial" and the backend must support sync.
- Conflict resolution requires versioning metadata; strategies: last-write-wins, CRDTs, or server-arbitrated merge.

Corroborating sources:
- https://www.locize.com/blog/offline-first-apps — offline-first is now the default architecture for apps used on unreliable networks; cost is upfront sync/conflict engineering; delta sync reduces data load. (Vendor blog, general quality.)
- https://dev.to/odunayo_dada/offline-first-mobile-app-architecture-syncing-caching-and-conflict-resolution-518n — notably by a Nigerian developer (Odunayo Dada): "Always queue unsynced data instead of blocking the user"; detect connectivity regain and enqueue a sync worker. (Practitioner post, anecdotal.)

### Design implication for this app (analysis, not sourced)
Daily sales/stock submissions are an ideal offline-first workload: writes are small, append-only, per-station, and rarely contended (one manager per station per day), so conflict resolution can be trivial — server-side uniqueness on (station_id, business_date, report_type) plus last-write-wins or reject-and-flag. The hard multi-writer merge problem mostly does not apply. Explicit "pending sync / synced" indicators are called out as critical for financial actions (wise-hustlers pattern table).

---

## 2. Local database / sync library options (React Native focus)

Source: PowerSync's comparison of RN local databases — https://powersync.com/blog/react-native-local-database-options (vendor blog with commercial interest in PowerSync, but the comparison table is factual and detailed). Scraped in full.

| Option | Key facts (per source) |
|---|---|
| expo-sqlite | SQLite, async+sync APIs, encryption via SQLCipher, web support via WA-SQLite, plugs into PowerSync |
| op-sqlite | Low-level, fastest SQLite bindings; encryption via SQLCipher; no web support |
| WatermelonDB | High-level ORM over SQLite, built-in sync protocol but **bring-your-own backend implementation**; single reader/writer at a time; no built-in encryption |
| RxDB | NoSQL, reactive, 15+ sync adapters incl. Supabase/CouchDB/GraphQL |
| PowerSync | Sync engine (Postgres/MySQL/MongoDB → SQLite on device); pairs with Supabase |

Corroboration:
- https://www.pkgpulse.com/guides/tinybase-vs-watermelondb-vs-rxdb-offline-first-2026 — WatermelonDB ~10k GitHub stars, "the proven React Native choice" for large local datasets, 5–50x faster than AsyncStorage approaches; RxDB "most production-complete" with official Supabase sync plugin. (Aggregator site; medium quality.)
- Reddit r/reactnative thread (https://www.reddit.com/r/reactnative/comments/1qdhwls/) shows practitioner frustration with WatermelonDB ergonomics — anecdotal but a real signal that its sync layer is DIY. **[UNCERTAIN: single thread.]**

Assessment for this app (analysis): at MVP scale (dozens of records/day/station), a heavyweight sync DB is optional. expo-sqlite (or a persisted queue in SQLite/MMKV) + a hand-rolled outbound submission queue with idempotency keys covers the requirement; PowerSync or RxDB+Supabase adapter is the upgrade path if two-way sync (price lists, targets pushed down to stations) grows complex.

---

## 3. Cross-platform stack for a small team

Source: https://www.thedroidsonroids.com/blog/flutter-vs-react-native-comparison (large agency guide, updated 2025; thorough and mostly balanced). Scraped in full. Key claims:
- Flutter and React Native are the two leading cross-platform frameworks in 2025; Flutter more popular by GitHub stars (170k vs 121k, April 2025) and per Appfigures/Statista trend data Flutter is the most-used cross-platform framework with RN just behind.
- Decision matrix: **"Team with JavaScript expertise → React Native — lower learning curve leveraging existing skills."** Flutter wins for custom UI/animation-heavy apps and maximum rendering performance (AOT + Impeller, 60–120fps); RN wins for native look-and-feel and the JS ecosystem's maturity.
- RN/Expo advantages called out: OTA updates without store review via Expo EAS Update; Expo's SDK covers camera, notifications, etc.; Hermes engine default since RN 0.70 (better performance/memory).
- Flutter's OTA equivalent (Shorebird) exists but is third-party.
- Both are in "production era" with major maintainers (Google / Meta).

Corroborating snippets: alimertgulec.com blog concludes "starting fresh → Flutter" (small team/limited budget listed under "choose Flutter"); Reddit r/reactnative debates are split — no consensus winner in 2025; the choice hinges on team skills.

Nigerian dev community angle: **[GAP/UNCERTAIN]** — dedicated search for Nigerian community stack preference returned low-quality sources and was not conclusively answered. Indirect signals: Paystack publishes first-party guides for BOTH "Building Terminal Apps with React Native" and "with Flutter" (https://paystack.com/docs/terminal/), implying both stacks are mainstream among Nigerian integrators. Do not overclaim either way.

Backend: no strong head-to-head Supabase-vs-Firebase source was scraped this run. Grounded observations: Supabase = Postgres + RLS (§4) + pg_cron/Edge Functions (§5) — one coherent story for relational, role-gated, report-heavy data; Firebase/Firestore has best-in-class built-in offline persistence but weaker relational reporting, and its security rules are less expressive than SQL RLS for hierarchical org data. **[UNCERTAIN: this comparison is analyst judgment, not a scraped citation.]**

---

## 4. Role-based access: owner / manager / attendant with Supabase RLS

Primary source: Supabase official RLS docs — https://supabase.com/docs/guides/database/postgres/row-level-security (first-party, authoritative):
- Enable RLS per table; grant table privileges to `anon`/`authenticated`/`service_role`; policy examples check membership in a roles table via `auth.uid()`.
- Performance recommendations: use `security definer` functions for role lookups; wrap `auth.uid()` in `(select auth.uid())` so it evaluates once, not per-row.

Best-practices source: https://makerkit.dev/blog/tutorials/supabase-rls-best-practices (Makerkit; patterns from "100+ production deployments"; high-quality practitioner guide). Scraped in full. Key rules:
- "Enable RLS on every table in your public schema. No exceptions." `service_role` bypasses RLS for admin jobs (e.g. the daily-digest cron).
- Index every column used in policies (e.g. `station_id`, `user_id`); the `(select auth.uid())` caching pattern is presented as turning 3-minute queries into ~2ms responses.
- Team/account pattern maps directly to owner→stations→managers: `using ((select auth.uid()) = primary_owner_user_id or public.has_role_on_account(id))`.
- Permission-based policies via a `role_permissions` lookup + `security definer` helper (`public.has_permission(user_id, account_id, 'reports.update')`); guard security-definer functions against privilege escalation by validating the caller inside the function.
- Add explicit application-level filters (`.eq('station_id', x)`) even though RLS would filter anyway — lets Postgres use indexes effectively.

Worked multi-tenant example: https://dev.to/blackie360/-enforcing-row-level-security-in-supabase-a-deep-dive-into-lockins-multi-tenant-architecture-4hd2 — complete SQL for an Organization → Members(role) → scoped-resources hierarchy: members SELECT org rows via membership subquery; only admins UPDATE; only owners DELETE; admins cannot change their own role (self-protection clause). Directly transplantable to owner/manager/attendant. (Practitioner post; code-complete.)

Mapping for this app (analysis): `organizations` (owner's business) → `stations` → `memberships(user_id, station_id/org_id, role in ('owner','manager','attendant'))`. Owner policies key off org membership; manager policies off station membership; attendants (if given logins later) get INSERT-only on their own submissions.

---

## 5. Push notifications + scheduled daily digest to the owner

Primary source: Supabase scheduling docs — https://supabase.com/docs/guides/functions/schedule-functions (first-party): pg_cron + pg_net invoke an Edge Function on a schedule; secrets (project URL, key) kept in Vault; full SQL example given (`cron.schedule(..., net.http_post(...))`).

Source: Supabase Cron launch post — https://supabase.com/blog/supabase-cron (first-party): built on Citus's `pg_cron`; jobs can run SQL snippets, database functions, webhooks, or Edge Functions; sub-minute syntax; dashboard observability of job runs; explicitly lists "Reporting and analytics: save daily or weekly reports" and "Sending notifications to external systems" as intended use cases.

Pattern for this app (analysis grounded in the above):
1. `pg_cron` job at e.g. 21:00 WAT calls an Edge Function.
2. Edge Function (running with `service_role`, bypassing RLS) aggregates the day's submissions per station: submitted vs missing, totals, variance flags.
3. Sends push via Expo Push API (if Expo) or FCM to the owner's device tokens; e-mail/WhatsApp as later channels.
4. A reciprocal "nag" job notifies managers who have NOT submitted by cutoff.
Corroboration that this is the community-standard shape: r/Supabase thread on cron-driven scheduled notifications (https://www.reddit.com/r/Supabase/comments/1fbfhre/) — cron or table triggers point at an edge function/webhook. (Anecdotal.)

**[GAP: Expo push notification docs not scraped directly this run; Expo Push API capability is well-established but uncited here.]**

---

## 6. Data integrity for financial figures entered by field staff

### Append-only / audit-trail patterns
- https://questdb.com/glossary/append-only-log/ (vendor glossary, factual): append-only logs allow records only to be added, never modified or deleted; they "provide natural audit trails"; financial systems / trade audit trails listed as canonical applications.
- https://www.hubifi.com/blog/immutable-audit-log-basics (vendor guide, scraped in full; medium quality, thorough): the accountant's-ledger model — new lines can be added but existing entries are locked and cannot be modified; build via append-only tables + write-once storage + digital signatures/hash sealing; strict access controls on the log itself; the immutable log becomes the single source of truth in disputes; blockchain is unnecessary for a single-authority business.
- https://blog.whiteprompt.com/immutable-audit-logs-with-amazon-quantum-ledger-database-ac8868f9e236 — journal-first design: every change goes through an append-only journal; each transaction is SHA-256-hashed and chained to the previous (Merkle tree) so any record can later be verified as unaltered; also notes custom audit tables in relational DBs are "error-prone since relational databases are not inherently immutable" — i.e. enforce append-only with grants/policies/triggers, not convention. (QLDB the product has since been deprecated by AWS — use the pattern, not the product. **[UNCERTAIN: deprecation from prior knowledge, not scraped.]**)

Practical translation for this app (analysis): submissions table is INSERT-only for managers (RLS: simply define no UPDATE/DELETE policies for the manager role). Corrections are new rows (`supersedes_id` referencing the original), so the owner always sees the full edit history: who, what, when, old vs new value. Optional hash-chain per station-day for tamper evidence.

### Photo evidence + geotagged/timestamped submissions
- Timemark (field photo-proof app, App Store listing — https://apps.apple.com/us/app/timemark-photo-proof-for-work/id6446071834): the commercial feature bar for field photo proof is "network-verified timestamps that can't be faked by changing device settings," GPS coordinates + street address stamped on every photo, unique photo codes linking each photo to its original metadata, anti-tamper protection; positioned around dispute resolution and fraud reduction; claims millions of field users. (Marketing copy, but establishes the accepted feature bar.)
- https://photoidapp.net/best-timestamped-photo-app-for-field-pros/ — verifiable timestamps with embedded GPS recorded at the moment of capture, framed explicitly as fraud prevention.
- https://www.fulcrumapp.com/blog/best-practices-for-creating-mobile-apps-for-data-collection/ — general field-data-collection best-practice framing (accuracy, data quality). **[Not scraped in full.]**

Implication (analysis): capture pump/totalizer and dip-stick photos in-app via camera only (no gallery uploads), store server-received-at time alongside device time, record GPS at capture, and flag submissions captured far from the station's known coordinates. Treat server time as authoritative because device clocks are user-settable.

### Domain baseline: what the daily figures actually are
Source: https://petrolbunksoftware.com/blog/daily-fuel-reconciliation-guide (fuel-retail software vendor; domain-credible). Scraped in full. Daily reconciliation process: (1) record opening stock per tank, (2) add fuel deliveries, (3) track sales from dispensers/POS, (4) measure physical stock via dip readings, (5) expected stock = opening + deliveries − sales, (6) variance = expected − actual dip. Small variances are normal (temperature, evaporation); persistent variance signals leakage, meter error, or theft. Challenges named: manual entry errors, delayed data, cash-vs-fuel mismatches. Technology value: real-time stock/sales tracking, automatic variance alerts, error-free daily reports.

This defines the app's core daily form: per-product opening dip, deliveries, pump/nozzle meter readings (open/close), closing dip, and cash/POS/credit split — with variance computed server-side, never entered by the manager.

---

## 7. Nigerian payments/POS ecosystem (future integration context only)

- Paystack Terminal — https://paystack.com/docs/terminal/ (first-party docs, scraped): developer platform for in-person payments; payment-intents API; official guides for building Terminal apps with **both React Native and Flutter**; Virtual Terminal option; OSS demos at github.com/PaystackOSS. The most developer-friendly documented entry point for a later "record POS payment against today's sales" reconciliation feature.
- Paystack × OPay interop — https://paystack.com/blog/product/pay-with-opay (first-party): Paystack merchants in Nigeria can accept payments from over 40 million OPay users — checkout-level interop already exists between major players.
- CBN license upgrades for OPay and Moniepoint were reported (Africa Fintech Summit Facebook post — social-media source, **[UNCERTAIN, verify]**), consistent with both operating huge agent/POS networks. Public developer APIs from Moniepoint/OPay for pulling transaction data were not located this run — their developer documentation appears much thinner than Paystack's. **[GAP]**
- Relevant risk already documented in §1: tower outages halt PoS terminals immediately — any future POS-linked reconciliation must tolerate delayed settlement data.

---

## 8. Synthesis: recommended architecture shape (evidence-backed)

1. **Offline-first is non-negotiable** (§1): local SQLite store of truth, write-ahead submission queue, background drain with exponential backoff, visible pending/synced state per submission.
2. **Stack**: Expo/React Native + Supabase fits a small JS-capable team best (RN for JS skills per §3 decision matrix; Supabase because RLS (§4) + pg_cron/Edge Functions (§5) + Postgres reporting cover the owner dashboard and digest natively). Flutter + Firebase is a legitimate alternative if the team knows Dart or wants Firestore's built-in offline cache; the evidence does not crown a universal winner.
3. **Data model**: org → stations → memberships(role); INSERT-only submissions with supersede-style corrections; server-computed variance (§6); indexes on all RLS policy columns and `(select auth.uid())` wrapping (§4).
4. **Trust layer**: in-app camera-only photo evidence, GPS + device time + server time on every submission; distance-from-station flagging (§6).
5. **Digest**: pg_cron → Edge Function (service_role) → Expo push/FCM to the owner at end of day, plus non-submission nags to managers (§5).
6. **Payments**: model a `payments.source` enum now; integrate Paystack Terminal later — it has first-party RN and Flutter guides (§7).

## Source quality summary

| Tier | Sources |
|---|---|
| First-party / authoritative | developer.android.com, supabase.com docs + blog, paystack.com docs + blog |
| High-quality practitioner | makerkit.dev RLS guide, powersync.com DB comparison (vendor bias noted), dev.to LockIn RLS walkthrough |
| Domain/vendor (verify numbers) | wise-hustlers.com Nigeria article (relays NCC/GSMA via press), petrolbunksoftware.com, hubifi.com, questdb.com, whiteprompt QLDB post, Timemark App Store listing |
| Anecdotal / weak | Reddit threads, pkgpulse aggregator; Facebook/Instagram search results were discarded |

Open gaps flagged for follow-up: primary NCC statistics page; Expo push docs; Moniepoint/OPay developer API availability; hard data on the Nigerian dev community's RN-vs-Flutter split.
