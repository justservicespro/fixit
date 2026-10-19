/* FixIt Abuja - technician directory (find-artisan.html)
 * Premium skills  -> booked through FixIt (no individual listings, ever)
 * General/Auto    -> searchable listings, contact artisan directly by call / WhatsApp
 */
(function () {
  'use strict';

  var SK = window.FIXIT_SKILLS || { tiers: [] };
  var SITE = 'https://fixit.justservices.pro';
  var TERMS = SITE + '/terms.html';
  var WA_NUMBER = '2348079926755';
  var PAGE_SIZE = 12;
  var AREAS = ['Abaji', 'Apo', 'Asokoro', 'Bwari', 'Dei-Dei', 'Durumi', 'Dutse', 'Galadimawa', 'Garki', 'Guzape', 'Gwagwalada', 'Gwarinpa', 'Idu', 'Jabi', 'Jahi', 'Kado', 'Karmo', 'Karu', 'Katampe', 'Kuje', 'Kubwa', 'Kwali', 'Life Camp', 'Lokogoma', 'Lugbe', 'Mabushi', 'Maitama', 'Mpape', 'Nyanya', 'Utako', 'Wuse', 'Wuye'];
  var SYN = {
    ac: ['air conditioning', 'air conditioner'], aircon: ['air conditioning'], gen: ['generator'], genset: ['generator'],
    phone: ['mobile phone'], iphone: ['mobile phone'], android: ['mobile'], laptop: ['computer'], pc: ['computer'],
    tv: ['television'], fridge: ['refrigerator', 'refrigeration'], freezer: ['refrigerator'], cctv: ['surveillance', 'cctv'],
    camera: ['surveillance'], car: ['auto', 'vehicle'], mechanic: ['mechanic', 'automotive'], plumber: ['plumber', 'plumbing'],
    pipe: ['plumbing', 'pipe'], electrician: ['electrician', 'electrical'], wiring: ['wiring', 'electrical'], tyre: ['tyre'],
    tire: ['tyre'], welder: ['welder', 'welding'], carpenter: ['carpenter', 'furniture'], painter: ['painter', 'painting'],
    lift: ['elevator', 'lift'], solar: ['solar'], inverter: ['inverter'], borehole: ['borehole', 'water pump'],
    wifi: ['networking'], network: ['networking'], pos: ['pos', 'payment terminal'], gate: ['gate'], lock: ['locksmith']
  };

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- taxonomy indexes ---------- */
  var skillById = {}, skillTier = {}, skillGroup = {}, tierById = {}, groupById = {};
  SK.tiers.forEach(function (t) {
    tierById[t.id] = t;
    t.groups.forEach(function (g) {
      groupById[g.id] = g;
      g.skills.forEach(function (s) {
        skillById[s.id] = s; skillTier[s.id] = t.id; skillGroup[s.id] = g.id;
        s._hay = (s.name + ' ' + g.name + ' ' + t.name).toLowerCase();
      });
    });
  });
  function tierSkillIds(tid) {
    var out = [];
    (tierById[tid] ? tierById[tid].groups : []).forEach(function (g) { g.skills.forEach(function (s) { out.push(s.id); }); });
    return out;
  }
  function groupSkillIds(gid) { return groupById[gid] ? groupById[gid].skills.map(function (s) { return s.id; }) : []; }

  /* ---------- state ---------- */
  var state = { q: '', tier: 'all', group: '', skill: '', area: '', min: '', max: '', verified: false, sort: 'relevance', page: 1 };
  var artisans = [];
  var loaded = false;
  var revealed = {};

  function readUrl() {
    var p = new URLSearchParams(location.search);
    state.q = (p.get('q') || '').slice(0, 80);
    state.tier = ['premium', 'general', 'automotive'].indexOf(p.get('tier')) > -1 ? p.get('tier') : 'all';
    state.group = groupById[p.get('group')] ? p.get('group') : '';
    state.skill = skillById[p.get('skill')] ? p.get('skill') : '';
    state.area = AREAS.indexOf(p.get('area')) > -1 ? p.get('area') : '';
    state.min = /^\d+$/.test(p.get('min') || '') ? p.get('min') : '';
    state.max = /^\d+$/.test(p.get('max') || '') ? p.get('max') : '';
    state.verified = p.get('verified') === '1';
    state.sort = ['fee-asc', 'fee-desc', 'exp', 'new'].indexOf(p.get('sort')) > -1 ? p.get('sort') : 'relevance';
    if (state.group && state.tier === 'all') state.tier = state.group.split('-')[0];
  }
  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.tier !== 'all') p.set('tier', state.tier);
    if (state.group) p.set('group', state.group);
    if (state.skill) p.set('skill', state.skill);
    if (state.area) p.set('area', state.area);
    if (state.min) p.set('min', state.min);
    if (state.max) p.set('max', state.max);
    if (state.verified) p.set('verified', '1');
    if (state.sort !== 'relevance') p.set('sort', state.sort);
    var qs = p.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* ignore */ }
  }

  /* ---------- search ---------- */
  function tokens(q) {
    return String(q || '').toLowerCase().replace(/[^a-z0-9& ]+/g, ' ').split(/\s+/).filter(Boolean);
  }
  function skillMatches(s, toks) {
    return toks.every(function (t) {
      if (s._hay.indexOf(t) > -1) return true;
      var syn = SYN[t];
      return !!syn && syn.some(function (x) { return s._hay.indexOf(x) > -1; });
    });
  }
  function skillsMatching(q) {
    var toks = tokens(q);
    if (!toks.length) return [];
    var out = [];
    Object.keys(skillById).forEach(function (id) {
      var s = skillById[id];
      if (skillMatches(s, toks)) {
        var n = s.name.toLowerCase();
        out.push({ s: s, score: (n.indexOf(toks[0]) === 0 ? 0 : n.indexOf(toks[0]) > -1 ? 1 : 2) });
      }
    });
    out.sort(function (a, b) { return a.score - b.score || a.s.name.length - b.s.name.length; });
    return out.map(function (o) { return o.s; });
  }

  /* constraint = Set-like object of skill ids, or null when unconstrained */
  function constraint() {
    var c = null;
    function narrow(ids) {
      var set = {}; ids.forEach(function (i) { set[i] = true; });
      if (c === null) { c = set; return; }
      Object.keys(c).forEach(function (k) { if (!set[k]) delete c[k]; });
    }
    if (state.skill) narrow([state.skill]);
    else if (state.q) narrow(skillsMatching(state.q).map(function (s) { return s.id; }));
    if (state.group) narrow(groupSkillIds(state.group));
    if (state.tier !== 'all') narrow(tierSkillIds(state.tier));
    return c;
  }

  function feeRange(a) {
    var f = a.feeFrom, t = a.feeTo;
    if (!f && !t) return null;
    return { from: f || t, to: t || f };
  }
  function expYears(a) {
    var y = String(a.years || '');
    if (/10\+/.test(y)) return 10;
    if (/5\s*[–-]\s*10/.test(y)) return 7;
    if (/3\s*[–-]\s*5/.test(y)) return 4;
    if (/1\s*[–-]\s*3/.test(y)) return 2;
    return y ? 0.5 : 0;
  }
  function filterArtisans(c) {
    var min = state.min ? Number(state.min) : null, max = state.max ? Number(state.max) : null;
    var list = artisans.filter(function (a) {
      if (c !== null && !a.skills.some(function (id) { return c[id]; })) return false;
      if (state.area) {
        var inArea = a.area === state.area || (a.areasServed || []).indexOf(state.area) > -1 || (a.areasServed || []).indexOf('Anywhere in Abuja') > -1;
        if (!inArea) return false;
      }
      if (state.verified && !a.verified) return false;
      if (min !== null || max !== null) {
        var r = feeRange(a);
        if (!r) return false;
        if (min !== null && r.to < min) return false;
        if (max !== null && r.from > max) return false;
      }
      return true;
    });
    var s = state.sort;
    if (s === 'fee-asc') list.sort(function (a, b) { return ((feeRange(a) || { from: 1e12 }).from) - ((feeRange(b) || { from: 1e12 }).from); });
    else if (s === 'fee-desc') list.sort(function (a, b) { return ((feeRange(b) || { to: 0 }).to) - ((feeRange(a) || { to: 0 }).to); });
    else if (s === 'exp') list.sort(function (a, b) { return expYears(b) - expYears(a); });
    else if (s === 'new') list.sort(function (a, b) { return String(b.joined).localeCompare(String(a.joined)); });
    return list;
  }

  /* ---------- formatting ---------- */
  function naira(n) { return '\u20A6' + Number(n).toLocaleString('en-NG'); }
  var BASIS = { job: 'per job', hour: 'per hour', day: 'per day', callout: 'call-out fee', negotiable: 'negotiable' };
  function feeHtml(a) {
    var r = feeRange(a);
    if (!r) return '<div class="fee">Fee on request</div>';
    var amt = r.from === r.to ? naira(r.from) : naira(r.from) + ' \u2013 ' + naira(r.to);
    return '<div class="fee">' + amt + '<small>' + esc(BASIS[a.feeBasis] || 'per job') + '</small></div>';
  }
  function initials(name) {
    var p = String(name || '?').trim().split(/\s+/);
    return ((p[0] || '?').charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : '')).toUpperCase().replace('.', '');
  }
  function primarySkill(a, c) {
    var pick = a.skills.filter(function (id) { return c && c[id]; })[0] || a.skills[0];
    return skillById[pick];
  }
  function waLink(a, skillName) {
    var first = String(a.name).split(' ')[0];
    var where = state.area || 'Abuja';
    var text = 'Hi ' + first + ', I got your contact from FixIt Abuja (' + SITE + ').\n' +
      'I need ' + skillName + ' in ' + where + '.\n\n' +
      "I agree to FixIt Abuja's Terms & Conditions: " + TERMS;
    return 'https://wa.me/' + a.whatsapp + '?text=' + encodeURIComponent(text);
  }
  function track(action, a, skillName) {
    try {
      if (typeof FIXIT_SHEETS_ENDPOINT === 'undefined' || String(FIXIT_SHEETS_ENDPOINT).indexOf('PASTE_YOUR') === 0) return;
      var payload = { _sheet: 'DirectoryContacts', 'Listing ID': a ? a.id : '', Skill: skillName || '', Channel: action, Area: state.area || '', Query: state.q || '', Page: location.pathname };
      navigator.sendBeacon(FIXIT_SHEETS_ENDPOINT, new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=UTF-8' }));
    } catch (e) { /* analytics must never break the page */ }
  }

  /* ---------- rendering ---------- */
  function artisanCard(a, c) {
    var sk = primarySkill(a, c);
    var more = a.skills.length > 1 ? '<small>+ ' + (a.skills.length - 1) + ' more skill' + (a.skills.length > 2 ? 's' : '') + '</small>' : '';
    var avatar = a.photo ? '<img src="' + esc(a.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '';
    var meta = [];
    if (a.years) meta.push(esc(a.years) + ' experience');
    if (a.areasServed && a.areasServed.length) meta.push('Serves ' + esc(a.areasServed.slice(0, 3).join(', ')) + (a.areasServed.length > 3 ? '\u2026' : ''));
    var actions = revealed[a.id]
      ? '<a class="btn btn-call" data-act="call" data-id="' + esc(a.id) + '" href="tel:+' + esc(a.phone) + '">Call</a>' +
        '<a class="btn btn-wa" data-act="wa" data-id="' + esc(a.id) + '" target="_blank" rel="noopener" href="' + esc(waLink(a, sk.name)) + '">WhatsApp</a>'
      : '<button type="button" class="btn btn-line" data-act="reveal" data-id="' + esc(a.id) + '">Show contact</button>';
    return '<article class="acard" data-card="' + esc(a.id) + '">' +
      '<div class="ahead"><div class="avatar" aria-hidden="true">' + avatar + '<span>' + esc(initials(a.name)) + '</span></div>' +
      '<div><h3>' + esc(a.name) + (a.verified ? '<span class="vbadge" title="Identity and skills checked by FixIt Abuja">\u2713 Verified</span>' : '') + '</h3>' +
      '<div class="where">' + esc(a.area || 'Abuja') + '</div></div></div>' +
      '<div class="askill">' + esc(sk.name) + more + '</div>' +
      feeHtml(a) +
      (a.bio ? '<p class="abio">' + esc(a.bio) + '</p>' : '') +
      (meta.length ? '<div class="ameta"><span>' + meta.join('</span><span>') + '</span></div>' : '') +
      '<div class="ctas">' + actions + '</div>' +
      (revealed[a.id] ? '<p class="mention">Tell them you found them on FixIt Abuja. By contacting, you agree to our <a href="/terms.html" target="_blank" rel="noopener" style="text-decoration:underline">Terms</a>.</p>' : '') +
      '</article>';
  }

  function premiumGroupsHtml(onlyIds) {
    var html = '';
    tierById.premium.groups.forEach(function (g) {
      var rows = g.skills.filter(function (s) { return !onlyIds || onlyIds[s.id]; });
      if (!rows.length) return;
      html += '<div class="pgroup"><h3>' + esc(g.name) + '</h3>' + rows.map(function (s) {
        return '<div class="prow"><span>' + esc(s.name) + '</span><button type="button" class="btn btn-amber" data-act="book" data-skill="' + esc(s.id) + '">Book</button></div>';
      }).join('') + '</div>';
    });
    return html;
  }
  function premiumNote() {
    return '<div class="premium-note"><span class="tag tag-premium">Premium</span><h2>Booked directly through FixIt Abuja</h2>' +
      '<p>Industrial, commercial and specialised jobs are handled by our own verified artisans. Tell us what you need and where, and we assess, quote, dispatch and stand behind the work. Individual artisans are not listed for these services.</p></div>';
  }
  function emptyHtml(c) {
    var ts = state.tier === 'automotive' ? 'a mechanic' : 'a technician';
    return '<div class="empty"><h3>No listed technicians match yet</h3>' +
      '<p>We\u2019re growing the directory every week. Tell FixIt what you need and we\u2019ll send a verified ' + ts + ' to you, or list your own skill and be found first.</p>' +
      '<div class="row"><button type="button" class="btn btn-amber" data-act="book-general">Book through FixIt</button>' +
      '<a class="btn btn-line" href="/technicians.html#apply">List your skill (free)</a></div></div>';
  }
  function skeletons() { var h = ''; for (var i = 0; i < 6; i++) h += '<div class="skel"></div>'; return '<div class="res-grid">' + h + '</div>'; }

  function renderResults() {
    var box = $('results');
    if (!loaded) { box.innerHTML = skeletons(); return; }
    var c = constraint();
    var constrained = c !== null;
    var html = '', total = 0, label = '';

    if (state.tier === 'premium') {
      var ids = null;
      if (constrained) ids = c;
      var any = Object.keys(constrained ? c : skillById).filter(function (id) { return skillTier[id] === 'premium'; }).length;
      html = premiumNote() + (any ? '<div class="pgroups">' + premiumGroupsHtml(ids) + '</div>'
        : '<div class="empty"><h3>No premium service matches that search</h3><p>Describe the job and we\u2019ll find the right specialist.</p><div class="row"><button type="button" class="btn btn-amber" data-act="book-general">Book through FixIt</button></div></div>');
      total = any; label = 'premium service' + (any === 1 ? '' : 's');
    } else {
      var list = filterArtisans(c);
      var premiumHits = [];
      if (state.tier === 'all' && constrained) {
        Object.keys(c).forEach(function (id) { if (skillTier[id] === 'premium') premiumHits.push(id); });
      }
      if (premiumHits.length) {
        var set = {}; premiumHits.forEach(function (i) { set[i] = true; });
        html += '<h2 class="sect-title">Premium services <span class="tag tag-premium">Book via FixIt</span></h2><div class="pgroups">' + premiumGroupsHtml(set) + '</div>';
      }
      if (list.length) {
        if (premiumHits.length) html += '<h2 class="sect-title">Listed technicians</h2>';
        var shown = list.slice(0, state.page * PAGE_SIZE);
        html += '<div class="res-grid">' + shown.map(function (a) { return artisanCard(a, c); }).join('') + '</div>';
        if (shown.length < list.length) html += '<div class="more-wrap"><button type="button" class="btn btn-line" data-act="more">Show more (' + (list.length - shown.length) + ' left)</button></div>';
      } else if (!premiumHits.length) {
        html += emptyHtml(c);
      }
      total = list.length; label = 'technician' + (list.length === 1 ? '' : 's');
    }
    box.innerHTML = html;
    $('count').innerHTML = '<b>' + total + '</b> ' + label + ' <small>' + describeScope() + '</small>';
    $('toolbarSort').style.display = state.tier === 'premium' ? 'none' : '';
  }
  function describeScope() {
    var bits = [];
    if (state.tier !== 'all') bits.push(tierById[state.tier].name);
    if (state.group) bits.push(groupById[state.group].name);
    if (state.area) bits.push('in ' + state.area);
    return bits.length ? '\u2022 ' + esc(bits.join(' \u2022 ')) : '';
  }

  function renderChips() {
    var chips = [];
    if (state.q) chips.push(['q', 'Search', state.q]);
    if (state.skill) chips.push(['skill', 'Skill', skillById[state.skill].name]);
    if (state.tier !== 'all') chips.push(['tier', 'Category', tierById[state.tier].name]);
    if (state.group) chips.push(['group', 'Group', groupById[state.group].name]);
    if (state.area) chips.push(['area', 'Area', state.area]);
    if (state.min || state.max) chips.push(['fee', 'Fee', (state.min ? naira(state.min) : '\u20A60') + ' \u2013 ' + (state.max ? naira(state.max) : 'any')]);
    if (state.verified) chips.push(['verified', 'Only', 'Verified']);
    $('activeChips').innerHTML = chips.map(function (c) {
      return '<button type="button" class="achip" data-clear="' + c[0] + '"><b>' + esc(c[1]) + ':</b> ' + esc(c[2]) + ' \u2715</button>';
    }).join('');
  }

  function renderTiers() {
    $('tiers').innerHTML = SK.tiers.map(function (t) {
      var n = tierSkillIds(t.id).length;
      var meta = t.mode === 'book' ? n + ' services \u2022 booked via FixIt' : n + ' skills \u2022 contact directly';
      return '<button type="button" class="tier' + (state.tier === t.id ? ' on' : '') + '" data-tier="' + t.id + '">' +
        '<span class="tag tag-' + t.id + '">' + (t.mode === 'book' ? 'Book via FixIt' : 'Direct contact') + '</span>' +
        '<h3>' + esc(t.name) + '</h3><p>' + esc(t.blurb) + '</p><span class="meta">' + esc(meta) + '</span></button>';
    }).join('');
  }

  function renderTree() {
    var html = '<button type="button" class="cat' + (state.tier === 'all' && !state.group ? ' on' : '') + '" data-tier="all">All categories</button>';
    SK.tiers.forEach(function (t) {
      var open = state.tier === t.id ? ' open' : '';
      html += '<details' + open + '><summary>' + esc(t.name) + '</summary>' +
        '<button type="button" class="cat' + (state.tier === t.id && !state.group ? ' on' : '') + '" data-tier="' + t.id + '">All ' + esc(t.name.toLowerCase()) + '</button>' +
        t.groups.map(function (g) {
          return '<button type="button" class="cat' + (state.group === g.id ? ' on' : '') + '" data-group="' + g.id + '">' + esc(g.name) + '</button>';
        }).join('') + '</details>';
    });
    $('catTree').innerHTML = html;
  }

  function syncControls() {
    $('q').value = state.q;
    $('area').value = state.area;
    $('fArea').value = state.area;
    $('fMin').value = state.min;
    $('fMax').value = state.max;
    $('fVerified').checked = state.verified;
    $('sort').value = state.sort;
    document.querySelectorAll('.band').forEach(function (b) {
      b.classList.toggle('on', (b.getAttribute('data-min') || '') === state.min && (b.getAttribute('data-max') || '') === state.max && (state.min || state.max));
    });
  }

  function render() {
    renderTiers(); renderTree(); renderChips(); renderResults(); syncControls(); writeUrl();
  }

  /* ---------- actions ---------- */
  function setState(patch, keepPage) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    if (!keepPage) state.page = 1;
    render();
  }
  function search() {
    var q = $('q').value.trim();
    setState({ q: q, skill: '', area: $('area').value });
    hideSuggest();
    var el = $('dirMain'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function clearFilter(key) {
    var patch = {};
    if (key === 'q') { patch.q = ''; patch.skill = ''; }
    else if (key === 'skill') patch.skill = '';
    else if (key === 'tier') { patch.tier = 'all'; patch.group = ''; }
    else if (key === 'group') patch.group = '';
    else if (key === 'area') patch.area = '';
    else if (key === 'fee') { patch.min = ''; patch.max = ''; }
    else if (key === 'verified') patch.verified = false;
    setState(patch);
  }
  function resetAll() { setState({ q: '', tier: 'all', group: '', skill: '', area: '', min: '', max: '', verified: false, sort: 'relevance' }); }

  /* suggestions */
  var suggestIdx = -1;
  function showSuggest() {
    var q = $('q').value.trim();
    var box = $('suggest');
    if (q.length < 2) { hideSuggest(); return; }
    var hits = skillsMatching(q).slice(0, 7);
    if (!hits.length) { hideSuggest(); return; }
    suggestIdx = -1;
    box.innerHTML = hits.map(function (s) {
      var t = skillTier[s.id];
      return '<button type="button" data-suggest="' + s.id + '"><span>' + esc(s.name) + '</span><span class="tag tag-' + t + '">' + esc(tierById[t].mode === 'book' ? 'Premium' : tierById[t].name.split(' ')[0]) + '</span></button>';
    }).join('');
    box.hidden = false;
  }
  function hideSuggest() { var b = $('suggest'); b.hidden = true; b.innerHTML = ''; }

  /* premium booking modal */
  var booking = { skill: '' };
  function openBook(skillId) {
    booking.skill = skillId ? skillById[skillId].name : '';
    $('bkSkill').textContent = booking.skill || 'a technician';
    $('bkDesc').value = ''; $('bkLoc').value = state.area || '';
    $('bookModal').classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('bkDesc').focus(); }, 40);
  }
  function closeBook() { $('bookModal').classList.remove('show'); document.body.style.overflow = ''; }
  function submitBook(e) {
    e.preventDefault();
    var desc = $('bkDesc').value.trim(), loc = $('bkLoc').value.trim();
    if (!desc || !loc) return;
    var isPremium = booking.skill && skillTier[Object.keys(skillById).filter(function (i) { return skillById[i].name === booking.skill; })[0]] === 'premium';
    var msg = 'Hi, I need ' + (booking.skill || 'a technician') + (isPremium ? ' (premium service)' : '') + ' in Abuja' +
      '\n\nDescription of issue: ' + desc + '\nLocation: ' + loc +
      "\n\nI agree to FixIt Abuja's Terms & Conditions: " + TERMS;
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    closeBook();
  }

  function findArtisan(id) { for (var i = 0; i < artisans.length; i++) if (artisans[i].id === id) return artisans[i]; return null; }

  function onResultsClick(e) {
    var t = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    var a = findArtisan(t.getAttribute('data-id'));
    var c = constraint();
    if (act === 'reveal' && a) {
      revealed[a.id] = true; track('reveal', a, primarySkill(a, c).name); renderResults();
      var card = document.querySelector('[data-card="' + a.id + '"]'); if (card) { var b = card.querySelector('.ctas a'); if (b) b.focus(); }
    } else if ((act === 'call' || act === 'wa') && a) {
      track(act === 'call' ? 'call' : 'whatsapp', a, primarySkill(a, c).name);
    } else if (act === 'book') { openBook(t.getAttribute('data-skill')); }
    else if (act === 'book-general') { openBook(state.skill || ''); }
    else if (act === 'more') { state.page += 1; renderResults(); }
  }

  /* ---------- data ---------- */
  function fetchJson(url) {
    return fetch(url, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(function () { return null; });
  }
  function cleanArtisan(a) {
    if (!a || !a.id || !a.phone) return null;
    var skills = (a.skills || []).filter(function (id) { return skillById[id] && skillTier[id] !== 'premium'; });
    if (!skills.length) return null; // premium artisans are never listed
    a.skills = skills; a.whatsapp = a.whatsapp || a.phone;
    a.feeFrom = a.feeFrom || null; a.feeTo = a.feeTo || null; a.areasServed = a.areasServed || [];
    return a;
  }
  function load() {
    return Promise.all([fetchJson('/api/artisans'), fetchJson('/artisans-data.json')]).then(function (res) {
      var seen = {}, out = [];
      [res[0], res[1]].forEach(function (r) {
        ((r && r.artisans) || []).forEach(function (a) {
          a = cleanArtisan(a);
          if (a && !seen[a.id]) { seen[a.id] = 1; out.push(a); }
        });
      });
      artisans = out; loaded = true;
    });
  }

  /* ---------- wiring ---------- */
  function init() {
    if (!$('results')) return;
    $('area').innerHTML = '<option value="">All of Abuja</option>' + AREAS.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('');
    $('fArea').innerHTML = $('area').innerHTML;
    readUrl(); render();

    $('searchForm').addEventListener('submit', function (e) { e.preventDefault(); search(); });
    $('q').addEventListener('input', showSuggest);
    $('q').addEventListener('keydown', function (e) {
      var box = $('suggest'); var items = box.querySelectorAll('button');
      if (box.hidden || !items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        suggestIdx = (suggestIdx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach(function (b, i) { b.classList.toggle('on', i === suggestIdx); });
      } else if (e.key === 'Enter' && suggestIdx > -1) { e.preventDefault(); items[suggestIdx].click(); }
      else if (e.key === 'Escape') hideSuggest();
    });
    $('suggest').addEventListener('click', function (e) {
      var b = e.target.closest('[data-suggest]'); if (!b) return;
      var s = skillById[b.getAttribute('data-suggest')];
      $('q').value = s.name;
      setState({ q: s.name, skill: s.id, area: $('area').value, tier: 'all', group: '' }); hideSuggest();
      $('dirMain').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.searchbar')) hideSuggest(); });

    document.querySelectorAll('.pchip').forEach(function (b) {
      b.addEventListener('click', function () { $('q').value = b.getAttribute('data-q'); search(); });
    });
    document.body.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tier]');
      if (t && !t.closest('#results')) { setState({ tier: t.getAttribute('data-tier'), group: '', skill: '' }); closeSheet(); if (t.classList.contains('tier')) $('dirMain').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      var g = e.target.closest('[data-group]');
      if (g) { var gid = g.getAttribute('data-group'); setState({ tier: gid.split('-')[0], group: gid, skill: '' }); closeSheet(); return; }
      var c = e.target.closest('[data-clear]');
      if (c) clearFilter(c.getAttribute('data-clear'));
    });
    $('results').addEventListener('click', onResultsClick);

    $('fArea').addEventListener('change', function () { setState({ area: this.value }); });
    $('area').addEventListener('change', function () { state.area = this.value; });
    $('fMin').addEventListener('change', function () { setState({ min: this.value.replace(/\D/g, '') }); });
    $('fMax').addEventListener('change', function () { setState({ max: this.value.replace(/\D/g, '') }); });
    $('fVerified').addEventListener('change', function () { setState({ verified: this.checked }); });
    $('sort').addEventListener('change', function () { setState({ sort: this.value }); });
    document.querySelectorAll('.band').forEach(function (b) {
      b.addEventListener('click', function () { setState({ min: b.getAttribute('data-min') || '', max: b.getAttribute('data-max') || '' }); });
    });
    $('fReset').addEventListener('click', function () { resetAll(); closeSheet(); });
    $('openFilters').addEventListener('click', function () { $('filters').classList.add('open'); $('sheetBd').classList.add('show'); });
    $('sheetBd').addEventListener('click', closeSheet);
    $('closeFilters').addEventListener('click', closeSheet);
    function closeSheet() { $('filters').classList.remove('open'); $('sheetBd').classList.remove('show'); }

    $('bookForm').addEventListener('submit', submitBook);
    $('bookModal').addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeBook(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeBook(); closeSheet(); } });

    load().then(function () { renderResults(); renderChips(); });
  }

  window.FixItDirectory = { state: state, skillsMatching: skillsMatching, init: init, _setArtisans: function (a) { artisans = a.map(cleanArtisan).filter(Boolean); loaded = true; render(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
