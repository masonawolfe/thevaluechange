# Next Actions

_The current task queue. Completed items get checked off or moved to the session log._

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
- [ ] Add `ALPHA_VANTAGE_KEY` and `FMP_API_KEY` to Netlify for live stock/earnings data
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
- [ ] Finnhub news API (free) — replace web search in daily brief agent with structured company news feed
- [ ] Finnhub or Alpha Vantage fundamentals (free tier) — auto-populate KPIs on company profiles
- [ ] Financial Modeling Prep earnings calendar (free tier) — keep earnings dates current automatically
- [ ] Store historical data locally — each week's pull adds to your proprietary dataset

### Step 3: Cross-Company Intelligence (the moat)
- [ ] Build topic-based query layer: "show me all management commentary on GLP-1 across CPG"
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
- [ ] Run full Lighthouse audit and fix any remaining issues
- [ ] Screen reader testing on company profiles and playbook cards
- [ ] Offline/slow connection handling (service worker or loading states)

## Backlog
- [ ] **DISABLE AI chat on company pages** — Claude Code shipped `netlify/functions/chat.js` (Claude Haiku) with live API calls. Mason has NOT reviewed the outputs and it costs money per query. KEEP the code but hide the chat UI from visitors until Mason has tested it, reviewed response quality, and approved. Re-enable in Phase 3 after voice/quality review.
- [ ] **Dark mode redesign** — Synthetic feedback report completed (TVC-Dark-Mode-Feedback-Report.docx). 9/10 personas agreed: green (#4ade80) is too bright, overused, and reads "SaaS" not "editorial." Fix: change accent to warm sage #5ABD66, limit green to interactive elements only, add secondary teal #4A9D83 for sparklines, soften text to #F0F0F0, increase card elevation (#13182b surface + subtle border + shadow), fix logo white box on dark nav. See report for full Tier 1-3 prioritized changes and revised CSS palette.
- [ ] Full live external data feeds (news APIs, real-time earnings — need paid API keys)
- [ ] Performance: code splitting if file size becomes an issue (currently ~260KB)

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
- [x] SEO: Hash-based routing with history.replaceState (Google can index #companies, #playbooks, etc.)
- [x] Accessibility: ARIA roles on nav tabs (tablist/tab pattern), search input, toast, modal
- [x] Accessibility: Keyboard navigation (arrow keys on tabs, Escape closes modals/search)
- [x] Accessibility: Skip-to-content link + focus-visible outlines
- [x] Accessibility: Semantic `<main>` and `<nav>` landmarks
- [x] Error Recovery: Clearbit logo onerror fallback (avatar initials)
- [x] Error Recovery: localStorage quota handling (safeLSSet with eviction)
- [x] Error Recovery: data.json fetch failure graceful fallback
- [x] Error Recovery: AI profile rate limiting (5/10min) + descriptive error messages
