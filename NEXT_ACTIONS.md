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

## QA Polish (Claude Code — Low Priority)
- [ ] Verify color contrast ratios meet WCAG AA in both light and dark modes
- [ ] Run full Lighthouse audit and fix any remaining issues
- [ ] Screen reader testing on company profiles and playbook cards
- [ ] Offline/slow connection handling (service worker or loading states)

## Backlog
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
