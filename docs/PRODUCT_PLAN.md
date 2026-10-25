# CyberHeist — Product Charter and Roadmap

**Status:** Working plan, 25 October 2026  
**Owner:** Ahmed  
**Product promise:** A free, game-first way to learn practical cybersecurity and become a better defender.

## 1. Product direction

CyberHeist should feel like a polished game with a coherent world, satisfying progression, and useful lessons. The player is a trainee defender working through fictional cases and contained simulations. The product teaches judgment and defensive skill; it is not a tool for attacking real systems.

The current repository is a small browser MVP. It is not an Android app and is not ready for a Play Store release. This plan separates the working prototype from the native Android product and treats the MVP as the first learning-loop experiment, not the finished project.

### Who it is for

- Beginners curious about cybersecurity.
- Learners who prefer short, interactive missions over long articles.
- Players who want to understand safe actions they can use in ordinary digital life.

The first release should explain jargon, work offline, support touch and keyboard input, and never assume that a player has a technical background.

### Product principles

1. **Free by design:** no premium tier, subscriptions, pay-to-win, or paid learning gates.
2. **Safe by construction:** missions run only inside fictional, local simulations. No real target selection, scanning, credential collection, exploit execution, or device access.
3. **Teach the reason:** every decision gets a short explanation and a chance to retry.
4. **Respect the player:** no fake announcements, invented team-size claims, fake “100% QA” badges, or unverified Play Store uniqueness claims.
5. **Private by default:** local progress first; optional online features only when their data and moderation needs are designed.
6. **Ship in reviewable steps:** each milestone has a real build, acceptance criteria, and documented limits.

### Visual identity

Use an investigative field-office language: warm paper, ink, deep forest green, and a restrained rust signal color; editorial serif headlines paired with precise compact interface typography; numbered case references, evidence cards, and a small custom case illustration. Keep the game interface focused on the current case and a short horizontal case library on phones. Avoid generic neon hacker screens, blue/purple gradients, oversized reward dashboards, and promotional labels that do not help the player.

## 2. Core game loop

1. **Briefing:** a short fictional incident establishes the context and learning objective.
2. **Investigate:** the player reviews safe artifacts such as a mock message, event log, policy, or toy network diagram.
3. **Decide:** the player selects a response or completes a constrained puzzle.
4. **Debrief:** the game explains what was strong, what was risky, and why.
5. **Progress:** mastery, badges, story chapters, and optional challenge ratings reward learning rather than speed alone.

## 3. Game modes and content map

### 60-day beginner field academy

The course pack now contains a playable mission for each of the 60 mapped days. Each day combines a short concept lesson, a fictional decision scenario, a personal-safe practice task, recall questions, and an optional private field note; Day 60 includes a multi-domain defensive assessment. This is a foundation-building route, not a promise that a beginner will become an expert in 60 days.

The intended learning outcome is a demonstrable foundation: explain core concepts, make sound personal-security choices, read a curated event timeline, write a factual case note, and complete a fictional defensive response exercise. The product must not promise expert status, employment, or professional certification after 60 days. Expertise depends on further study, supervised practice, assessment, and real experience. All course content still needs qualified subject-matter review before public release.

| Mode | Player experience | Safe simulation boundary | Release |
|---|---|---|---|
| Case Files | Investigate phishing, account alerts, privacy settings, and social engineering | Fictional messages and accounts; no links that resolve to real targets | MVP |
| Account Defense | Build better account habits and respond to login warnings | Password examples are never collected or checked; choices use toy accounts | MVP |
| Defender Desk | Triage a fictional incident using a timeline and short log excerpts | Static, curated logs with fake hosts, identities, and data | V1 |
| Secure Builder | Find risky choices in toy app, cloud, and device configurations | Constrained visual puzzles; no deployment or external requests | V1 |
| Story Campaign | Follow a connected incident-response storyline across chapters | Fictional organizations and sanitized artifacts | V1 |
| Cyber League | Compete in rotating knowledge and defense challenges | Deterministic challenges; verified scoring and no open-ended attack input | V2, after backend and abuse review |
| Lab Arcade | Replay focused puzzles for networking concepts, cryptography, and secure coding | Purpose-built toy environments with no access to the host device or internet | V2, module by module |

“Hacking topics” can be represented as defender investigations and contained puzzles. Any future offensive-security lesson needs an isolated toy target, explicit learning purpose, and a separate safety review before implementation.

## 4. Progression and free model

- XP is earned for completing lessons and reviewing explanations; replay does not farm XP.
- Chapters, cosmetic badges, and league tiers can reward consistency and mastery.
- League scoring should prioritize accuracy and improvement. Speed is a small optional tie-breaker, never the only measure.
- No paid currency, loot boxes, pay-to-win boosts, or subscription gates.
- Keep the first build account-free and offline-capable. Online leagues require an explicit product decision about optional accounts, server costs, cheating, deletion, and moderation.

