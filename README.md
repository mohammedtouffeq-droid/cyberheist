# CyberHeist

CyberHeist is a free cybersecurity learning game project. The browser prototype and an early native Android foundation use short, fictional defensive scenarios. Neither build is a Play Store release.

## Safety and privacy

- Missions are simulations. The app does not scan networks, connect to targets, crack passwords, or access accounts.
- The browser training terminal reads a fixed, fictional log bundle through an allow-list of commands; it cannot run a host shell command, access the device filesystem, or connect to a network.
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
To regenerate the 60-day content pack, run `python scripts/build_course_pack.py`; after editing the root course files, run `python scripts/sync_android_content.py` before validating or building Android.

## Project structure

- `index.html` — separately routed briefing, research-informed learning guide, record, searchable case library, practice floor, and private notes
- `style.css` — responsive visual design
- `game.js` — routed case flow, shuffled answer presentation, twenty fictional simulations (selection, ordering, and classification), a guided allow-listed fictional log terminal, notes, and local progress
- `missions.json` — authored fictional learning scenarios and static case evidence
- `curriculum.json` — 60-day beginner-to-foundation course map, with one playable mission for each day
- `scripts/build_course_pack.py` — reproducibly builds the authored course pack and keeps the learning promise bounded
- `scripts/validate_content.py` — checks course coverage, scenario structure, and answer references
- `scripts/sync_android_content.py` — syncs the shared course files into the Android asset bundle
- `android/` — early offline-first native Kotlin/Compose app foundation

## Native Android foundation

The `android/` folder contains the first native Kotlin/Jetpack Compose app foundation. Open that folder in Android Studio with JDK 17 and Android SDK 37 installed, allow Gradle to sync, then run the `app` configuration on an emulator or Android device. Its offline Academy, cases, progress, and field notes are built from bundled course JSON; the app requests no network permission. The browser Practice Arcade, case filters, and direct note composer still need to be ported to Android. The package ID is provisional until the Play Store identity is confirmed. The Gradle wrapper pins Gradle 9.6.0 and verifies its distribution checksum.

This checkout does not currently have Java, Gradle, or the Android SDK installed, so the Android project has not yet been compiled or run on a device here. The browser preview instructions above remain separate.

## Product direction

The repository contains a working browser learning game and an early native Android project. It is not a finished Android app or Play Store release; Android compilation/device testing, qualified subject-matter review, accessibility review, privacy disclosures, and store materials remain outstanding. The course is designed to build beginner foundations; it cannot guarantee expert status in 60 days.

The staged product roadmap is in [`docs/PRODUCT_PLAN.md`](docs/PRODUCT_PLAN.md), the proposed native Android architecture is in [`docs/TECHNICAL_PLAN.md`](docs/TECHNICAL_PLAN.md), and the 18-source review plus 50-item acceptance backlog is in [`docs/RESEARCH_AND_FEATURE_BACKLOG.md`](docs/RESEARCH_AND_FEATURE_BACKLOG.md). These documents distinguish planned work from features that have actually shipped.

## Content contributions

Keep all scenarios fictional and defensive. Do not add instructions that act on real systems, real accounts, or third-party networks. Keep each lesson understandable without specialist experience and explain why the safer choice helps.
