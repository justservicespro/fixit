/* FixIt Abuja - skill picker + directory-listing fields for the technician application form.
 * Premium skills  -> private pipeline only (sheet + email), never listed publicly.
 * General/Auto    -> optional public listing (moderated), needs the listing consent tick.
 * Builds four hidden fields the Sheets/email layer already understands:
 *   Areas of Expertise (all names) | Premium Skills | Listing Skills | Listing Skill IDs
 */
(function () {
  'use strict';
  var SK = window.FIXIT_SKILLS, host = document.getElementById('skillPicker');
  if (!SK || !host) return;
  var form = host.closest('form');
  var AREAS = ['Anywhere in Abuja', 'Abaji', 'Apo', 'Asokoro', 'Bwari', 'Dei-Dei', 'Durumi', 'Dutse', 'Galadimawa', 'Garki', 'Guzape', 'Gwagwalada', 'Gwarinpa', 'Idu', 'Jabi', 'Jahi', 'Kado', 'Karmo', 'Karu', 'Katampe', 'Kuje', 'Kubwa', 'Kwali', 'Life Camp', 'Lokogoma', 'Lugbe', 'Mabushi', 'Maitama', 'Mpape', 'Nyanya', 'Utako', 'Wuse', 'Wuye'];
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  var css = document.createElement('style');
  css.textContent =
    '.sp-note{font-size:13px;line-height:1.6;color:var(--text-mute);margin:0 0 10px}' +
    '.sp-search{width:100%;margin-bottom:10px}' +
    '.sp-tier{border:1px solid var(--line-dark);border-radius:6px;margin-bottom:8px;background:#fff}' +
    '.sp-tier>summary{cursor:pointer;padding:12px 14px;font-weight:700;font-size:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}' +
    '.sp-badge{font-family:"Barlow Condensed",sans-serif;letter-spacing:.1em;text-transform:uppercase;font-size:11px;border-radius:3px;padding:2px 7px}' +
    '.sp-b-premium{background:#171A21;color:#FF7A1A}.sp-b-general{background:rgba(18,165,148,.14);color:#0C7E71}.sp-b-automotive{background:rgba(255,122,26,.16);color:#E35F00}' +
    '.sp-group{border-top:1px solid var(--line-dark)}' +
    '.sp-group>summary{cursor:pointer;padding:10px 14px;font-size:13.5px;font-weight:600;display:flex;justify-content:space-between;gap:8px}' +
    '.sp-skills{padding:2px 14px 12px;display:grid;grid-template-columns:repeat(2,1fr);gap:6px 14px}' +
    '.sp-skill{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.35;cursor:pointer}' +
    '.sp-skill input{width:16px;height:16px;margin-top:1px;accent-color:#0C7E71;flex-shrink:0}' +
    '.sp-summary{font-size:13px;margin:10px 0 0;color:var(--ink);line-height:1.6}' +
    '.sp-premium-note{background:#171A21;color:#F6F2E9;border-left:4px solid #FF7A1A;border-radius:6px;padding:12px 14px;font-size:13px;line-height:1.6;margin-top:10px}' +
    '.sp-listing{margin-top:14px;border:1px solid rgba(18,165,148,.4);background:rgba(18,165,148,.06);border-radius:6px;padding:16px}' +
    '.sp-listing h4{margin:0 0 4px;font-family:"Archivo Black",sans-serif;font-size:15px}' +
    '.sp-listing .sp-note{margin-bottom:12px}' +
    '.sp-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}' +
    '.sp-areas{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}' +
    '.sp-areas label{border:1px solid var(--line-dark);background:#fff;border-radius:999px;padding:5px 11px;font-size:12.5px;cursor:pointer;display:flex;gap:6px;align-items:center}' +
    '.sp-error{color:#B23A17;font-size:13px;font-weight:700;margin-top:8px}' +
    '@media(max-width:640px){.sp-skills{grid-template-columns:1fr}.sp-row{grid-template-columns:1fr}}';
  document.head.appendChild(css);

  var html = '<label style="display:block;margin-bottom:6px;">Skills &amp; Services You Offer</label>' +
    '<p class="sp-note">Tick every skill you can do. <b>Premium</b> skills are booked through FixIt only and are <b>never listed publicly</b>. <b>General</b> and <b>Automotive</b> skills can also appear in the public directory so customers can call or WhatsApp you directly.</p>' +
    '<input class="sp-search" id="spSearch" type="search" placeholder="Search skills, e.g. plumber, CCTV, forklift" autocomplete="off">';
  SK.tiers.forEach(function (t) {
    var n = t.groups.reduce(function (a, g) { return a + g.skills.length; }, 0);
    html += '<details class="sp-tier"' + (t.id === 'general' ? ' open' : '') + ' data-tier="' + t.id + '"><summary><span class="sp-badge sp-b-' + t.id + '">' + (t.mode === 'book' ? 'Not listed publicly' : 'Can be listed') + '</span>' + esc(t.name) + ' <span style="font-weight:400;color:var(--text-mute)">(' + n + ')</span></summary>';
    t.groups.forEach(function (g) {
      html += '<details class="sp-group"><summary><span>' + esc(g.name) + '</span><span class="sp-gcount" style="font-weight:400;color:var(--text-mute)"></span></summary><div class="sp-skills">' +
        g.skills.map(function (s) {
          return '<label class="sp-skill" data-hay="' + esc((s.name + ' ' + g.name).toLowerCase()) + '"><input type="checkbox" class="sp-cb" value="' + s.id + '" data-name="' + esc(s.name) + '" data-tier="' + t.id + '"> <span>' + esc(s.name) + '</span></label>';
        }).join('') + '</div></details>';
    });
    html += '</details>';
  });
  html += '<div class="sp-summary" id="spSummary">No skills selected yet.</div><div class="sp-error" id="spError" hidden>Please select at least one skill.</div>' +
    '<div class="sp-premium-note" id="spPremium" hidden><b>Premium skills selected.</b> Your details stay private. FixIt will contact you directly when a matching job comes in; you are not listed in the public directory for these skills.</div>' +
    '<input type="hidden" name="Areas of Expertise" id="spAll"><input type="hidden" name="Premium Skills" id="spPrem"><input type="hidden" name="Listing Skills" id="spListNames"><input type="hidden" name="Listing Skill IDs" id="spListIds"><input type="hidden" name="Areas Served" id="spAreasServed">' +
    '<fieldset class="sp-listing" id="spListing" hidden disabled style="min-width:0">' +
    '<h4>Public directory listing (free)</h4><p class="sp-note">Customers will see your first name and last initial, photo, skills, base area, fee range and bio, and can call or WhatsApp you. Listings go live after FixIt approval.</p>' +
    '<div class="sp-row"><div class="field"><label for="spFeeFrom">Fee from (&#8358;)</label><input id="spFeeFrom" name="Fee From" type="text" inputmode="numeric" placeholder="e.g. 5000"></div>' +
    '<div class="field"><label for="spFeeTo">Fee to (&#8358;)</label><input id="spFeeTo" name="Fee To" type="text" inputmode="numeric" placeholder="e.g. 20000"></div>' +
    '<div class="field"><label for="spBasis">Fee basis</label><select id="spBasis" name="Fee Basis"><option value="job">Per job</option><option value="hour">Per hour</option><option value="day">Per day</option><option value="callout">Call-out / inspection fee</option><option value="negotiable">Negotiable</option></select></div></div>' +
    '<div class="field" style="margin-bottom:12px"><label for="spWa">WhatsApp number (if different from phone)</label><input id="spWa" name="WhatsApp Number" type="tel" placeholder="080 000 0000"></div>' +
    '<div class="field"><label>Areas you serve</label><div class="sp-areas" id="spAreas">' + AREAS.map(function (a) { return '<label><input type="checkbox" class="sp-area" value="' + esc(a) + '"> ' + esc(a) + '</label>'; }).join('') + '</div></div>' +
    '<label class="echk" style="align-items:flex-start;font-weight:400;margin-top:14px"><input type="checkbox" name="Public Listing Consent" value="Yes" style="margin-top:3px"> <span>List me in the public directory. I agree my name (first name + initial), photo, skills, base area, fee range, bio and phone/WhatsApp number may be shown publicly, and that I am an independent contractor.</span></label>' +
    '</fieldset>';
  host.innerHTML = html;

  var $ = function (id) { return document.getElementById(id); };
  function refresh() {
    var all = [], prem = [], pubN = [], pubI = [];
    host.querySelectorAll('.sp-cb:checked').forEach(function (cb) {
      var n = cb.getAttribute('data-name'); all.push(n);
      if (cb.getAttribute('data-tier') === 'premium') prem.push(n); else { pubN.push(n); pubI.push(cb.value); }
    });
    $('spAll').value = all.join(' | '); $('spPrem').value = prem.join(' | ');
    $('spListNames').value = pubN.join(' | '); $('spListIds').value = pubI.join('|');
    var areas = []; host.querySelectorAll('.sp-area:checked').forEach(function (a) { areas.push(a.value); });
    $('spAreasServed').value = areas.join('|');
    $('spSummary').textContent = all.length ? all.length + ' skill' + (all.length > 1 ? 's' : '') + ' selected (' + prem.length + ' premium, ' + pubN.length + ' listable).' : 'No skills selected yet.';
    $('spPremium').hidden = !prem.length;
    var lst = $('spListing'); lst.hidden = !pubN.length; lst.disabled = !pubN.length;
    if (all.length) $('spError').hidden = true;
    host.querySelectorAll('.sp-group').forEach(function (g) {
      var c = g.querySelectorAll('.sp-cb:checked').length; g.querySelector('.sp-gcount').textContent = c ? c + ' selected' : '';
    });
  }
  host.addEventListener('change', refresh);
  $('spSearch').addEventListener('input', function () {
    var q = this.value.trim().toLowerCase(), toks = q.split(/\s+/).filter(Boolean);
    host.querySelectorAll('.sp-skill').forEach(function (l) {
      var hay = l.getAttribute('data-hay'); l.style.display = toks.every(function (t) { return hay.indexOf(t) > -1; }) ? '' : 'none';
    });
    host.querySelectorAll('.sp-group').forEach(function (g) {
      var any = Array.prototype.some.call(g.querySelectorAll('.sp-skill'), function (l) { return l.style.display !== 'none'; });
      g.style.display = any ? '' : 'none'; if (q && any) g.open = true;
    });
    host.querySelectorAll('.sp-tier').forEach(function (t) { if (q) t.open = true; });
  });

  // Registered before the Sheets/email submit handlers (this script sits right after the form).
  form.addEventListener('submit', function (e) {
    refresh();
    if (!$('spAll').value) {
      e.preventDefault(); e.stopImmediatePropagation();
      $('spError').hidden = false; $('spError').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    ['spFeeFrom', 'spFeeTo'].forEach(function (id) { $(id).value = $(id).value.replace(/[^\d]/g, ''); });
  }, true);
  refresh();
})();
