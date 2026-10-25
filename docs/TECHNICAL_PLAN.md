# CyberHeist — Technical Plan

**Status:** Proposed architecture for staged delivery  
**Decision owner:** Ahmed  
**Last updated:** 25 October 2026

## Current repository

The repository has a static browser prototype (`index.html`, `style.css`, `game.js`) plus an initial native Android Compose app in `android/`. Both load the same bundled course map and playable mission pack. There is no product server, user account, analytics, or online multiplayer. The browser preview uses a local static web server because it loads mission data with `fetch()`.

The browser prototype now includes separate Briefing, Guide, Case, Practice, and Record views; a searchable 60-case library; 20 self-contained interactive practice simulations across selection, ordering, and classification interactions; a step-by-step terminal guide over one fixed fictional log bundle; local notes; sequential Academy unlocks; and mastery-gated XP with shuffled answer presentation. The Guide distinguishes live prototype exercises from planned specialist content; the complete 50-item inventory and research set are in `docs/RESEARCH_AND_FEATURE_BACKLOG.md`. These browser systems are still a prototype; the Android project requires guide, practice-lab, terminal, filtering, and note-composer parity work, an Android SDK build, and device testing before it can be considered a working Android release.

## Android direction

Build the Play Store client as a native Android application using Kotlin and Jetpack Compose. Avoid putting the web app in a WebView as the final product: the game needs native navigation, accessibility, robust offline state, platform lifecycle behavior, and a maintainable path to device testing.

### Client layers

- **UI:** Compose screens, navigation, theme, accessibility semantics, animations, and responsive layouts.
- **Presentation:** ViewModels expose screen state and handle player actions without embedding content policy in UI components.
- **Domain:** typed mission, decision, scoring, mastery, and progression models; pure rules for scoring and unlocks.
- **Content:** versioned bundled lesson packs with schema/version validation. A malformed lesson is rejected and reported without crashing the app.
- **Storage:** DataStore for completed lessons, answers, notes, and small progression settings. Keep first release data on-device.
- **Network:** absent from the first release. Add only behind an explicit future feature decision, with authenticated, server-validated league operations.

### Suggested package boundaries

```text
app/
  navigation/
  feature/home/
  feature/mission/
  feature/progress/
core/model/
core/content/
core/storage/
core/designsystem/
```

Keep the first native build modular without introducing extra frameworks until a concrete need appears. Maintain a single source of truth for lesson state and scoring rules.

### Native foundation status

The current `android/app` contains Compose screens for Briefing, Academy, Cases, Notes, the learning record, and a decision/debrief flow. Bundled `curriculum.json` and `missions.json` are parsed into typed Kotlin models. Preferences DataStore persists XP, completed mission IDs, streak, and player-authored field notes. The package ID and target SDK are provisional; no network permission, accounts, analytics, ads, or multiplayer are included. The project has not been compiled or exercised on an Android device because the current workspace has no JDK or Android SDK. Keep player notes free of passwords, recovery codes, and other secrets.

## Lesson content model

Each lesson should be data, not executable code. A reviewed lesson includes:

- stable ID and content version
- title, category, difficulty, estimated duration, and XP cap
- plain-language learning objective and fictional scenario
- ordered decisions with bounded answer choices
- correct/acceptable responses and short explanations
- safety classification and reviewer metadata

The browser prototype separates the 60-day outline (`curriculum.json`) from playable scenario content (`missions.json`); the current pack maps each course day to a playable mission. Day 7 includes a static fictional evidence timeline rendered as text. `scripts/build_course_pack.py` rebuilds the data pack, and `scripts/validate_content.py` checks day coverage, lesson references, answer indexes, field-guide and practice copy, evidence fields, and required explanations; these structural checks do not replace qualified subject-matter review.

The renderer must treat lesson text as text, not markup or commands. The client must not interpret a lesson as a URL to visit, an arbitrary shell command to execute, a network target to inspect, or a credential to capture. The browser training terminal accepts only exact allow-listed commands over a hard-coded fictional dataset. Remote content, if ever introduced, is untrusted input and must pass the same schema and review rules as bundled content.

## Privacy and security baseline

- No real passwords, one-time codes, personal documents, or account credentials are requested.
- No network permission is needed for the offline learning release.
- No ad SDK, analytics SDK, or third-party tracker in the first release.
- Clearly explain local progress and provide a player-controlled reset/delete path before release.
- Do not store sensitive personal data in progress records.
- Online League design must include server-authoritative score checks, abuse controls, data minimization, account deletion, and a privacy/security review before implementation.
- Do not store production signing keys or service credentials in source control.

## Web prototype quality gates

Before using the browser prototype as a behavior reference:

- Validate mission schema, IDs, answer indexes, XP bounds, and required explanations.
- Review the full flow with touch and keyboard input at mobile and desktop sizes.
- Confirm progress persistence and recovery when storage is unavailable or malformed.
- Check accessible labels, focus movement, color contrast, reduced motion, and useful error states.
- Review every scenario for fictional data and safe defensive learning.
- Every guided exercise names its objective, prerequisites, exact player actions, permitted scope, expected outcome, and recovery/help path.
- Research maps knowledge to NIST NICE Tasks/Knowledge/Skills and CSF 2.0 outcomes; AppSec awareness material tracks the then-current OWASP Top 10 while remaining clearly distinct from comprehensive secure-development training.

## Release and delivery controls

- No scheduled AI content generation or automated direct push to the default branch.
- Changes should be reviewable by branch/commit and use evidence-based release notes.
- CI should validate formatting, content schema, and build output once the project has a repeatable build setup.
- Android release signing should use protected environment secrets; never commit keystores or credentials.
- Keep milestone status honest: planned, implemented, verified, and released are distinct states.
- Before a Play Store submission, review the then-current [Google Play review preparation requirements](https://support.google.com/googleplay/android-developer/answer/9859455) and [User Data and Data safety policy](https://support.google.com/googleplay/android-developer/answer/10144311). Privacy-policy and Data safety declarations must describe the app and any included SDKs accurately; store acceptance cannot be guaranteed by the project team.

## Architecture decision record

### ADR-001: Native Android app after browser learning-loop validation

**Decision:** Keep the current web prototype as a low-cost gameplay experiment, then build the Play Store client natively in Kotlin/Jetpack Compose.

**Why:** The stated destination is Android/Play Store, while the current repository is static web. A native client gives a direct route to Android lifecycle, accessibility, offline storage, and device QA. The prototype remains useful for validating lessons without being misrepresented as the app.

**Tradeoff:** Some interface and gameplay logic will be implemented again in Kotlin. Keep lesson content and scoring rules documented and versioned so the learning design can transfer cleanly.

**Revisit when:** A validated cross-platform distribution goal or a concrete web-first release requirement outweighs the native Android benefits.