## 5. Milestones and acceptance criteria

### Four-part delivery contract

Track the work in four reviewable build parts, as requested. The parts describe deliverable slices, not a claim that four messages can replace implementation, device QA, or release gates.

1. **Part 1 — Product foundation and visual/gameplay prototype:** product direction, distinct visual identity, responsive briefing desk, working first case loop, and review of the existing web experience. Delivered as a browser prototype; it is not the Android app.
2. **Part 2 — Academy and game systems:** 60-day course map, first authored lesson set, daily case rotation, field notes, content validation, and reusable progression/gameplay. The browser slice is delivered; qualified content review remains a launch requirement.
3. **Part 3 — Native Android product:** Compose app foundation, offline content/state, navigation/accessibility, device testing, and Android build pipeline. The native scaffold is in the repository and is the current slice; compiling and device verification are outstanding.
4. **Part 4 — League and release candidate:** League services and scoring integrity after privacy/moderation design, broader content/device QA, current Play Store declarations, and a verified release candidate.

Do not announce a part as complete until its listed scope is implemented and its acceptance evidence is available. The full Play Store project is complete only after Part 4 release criteria pass.

### Milestone 0 — Product and quality foundation (current)

- Maintain this charter, a clear architecture decision, and a small prioritized backlog.
- Remove misleading automation and product claims.
- Define content review and safe-simulation requirements.
- **Accept when:** each planned feature has a player outcome, safe boundary, and testable completion conditions.

### Milestone 1 — Browser learning-loop prototype (in progress)

- Responsive home screen, mission cards, decision flow, explanations, XP, and device-local progress.
- Starter content: phishing, account security, and public Wi-Fi.
- **Accept when:** the complete lesson loop works on a phone-sized and desktop-sized viewport; mission content validates; progress survives reload; keyboard and screen-reader interaction are usable; no external service is needed to play.

### Milestone 2 — Content and game foundation

- Versioned content schema and authoring guidance.
- Reusable scenario, branching decision, debrief, mastery, and replay components.
- Add Defender Desk and Secure Builder modules only after content review.
- **Accept when:** new lessons can be added without changing game-flow code; malformed content fails closed with a useful message; all player actions remain local simulations.

### Milestone 3 — Native Android foundation

- Build a native Android app with Kotlin and Jetpack Compose rather than wrapping the web page in a WebView.
- Port the proven learning loop, local progress, accessibility, and offline content.
- Set up app identity, build variants, versioning, crash-safe state, and release signing practices.
- **Accept when:** the app installs and completes core lessons on a documented device matrix; progress is retained; Android back/navigation and accessibility behavior are reviewed.

### Milestone 4 — Campaign and replayability

- Add connected story chapters, difficulty options, review cards, and more defensive game modes.
- Commission or review content with qualified cybersecurity educators before making factual claims.
- **Accept when:** each lesson has learning objectives, reviewed explanations, difficulty metadata, and a recorded content review.

### Milestone 5 — Cyber League and online services

- Design optional accounts, challenge rotation, server-authoritative scores, privacy controls, abuse reporting, and moderation before coding public competition.
- Keep a full offline learning experience if the player declines an account or the service is unavailable.
- **Accept when:** threat model, data map, retention/deletion behavior, anti-cheat design, operating cost, and support ownership are approved and implemented.

### Milestone 6 — Public release readiness

- Verify current Play policies, app metadata, privacy disclosures, accessibility, device compatibility, signing, and support contact.
- Run a closed test, resolve high-severity defects, then prepare store assets and release notes.
- **Accept when:** a release candidate passes the agreed device and content checks and all store declarations match actual app behavior.

## 6. Definition of done

A feature is done only when its user flow is implemented, content and safety boundaries are reviewed, relevant acceptance checks pass, errors have a useful recovery path, mobile and accessibility behavior are considered, and documentation describes what really shipped. A commit, mockup, generated mission, or successful page load alone is not product completion.

## 7. Immediate backlog

1. Review the current browser MVP in the local browser and fix interaction or layout issues found.
2. Add progress reset/export controls with clear confirmation and privacy copy.
3. Add a content-schema validator and readable authoring guide.
4. Improve question feedback to support retrying before showing the answer where pedagogically appropriate.
5. Add the next defensive game mode: Defender Desk, using static fictional event logs.
6. Create the Android project only after the player flow and minimum content set are agreed in this plan.

## 8. Product decisions still to verify

- Exact app name, visual identity, and availability of the name in app stores and domains.
- Initial supported language set and localization workflow.
- Intended minimum age and whether any child-directed design or policy obligations apply.
- Whether League is offline challenge tiers first or an online leaderboard later.
- Content reviewer and ongoing free hosting/support budget before online features.
