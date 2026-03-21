# Next Actions

_The current task queue. Completed items get checked off or moved to the session log._

## CRITICAL: Site Audit Fixes (Claude Code — Do These First)
Full audit conducted March 20. These are blocking credibility.

### P0: Content Freshness (the site looks abandoned)
- [x] **Weekly refresh agent created** (`tvc-weekly-refresh`, Sundays 6 AM CT) — refreshes thisWeekPick, signals, earnings calendar, company updates, trends, transcript quotes. Outputs weekly-draft.json + weekly-refresh-summary.md.
- [x] **Daily brief agent updated** — now also outputs daily-update.json with fresh hero card + signals alongside the LinkedIn brief. Runs daily 5:30 AM CT.
- [x] **First weekly refresh triggered** — running now (Mar 20 midnight). Will output fresh data for Mason to review and push.
- [x] **GitHub Action created** — `.github/workflows/auto-merge-data.yml` auto-merges weekly-draft.json and daily-update.json into data.json on push or manual trigger. Zero CLI steps for Mason.
- [ ] **MASON ACTION: After weekly refresh completes, review weekly-draft.json, run `node merge-draft.js weekly-draft.json`, then push to GitHub.** This will immediately fix the stale PepsiCo hero, the GIS earnings calendar, and the Mar 15 timestamp.
- [ ] **MASON ACTION: Each morning, review daily-update.json alongside the brief. Merge and push to keep the site fresh daily.**

### P0: Disable AI Chat
- [x] **Chat UI hidden** — `display:none` on `.ai-chat` container. Backend code preserved. Re-enable after Mason reviews response quality.

### P1: Dark Mode Redesign
- [x] **Full redesign shipped** per TVC-Dark-Mode-Feedback-Report.docx. Accent #4ade80 → #5ABD66 (warm sage). Secondary teal #4A9D83 for sparklines. Text softened to #F0F0F0/#C4CBD6/#A0A8B8. Surface darkened to #13182b. Card elevation with shadows. OUR READ top-border. Nav shadow restored.

### P1: Company Logos Not Loading
- [x] **Fixed.** Clearbit logo CDN is dead (acquired by HubSpot, DNS no longer resolves). Switched to Google Favicon API (`t1.gstatic.com/faviconV2`). All 10 company logos now loading correctly. Updated preconnect hint.

### P1: AI Search Profile Generation Failing
- [x] **Fixed earlier.** Updated model ID to `claude-sonnet-4-6-20250131`, added multi-env-var fallback (`CLAUDE_API_KEY` / `Anthropic_API_Key` / `ANTHROPIC_API_KEY`), added specific error messages for 401/400/404/422/429.

## PHASE 1: Launch the Brand (This Week — Mason's Tasks)
The product is built. Nothing below is blocked by engineering. These are all Mason actions.
- [ ] Create Substack account for The Value Change (thevaluechange.substack.com)
- [ ] Post the Mondelez brief (v6) as first article
- [ ] Generate DALL-E image for the Mondelez post using the prompt we wrote
- [ ] Share on LinkedIn with the headline we wrote
- [ ] Submit sitemap.xml to Google Search Console (5 min — google.com/webmasters)
- [ ] Send first Monday Morning CPG Brief to 25 CPG contacts
- [ ] Review daily agent briefs each morning, post 3x/week on LinkedIn

## PHASE 2: Build the Habit (Weeks 2-4)
- [ ] Wire thevaluechange.com newsletter form to Substack (or Beehiiv) email list
- [ ] Write first 4 weekly intelligence briefs in Mason's voice
- [ ] Create LinkedIn content calendar: 3 posts/week pulling from app + daily briefs
- [ ] Review and approve first automated weekly data.json refresh (run merge-draft.js, push to GitHub)
- [ ] Finalize logo mark (gear concept — hand-code SVG or pick direction)
- [ ] Update favicon with chosen logo

## PHASE 3: Refine & Grow (Month 2+)
- [ ] Rewrite app content in Mason's voice (replace AI-generated exec summaries, playbooks)
- [ ] Real AI backend for chat (replace demo mode keyword matching with Claude API)
- [ ] Add `ALPHA_VANTAGE_KEY`, `FMP_API_KEY`, and `FINNHUB_API_KEY` to Netlify for live data
- [ ] Feed search trend data back into weekly refresh agent (editorial intelligence loop)
- [ ] Export search trends for Monday brief content

## PHASE 4: Proprietary CPG Intelligence Layer (AlphaSense-Inspired)
Build your own data pipeline from free public sources so you never depend on a $10K/year vendor.
Dual-purpose: powers TVC content engine AND sharpens your Accenture client advisory work.

### Step 1: Earnings Transcript Pipeline (free, no new infrastructure)
- [ ] Add earnings transcript extraction to weekly refresh agent (SEC EDGAR 8-K exhibits contain full transcripts)
- [ ] Agent extracts key quotes by topic: pricing, volume, innovation, M&A, private label, digital/AI
- [ ] Store extracted quotes in structured JSON (by company, topic, quarter) — builds over time
- [ ] After 2-3 quarters: can query "what did every CPG CEO say about pricing this year"

