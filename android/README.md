# FixIt Abuja - Android app

Native shell (WebView, no third-party dependencies) around https://fixit.justservices.pro.
Package: `pro.justservices.fixit` - min SDK 24 - target SDK 36 (Google Play requirement from 31 Aug 2026).

## Build in GitHub Actions

1. Add the four secrets below (Repo > Settings > Secrets and variables > Actions).
2. Actions tab > **Android build (APK + AAB)** > **Run workflow**, enter a version name.
3. Download `fixit-abuja-android-b<N>` from the run's **Artifacts** (or tick *create_release* for a GitHub Release).

`versionCode` is the workflow run number, so every build is higher than the last (Play requires this).

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Base64 of your `.jks` keystore file |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias (e.g. `fixit`) |
| `ANDROID_KEY_PASSWORD` | Key password |

Without `ANDROID_KEYSTORE_BASE64` the workflow still runs, but only produces a **debug APK** for testing (no AAB).

## Create the keystore (once)

```bash
keytool -genkeypair -v -keystore fixit-release.jks -alias fixit \
  -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 fixit-release.jks          # macOS: base64 -i fixit-release.jks | tr -d '\n'
```

Paste the base64 output into `ANDROID_KEYSTORE_BASE64`. Keep the `.jks` file and passwords backed up
somewhere safe and **never commit them** (`*.jks` is git-ignored). If you enrol in Play App Signing,
this becomes your *upload* key.

## App structure

Native top bar (page title, back, call) + **bottom navigation**: Home - Services - **Find** - Book - More.
Every section of the website is its own page in the app:

| Page | Source |
| --- | --- |
| Home | `/?section=home` (hero + latest guides) |
| Services | `/?section=services` (call-outs + more repairs) |
| Find | `/find-artisan.html` (technician directory: premium = book via FixIt, general/automotive = contact directly) |
| Book | `/book-a-service.html` |
| More: How It Works, Areas We Cover, Customer Reviews, Blog & Guides, Buy, What We Buy, Contact Us, Join Our Team, FAQ | `/?section=<key>`, `/blog/` |
| More: For Technicians, Terms & Conditions | `/technicians.html`, `/terms.html` |

`app/src/main/assets/app-mode.js` is injected into every page: it hides the website header/footer/floating
buttons and, on the landing page, shows only the requested section (any section with an `id` works as a page).
To add a menu entry, edit `MORE_ITEMS` / `sectionTitle()` in `MainActivity.java`.
Pages stay hidden for a moment until the script reports ready, so users never see a flash of the full page.

## Behaviour

- Loads the live site; website updates show up in the app instantly (no rebuild needed).
- `tel:`, `mailto:`, WhatsApp (`wa.me`) and other outside links open in the right app; justservices.pro,
  the booking/technician form posts and Apps Script endpoints stay inside the app.
- File uploads (technician photos), offline screen with call/WhatsApp buttons, back-gesture support for API 36.
- Web push (OneSignal) does not run inside a WebView; push would need native FCM later.
