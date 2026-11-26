/* Injected by the Android app into every fixit.justservices.pro page.
 * - hides the website's own header/footer/floating bars (the app has native ones)
 * - turns each homepage section into its own page: /?section=services, /?section=faq, ...
 * - tells the native side when the page is ready to be shown (no flash of the full page)
 */
(function () {
  if (window.__fixitApp) { return; }
  window.__fixitApp = true;

  var d = document;
  var path = location.pathname;
  var isIndex = (path === '/' || path === '/index.html');
  var section = new URLSearchParams(location.search).get('section') || 'home';

  function addStyle(css) {
    var s = d.createElement('style');
    s.setAttribute('data-fixit-app', '1');
    s.textContent = css;
    (d.head || d.documentElement).appendChild(s);
  }

  // 1) native top bar / bottom navigation replace the website chrome
  addStyle(
    '.topbar,header.site,header.tbar,footer,.tfoot,.wa-float,.sticky-bar,.mobile-drawer,.rent-tab{display:none!important}' +
    'html,body{scroll-padding-top:0!important}body{padding-bottom:0!important}'
  );

  // 1b) native feel: no pinch-zoom, no tap flash, no text-selection on chrome, press feedback, soft page-in
  (function () {
    var vp = d.querySelector('meta[name=viewport]');
    var vc = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    if (vp) { vp.setAttribute('content', vc); }
    else if (d.head) { var m = d.createElement('meta'); m.name = 'viewport'; m.content = vc; d.head.appendChild(m); }
  })();
  addStyle(
    '*{-webkit-tap-highlight-color:transparent}' +
    'html{scroll-behavior:auto!important;overscroll-behavior-y:none}' +
    'body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation}' +
    'input,textarea,select,[contenteditable]{-webkit-user-select:text;user-select:text}' +
    '::-webkit-scrollbar{display:none}' +
    'a,button,.btn,summary,[role=button]{touch-action:manipulation;transition:transform .12s ease,opacity .12s ease}' +
    'a:active,button:active,.btn:active,[role=button]:active{transform:scale(.97);opacity:.88}' +
    '@keyframes fixitIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    'main{animation:fixitIn .24s ease-out both}' +
    '@media (prefers-reduced-motion:reduce){main{animation:none}}'
  );

  // 2) links to a homepage section open that section as its own page
  var S = '/?section=';
  var TARGETS = {
    top: S + 'home', home: S + 'home', services: S + 'services', how: S + 'how',
    areas: S + 'areas', reviews: S + 'reviews', contact: S + 'contact', faq: S + 'faq',
    buy: S + 'buy', 'we-buy': S + 'we-buy', rent: S + 'rent', find: '/find-artisan.html',
    'join-team': S + 'join-team', 'blog-teaser': '/blog/'
  };
  d.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) { return; }
    var u;
    try { u = new URL(a.getAttribute('href'), location.href); } catch (err) { return; }
    if (u.origin !== location.origin || u.hash.length < 2) { return; }
    if (u.pathname !== '/' && u.pathname !== '/index.html') { return; }
    var target = TARGETS[u.hash.slice(1)];
    if (!target) { return; }
    e.preventDefault();
    e.stopPropagation();
    location.href = target;
  }, true);

  // 2b) Find (general search) and Book (premium) pages: compact layout + switcher + extra blocks
  var isFind = path.indexOf('/find-artisan') === 0;
  var isBook = path.indexOf('/book-a-service') === 0;
  function loadAsset(tag, attrs) {
    var el = d.createElement(tag);
    Object.keys(attrs).forEach(function (k) { el[k] = attrs[k]; });
    (d.head || d.documentElement).appendChild(el);
    return el;
  }
  function setupToolPages() {
    if (!isFind && !isBook) { return; }
    loadAsset('link', { rel: 'stylesheet', href: '/app/app.css' });
    var main = d.querySelector('main');
    var s = loadAsset('script', { src: '/app/fx.js' });
    s.onload = function () {
      if (!main || !window.FX) { return; }
      var holder = d.createElement('div');
      holder.className = 'fx';
      holder.style.cssText = 'padding:10px 12px 0';
      holder.innerHTML = FX.seg(isFind ? 'general' : 'premium');
      main.insertBefore(holder, main.firstChild);
      if (isFind) {
        var more = d.createElement('div');
        more.style.cssText = 'padding:0 12px 24px';
        main.appendChild(more);
        FX.blocks(more);
        var tips = d.querySelector('.safety-tips');
        if (tips && tips.querySelector('h2')) {
          var det = d.createElement('details'); var sum = d.createElement('summary');
          sum.textContent = tips.querySelector('h2').textContent; sum.style.cssText = 'font-weight:800;cursor:pointer;padding:6px 0';
          tips.querySelector('h2').remove();
          while (tips.firstChild) { det.appendChild(tips.firstChild); }
          det.insertBefore(sum, det.firstChild); tips.appendChild(det);
        }
      }
    };
  }
  if (isFind) {
    addStyle('.dir-hero{padding:14px 0 10px!important}.dir-hero h1{font-size:21px!important;margin:4px 0 6px!important}.dir-hero .sub,.dir-hero .eyebrow{display:none!important}' +
      '.dir-hero .popular{display:flex;flex-wrap:nowrap;overflow-x:auto;white-space:nowrap;gap:6px;padding-bottom:4px}.dir-hero .popular::-webkit-scrollbar{display:none}' +
      '.join-cta{display:none!important}');
  }
  if (isBook) {
    addStyle('main>.hero{padding:16px 0 14px!important}main>.hero nav,main>.hero .hero-ctas,main>.hero .hero-eyebrow{display:none!important}' +
      'main>.hero h1{font-size:22px!important;line-height:1.2!important}main>.hero .lead{font-size:13px!important;margin-top:8px!important}' +
      '.contact-card{display:none!important}.contact-grid{display:block!important}main>.section{padding-top:14px!important}' +
      'main>section:not(.hero):not(:nth-of-type(2)){display:none!important}');
  }

  function ready() {
    try { if (window.FixItApp) { window.FixItApp.ready(); } } catch (err) { /* ignore */ }
  }

  // 3) show only the requested section on the homepage
  function isolate() {
    if (isIndex) {
      var main = d.querySelector('main');
      if (main) {
        var cur = 'home';
        var found = false;
        Array.prototype.forEach.call(main.children, function (el) {
          if (el.id && el.id !== 'top') { cur = el.id; }
          el.setAttribute('data-app-group', cur);
          if (cur === section) { found = true; }
        });
        if (!found) { section = 'home'; }
        // Home screen = hero + latest guides; every other section is a page of its own
        var keep = (section === 'home') ? ['home', 'blog-teaser'] : [section];
        addStyle('main>[data-app-group]' + keep.map(function (k) { return ':not([data-app-group="' + k + '"])'; }).join('') + '{display:none!important}');
      }
      window.scrollTo(0, 0);
    }
    setupToolPages();
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', isolate);
  } else {
    isolate();
  }
})();
