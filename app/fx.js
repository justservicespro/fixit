/* FixIT Abuja in-app helpers: compact blocks shared by Home, Services and the Find page. */
(function () {
  var WA = '2348079926755';
  var TERMS = '\n\nI agree to FixIT Abuja\'s Terms & Conditions: https://fixit.justservices.pro/terms.html';
  function wa(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg + TERMS); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var RENT = [
    { name: 'InFocus Projector, 3200 Lumens', spec: 'HDMI / VGA / Wireless · HD · Large screen', price: '\u20a620,000', img: '/images/projector-infocus.jpg',
      msg: 'Hi FixIT Abuja, I want to BOOK the InFocus Projector (3200 Lumens, HDMI/VGA/Wireless) (\u20a620,000 per day) in Abuja.\n\nDate(s) needed: \nEvent location: ' },
    { name: 'HY300 Projector, 4K support', spec: 'Wireless · HDMI · Portable', price: '\u20a610,000', img: '/images/projector-hy300.jpg',
      msg: 'Hi FixIT Abuja, I want to BOOK the HY300 Projector (4K support, Wireless, HDMI) (\u20a610,000 per day) in Abuja.\n\nDate(s) needed: \nEvent location: ' }
  ];
  var SELL_MSG = 'Hi FixIT Abuja, I want to sell my gadget(s).\n\nItem(s) & condition: \nLocation: \n\nI am open to a distress-sale cash offer.';
  var GADGETS = ['Laptops', 'Tablets', 'PS5 & Xbox', 'Drones', 'VR headsets', 'Smartwatches', 'Headphones', 'Speakers', 'Projectors', 'Cameras', 'Power banks', 'Routers'];
  var JSP = [
    ['Business Registration & Compliance', 'CAC, TIN, SCUML, licences', 'From \u20a645,000'],
    ['Website & App Development', 'Corporate sites, mobile apps, landing pages', 'From \u20a6150,000'],
    ['Cloud Management Services', 'Business email, Google Workspace, Microsoft 365', 'From \u20a635,000'],
    ['Corporate Admin & Training', 'Office support, staff training, project management', 'From \u20a680,000'],
    ['Startup & Business Consulting', 'Business plans, grant proposals, loan documents', 'From \u20a6120,000'],
    ['Branding & Digital Services', 'Graphics, social media, SEO, content', 'From \u20a660,000'],
    ['AI & Technology Solutions', 'AI integration, automation, chatbots', 'From \u20a6200,000'],
    ['Event & Equipment Solutions', 'Projector rental, presentation equipment, event support', 'From \u20a625,000'],
    ['Real Estate & Related Services', 'Property solutions, documentation, advisory', 'From \u20a650,000']
  ];

  var siteData = null;
  function loadSite() {
    if (siteData) { return siteData; }
    siteData = fetch('/index.html', { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var services = [], seen = {};
      function add(name, link) {
        name = (name || '').replace(/\s+/g, ' ').trim();
        if (!name || seen[name.toLowerCase()]) { return; }
        seen[name.toLowerCase()] = 1;
        services.push({ name: name, href: link || ('/book-a-service.html?source=android_app&service=' + encodeURIComponent(name)) });
      }
      doc.querySelectorAll('.pcard').forEach(function (c) {
        var h = c.querySelector('h3'), l = c.querySelector('.more-link');
        add(h && h.textContent, l && l.getAttribute('href'));
      });
      doc.querySelectorAll('.mcard').forEach(function (c) {
        var h = c.querySelector('h4'), l = c.querySelector('.more-link');
        add(h && h.textContent, l && l.getAttribute('href'));
      });
      var posts = [];
      var m = html.match(/var POSTS = (\[[\s\S]*?\]);/);
      if (m) { try { posts = JSON.parse(m[1]); } catch (e) { posts = []; } }
      return { services: services, posts: posts };
    }).catch(function () { return { services: [], posts: [] }; });
    return siteData;
  }

  function cloud(items, limit, cls) {
    var html = '<div class="fx-cloud">';
    items.forEach(function (s, i) {
      html += '<a class="fx-chip ' + (cls || '') + (limit && i >= limit ? ' fx-hide fx-extra' : '') + '" href="' + esc(s.href) + '">' + esc(s.name) + '</a>';
    });
    html += '</div>';
    if (limit && items.length > limit) { html += '<button type="button" class="fx-more" data-fx-more>See all ' + items.length + ' \u2192</button>'; }
    return html;
  }
  function wireMore(root) {
    root.querySelectorAll('[data-fx-more]').forEach(function (b) {
      b.addEventListener('click', function () {
        var box = b.previousElementSibling;
        var hidden = box.querySelectorAll('.fx-extra.fx-hide').length > 0;
        box.querySelectorAll('.fx-extra').forEach(function (c) { c.classList.toggle('fx-hide', !hidden); });
        b.textContent = hidden ? 'Show less' : b.getAttribute('data-all') || 'See all \u2192';
        if (!hidden) { b.textContent = 'See all \u2192'; }
      });
    });
  }

  /* ---- bottom sheet ---- */
  function ensureSheet() {
    var s = document.getElementById('fxSheet');
    if (s) { return s; }
    var wrap = document.createElement('div');
    wrap.innerHTML = '<div class="fx-scrim" id="fxScrim"></div><div class="fx-sheet" id="fxSheet" role="dialog" aria-modal="true"><div class="grab"></div><div id="fxSheetBody"></div></div>';
    document.body.appendChild(wrap);
    document.getElementById('fxScrim').addEventListener('click', closeSheet);
    return document.getElementById('fxSheet');
  }
  function openSheet(html) { ensureSheet(); document.getElementById('fxSheetBody').innerHTML = html; document.documentElement.classList.add('fx-open'); }
  function closeSheet() { document.documentElement.classList.remove('fx-open'); }
  function rentRows() {
    return RENT.map(function (p) {
      return '<div class="fx-row"><img src="' + p.img + '" alt=""><div class="t"><b>' + esc(p.name) + '</b><span>' + esc(p.spec) + '</span></div>' +
        '<div style="text-align:right"><div class="pr">' + p.price + '<small style="font:500 10px Inter"> /day</small></div>' +
        '<a class="fx-btn am sm" style="margin-top:6px" target="_blank" rel="noopener" href="' + wa(p.msg) + '">BOOK NOW</a></div></div>';
    }).join('');
  }
  function openRent() {
    openSheet('<h3>Rent a projector in Abuja</h3><p class="s">Available within Abuja. Book on WhatsApp.</p>' + rentRows());
  }
  function openSell() {
    openSheet('<h3>Sell your gadgets for cash</h3><p class="s">Distress sale: fast cash, offers typically 40\u201360% below market price.</p>' +
      '<div class="fx-cloud" style="margin:6px 0 14px">' + GADGETS.map(function (g) { return '<span class="fx-chip tl">' + esc(g) + '</span>'; }).join('') + '</div>' +
      '<a class="fx-btn am" style="width:100%" target="_blank" rel="noopener" href="' + wa(SELL_MSG) + '">Sell on WhatsApp</a>' +
      '<p class="fx-note">Inverters, UPS, solar equipment and transformers are also welcome.</p>');
  }

  /* ---- segmented control ---- */
  function seg(active) {
    return '<nav class="fx-seg" aria-label="Choose how to get help">' +
      '<a class="' + (active === 'general' ? 'on' : '') + '" href="/find-artisan.html"><b>General search</b><span>Independent technicians \u00b7 you contact them</span></a>' +
      '<a class="prem ' + (active === 'premium' ? 'on' : '') + '" href="/book-a-service.html?source=android_app"><b>Premium booking</b><span>Vetted experts, 5+ yrs \u00b7 booked via FixIT</span></a></nav>';
  }

  /* ---- "More from FixIT" compact blocks (Find page) ---- */
  function blocks(el) {
    el.classList.add('fx', 'fx-blocks');
    el.innerHTML = '<div class="fx-sec">More from FixIT</div><div id="fxBlkBody"></div>';
    var body = el.querySelector('#fxBlkBody');
    loadSite().then(function (d) {
      var h = '';
      h += '<details class="fx-card prem" open><summary><span class="ic">\ud83d\udee0\ufe0f</span><span class="tx">Our services<small>Booked through FixIT</small></span></summary><div class="body">' +
        cloud(d.services, 14, 'am') + '<p class="fx-note"><a href="/book-a-service.html?source=android_app" style="color:var(--teal-d);font-weight:800">Book a premium service \u2192</a></p></div></details>';
      h += '<details class="fx-card"><summary><span class="ic">\ud83d\udcb8</span><span class="tx">We buy gadgets for cash<small>Distress sale \u00b7 typically 40\u201360% below market</small></span></summary><div class="body">' +
        '<div class="fx-cloud" style="margin-bottom:12px">' + GADGETS.map(function (g) { return '<span class="fx-chip tl">' + esc(g) + '</span>'; }).join('') + '</div>' +
        '<a class="fx-btn am sm" target="_blank" rel="noopener" href="' + wa(SELL_MSG) + '">Sell your gadget</a>' +
        '<p class="fx-note">Also buying: inverters, UPS, solar equipment, transformers.</p></div></details>';
      h += '<details class="fx-card"><summary><span class="ic">\ud83d\udcfd\ufe0f</span><span class="tx">Projectors for rent<small>From \u20a610,000 per day \u00b7 within Abuja</small></span></summary><div class="body">' + rentRows() + '</div></details>';
      if (d.posts && d.posts.length) {
        var posts = d.posts.slice(0, 6);
        h += '<div class="fx-sec" style="margin-top:14px">Guides &amp; blog<a href="/blog/">All guides \u2192</a></div><div class="fx-scroll">' +
          posts.map(function (p) { return '<a class="fx-post" href="/blog/' + esc(p.slug) + '.html"><small>' + esc(p.cat || p.category || 'Guide') + '</small><b>' + esc(p.title) + '</b></a>'; }).join('') + '</div>';
      }
      body.innerHTML = h;
      wireMore(body);
    });
  }

  window.FX = { wa: wa, esc: esc, loadSite: loadSite, cloud: cloud, wireMore: wireMore, openRent: openRent, openSell: openSell, closeSheet: closeSheet, seg: seg, blocks: blocks, JSP: JSP, RENT: RENT };
})();