### Step 2: Structured News & Fundamentals (free API tiers)
- [x] **Finnhub news API endpoint built** — `/.netlify/functions/live-data?type=news&ticker=PG` (needs `FINNHUB_API_KEY` env var)
- [x] **FMP fundamentals endpoint built** — `/.netlify/functions/live-data?type=fundamentals&ticker=PG` (needs `FMP_API_KEY` env var)
- [x] **FMP earnings calendar already built** — `/.netlify/functions/live-data?type=earnings&ticker=PG`
- [ ] Add `FINNHUB_API_KEY` to Netlify (free at finnhub.io — Mason action)
- [ ] Store historical data locally — each week's pull adds to your proprietary dataset

### Step 3: Cross-Company Intelligence (the moat)
- [x] **Topic-based transcript query layer built** — `/.netlify/functions/live-data?type=transcripts&topic=pricing&ticker=ALL`. Admin dashboard has topic filter buttons. Data accumulates as weekly agent runs.
- [ ] Sentiment tracking over time: is management tone on pricing shifting from confident to cautious?
- [ ] Competitive cross-reference: when PEP mentions private label pressure, does KO say the same thing?
- [ ] Surface insights the daily brief agent can use: "3 of 10 covered CEOs mentioned tariff risk this quarter — that's a trend worth writing about"

### What this becomes:
- Your briefs get richer because they draw from accumulated data, not single API calls
- Your Accenture advisory work gets sharper — you have proprietary cross-company intelligence at your fingertips
- The "What CPG Professionals Are Watching" section gets smarter (search trends + earnings language shifts)
- Long-term: this dataset IS the product. Nobody else has a structured, topic-indexed CPG earnings knowledge base updated weekly for free

### What you CAN'T replicate (and don't need to):
- AlphaSense's 260K expert call transcripts (proprietary Tegus interviews) — you don't need private interviews to write editorial briefs
- Wall Street equity research from 1,500 brokers — your editorial voice IS the value, not aggregating Goldman's take
- Their finance-specific LLM trained on 450M documents — Claude handles your use case fine
- 10+ years of historical transcripts — you start accumulating now and build forward

## QA Polish (Claude Code — Low Priority)
- [ ] Verify color contrast ratios meet WCAG AA in both light and dark modes
- [ ] Screen reader testing on company profiles and playbook cards
- [ ] Offline/slow connection handling (service worker or loading states)

## Completed
- [x] Sprints 1–18 (full app build through AI generation layer)
- [x] Deploy to thevaluechange.com via GitHub + Netlify
- [x] Custom domain (GoDaddy DNS → Netlify)
- [x] Consulting Funnel: engagement tracking, smart CTA, 4-step intake modal, admin review page (?admin=true)
- [x] Weekly Content Refresh Pipeline: scheduled agent, merge-draft.js, dynamic hero card, test run
- [x] Phase 2: Search-Generated Profiles (search bar, AI generation, caching, editorial badges)
- [x] Phase 3: Community Feedback & Search Intelligence (flagging, search tracking, watching section, spike detection)
- [x] Live SEC EDGAR filings on company profiles (Netlify function)
- [x] Admin dashboard: search intelligence panel, flagged profiles, intake review
- [x] Performance: deferred scripts, preconnect hints
- [x] `ANTHROPIC_API_KEY` added to Netlify dashboard
- [x] Business strategy document + North star vision
- [x] Daily CPG brief agent scheduled (5:30 AM CT daily)
- [x] FIX: AI search profile generation — updated model ID, multi-key fallback, better error messages
- [x] SEO: sitemap.xml + robots.txt
- [x] SEO: JSON-LD structured data (Organization + WebSite schemas)
- [x] SEO: Per-page meta descriptions, titles, canonical URLs, OG tags (dynamic in showPage)
- [x] SEO: Hash-based routing with history.replaceState
- [x] SEO: Semantic headings (h1/h2) for Lighthouse
- [x] Accessibility: ARIA roles on nav tabs (tablist/tab pattern), search input, toast, modal
- [x] Accessibility: Keyboard navigation (arrow keys on tabs, Escape closes modals/search)
- [x] Accessibility: Skip-to-content link + focus-visible outlines
- [x] Accessibility: Semantic `<main>` and `<nav>` landmarks
- [x] Error Recovery: localStorage quota handling (safeLSSet with eviction)
- [x] Error Recovery: data.json fetch failure graceful fallback
- [x] Error Recovery: AI profile rate limiting (5/10min) + descriptive error messages
- [x] Dark mode redesign: warm sage accent, muted teal sparklines, softer text, card elevation
- [x] AI chat UI hidden (display:none) until voice/quality review
- [x] Company logos fixed: Clearbit dead → Google Favicon API
- [x] Finnhub news + FMP fundamentals endpoints in live-data.js
- [x] Cross-company transcript query layer + admin UI
- [x] GitHub Action for auto-merge of data drafts
