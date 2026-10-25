# CyberHeist — Research and feature backlog

**Research review:** 25 October 2026  
**Product boundary:** free, defensive learning game; fictional local scenarios only.  
**Status legend:** `LIVE` = in current browser prototype; `NEXT` = scoped for the next build slice; `LATER` = needs product/infrastructure/content work; `BLOCKED` = do not promise until a dependency is resolved.

This is a research-informed product plan, not a claim that every cybersecurity job or specialization can be taught in one app. In particular, the current 60-day route builds foundations. It cannot guarantee professional expertise. Capability should be measured through reviewed, observable tasks, not the number of days, badges, quizzes, or features shipped.

## Research set: 16 official learning, framework, or project sources

| Source | Product pattern / planning lesson | CyberHeist application |
|---|---|---|
| [Kali Linux tools and metapackages](https://www.kali.org/docs/general-use/metapackages/) | Kali groups a very broad tool collection by domain, while its tool docs point learners to help, manuals, use cases, and upstream references. | Use a domain map and tool literacy cards; do not provide arbitrary real-target tool execution in this game. |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security/learning-paths) | Curated learning paths pair explanations with topic labs and progression. | Build prerequisite-aware paths with practice and debriefs, instead of a wall of quizzes. |
| [TryHackMe rooms and paths](https://tryhackme.com/hacktivities?tab=paths) | Content is organized as paths → modules → bite-sized rooms/challenges; practical tasks are tied to a learning objective. | Use short, connected missions and optional difficulty, but make our simulations self-contained. |
| [HTB Academy](https://academy.hackthebox.com/faq) | Digestible content, command examples, hands-on checkpoints, and skills assessments support a guided-to-exploratory path. | Add a worked example, practice checkpoint, independent attempt, and clear hint/debrief sequence. |
| [CyLab Security Academy / picoCTF](https://picoctf.org/get_started.html) | A noncompetitive practice space, primer, challenge playlists, and CTF framing make practice playful and approachable. | Add optional replayable challenge sets and game narrative; maintain safe, beginner-friendly on-ramps. |
| [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) | Levels build from basics; manuals, hints, note-taking, and persistence are part of the learning loop. | Provide contextual hints and a private field notebook; use only an allow-listed simulator in-app. |
| [NIST NICE Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/getting-started) | Observable Tasks connect to Knowledge and Skills, then competency areas and work roles. | Track demonstrated skills per pathway rather than implying “expert” from course completion. |
| [NIST CSF 2.0](https://www.nist.gov/cyberframework/faqs) | Govern, Identify, Protect, Detect, Respond, and Recover are connected risk-management functions. | Balance missions across prevention, detection, response, recovery, and governance. |
| [OWASP Top 10:2025](https://top10.owasp.org/2025/) | A current application-security awareness taxonomy spans design, access, configuration, supply chain, and other failure classes. | Expand secure-building content beyond injection-only examples; use this as awareness scope, not a full AppSec syllabus. |
| [OWASP Juice Shop](https://owasp.org/projects/juice-shop) | An intentionally vulnerable training app uses challenges, varied difficulty, guided hints, and score tracking. | Use authored, isolated toy exercises; any future vulnerable target must be sandboxed and separately reviewed. |
| [OWASP WebGoat](https://owasp.org/projects/webgoat) | Guided lessons and a contained environment provide a practice loop for application security. | Keep labs self-contained, explicit about scope, and safe by default. |
| [Google Gruyere codelab](https://google-gruyere.appspot.com/) | A codelab teaches through a deliberately sandboxed toy service, with black-box and source-review perspectives plus defensive fixes. | Favor paired “spot the weakness / choose the repair” exercises; never direct learners at unrelated systems. |
| [CISA Tabletop Exercise Package](https://www.cisa.gov/resources-tools/resources/ctep-package-documents) | Scenario, objectives, discussion prompts, facilitator roles, feedback, and after-action material make exercises operational. | Build branching incident tabletop cases and structured after-action debriefs. |
| [MITRE ATT&CK](https://attack.mitre.org/resources/) | A shared taxonomy organizes adversary behavior by tactical goal and technique; it is not itself a step-by-step curriculum. | Teach defensive behavior mapping and detection coverage; avoid reproducing operational attack instructions. |
| [CyberDefenders blue-team labs](https://cyberdefenders.org/blue-team-labs/) | Investigations use fictional/curated evidence, varied artifacts, forensic questions, difficulty, and game progression. | Expand synthetic logs into distinct triage, timeline, evidence, and threat-intelligence cases. |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Downloadable challenges, difficulty, categories, points, and rank support repeatable defender practice. | Keep offline replay and skill-based scoring; no public leaderboard until privacy and integrity are designed. |
| [Sigma detection format](https://sigmahq.io/docs/basics/rules.html) | Detection rules have log sources, logic, metadata, severity, and false-positive context. | Teach detection reasoning through toy log fields and rule review; no real SIEM connection in this release. |
| [Atomic Red Team](https://www.atomicredteam.io/) | Small tests map to ATT&CK and are designed for controlled validation with cleanup considerations. | Teach the purpose of controlled validation and detection coverage conceptually; do not execute tests from the app. |

## Feature inventory: 50 scoped items

### Player foundation and game loop

| # | Feature | Status | Acceptance evidence / boundary |
|---:|---|---|---|
| 1 | Briefing desk, case library, mobile navigation | `LIVE` | Distinct routes render; touch-friendly navigation works. |
| 2 | 60-day beginner foundation path | `LIVE` | 60 mapped, playable lessons validate; not an expert promise. |
| 3 | Sequential lesson unlocks and local progress | `LIVE` | Completion persists on this device and opens the next day. |
| 4 | Feedback, retry, and shuffled answer presentation | `LIVE` | Learner sees an explanation and can retry; choice order is not fixed. |
| 5 | Local field notes | `LIVE` | Notes stay in local browser storage. Never enter secrets. |
| 6 | Learning guide and topic map | `LIVE` | Foundation and planned scope are labeled distinctly. |
| 7 | Guided first-session route | `LIVE` | Clear steps lead into an Academy lesson, case, simulation, and reflection. |
| 8 | Skill evidence record | `LIVE` | Reports completed practice counts, not professional readiness. |
| 9 | Career pathways (SOC, secure builder, governance, investigation) | `NEXT` | Each pathway maps prerequisite tasks to observable skills and references. |
| 10 | Mastery/review queue for missed concepts | `NEXT` | Incorrect or uncertain topics return in varied practice, without XP farming. |

### Practical simulation and defender work

| # | Feature | Status | Acceptance evidence / boundary |
|---:|---|---|---|
| 11 | Message-signal investigation | `LIVE` | Fictional message only; clues explained. |
| 12 | Least-permission design | `LIVE` | Toy app permission review only. |
| 13 | Network-path concept model | `LIVE` | Diagram puzzle; emits no packets. |
| 14 | Owner-led response sequence | `LIVE` | Fictional account case, authorization explicit. |
| 15 | Configuration review | `LIVE` | Toy settings; no real host changes. |
| 16 | Data minimization | `LIVE` | Synthetic signup form. |
| 17 | Secure code-pattern review | `LIVE` | Text-only fictional diff; no payload execution. |
| 18 | Alert prioritization | `LIVE` | Fictional queue with contextual debrief. |
| 19 | Recovery sequence | `LIVE` | Fictional restore plan; no files or backups touched. |
| 20 | Evidence register / chain-of-custody basics | `LIVE` | Sort fictional evidence-handling steps; no acquisition. |
| 21 | Dependency / provenance review | `LIVE` | Fictional release checklist; no package download. |
| 22 | Data classification | `LIVE` | Learner labels synthetic records using a stated policy. |
| 23 | Incident update writing sequence | `LIVE` | Sort factual communication steps; no external messaging. |
| 24 | Access recertification | `LIVE` | Identify stale/excessive fictional grants; no accounts touched. |
| 25 | Evidence confidence labeling | `LIVE` | Classify facts, inference, and unknowns from a synthetic bundle. |
| 26 | Cloud sharing posture review | `LIVE` | Fictional configuration; no cloud API. |
| 27 | Secure release-gate sequence | `LIVE` | Conceptual lifecycle; no build or deployment. |
| 28 | Vendor risk intake | `LIVE` | Identify owner questions; no real vendor decision. |
| 29 | Scenario-based risk prioritization | `LIVE` | Ranking exercise; explains assumptions and limitations. |
| 30 | Backup readiness check | `LIVE` | Evaluate fictional restore evidence; no backup system connected. |
| 31 | Synthetic event-log terminal | `LIVE` | Exact allow-list over fixed in-memory artifacts; not a shell. |
| 32 | Multi-source timeline reconstruction | `NEXT` | Correlate varied synthetic log sources; timestamps and provenance visible. |
| 33 | Phishing artifact triage / safe message analysis | `NEXT` | Sanitized offline artifacts only; no live message submission. |
| 34 | Detection-rule authoring and false-positive tuning | `NEXT` | Structured toy rule builder over fixed events; no SIEM integration. |
| 35 | Threat model / abuse-case map | `NEXT` | Identify assets, trust boundaries, and mitigations in a toy design. |
| 36 | Branching incident-response tabletop with after-action review | `NEXT` | Fictional injects, role ownership, comms, recovery, and lessons captured locally. |
| 37 | Toy access-control matrix and authorization review | `NEXT` | Static roles/resources; no user data or real credentials. |
| 38 | Cryptography and certificate literacy puzzles | `NEXT` | Conceptual and precomputed examples; no encryption of user data or key storage. |
| 39 | Mobile privacy and secure-settings scenarios | `NEXT` | Simulated Android settings; no inspection of installed apps or permissions. |
| 40 | Beginner networking and DNS/TLS visual explorer | `NEXT` | Animated fictional path and definitions; no network discovery. |

### Platform, social play, and release work

| # | Feature | Status | Acceptance evidence / dependency |
|---:|---|---|---|
| 41 | Optional progress export/reset controls | `NEXT` | Clear confirmation, local-only export format, privacy copy, and reset recovery behavior. |
| 42 | Accessibility verification | `NEXT` | Screen-reader semantics, text scaling, contrast, keyboard, reduced motion checked across flows. |
| 43 | Content versioning and review ledger | `NEXT` | Source attribution, reviewer, date, and content version visible to maintainers. |
| 44 | Hindi/English localization workflow | `LATER` | Glossary consistency and educator/language review; no machine-only translation claims. |
| 45 | Replayable seasons and varied daily operations | `LATER` | Rotating scenario variants preserve learning outcomes and do not reward speed alone. |
| 46 | Offline league tiers | `LATER` | Rank based on mastery across domains; no backend required. |
| 47 | Online accounts, leagues, and leaderboard | `BLOCKED` | Requires threat model, privacy/retention/deletion, server-authoritative scores, anti-cheat, moderation, budget, support owner. |
| 48 | Android Compose feature parity and device QA | `LATER` | Port each browser learning loop, compile, install, and verify on a documented device matrix; current scaffold has not passed that gate. |
| 49 | Play Store release candidate | `BLOCKED` | Current policy declarations, accessibility, signing, metadata, support, privacy, and closed-test criteria pass. |
| 50 | External curriculum review and outcome study | `NEXT` | Qualified educators review content; learners demonstrate transfer on novel, bounded tasks before any readiness claim. |

## How we will measure learning honestly

The app will not display “X% cybersecurity expert” based on days completed. NICE describes work in observable task, knowledge, and skill statements; a defensible percentage requires choosing a bounded target role/domain, mapping reviewed tasks to it, and observing performance on novel tasks. Until that mapping and assessment exist, the honest expert-readiness percentage is **not measured**. The prototype can display only what the learner has completed (e.g., 20 visual simulations and 60 foundation lessons), with a notice that course completion is not certification or professional qualification.

## Immediate engineering slice completed with this review

- Expanded the browser practice floor from 9 to 20 visual simulations and kept the synthetic read-only terminal as a separate exercise.
- Added hands-on classification controls in addition to clue selection and step ordering.
- Added distinct scenarios for evidence handling, supply-chain review, communication, access recertification, evidence confidence, cloud-sharing posture, release gates, vendor review, risk ranking, and backup readiness.
- All new exercises use fixed fictional artifacts and local controls; no shell commands, scanning, device access, cloud integration, or network traffic were added.
- Follow-up: Android parity, richer branching, reviewed content, accessibility audit, and outcome assessment remain open work.
