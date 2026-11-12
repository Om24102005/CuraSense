# CuraSense on iPhone and Android

The website runs as an iPhone app and an Android app. Both are the same pages in a native shell made with Capacitor: the shell gives the app an icon, a splash screen, the system status bar, the camera and photo picker, and the phone's back button, and it loads the built website from inside the app.

| What | Where |
|---|---|
| Xcode project (iPhone and iPad) | `frontend/ios/App/App.xcodeproj` |
| Android Studio project | `frontend/android` |
| Shell settings (name, id, colours, plugins) | `frontend/capacitor.config.json` |
| Icon and splash sources | `frontend/assets/*.png` |
| Code that only runs inside the app | `frontend/src/app/native/index.ts`, `frontend/src/styles/native.css` |

## Open it in Xcode

```bash
cd frontend
npm run app:ios        # builds the website, copies it into the app, opens Xcode
```

Then in Xcode, once:

1. Click **App** (blue icon, top of the left list), then the **App** target, then **Signing & Capabilities**.
2. Pick your **Team** (your Apple ID; a free one works for your own iPhone).
3. Change **Bundle Identifier** from `com.curasense.app` to one you own (for example `com.yourname.curasense`). The id is a placeholder: bundle ids are unique on the App Store.
4. Pick a simulator or your connected iPhone at the top and press **Run** (the play button, or Cmd-R).

After you change website code, run `npm run app:sync` (or `npm run app:ios` again) and press Run. Changes to the icon or splash sources: replace the files in `frontend/assets/`, then `npm run app:assets && npm run app:sync`.

## Which server the app talks to

The app calls the same Node API as the website. The address is built in when the website is built: `VITE_NODE_BASE_URL` (default `http://localhost:5001`, from `frontend/.env`).

- **iPhone simulator:** the default works, because the simulator shares your Mac's network. Start the backend with `./start-dev.sh` first.
- **A real iPhone on your Wi-Fi:** use the Mac's address, then run again. The phone asks once for permission to use the local network.
  ```bash
  VITE_NODE_BASE_URL=http://192.168.1.5:5001 npm run app:ios     # your Mac's address, from System Settings > Wi-Fi
  ```
- **A live server:** use its https address. Internet traffic must be https; only addresses on a local network may use http (App Transport Security, set in `Info.plist`).
- The Node server accepts every origin today (`cors()`). If you later restrict it, allow the app's own origins: `capacitor://localhost` (iPhone), `https://localhost` (Android) and `http://localhost`.

## Android

```bash
cd frontend
npm run app:android    # builds the website, copies it into the app, opens Android Studio
```

This Mac has no Android Studio, JDK or Android SDK, so **the Android project was generated and configured but has not been built or run**. Install Android Studio (it brings JDK 21 and the SDK), open `frontend/android`, let Gradle sync, press Run. Notes: the emulator reaches your Mac at `10.0.2.2` (so `VITE_NODE_BASE_URL=http://10.0.2.2:5001`); debug builds may use plain http (a debug-only manifest allows it, release builds never can), but the page itself is served from `https://localhost`, so a local http server also needs `"android": { "allowMixedContent": true }` in `capacitor.config.json` for testing; remove it again before you release.

## What the shell changes about the website

Only inside the app (a browser never runs this code):

- **Notch and home bar.** The page draws under the status bar and home bar and pads itself with `env(safe-area-inset-*)`. The navigation, headers, menus, dialogs and the loading page all do.
- **Status bar.** Light text on the dark theme, dark text on the light theme, switched with the theme.
- **Splash screen.** A navy screen with the logo tile, lifted two frames after the first screen is painted, so there is no blank frame.
- **Android back button.** Closes an open menu, then goes to the dashboard, then goes back a page, and only then leaves the app.
- **Feel.** No rubber-band scrolling at the ends, no tap flash, no long-press menu on buttons; text you read stays selectable.
- **Orientation.** iPhone stays upright; iPad turns freely.
- **Permissions.** The camera and photo library are asked for the first time you photograph or pick a report or scan (the texts are in `Info.plist` and `AndroidManifest.xml`).

For phones in general (browser or app) the website now: shows the names of the three Analyze tabs, has a **Sign out** button in the menu (the profile menu is desktop-only), ships its own Inter font (no download), and gives phones a lighter 3D profile: never the full post-processing chain, fewer particles, and the resolution governor still steps pixels down if frames run late. WebKit reports at most 4 cores whatever the chip, so Apple devices start at the middle profile instead of being judged by core count.

## Before you publish

- Choose your own bundle id and Team (above), and set the version and build number (Xcode: **General**).
- **Account deletion.** Apple (guideline 5.1.1(v)) and Google Play both require that an app which lets people create an account also lets them delete it inside the app. CuraSense has no self-service account deletion yet, so a store submission would be rejected until one is added (a `DELETE` route on the Node API plus a button in Settings).
- **Privacy.** Symptoms, scans and reports are sent to third-party AI providers (DeepSeek today). Both stores ask you to declare health data and where it goes, and want a privacy-policy URL. The app says it is decision support, not a medical device; keep that wording.
- **A live backend over https** is needed for anyone but you. Until then the app only works next to your own computer.
- Apple asks for a `PrivacyInfo.xcprivacy` privacy manifest for apps that use certain system APIs. The Capacitor frameworks ship theirs; check with Xcode's **Product > Archive > Validate App** before submitting.

## What was checked, and what was not

Checked on 2026-11-12:

- The app builds with Xcode 27.2 for the iPhone simulator (`xcodebuild ... build` succeeds), installs, launches, shows the landing page with the 3D cell in light and dark, puts text below the Dynamic Island and the status bar in the right colour, and its web view reached the Node API on the Mac (App Transport Security, CORS and the page policy all let it through).
- The phone checks in `frontend/e2e/10-mobile.spec.ts` pass in real WebKit (iPhone 15) and Chromium (Pixel 7): no page scrolls sideways, the menu reaches every page and signs out, the tab names show, phones get the lighter 3D profile, content starts below an emulated notch. The desktop suite (41 tests) still passes.
- Landing-page frame times with the CPU slowed 4x stayed at 60 fps on this Mac in both the new and the old profile; uncapped, the new profile costs about 40 percent less per frame at the median (0.6 ms against 1.0 ms) and its 95th percentile is half (2.1 ms against 4.0 ms).

Not checked:

- **A real iPhone or Android phone.** The Mac's GPU is many times faster than a phone's, so these numbers show the direction, not the phone's frame rate. Try the app on a real device; if it is slow there, the knobs are in `src/app/animations/deviceTier.ts` and `QUALITY` in `src/app/scenes/cell/CellScene.tsx`.
- The Android build (no SDK here), the camera and photo picker on a device, push notifications and deep links (not built), and App Store or Play Store submission.

## Trap found while testing

Do not set `server.appStartPath` in `capacitor.config.json`: with it, the iOS app closed itself a second after launch in the simulator.
