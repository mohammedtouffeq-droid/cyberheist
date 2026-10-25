# CyberHeist

CyberHeist is a free, browser-based cybersecurity awareness game. Players learn through short, fictional scenarios about phishing, account protection, and safer public Wi-Fi choices.

## Safety and privacy

- Missions are simulations. The app does not scan networks, connect to targets, crack passwords, or access accounts.
- Progress is stored in this browser on this device using local storage. There are no accounts, analytics, ads, purchases, or subscriptions in this MVP.
- Mission content is bundled in `missions.json`; the game does not need an AI service or API key.
- Never use a training exercise to access a real account or system without explicit authorization.

## Run locally

The app uses `fetch()` to load its mission file, so open it through a local static web server rather than double-clicking `index.html`.

With Python installed, run this from the project directory:

```powershell
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Project structure

- `index.html` — accessible page structure and mission dialog
- `style.css` — responsive visual design
- `game.js` — mission flow, scoring, and local progress
- `missions.json` — reviewed, fictional learning scenarios

## Product direction

This repository currently contains a web game, not an Android application. The Android/Play Store release is a separate product milestone that needs an Android project, device testing, privacy disclosures, and store materials. The first release target here is a safe, usable learning-game MVP that can be previewed locally.

## Content contributions

Keep all scenarios fictional and defensive. Do not add instructions that act on real systems, real accounts, or third-party networks. Keep each lesson understandable without specialist experience and explain why the safer choice helps.
