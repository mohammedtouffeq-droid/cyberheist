# CyberHeist

CyberHeist is a free cybersecurity learning game project. The browser prototype and an early native Android foundation use short, fictional defensive scenarios. Neither build is a Play Store release.

## Safety and privacy

- Missions are simulations. The app does not scan networks, connect to targets, crack passwords, or access accounts.
- Browser progress uses this device's local storage; Android progress uses on-device DataStore. There are no accounts, analytics, ads, purchases, or subscriptions in these MVP builds.
- Mission content is bundled in `missions.json`; the game does not need an AI service or API key.
- Never use a training exercise to access a real account or system without explicit authorization.

## Run locally

The app uses `fetch()` to load its mission file, so open it through a local static web server rather than double-clicking `index.html`.

With Python installed, run this from the project directory:

```powershell
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

Check the authored course content with `python scripts/validate_content.py`.
After editing the root course files, run `python scripts/sync_android_content.py` before validating or building Android.

## Project structure

- `index.html` — accessible page structure and mission dialog
- `style.css` — responsive visual design
- `game.js` — mission flow, scoring, and local progress
- `missions.json` — authored fictional learning scenarios and static case evidence
- `curriculum.json` — 60-day course map; the first 7 lessons are playable in this slice
- `scripts/validate_content.py` — checks course coverage, scenario structure, and answer references
- `scripts/sync_android_content.py` — syncs the shared course files into the Android asset bundle
- `android/` — early offline-first native Kotlin/Compose app foundation

## Native Android foundation

The `android/` folder contains the first native Kotlin/Jetpack Compose app foundation. Open that folder in Android Studio with JDK 17 and Android SDK 37 installed, allow Gradle to sync, then run the `app` configuration on an emulator or Android device. Its offline Academy, cases, progress, and field notes are built from bundled course JSON; the app requests no network permission. The package ID is provisional until the Play Store identity is confirmed. The Gradle wrapper pins Gradle 9.6.0 and verifies its distribution checksum.

This checkout does not currently have Java, Gradle, or the Android SDK installed, so the Android project has not yet been compiled or run on a device here. The browser preview instructions above remain separate.

## Product direction

The repository contains a working browser prototype and an early native Android project. It is not a finished Android app or Play Store release; device testing, complete course content, privacy disclosures, and store materials remain outstanding.

The staged product roadmap is in [`docs/PRODUCT_PLAN.md`](docs/PRODUCT_PLAN.md), and the proposed native Android architecture is in [`docs/TECHNICAL_PLAN.md`](docs/TECHNICAL_PLAN.md). These documents distinguish planned work from features that have actually shipped.

## Content contributions

Keep all scenarios fictional and defensive. Do not add instructions that act on real systems, real accounts, or third-party networks. Keep each lesson understandable without specialist experience and explain why the safer choice helps.
