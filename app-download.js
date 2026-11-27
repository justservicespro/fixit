/* FixIT Abuja: Android app download card (footer) + enlarge/download lightbox. */
(function () {
  if (window.__fxApk) { return; } window.__fxApk = 1;
  var APK = '/download/fixit-abuja.apk';
  var QR = '<svg viewBox="0 0 35 35"><path fill="#fff" d="M0 0h35v35h-35z"/><path stroke="#171a21" d="M1 1.5h7m3 0h1m2 0h3m3 0h1m2 0h3m1 0h7m-33 1h1m5 0h1m3 0h2m1 0h5m3 0h1m1 0h1m2 0h1m5 0h1m-33 1h1m1 0h3m1 0h1m2 0h1m1 0h3m1 0h3m1 0h1m2 0h2m2 0h1m1 0h3m1 0h1m-33 1h1m1 0h3m1 0h1m6 0h4m1 0h2m3 0h2m1 0h1m1 0h3m1 0h1m-33 1h1m1 0h3m1 0h1m2 0h1m4 0h1m6 0h1m1 0h1m2 0h1m1 0h3m1 0h1m-33 1h1m5 0h1m1 0h3m1 0h1m2 0h6m1 0h1m1 0h1m1 0h1m5 0h1m-33 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-24 1h2m3 0h4m1 0h5m-24 1h1m2 0h1m1 0h2m1 0h6m5 0h3m3 0h1m1 0h1m-28 1h2m1 0h2m2 0h2m1 0h1m1 0h2m2 0h2m2 0h1m3 0h4m4 0h1m-33 1h2m1 0h4m1 0h1m2 0h4m3 0h2m2 0h1m3 0h3m1 0h1m1 0h1m-32 1h2m1 0h2m1 0h5m1 0h1m1 0h1m3 0h1m1 0h2m2 0h2m1 0h2m-29 1h3m1 0h2m1 0h3m1 0h1m1 0h1m1 0h2m2 0h2m1 0h2m1 0h1m2 0h1m1 0h1m-32 1h1m2 0h3m1 0h1m1 0h1m2 0h4m3 0h1m2 0h1m1 0h1m1 0h1m1 0h1m2 0h2m-30 1h6m3 0h2m1 0h4m1 0h9m2 0h1m-31 1h1m1 0h1m6 0h4m2 0h4m1 0h1m1 0h1m2 0h2m3 0h1m-32 1h1m2 0h1m2 0h2m1 0h1m2 0h6m1 0h6m1 0h1m1 0h1m2 0h1m-32 1h5m2 0h1m1 0h4m1 0h1m1 0h2m3 0h5m1 0h1m1 0h1m1 0h1m-32 1h1m3 0h3m3 0h1m2 0h1m2 0h3m3 0h1m1 0h2m4 0h3m-33 1h1m1 0h4m2 0h3m3 0h1m2 0h3m1 0h1m1 0h1m1 0h3m-28 1h1m1 0h1m3 0h3m2 0h2m1 0h2m1 0h2m2 0h1m3 0h1m5 0h1m-28 1h1m2 0h4m4 0h1m1 0h1m2 0h2m2 0h3m3 0h3m-33 1h4m1 0h4m1 0h1m2 0h1m2 0h5m1 0h1m3 0h3m3 0h1m-32 1h4m2 0h3m3 0h1m1 0h1m2 0h1m1 0h3m2 0h1m2 0h2m-30 1h1m1 0h1m1 0h4m2 0h1m1 0h3m1 0h2m1 0h1m1 0h1m1 0h6m2 0h2m-25 1h1m1 0h2m1 0h1m2 0h2m1 0h3m2 0h1m3 0h2m2 0h1m-33 1h7m2 0h3m2 0h1m2 0h2m2 0h2m1 0h1m1 0h1m1 0h4m-32 1h1m5 0h1m1 0h2m1 0h1m2 0h1m2 0h1m1 0h3m2 0h1m3 0h1m3 0h1m-33 1h1m1 0h3m1 0h1m2 0h4m1 0h1m3 0h5m1 0h6m-30 1h1m1 0h3m1 0h1m1 0h3m4 0h2m4 0h3m2 0h1m1 0h3m-31 1h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h4m4 0h2m5 0h1m1 0h1m1 0h1m-33 1h1m5 0h1m2 0h1m1 0h1m2 0h1m2 0h2m1 0h2m1 0h3m-26 1h7m1 0h2m1 0h1m2 0h2m4 0h2m2 0h1m1 0h1m1 0h2m1 0h1"/></svg>';
  var css = '.apd-wrap{margin-top:16px;max-width:340px}' +
    '.apd-card{--u:10px;font-size:var(--u);position:relative;width:32em;max-width:100%;aspect-ratio:4/3;background:#fff;border-radius:1.4em;overflow:hidden;color:#171A21;font-family:Inter,system-ui,sans-serif;box-shadow:0 1em 2.4em -1em rgba(0,0,0,.55)}' +
    '.apd-thumb{cursor:pointer;display:block;border:0;padding:0;background:none;text-align:left;width:100%}' +
    '.apd-thumb:focus-visible{outline:3px solid #FF7A1A;outline-offset:3px;border-radius:1.4em}' +
    '.apd-disc{position:absolute;left:-4em;top:2.6em;width:20.5em;height:20.5em;border-radius:50%;background:#FF7A1A}' +
    '.apd-phone{position:absolute;left:3.2em;top:1.6em;width:10.6em;height:20.8em;background:#171A21;border-radius:1.7em;padding:.45em;transform:rotate(-8deg);box-shadow:.4em .6em 1.4em rgba(0,0,0,.35)}' +
    '.apd-screen{width:100%;height:100%;background:#fff;border-radius:1.3em;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7em}' +
    '.apd-screen img{width:5.6em;height:5.6em;border-radius:1.3em;box-shadow:0 .3em .8em rgba(0,0,0,.25)}' +
    '.apd-screen b{font:800 .95em Inter,sans-serif}' +
    '.apd-txt{position:absolute;left:15.6em;right:1.1em;top:1.5em}' +
    '.apd-txt h4{margin:0;font:400 1.75em/1.08 "Archivo Black",Inter,sans-serif;color:#171A21;letter-spacing:-.01em}' +
    '.apd-txt h4 em{font-style:normal;color:#FF7A1A}' +
    '.apd-txt p{margin:.55em 0 0;font-size:.92em;line-height:1.35;color:rgba(23,26,33,.72)}' +
    '.apd-qr{position:absolute;right:1.1em;bottom:1.1em;width:12em;background:#fff;border:.18em solid #171A21;border-radius:.9em;padding:.35em;box-sizing:border-box}' +
    '.apd-qr svg{display:block;width:100%;height:auto}' +
        '.apd-cap{display:block;margin-top:8px;font-size:12px;color:rgba(246,242,233,.75)}' +
    '.apd-ov{position:fixed;inset:0;z-index:2000;background:rgba(9,11,15,.82);display:none;align-items:center;justify-content:center;padding:16px;overflow:auto}' +
    '.apd-ov.on{display:flex}' +
    '.apd-box{width:min(720px,100%);display:flex;flex-direction:column;align-items:center;gap:14px;margin:auto}' +
    '.apd-box .apd-card{--u:min(22px,3.1vw);width:32em;box-shadow:0 2em 5em -1em rgba(0,0,0,.7)}' +
    '.apd-acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}' +
    '.apd-btn{display:inline-flex;align-items:center;gap:8px;border:0;border-radius:10px;padding:13px 20px;font:800 15px Inter,sans-serif;cursor:pointer;text-decoration:none}' +
    '.apd-btn.am{background:#FF7A1A;color:#171A21}.apd-btn.gh{background:rgba(255,255,255,.14);color:#fff}' +
    '.apd-help{background:#fff;color:#171A21;border-radius:12px;padding:14px 16px;font:400 13.5px/1.55 Inter,sans-serif;max-width:480px}' +
    '.apd-help b{font-weight:800}.apd-help ol{margin:6px 0 8px;padding-left:20px}.apd-help p{margin:0}.apd-help .ok{margin-top:6px;color:#0C7E71;font-weight:700}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function card() {
    return '<div class="apd-card"><div class="apd-disc"></div>' +
      '<div class="apd-phone"><div class="apd-screen"><img src="/android-chrome-192x192.png" alt="FixIT Abuja app icon"><b>FixIT Abuja</b></div></div>' +
      '<div class="apd-txt"><h4>Download <em>Our New App</em></h4><p><b>Scan the QR code</b> to get the app.</p></div>' +
      '<div class="apd-qr" aria-label="QR code: direct download link for the FixIT Abuja Android app">' + QR + '</div></div>';
  }
  var ov;
  function openBox() {
    if (!ov) {
      ov = document.createElement('div'); ov.className = 'apd-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Download the FixIT Abuja app');
      ov.innerHTML = '<div class="apd-box">' + card() +
        '<div class="apd-acts"><a class="apd-btn am" href="' + APK + '" download="FixIT-Abuja.apk">\u2b07 Download App (APK)</a><button type="button" class="apd-btn gh" id="apdClose">Close</button></div>' +
        '<div class="apd-help"><p><b>Installing on Android</b></p><ol>' +
        '<li>Open the downloaded file. If asked, allow installs from this source (Settings \u2192 Install unknown apps).</li>' +
        '<li>If Google Play Protect appears, choose <b>Scan app</b> and let it finish, then tap Install.</li></ol>' +
        '<p class="ok">The app is completely safe. Android shows this prompt for any app installed outside the Play Store.</p></div></div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function (e) { if (e.target === ov || e.target.id === 'apdClose') { close(); } });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
    }
    ov.classList.add('on'); document.documentElement.style.overflow = 'hidden';
  }
  function close() { if (ov) { ov.classList.remove('on'); document.documentElement.style.overflow = ''; } }

  function mount() {
    var foot = document.querySelector('footer'); if (!foot || foot.querySelector('.apd-wrap')) { return; }
    var wrap = document.createElement('div'); wrap.className = 'apd-wrap';
    wrap.innerHTML = '<button type="button" class="apd-thumb" aria-label="Get the FixIT Abuja Android app: enlarge QR code or download">' + card() + '</button>' +
      '<span class="apd-cap">Tap to enlarge the QR code or download the app</span>';
    wrap.querySelector('.apd-thumb').addEventListener('click', openBox);
    var wa = foot.querySelector('.foot-brand a[href*="wa.me"]') || foot.querySelector('a[href*="wa.me"]');
    if (wa && wa.parentNode) { wa.parentNode.insertBefore(wrap, wa.nextSibling); return; }
    var host = foot.querySelector('.foot-brand') || foot.querySelector('.wrap') || foot; host.appendChild(wrap);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', mount); } else { mount(); }
})();
