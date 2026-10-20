package pro.justservices.fixit;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * FixIt Abuja - native shell (top bar + bottom navigation) around https://fixit.justservices.pro.
 * Every section of the site is presented as its own page; see assets/app-mode.js.
 * No third-party dependencies: framework classes only.
 */
public class MainActivity extends Activity {

    private static final String HOST = "fixit.justservices.pro";
    private static final String BASE = "https://" + HOST;
    private static final String URL_HOME = BASE + "/?section=home&source=android_app";
    private static final String URL_SERVICES = BASE + "/?section=services";
    private static final String URL_BOOK = BASE + "/book-a-service.html?source=android_app";
    private static final String URL_FIND = BASE + "/find-artisan.html";
    private static final String URL_BLOG = BASE + "/blog/";
    private static final String OFFLINE_URL = "file:///android_asset/offline.html";
    private static final String PHONE = "+2348079926755";
    private static final String WHATSAPP = "whatsapp://send?phone=2348079926755";
    private static final int REQ_FILE_CHOOSER = 1001;

    private static final int INK = Color.parseColor("#171A21");
    private static final int PANEL = Color.parseColor("#20242E");
    private static final int AMBER = Color.parseColor("#FF7A1A");
    private static final int MUTED = Color.parseColor("#9AA0AA");
    private static final int LINE = Color.argb(40, 255, 255, 255);

    private static final String[] TAB_LABELS = {"Home", "Services", "Find", "Book", "More"};
    private static final int[] TAB_ICONS = {
            R.drawable.ic_nav_home, R.drawable.ic_nav_services, R.drawable.ic_nav_find,
            R.drawable.ic_nav_book, R.drawable.ic_nav_more};

    /** Pages reachable from the "More" tab: {title, url}. Each one is its own page. */
    private static final String[][] MORE_ITEMS = {
            {"How It Works", BASE + "/?section=how"},
            {"Areas We Cover", BASE + "/?section=areas"},
            {"Customer Reviews", BASE + "/?section=reviews"},
            {"Blog & Guides", BASE + "/blog/"},
            {"Buy", BASE + "/?section=buy"},
            {"What We Buy", BASE + "/?section=we-buy"},
            {"Contact Us", BASE + "/?section=contact"},
            {"Join Our Team", BASE + "/?section=join-team"},
            {"For Technicians", BASE + "/technicians.html"},
            {"FAQ", BASE + "/?section=faq"},
            {"Terms & Conditions", BASE + "/terms.html"},
    };

    private WebView webView;
    private ProgressBar progress;
    private TextView titleView;
    private ImageButton backBtn;
    private LinearLayout bottomNav;
    private View navDivider;
    private final ImageView[] tabIcons = new ImageView[5];
    private final TextView[] tabLabels = new TextView[5];

    private ValueCallback<Uri[]> filePathCallback;
    private Object backHandler; // BackHandler on API 33+, null otherwise
    private String appModeJs;
    private boolean onHomeRoot = true;
    private boolean clearHistoryOnFinish;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private final Runnable revealRunnable = this::revealWebView;

    /** Called by assets/app-mode.js once the page has been reduced to the requested section. */
    public final class Bridge {
        @JavascriptInterface
        public void ready() {
            runOnUiThread(MainActivity.this::revealWebView);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        appModeJs = readAsset("app-mode.js");

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(INK);

        // ---- top bar: back arrow, page title, call button ----
        LinearLayout topBar = new LinearLayout(this);
        topBar.setOrientation(LinearLayout.HORIZONTAL);
        topBar.setGravity(Gravity.CENTER_VERTICAL);
        topBar.setBackgroundColor(INK);
        topBar.setPadding(dp(4), 0, dp(4), 0);
        root.addView(topBar, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(52)));

        backBtn = iconButton(R.drawable.ic_back, "Back", Color.WHITE, v -> handleBack());
        backBtn.setVisibility(View.GONE);
        topBar.addView(backBtn, new LinearLayout.LayoutParams(dp(48), dp(48)));

        titleView = new TextView(this);
        titleView.setTextColor(Color.WHITE);
        titleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        titleView.setTypeface(Typeface.DEFAULT_BOLD);
        titleView.setSingleLine(true);
        titleView.setEllipsize(TextUtils.TruncateAt.END);
        titleView.setText("FixIt Abuja");
        titleView.setPadding(dp(16), 0, dp(8), 0);
        topBar.addView(titleView, new LinearLayout.LayoutParams(0,
                ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        ImageButton callBtn = iconButton(R.drawable.ic_call, "Call FixIt Abuja", AMBER, v -> dial());
        topBar.addView(callBtn, new LinearLayout.LayoutParams(dp(48), dp(48)));

        // ---- content: web view + load progress ----
        FrameLayout content = new FrameLayout(this);
        root.addView(content, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));

        webView = new WebView(this);
        webView.setBackgroundColor(INK);
        content.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        progress.setProgressTintList(ColorStateList.valueOf(AMBER));
        progress.setVisibility(View.GONE);
        content.addView(progress, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(3), Gravity.TOP));

