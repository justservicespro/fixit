/* Used by book-a-service.html and technicians.html when shown inside the app Home page (?embed=1):
   shows only the form, submits at top level, and reports its height to the parent. */
(function () {
  if (!/[?&]embed=1/.test(location.search)) { return; }
  var me = document.currentScript;
  var sel = me && me.getAttribute('data-target');
  var d = document;
  d.documentElement.classList.add('fx-embed');
  var st = d.createElement('style');
  st.textContent = '.fx-embed header.site,.fx-embed .mobile-drawer,.fx-embed footer,.fx-embed .wa-float,.fx-embed .sticky-bar,.fx-embed .app-banner{display:none!important}' +
    '.fx-embed,.fx-embed body{background:transparent!important}.fx-embed body{padding:0!important;margin:0!important}' +
    '.fx-embed .contact-grid,.fx-embed .expert-grid,.fx-embed .form-row{display:block!important}.fx-embed .form-row .field{margin-bottom:14px!important}' +
    '.fx-embed .form-panel{margin:0!important;max-width:none!important;width:100%!important;box-shadow:none!important;border:0!important;padding:4px 2px!important;background:transparent!important}' +
    '.fx-embed .section,.fx-embed .wrap{padding-top:0!important;padding-bottom:0!important;margin:0!important;max-width:none!important;width:100%!important}';
  d.head.appendChild(st);
  function isolate() {
    var form = sel && d.querySelector(sel);
    if (!form) { return; }
    var panel = form.closest('.form-panel') || form;
    var n = panel;
    while (n && n !== d.body) {
      var p = n.parentNode; if (!p) { break; }
      Array.prototype.forEach.call(p.children, function (c) {
        if (c !== n && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.tagName !== 'LINK') { c.style.display = 'none'; }
      });
      n = p;
    }
    var h = panel.querySelector('h3'); if (h) { h.style.display = 'none'; }
    var sub = panel.querySelector('.sub'); if (sub) { sub.style.display = 'none'; }
    form.target = '_top';
    var nx = form.querySelector('input[name=_next]');
    if (nx) { nx.value = location.origin + '/app/home.html?sent=1'; }
  }
  function post() {
    try { parent.postMessage({ fxEmbedHeight: Math.ceil(d.documentElement.scrollHeight), src: location.pathname }, location.origin); } catch (e) { /* ignore */ }
  }
  function start() {
    isolate(); post();
    if (window.ResizeObserver) { new ResizeObserver(post).observe(d.body); }
    setInterval(post, 700);
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
