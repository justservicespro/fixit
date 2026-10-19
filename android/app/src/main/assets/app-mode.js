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
    '.topbar,header.site,header.tbar,footer,.tfoot,.wa-float,.sticky-bar,.mobile-drawer{display:none!important}' +
    'html,body{scroll-padding-top:0!important}body{padding-bottom:0!important}'
  );

  // 2) links to a homepage section open that section as its own page
  var S = '/?section=';
  var TARGETS = {
    top: S + 'home', home: S + 'home', services: S + 'services', how: S + 'how',
    areas: S + 'areas', reviews: S + 'reviews', contact: S + 'contact', faq: S + 'faq',
    buy: S + 'buy', 'we-buy': S + 'we-buy', find: '/find-artisan.html',
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
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', isolate);
  } else {
    isolate();
  }
})();