        // ---- bottom navigation ----
        navDivider = new View(this);
        navDivider.setBackgroundColor(LINE);
        root.addView(navDivider, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 1));

        bottomNav = new LinearLayout(this);
        bottomNav.setOrientation(LinearLayout.HORIZONTAL);
        bottomNav.setBackgroundColor(INK);
        root.addView(bottomNav, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(60)));
        for (int i = 0; i < TAB_LABELS.length; i++) {
            bottomNav.addView(makeTab(i), new LinearLayout.LayoutParams(
                    0, ViewGroup.LayoutParams.MATCH_PARENT, 1f));
        }

        // Edge-to-edge is enforced on Android 15+: pad the content so it clears the bars / keyboard.
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets i = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                v.setPadding(i.left, i.top, i.right, i.bottom);
                int vis = insets.isVisible(WindowInsets.Type.ime()) ? View.GONE : View.VISIBLE;
                bottomNav.setVisibility(vis);
                navDivider.setVisibility(vis);
                return WindowInsets.CONSUMED;
            }
            v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets.consumeSystemWindowInsets();
        });
        setContentView(root);

        configureWebView();
        updateChrome(URL_HOME);

        if (Build.VERSION.SDK_INT >= 33) {
            backHandler = new BackHandler();
        }

        if (savedInstanceState == null || webView.restoreState(savedInstanceState) == null) {
            webView.loadUrl(URL_HOME);
        }
    }

    // ---- Native chrome helpers ---------------------------------------------------------------

    private ImageButton iconButton(int drawableRes, String description, int tint, View.OnClickListener l) {
        ImageButton b = new ImageButton(this);
        b.setImageResource(drawableRes);
        b.setColorFilter(tint);
        b.setContentDescription(description);
        b.setBackgroundResource(selectableBackground(true));
        b.setOnClickListener(l);
        return b;
    }

    private int selectableBackground(boolean borderless) {
        TypedValue tv = new TypedValue();
        getTheme().resolveAttribute(borderless
                ? android.R.attr.selectableItemBackgroundBorderless
                : android.R.attr.selectableItemBackground, tv, true);
        return tv.resourceId;
    }

    private View makeTab(final int index) {
        LinearLayout tab = new LinearLayout(this);
        tab.setOrientation(LinearLayout.VERTICAL);
        tab.setGravity(Gravity.CENTER);
        tab.setBackgroundResource(selectableBackground(false));
        tab.setContentDescription(TAB_LABELS[index]);
        tab.setOnClickListener(v -> onTabClicked(index));

        ImageView icon = new ImageView(this);
        icon.setImageResource(TAB_ICONS[index]);
        icon.setColorFilter(MUTED);
        tab.addView(icon, new LinearLayout.LayoutParams(dp(24), dp(24)));

        TextView label = new TextView(this);
        label.setText(TAB_LABELS[index]);
        label.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        label.setTextColor(MUTED);
        label.setPadding(0, dp(3), 0, 0);
        tab.addView(label, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        tabIcons[index] = icon;
        tabLabels[index] = label;
        return tab;
    }

    private void selectTab(int selected) {
        for (int i = 0; i < tabIcons.length; i++) {
            int color = (i == selected) ? AMBER : MUTED;
            tabIcons[i].setColorFilter(color);
            tabLabels[i].setTextColor(color);
        }
    }

    private void onTabClicked(int index) {
        switch (index) {
            case 0:
                openRoot(URL_HOME);
                break;
            case 1:
                openRoot(URL_SERVICES);
                break;
            case 2:
                openRoot(URL_FIND);
                break;
            case 3:
                openRoot(URL_BOOK);
                break;
            default:
                showMoreSheet();
                break;
        }
    }

    /** Opens a top-level page (tab or More item) and starts a fresh back stack. */
    private void openRoot(String url) {
        clearHistoryOnFinish = true;
        webView.loadUrl(url);
    }

    private void showMoreSheet() {
        final Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout sheet = new LinearLayout(this);
        sheet.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(PANEL);
        float r = dp(18);
        bg.setCornerRadii(new float[]{r, r, r, r, 0, 0, 0, 0});
        sheet.setBackground(bg);
        sheet.setPadding(0, dp(8), 0, dp(12));

        TextView head = new TextView(this);
        head.setText("More");
        head.setTextColor(AMBER);
        head.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        head.setTypeface(Typeface.DEFAULT_BOLD);
        head.setAllCaps(true);
        head.setLetterSpacing(0.1f);
        head.setPadding(dp(20), dp(12), dp(20), dp(6));
        sheet.addView(head);

        for (final String[] item : MORE_ITEMS) {
            sheet.addView(sheetRow(item[0], v -> {
                dialog.dismiss();
                openRoot(item[1]);
            }));
        }
        sheet.addView(sheetRow("Call us", v -> {
            dialog.dismiss();
            dial();
        }));
        sheet.addView(sheetRow("WhatsApp us", v -> {
            dialog.dismiss();
            openExternal(Uri.parse(WHATSAPP));
        }));

        ScrollView scroll = new ScrollView(this);
        scroll.addView(sheet);
        dialog.setContentView(scroll);

        Window w = dialog.getWindow();
        if (w != null) {
            w.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            w.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            w.setGravity(Gravity.BOTTOM);
        }
        dialog.show();
    }

    private TextView sheetRow(String text, View.OnClickListener l) {
        TextView row = new TextView(this);
        row.setText(text);
        row.setTextColor(Color.WHITE);
        row.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        row.setPadding(dp(20), dp(14), dp(20), dp(14));
        row.setBackgroundResource(selectableBackground(false));
        row.setOnClickListener(l);
        return row;
    }

    private void dial() {
        openExternal(Uri.parse("tel:" + PHONE));
    }

    /** Keeps the title, back arrow and selected tab in sync with the page being shown. */
    private void updateChrome(String url) {
        if (url == null) {
            return;
        }
        if (url.startsWith("file:")) { // offline screen: leave the selected tab alone
            titleView.setText("Offline");
            return;
        }
        Uri u = Uri.parse(url);
        if (!HOST.equals(u.getHost())) { // e.g. a form-processor page: keep current chrome
            return;
        }
        String path = u.getPath();
        if (path == null || path.isEmpty()) {
            path = "/";
        }
        String section = u.getQueryParameter("section");

        int tab = -1;
        String title = "FixIt Abuja";
        boolean root = false;
        if (path.equals("/") || path.equals("/index.html")) {
            if (section == null || section.equals("home")) {
                tab = 0;
                root = true;
            } else if (section.equals("services")) {
                tab = 1;
                title = "Services";
                root = true;
            } else {
                tab = 4;
                title = sectionTitle(section);
            }
        } else if (path.startsWith("/services")) {
            tab = 1; // service landing pages sit under the Services tab
            title = "Services";
        } else if (path.startsWith("/find-artisan")) {
            tab = 2;
            title = "Find a Technician";
            root = true;
        } else if (path.startsWith("/book-a-service")) {
            tab = 3;
            title = "Book a Service";
            root = true;
        } else if (path.startsWith("/blog")) {
            tab = 4; // lives under More
            title = "Blog";
        } else if (path.equals("/technicians.html")) {
            tab = 4;
            title = "For Technicians";
        } else if (path.equals("/terms.html")) {
            tab = 4;
            title = "Terms & Conditions";
        }

        onHomeRoot = (tab == 0);
        selectTab(tab);
        titleView.setText(title);
        titleView.setPadding(root ? dp(16) : dp(4), 0, dp(8), 0);
        backBtn.setVisibility(root ? View.GONE : View.VISIBLE);
    }

    private static String sectionTitle(String section) {
        switch (section) {
            case "how":
                return "How It Works";
            case "areas":
                return "Areas We Cover";
            case "reviews":
                return "Customer Reviews";
            case "buy":
                return "Buy";
            case "we-buy":
                return "What We Buy";
            case "find":
                return "Find a Technician";
            case "contact":
                return "Contact Us";
            case "join-team":
                return "Join Our Team";
            case "faq":
                return "FAQ";
            default:
                return "FixIt Abuja";
        }
    }

    // ---- WebView -----------------------------------------------------------------------------

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        boolean debuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        WebView.setWebContentsDebuggingEnabled(debuggable);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false); // android_asset URLs still work
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setSupportMultipleWindows(false);
        s.setSupportZoom(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        s.setUserAgentString(s.getUserAgentString() + " FixItAbujaApp/" + versionName());

        CookieManager.getInstance().setAcceptCookie(true);

        webView.addJavascriptInterface(new Bridge(), "FixItApp");

        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) ->
                openExternal(Uri.parse(url)));

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrl(request.getUrl(), request.isForMainFrame());
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progress.setProgress(0);
                progress.setVisibility(View.VISIBLE);
                injectAppMode(view, url);
            }

            @Override
            public void onPageCommitVisible(WebView view, String url) {
                if (isAppUrl(url)) {
                    hideUntilReady(); // stay blank until app-mode.js has isolated the section
                    injectAppMode(view, url);
                } else {
                    revealWebView();
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progress.setVisibility(View.GONE);
                CookieManager.getInstance().flush();
                injectAppMode(view, url);
                ui.removeCallbacks(revealRunnable);
                ui.postDelayed(revealRunnable, 1500); // safety net if the script never reports ready
                if (clearHistoryOnFinish) {
                    clearHistoryOnFinish = false;
                    view.clearHistory();
                }
                syncBackHandler();
            }

            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                updateChrome(url);
                syncBackHandler();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    view.loadUrl(OFFLINE_URL);
                }
            }

            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                recreate();
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progress.setProgress(newProgress);
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;
                try {
                    startActivityForResult(params.createIntent(), REQ_FILE_CHOOSER);
                } catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    return false;
                }
                return true;
            }
        });
    }

    private static boolean isAppUrl(String url) {
        return url != null && HOST.equals(Uri.parse(url).getHost());
    }

    private void hideUntilReady() {
        if (webView == null) {
            return;
        }
        webView.setAlpha(0f);
        ui.removeCallbacks(revealRunnable);
        ui.postDelayed(revealRunnable, 3500);
    }

    private void revealWebView() {
        ui.removeCallbacks(revealRunnable);
        if (webView != null) {
            webView.setAlpha(1f);
        }
    }

    /** Hides the website chrome and isolates one section per page (idempotent per document). */
    private void injectAppMode(WebView view, String url) {
        if (appModeJs == null || !isAppUrl(url)) {
            return;
        }
        view.evaluateJavascript(appModeJs, null);
    }

    /** @return true if the app handled the URL (WebView must not load it). */
    private boolean handleUrl(Uri uri, boolean mainFrame) {
        if (!mainFrame) {
            return false;
        }
        String scheme = uri.getScheme();
        if (scheme == null) {
            return false;
        }
        switch (scheme) {
            case "http":
            case "https":
                if (isInternalHost(uri.getHost())) {
                    return false;
                }
                openExternal(uri); // wa.me, justbuys.deals, etc.
                return true;
            case "file":
                // only our own offline page may load from file://
                return !uri.toString().startsWith("file:///android_asset/");
            case "about":
            case "data":
            case "blob":
            case "javascript":
                return false;
            default:
                openExternal(uri); // tel:, mailto:, sms:, whatsapp:, geo: ...
                return true;
        }
    }

    private static boolean isInternalHost(String host) {
        if (host == null) {
            return false;
        }
        return host.equals("justservices.pro")
                || host.endsWith(".justservices.pro")
                || host.equals("formsubmit.co")            // booking / technician form posts
                || host.equals("script.google.com")        // Apps Script endpoints
                || host.endsWith(".googleusercontent.com");
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException ignored) {
            // no app can handle it
        }
    }

    private String versionName() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "1";
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private String readAsset(String name) {
        try (InputStream in = getAssets().open(name);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buf = new byte[4096];
            int n;
            while ((n = in.read(buf)) > 0) {
                out.write(buf, 0, n);
            }
            return out.toString("UTF-8");
        } catch (IOException e) {
            return null;
        }
    }

    // ---- Back navigation ---------------------------------------------------------------------
    // Back steps through the page history; from the first page of any other tab it returns to Home;
    // from Home it exits. Apps targeting API 36 no longer receive onBackPressed() on Android 16+,
    // so on API 33+ an OnBackInvokedCallback is registered only while we need to intercept back.

    private boolean shouldInterceptBack() {
        return webView != null && (webView.canGoBack() || !onHomeRoot);
    }

    private void handleBack() {
        if (webView == null) {
            return;
        }
        if (webView.canGoBack()) {
            webView.goBack();
        } else if (!onHomeRoot) {
            openRoot(URL_HOME);
        }
    }

    @TargetApi(33)
    private final class BackHandler {
        private final OnBackInvokedCallback callback = () -> handleBack();
        private boolean registered;

        void sync() {
            boolean needed = shouldInterceptBack();
            OnBackInvokedDispatcher dispatcher = getOnBackInvokedDispatcher();
            if (needed && !registered) {
                dispatcher.registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, callback);
                registered = true;
            } else if (!needed && registered) {
                dispatcher.unregisterOnBackInvokedCallback(callback);
                registered = false;
            }
        }
    }

    private void syncBackHandler() {
        if (Build.VERSION.SDK_INT >= 33 && backHandler != null) {
            ((BackHandler) backHandler).sync();
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (shouldInterceptBack()) {
            handleBack();
        } else {
            super.onBackPressed();
        }
    }

    // ---- File uploads (technician photos etc.) ----------------------------------------------

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQ_FILE_CHOOSER) {
            if (filePathCallback != null) {
                filePathCallback.onReceiveValue(
                        WebChromeClient.FileChooserParams.parseResult(resultCode, data));
                filePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    // ---- Lifecycle ---------------------------------------------------------------------------

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.onPause();
        }
        CookieManager.getInstance().flush();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        ui.removeCallbacks(revealRunnable);
        if (webView != null) {
            ((ViewGroup) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
