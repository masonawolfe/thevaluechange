#!/usr/bin/env node
/**
 * merge-draft.js — Merges weekly-draft.json into data.json
 * Usage: node merge-draft.js [draft-file]
 * Default draft: weekly-draft.json in same directory
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const draftFile = process.argv[2] || 'weekly-draft.json';
const dataPath = path.join(dir, 'data.json');
const draftPath = path.join(dir, draftFile);

if (!fs.existsSync(dataPath)) { console.error('data.json not found'); process.exit(1); }
if (!fs.existsSync(draftPath)) { console.error(`Draft not found: ${draftFile}`); process.exit(1); }

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));

// Backup
fs.writeFileSync(path.join(dir, 'data.json.bak'), JSON.stringify(data, null, 2));
console.log('Backup → data.json.bak');

// Meta
if (draft.meta) {
  if (draft.meta.weekLabel) data.meta.weekLabel = draft.meta.weekLabel;
  if (draft.meta.lastUpdated) data.meta.lastUpdated = draft.meta.lastUpdated;
  if (draft.meta.version) data.meta.version = draft.meta.version;
}

// Company updates
if (draft.companyUpdates) {
  let updated = 0;
  for (const [ticker, update] of Object.entries(draft.companyUpdates)) {
    if (!update.hasUpdate || !data.companies[ticker]) continue;
    const co = data.companies[ticker];
    if (update.headline) co.headline = update.headline;
    if (update.deck) co.deck = update.deck;
    if (update.execSummary && update.execSummary !== 'NO CHANGE') co.execSummary = update.execSummary;
    if (update.mgmtSignals?.length) co.mgmtSignals = update.mgmtSignals;
    if (update.risks?.length) {
      const existing = new Set(co.risks || []);
      co.risks = [...update.risks.filter(r => !existing.has(r)), ...(co.risks || [])].slice(0, 6);
    }
    if (update.opps?.length) {
      const titles = new Set((co.opps || []).map(o => o.title));
      co.opps = [...update.opps.filter(o => !titles.has(o.title)), ...(co.opps || [])].slice(0, 6);
    }
    if (update.news?.length) {
      co.news = update.news.map(n => ({ h: n.title || n.h, s: n.source || n.s, d: n.date || n.d, url: n.url || '' }));
    }
    co.lastUpdated = draft.meta?.lastUpdated || new Date().toISOString().slice(0, 10);
    updated++;
    console.log(`  ✓ ${ticker}`);
  }
  console.log(`${updated} companies updated`);
}

// Earnings
if (draft.earningsUpdates) {
  if (draft.earningsUpdates.reported) data.reported = draft.earningsUpdates.reported;
  if (draft.earningsUpdates.upcoming) data.upcoming = draft.earningsUpdates.upcoming;
  console.log(`Earnings: ${(draft.earningsUpdates.reported||[]).length} reported, ${(draft.earningsUpdates.upcoming||[]).length} upcoming`);
}

// Signals
if (draft.signals) {
  data.signals = draft.signals.map(s => ({ h: s.title || s.h, s: s.source || s.s, d: s.date || s.d, ticker: s.ticker, tags: s.tags || [] }));
  console.log(`${draft.signals.length} signals`);
}

// This week's pick
if (draft.thisWeekPick) {
  data.thisWeekPick = draft.thisWeekPick;
  console.log(`Pick: ${draft.thisWeekPick.ticker}`);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\nDone. data.json updated.');
