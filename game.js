/* CyberHeist is a local-only learning game. All actions run against fictional scenarios. */
const STORAGE_KEY = 'cyberheist.learning.v1';
const LABS = {
  'signal-hunt': {
    title: 'Signal Hunt',
    category: 'MESSAGE ANALYSIS',
    mode: 'select',
    workbenchTitle: 'MARK THE SIGNALS THAT NEED A SEPARATE CHECK',
    brief: 'Inspect the fictional service message. Mark the details that deserve verification before you act.',
    artifact: 'Fictional message: “Your club membership will close in 10 minutes. Confirm your account at club-help.example and pay a reactivation fee.”',
    items: [
      { label: 'Unexpected reactivation fee', clue: true },
      { label: 'A deadline designed to rush the reader', clue: true },
      { label: 'A sign-in link supplied inside the message', clue: true },
      { label: 'The message mentions a club membership', clue: false },
    ],
    debrief: 'Pressure, unexpected payment, and a message-provided sign-in route are clues to verify separately. The club name alone is not proof either way.',
  },
  'permission-desk': {
    title: 'Permission Desk',
    category: 'ACCESS DESIGN',
    mode: 'select',
    workbenchTitle: 'GRANT ONLY WHAT THE FEATURE NEEDS',
    brief: 'A fictional flashlight utility needs to turn its light on. Select only the permission needed for that job.',
    artifact: 'Toy app request: Camera (controls the light), Contacts, Location, Microphone.',
    items: [
      { label: 'Camera', clue: true },
      { label: 'Contacts', clue: false },
      { label: 'Location', clue: false },
      { label: 'Microphone', clue: false },
    ],
    debrief: 'Grant only the access the feature needs, and revisit it if the feature changes. A permission prompt is not a reason to approve everything.',
  },
  'packet-route': {
    title: 'Packet Route',
    category: 'NETWORK CONCEPTS',
    mode: 'order',
    workbenchTitle: 'ARRANGE THE SIMPLIFIED CONNECTION PATH',
    brief: 'Put the fictional connection path in order. This is a paper model; it sends no packets and uses no real addresses.',
    artifact: 'Arrange the components from the learner’s device toward the requested service.',
    items: [
      { label: 'Learner device', clue: true },
      { label: 'Local router / access point', clue: true },
      { label: 'Internet service path', clue: true },
      { label: 'Destination service', clue: true },
    ],
    debrief: 'The route is a simplified model. DNS lookup helps resolve a domain name separately; it is not a router hop on every packet. A path also does not prove the service is trustworthy.',
  },
  'response-runbook': {
    title: 'Response Runbook',
    category: 'INCIDENT RESPONSE',
    mode: 'order',
    workbenchTitle: 'ARRANGE A CALM RESPONSE',
    brief: 'Order a calm response for a fictional account alert. Stay within the account owner’s authority.',
    artifact: 'A person reports an unexpected sign-in alert. No one has confirmed whether the account was accessed.',
    items: [
      { label: 'Confirm the report and record observable facts', clue: true },
      { label: 'Use the official account route to secure access; involve the account owner', clue: true },
      { label: 'Review active sessions and recovery options with the owner', clue: true },
      { label: 'Document what changed and what remains unknown', clue: true },
    ],
    debrief: 'A useful response preserves facts, acts through an authorized route, checks recovery and sessions, then records outcomes and uncertainty. Never collect or share the person’s password or codes.',
  },
  'config-audit': {
    title: 'Configuration Audit',
    category: 'SECURE CONFIGURATION',
    mode: 'select',
    workbenchTitle: 'FLAG THE SETTINGS THAT NEED A FIX',
    brief: 'Review a fictional service configuration. Select the choices that create avoidable exposure.',
    artifact: 'Toy review: remote administration is open to every network; a shared default admin password is still active; updates come from the official vendor channel; a session token appears in a debug log; read access is limited to the service role.',
    items: [
      { label: 'Remote administration open to every network', clue: true },
      { label: 'Shared default administrator password', clue: true },
      { label: 'Updates installed from the official vendor channel', clue: false },
      { label: 'Session token written into a debug log', clue: true },
      { label: 'Read access limited to the service role', clue: false },
    ],
    debrief: 'Restrict management access, replace shared defaults with managed unique credentials, and keep tokens out of logs. The fictional configuration should be corrected by its authorized owner and reviewed before release.',
  },
  'data-minimizer': {
    title: 'Data Minimizer',
    category: 'PRIVACY DESIGN',
    mode: 'select',
    workbenchTitle: 'KEEP ONLY DATA NEEDED FOR THE TASK',
    brief: 'A fictional community sends a monthly email bulletin. Choose the data required to deliver it.',
    artifact: 'Toy signup form proposes: email address, full birth date, government ID, home address, and optional topic preferences.',
    items: [
      { label: 'Email address for delivery', clue: true },
      { label: 'Full birth date', clue: false },
      { label: 'Government ID number', clue: false },
      { label: 'Home address', clue: false },
      { label: 'Optional topic preferences', clue: false },
    ],
    debrief: 'Only the email address is necessary to deliver the bulletin. Make preferences optional, explain why any data is collected, and provide a clear way to stop future mail.',
  },
  'code-review': {
    title: 'Secure Code Review',
    category: 'SECURE DEVELOPMENT',
    mode: 'select',
    workbenchTitle: 'MARK THE CODE REVIEW FINDINGS',
    brief: 'Review a fictional change request. Select patterns a developer should fix before release.',
    artifact: 'Toy code review: user text is inserted into a database query by string concatenation; the current user role is checked before showing a record; user-provided text is rendered as trusted HTML; display names are length- and format-validated.',
    items: [
      { label: 'Concatenate user input into a database query', clue: true },
      { label: 'Check the user role before showing a record', clue: false },
      { label: 'Render user-provided text as trusted HTML', clue: true },
      { label: 'Validate display-name length and allowed format', clue: false },
    ],
    debrief: 'Use parameterized queries for database values and context-aware output encoding for untrusted text. Keep authorization checks and bounded input validation. This puzzle reviews defensive code patterns; it does not run or exploit code.',
  },
  'alert-triage': {
    title: 'Alert Queue',
    category: 'SECURITY OPERATIONS',
    mode: 'order',
    workbenchTitle: 'ORDER BY URGENCY, THEN INVESTIGATE',
    brief: 'Rank a small fictional alert queue from highest to lowest immediate concern. Context and confirmation still matter.',
    artifact: 'Four toy alerts: confirmed exposure of a shared administrator credential; an account owner reports an unfamiliar active session; one denied MFA challenge with no success event; a routine update failed on a test device.',
    items: [
      { label: 'Confirmed exposure of a shared administrator credential', clue: true },
      { label: 'Owner reports an unfamiliar active session', clue: true },
      { label: 'One denied MFA challenge; no successful sign-in seen', clue: true },
      { label: 'Routine update failed on a test device', clue: true },
    ],
    debrief: 'Prioritize the confirmed high-impact exposure, then the owner-reported active session, then the isolated denied challenge, then the routine test-device update issue. Severity is a starting point; responders verify evidence and follow their authority.',
  },
  'recovery-check': {
    title: 'Recovery Check',
    category: 'BACKUP & RECOVERY',
    mode: 'order',
    workbenchTitle: 'ORDER A CONTROLLED RECOVERY',
    brief: 'A fictional team is restoring a service after a disruption. Put its defensive recovery steps in order.',
    artifact: 'Arrange: verify service and recovery owner; choose a known-good backup; restore in the approved recovery environment; validate operation and record the outcome.',
    items: [
      { label: 'Confirm the service owner, impact, and recovery scope', clue: true },
      { label: 'Select a known-good backup and verify its timestamp', clue: true },
      { label: 'Restore through the approved recovery environment', clue: true },
      { label: 'Check normal operation and document the result', clue: true },
    ],
    debrief: 'Recovery needs an owner and a defined scope, a known-good source, an approved restore path, and a validation step. A backup is only useful when it can be restored and checked.',
  },
};

const fallbackMissions = [
  {
    id: 'phishing-first-look', title: 'The too-good-to-be-true parcel', category: 'SPOT THE SCAM', tone: 'orange', difficulty: 'Starter', duration: '3 min', xp: 60,
    description: 'Learn to slow down and verify a message before you click.',
    day: 1, lesson: 'Scams may look like familiar services. Pause when a message pressures you or asks for payment or sign-in through an unexpected link. Verify the request separately through an official app or a known address.',
    takeaway: 'Pause when a message pressures you. Verify through an official route you choose yourself.',
    scenario: 'A fictional delivery company texts you: “Your package is paused. Pay a small fee now at parcel-help.example.” You were not expecting a delivery.',
    questions: [
      { prompt: 'What is the safest first move?', options: ['Open the link to see what it asks for', 'Use the delivery company’s official app or website to check independently', 'Reply with your full name so support can find your parcel'], answer: 1, explanation: 'Go to a service through a trusted route you choose yourself. Unexpected urgency and a payment link are reasons to pause.' },
      { prompt: 'What should you do with the unexpected message?', options: ['Forward it to friends to ask if it looks real', 'Report it as spam or phishing, then delete it', 'Keep it and try the link later'], answer: 1, explanation: 'Reporting helps your messaging provider improve filtering. You do not need to interact with a suspicious link.' },
      { prompt: 'Which clue deserves extra scrutiny?', options: ['The message creates urgency and asks for payment through an unfamiliar link', 'It arrived on a weekday', 'It uses a short greeting'], answer: 0, explanation: 'Unexpected payment requests, pressure, and unfamiliar domains are useful warning signs. Verify using a separate trusted channel.' }
    ]
  },
  {
    id: 'password-power-up', title: 'Lock down your account', category: 'ACCOUNT DEFENSE', tone: 'purple', difficulty: 'Starter', duration: '4 min', xp: 70,
    description: 'Build a stronger password and add a second layer of protection.',
    day: 2, lesson: 'Use a different long password for every account; a reputable password manager can help. Add another sign-in factor where available. Never approve an alert you did not start or share a one-time code.',
    takeaway: 'Use a unique long sign-in secret for each account, and turn on a strong second factor.',
    scenario: 'You are setting up a new fictional gaming account. A friend suggests reusing the password you use for email because it is easy to remember.',
    questions: [
      { prompt: 'What is the strongest password habit?', options: ['Reuse one memorable password everywhere', 'Use a unique, long password for each account, ideally stored in a password manager', 'Add “123” to your usual password'], answer: 1, explanation: 'Unique passwords limit the damage if one service is breached. A reputable password manager can help create and store them.' },
      { prompt: 'What extra protection should you turn on?', options: ['Multi-factor authentication (MFA), preferably a passkey or authenticator method', 'A public profile so friends can confirm it is you', 'The same password hint as your other accounts'], answer: 0, explanation: 'MFA asks for another proof of identity. Passkeys and authenticator methods are generally safer than relying on a password alone.' },
      { prompt: 'A login alert arrives that you did not request. What now?', options: ['Approve it so the alert stops', 'Deny it, change your password from the official app/site, and review account sessions', 'Share the alert code with whoever contacts you'], answer: 1, explanation: 'Never approve a sign-in you did not start or share a one-time code. Use the official service to secure the account and check active sessions.' }
    ]
  },
  {
    id: 'public-wifi-check', title: 'The café Wi-Fi check', category: 'SAFE CONNECTIONS', tone: 'green', difficulty: 'Explorer', duration: '4 min', xp: 70,
    description: 'Make safer choices when connecting on a public network.',
    day: 3, lesson: 'A network name is only a label. Confirm the official name before joining. For sensitive activity use a connection you trust and the service official app or site. Encryption does not make every page or request trustworthy.',
    takeaway: 'Confirm the network name and keep sensitive activity on a trusted connection and official app.',
    scenario: 'At a café, two networks appear: “Cafe Guest” on the menu and “Cafe_Free_Fast” with a stronger signal. You need to check a bank notification.',
    questions: [
      { prompt: 'Which network should you choose?', options: ['The strongest signal, even if you do not know who runs it', 'Confirm the official network name with staff before connecting', 'Both networks because public Wi-Fi is always encrypted'], answer: 1, explanation: 'A familiar-looking network name can be imitated. Confirm the correct network with staff before joining.' },
      { prompt: 'What is the safer way to check the bank notification?', options: ['Use your mobile connection and the official banking app', 'Follow a banking link from a pop-up on the Wi-Fi page', 'Install a certificate the network asks you to download'], answer: 0, explanation: 'For sensitive accounts, a trusted mobile connection and official app reduce exposure to untrusted networks and fake login pages.' },
      { prompt: 'A page warns that your device is infected and offers a download. What should you do?', options: ['Install it immediately to stay protected', 'Close the page and use your device’s trusted security settings or official support', 'Enter your device password to dismiss the warning'], answer: 1, explanation: 'Unexpected security pop-ups can be scams. Do not install software or enter credentials from an unsolicited page.' }
    ]
  }
];

function readProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      xp: Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : 0,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id) => typeof id === 'string') : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes.filter((note) => note && typeof note.missionId === 'string' && typeof note.text === 'string').slice(0, 100) : [],
      labsCompleted: Array.isArray(parsed.labsCompleted) ? parsed.labsCompleted.filter((id) => typeof id === 'string') : [],
      terminalLabCompleted: parsed.terminalLabCompleted === true,
      lastPlayed: typeof parsed.lastPlayed === 'string' ? parsed.lastPlayed : null,
      streak: Number.isFinite(parsed.streak) ? Math.max(0, parsed.streak) : 0
    };
  } catch {
    return { xp: 0, completed: [], notes: [], labsCompleted: [], terminalLabCompleted: false, lastPlayed: null, streak: 0 };
  }
}

class CyberHeistGame {
  constructor() {
    this.progress = readProgress();
    this.missions = [];
    this.curriculum = null;
    this.activeMission = null;
    this.questionIndex = 0;
    this.correctAnswers = 0;
    this.answered = false;
    this.displayOrder = [];
    this.displayAnswerIndex = -1;
    this.activeLab = null;
    this.returnMission = null;
    this.labSelection = new Set();
    this.labOrder = [];
    this.terminalStep = 'inspect';
    this.terminalEvidenceInspected = false;
    this.terminalHistory = [];
    this.terminalHistoryIndex = 0;
    this.toastTimer = null;
    this.grid = document.getElementById('missionGrid');
    this.labGrid = document.getElementById('labGrid');
    this.caseSearch = document.getElementById('caseSearch');
    this.caseCategory = document.getElementById('caseCategory');
    this.dialog = document.getElementById('missionDialog');
    this.academyDialog = document.getElementById('academyDialog');
    this.notesDialog = document.getElementById('notesDialog');
    this.stage = document.getElementById('missionStage');
    this.toast = document.getElementById('toast');
    this.bindEvents();
    this.navigate(this.routeFromHash(), { updateHistory: false, scroll: false });
    this.loadMissions();
  }

  bindEvents() {
    document.getElementById('closeDialog').addEventListener('click', () => this.dialog.close());
    document.getElementById('closeAcademy').addEventListener('click', () => this.academyDialog.close());
    document.getElementById('closeNotes').addEventListener('click', () => this.notesDialog.close());
    ['academyButton', 'academyRailButton', 'academyMobileButton'].forEach((id) => {
      document.getElementById(id).addEventListener('click', () => this.openAcademy());
    });
    ['notesButton', 'notesRailButton', 'notesMobileButton'].forEach((id) => {
      document.getElementById(id).addEventListener('click', () => this.openNotes());
    });
    this.caseSearch.addEventListener('input', () => this.renderCases());
    this.caseCategory.addEventListener('change', () => this.renderCases());
    this.labGrid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-lab-id]');
      if (button) this.startLab(button.dataset.labId);
    });
    this.stage.addEventListener('click', (event) => {
      const clue = event.target.closest('[data-lab-choice]');
      if (clue) {
        const index = Number(clue.dataset.labChoice);
        if (this.labSelection.has(index)) this.labSelection.delete(index);
        else this.labSelection.add(index);
        clue.classList.toggle('selected', this.labSelection.has(index));
        return;
      }
      const relatedLab = event.target.closest('[data-related-lab]');
      if (relatedLab) {
        this.startLab(relatedLab.dataset.relatedLab, true);
        return;
      }
      const move = event.target.closest('[data-lab-move]');
      if (move) {
        const index = Number(move.dataset.labMove);
        const next = index + Number(move.dataset.direction);
        if (next >= 0 && next < this.labOrder.length) {
          [this.labOrder[index], this.labOrder[next]] = [this.labOrder[next], this.labOrder[index]];
          this.renderLab();
        }
        return;
      }
      if (event.target.closest('[data-lab-check]')) this.checkLab();
      if (event.target.closest('[data-lab-retry]')) return;
    });
    document.getElementById('manualNoteInput').addEventListener('input', (event) => {
      document.getElementById('manualNoteCount').textContent = `${event.target.value.length} / 280`;
    });
    document.getElementById('manualNoteForm').addEventListener('submit', (event) => {
      event.preventDefault();
      this.saveManualNote();
    });
    document.querySelectorAll('[data-route-link]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const route = link.dataset.routeLink || link.getAttribute('href')?.slice(1);
        this.navigate(route);
      });
    });
    window.addEventListener('hashchange', () => this.navigate(this.routeFromHash(), { updateHistory: false }));
    document.getElementById('terminalForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('terminalCommand');
      this.runTerminalCommand(input.value);
      input.value = '';
      input.focus();
    });
    document.getElementById('terminalCommand').addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp' && this.terminalHistory.length) {
        event.preventDefault();
        this.terminalHistoryIndex = Math.max(0, this.terminalHistoryIndex - 1);
        event.target.value = this.terminalHistory[this.terminalHistoryIndex] || '';
      } else if (event.key === 'ArrowDown' && this.terminalHistory.length) {
        event.preventDefault();
        this.terminalHistoryIndex = Math.min(this.terminalHistory.length, this.terminalHistoryIndex + 1);
        event.target.value = this.terminalHistory[this.terminalHistoryIndex] || '';
      }
    });
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.dialog.close();
    });
    this.grid.addEventListener('click', (event) => {
      const button = event.target.closest('[data-mission-id]');
      if (!button || button.disabled) return;
      const mission = this.missions.find((item) => item.id === button.dataset.missionId);
      if (mission) this.startMission(mission);
    });
    this.stage.addEventListener('click', (event) => {
      const answer = event.target.closest('[data-answer-index]');
      if (answer && !this.answered) this.answerQuestion(Number(answer.dataset.answerIndex));
      if (event.target.closest('[data-next]')) this.nextStep();
      if (event.target.closest('[data-finish]')) {
        this.dialog.close();
        this.render();
      }
      if (event.target.closest('[data-save-note]')) this.saveFieldNote();
    });
    document.getElementById('academyModules').addEventListener('click', (event) => {
      const dayButton = event.target.closest('[data-day-mission]');
      if (!dayButton) return;
      const mission = this.missions.find((item) => item.id === dayButton.dataset.dayMission);
      if (!mission) return;
      this.academyDialog.close();
      this.startMission(mission);
    });
  }

  routeFromHash() {
    const route = window.location.hash.replace(/^#/, '');
    return document.getElementById(route)?.matches('[data-route-view]') ? route : 'home';
  }

  navigate(route, { updateHistory = true, scroll = true, focus = scroll } = {}) {
    const target = document.getElementById(route)?.matches('[data-route-view]') ? document.getElementById(route) : null;
    const selectedRoute = target ? route : 'home';
    document.querySelectorAll('[data-route-view]').forEach((view) => {
      view.hidden = view.id !== selectedRoute;
    });
    this.currentRoute = selectedRoute;
    document.querySelectorAll('.nav-link, .mobile-link').forEach((item) => {
      const itemRoute = item.dataset.routeLink || item.getAttribute('href')?.replace(/^#/, '');
      item.classList.toggle('active', itemRoute === selectedRoute);
    });
    const nextHash = `#${selectedRoute}`;
    if (updateHistory && window.location.hash !== nextHash) history.pushState(null, '', nextHash);
    if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
    if (focus) {
      const heading = target?.querySelector('h1, h2');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }

  async loadMissions() {
    try {
      const response = await fetch('missions.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Mission file unavailable');
      const data = await response.json();
      if (!Array.isArray(data.missions) || !data.missions.length) throw new Error('No missions found');
      this.missions = data.missions;
    } catch {
      this.missions = fallbackMissions;
      this.showToast('Using the built-in mission pack.');
    }
    try {
      const response = await fetch('curriculum.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('Course map unavailable');
      this.curriculum = await response.json();
    } catch {
      this.curriculum = null;
      this.showToast('Course map is unavailable right now.');
    }
    this.render();
  }

  render() {
    const completedCount = this.missions.filter((mission) => this.progress.completed.includes(mission.id)).length;
    const level = this.getLevel(this.progress.xp);
    document.getElementById('levelValue').textContent = level.name;
    document.getElementById('xpValue').textContent = `${this.progress.xp} XP`;
    document.getElementById('xpProgress').style.width = `${level.progress}%`;
    document.getElementById('completedValue').textContent = `${completedCount} / ${this.missions.length}`;
    document.getElementById('recordMark').textContent = `${this.progress.labsCompleted.length} / ${Object.keys(LABS).length} LABS`;
    document.getElementById('recordCaseDetail').textContent = `${completedCount} ${completedCount === 1 ? 'case' : 'cases'}`;
    document.getElementById('recordLabDetail').textContent = `${this.progress.labsCompleted.length} of ${Object.keys(LABS).length}`;
    document.getElementById('recordTerminalDetail').textContent = this.progress.terminalLabCompleted ? 'Completed' : 'Not completed';
    document.getElementById('missionCount').textContent = `${String(this.missions.length).padStart(2, '0')} CASES  /  AVAILABLE`;
    const streakValue = document.getElementById('streakValue');
    const dayLabel = document.createElement('small');
    dayLabel.textContent = this.progress.streak === 1 ? 'DAY' : 'DAYS';
    streakValue.replaceChildren(document.createTextNode(String(this.progress.streak)), dayLabel);
    const dailyMission = this.getDailyMission();
    if (dailyMission) {
      const dayNumber = Number.isInteger(dailyMission.day) ? dailyMission.day : 1;
      document.getElementById('featuredTitle').textContent = dailyMission.title;
      document.getElementById('featuredDescription').textContent = dailyMission.description;
      document.getElementById('featuredReference').textContent = `DAY ${String(dayNumber).padStart(2, '0')} / 60`;
      document.getElementById('featuredWatermark').textContent = String(dayNumber).padStart(2, '0');
      document.getElementById('featuredXp').textContent = `+${dailyMission.xp} XP`;
      document.querySelector('.featured-kicker').textContent = `DAY ${String(dayNumber).padStart(2, '0')} · ${String(dailyMission.duration).toUpperCase()}`;
    }
    const noteCount = String(this.progress.notes.length).padStart(2, '0');
    document.getElementById('noteCount').textContent = noteCount;
    document.getElementById('mobileNoteCount').textContent = noteCount;
    document.getElementById('startFeatured').onclick = () => {
      const mission = this.getDailyMission();
      if (mission) this.startMission(mission);
    };
    this.renderCategoryOptions();
    this.renderCases();
    this.renderLabs();
  }

  runTerminalCommand(rawCommand) {
    const command = String(rawCommand || '').trim().replace(/\s+/g, ' ');
    const output = document.getElementById('terminalOutput');
    if (!command) return;
    this.terminalHistory.push(command);
    this.terminalHistory = this.terminalHistory.slice(-30);
    this.terminalHistoryIndex = this.terminalHistory.length;
    const entered = document.createElement('p');
    entered.className = 'terminal-line terminal-command';
    entered.textContent = `trainee@field-lab:~$ ${command}`;
    output.append(entered);
    const write = (text, kind = '') => {
      const line = document.createElement('p');
      line.className = `terminal-line${kind ? ` ${kind}` : ''}`;
      line.textContent = text;
      output.append(line);
    };
    const files = {
      'auth.log': [
        '08:12:02 user=amina event=LOGIN result=SUCCESS src=203.0.113.10 device=known',
        '08:19:44 user=amina event=MFA_DENIED result=DENIED src=198.51.100.23 device=unknown',
        '08:20:05 user=amina event=PASSWORD_RESET result=REQUESTED src=198.51.100.23 channel=unverified',
        '08:20:52 user=amina event=SESSION_REVOKED result=SUCCESS src=203.0.113.10 actor=account-owner',
      ],
      'asset-baseline.csv': [
        'asset,expected-sign-in-source,owner',
        'account-amina,203.0.113.10,amina@example.test',
        'scope,fictional training data,read-only exercise',
      ],
      'incident-brief.txt': [
        'IR-04 / FICTIONAL TRAINING CASE',
        'An account owner reports an unfamiliar sign-in challenge.',
        'The log is synthetic; an alert is a signal, not proof of compromise.',
        'Stay within the owner’s authority and use the service’s official route.',
      ],
    };
    const finishOutput = () => {
      while (output.children.length > 26) output.firstElementChild.remove();
      output.scrollTop = output.scrollHeight;
    };
    const normalized = command.toLocaleLowerCase();

    if (normalized === 'help') {
      write('Allowed commands: help · whoami · pwd · ls · cat <file> · grep <text> <file> · timeline · answer <IP> · decision owner-led · clear', 'terminal-system');
      write('Files: auth.log, asset-baseline.csv, incident-brief.txt. This simulator never executes host commands.');
    } else if (normalized === 'whoami') {
      write('trainee (simulated identity; no host account is read).');
    } else if (normalized === 'pwd') {
      write('/field-lab/IR-04 (fictional path; no device filesystem access).');
    } else if (normalized === 'ls') {
      write('auth.log  asset-baseline.csv  incident-brief.txt');
    } else if (normalized === 'timeline') {
      this.terminalEvidenceInspected = true;
      write('08:12 known-source sign-in succeeded.');
      write('08:19 MFA challenge denied from 198.51.100.23 (documentation-only address).');
      write('08:20 password reset requested through an unverified channel.');
      write('08:20 account owner revoked the session from the known source.');
    } else if (normalized === 'clear') {
      output.replaceChildren();
      write('Display cleared. Your exercise progress is unchanged.', 'terminal-system');
    } else {
      const catMatch = normalized.match(/^cat\s+([a-z0-9._-]+)$/);
      const grepMatch = normalized.match(/^grep\s+(?:"([^"]+)"|'([^']+)'|([^\s]+))\s+([a-z0-9._-]+)$/);
      const answerMatch = normalized.match(/^answer\s+([0-9.]+)$/);
      const decisionMatch = normalized.match(/^decision\s+([a-z-]+)$/);
      if (catMatch) {
        const filename = catMatch[1];
        if (!files[filename]) write(`No such training artifact: ${filename}. Use ls to list the fictional bundle.`, 'terminal-error');
        else {
          if (filename === 'auth.log') this.terminalEvidenceInspected = true;
          files[filename].forEach((line) => write(line));
        }
      } else if (grepMatch) {
        const needle = (grepMatch[1] || grepMatch[2] || grepMatch[3] || '').toLocaleLowerCase();
        const filename = grepMatch[4];
        if (!files[filename]) write(`No such training artifact: ${filename}. Use ls to list the fictional bundle.`, 'terminal-error');
        else {
          const matches = files[filename].filter((line) => line.toLocaleLowerCase().includes(needle));
          if (filename === 'auth.log' && needle.includes('mfa_denied') && matches.length) this.terminalEvidenceInspected = true;
          if (matches.length) matches.forEach((line) => write(line));
          else write('(no matching lines)');
        }
      } else if (answerMatch) {
        if (!this.terminalEvidenceInspected) write('Review auth.log first. Use grep MFA_DENIED auth.log or cat auth.log.', 'terminal-error');
        else if (answerMatch[1] !== '198.51.100.23') write('That address is not attached to the denied MFA event. Re-check the event row; no penalty.', 'terminal-error');
        else {
          this.terminalStep = 'decision';
          write('Finding recorded in this local exercise: 198.51.100.23. Now choose an owner-led next step.', 'terminal-success');
        }
      } else if (decisionMatch) {
        if (this.terminalStep !== 'decision') write('First inspect the evidence and submit the source address with answer <IP>.', 'terminal-error');
        else if (decisionMatch[1] !== 'owner-led') write('Keep the response authorized and proportionate. Review incident-brief.txt; no penalty.', 'terminal-error');
        else {
          write('Correct: confirm with the account owner, secure access through the official service route, review sessions with them, and document facts separately from assumptions.', 'terminal-success');
          const firstCompletion = !this.progress.terminalLabCompleted;
          if (firstCompletion) {
            this.progress.terminalLabCompleted = true;
            this.progress.xp += 80;
            this.updateStreak();
            this.saveProgress();
            write('Training objective complete · 80 XP earned once. The simulated command changed no real account.', 'terminal-success');
          } else {
            write('Replay complete. No repeat XP.', 'terminal-system');
          }
          this.terminalStep = 'complete';
        }
      } else {
        write('Command not available in this isolated training image. Nothing was executed. Type help.', 'terminal-error');
      }
    }
    finishOutput();
  }

  renderCategoryOptions() {
    const categories = [...new Set(this.missions.map((mission) => mission.category).filter(Boolean))].sort();
    const selected = this.caseCategory.value || 'all';
    this.caseCategory.replaceChildren(new Option('All areas', 'all'));
    categories.forEach((category) => this.caseCategory.add(new Option(category, category)));
    this.caseCategory.value = categories.includes(selected) ? selected : 'all';
  }

  renderCases() {
    const query = this.caseSearch.value.trim().toLocaleLowerCase();
    const category = this.caseCategory.value;
    const visible = this.missions.filter((mission) => {
      const matchesCategory = category === 'all' || mission.category === category;
      const searchable = `${mission.title} ${mission.category} ${mission.description} ${mission.day || ''}`.toLocaleLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
    const completed = new Set(this.progress.completed);
    const cards = visible.map((mission) => this.createMissionCard(mission, completed.has(mission.id)));
    if (!cards.length) {
      const empty = document.createElement('div');
      empty.className = 'loading-card';
      empty.textContent = 'No cases match. Try another title or learning area.';
      cards.push(empty);
    }
    this.grid.replaceChildren(...cards);
    document.getElementById('missionCount').textContent = `${visible.length} OF ${this.missions.length} CASES`;
  }

  renderLabs() {
    Object.entries(LABS).forEach(([id, lab]) => {
      const button = this.labGrid.querySelector(`[data-lab-id="${id}"]`);
      if (button) button.textContent = this.progress.labsCompleted.includes(id) ? 'Replay simulation  ✓' : 'Open simulation  ↗';
      if (button) button.setAttribute('aria-label', `${lab.title}: ${this.progress.labsCompleted.includes(id) ? 'completed, replay' : 'open simulation'}`);
    });
  }

  getDailyMission() {
    const dailyMissions = this.missions.filter((mission) => Number.isInteger(mission.day)).sort((a, b) => a.day - b.day);
    if (!dailyMissions.length) return this.missions[0] || null;
    const nextLesson = dailyMissions.find((mission) => !this.progress.completed.includes(mission.id));
    if (nextLesson) return nextLesson;
    const now = new Date();
    const dateSeed = now.getFullYear() * 372 + (now.getMonth() + 1) * 31 + now.getDate();
    return dailyMissions[dateSeed % dailyMissions.length];
  }

  openAcademy() {
    if (!this.curriculum?.modules?.length) {
      this.showToast('The course map could not be loaded.');
      return;
    }
    this.renderAcademy();
    this.academyDialog.showModal();
  }

  renderAcademy() {
    const completed = new Set(this.progress.completed);
    const allDays = this.curriculum.modules.flatMap((module) => module.days);
    const finishedDays = allDays.filter((day) => day.mission_id && completed.has(day.mission_id)).length;
    const availableDays = allDays.filter((day) => day.mission_id && this.missions.some((mission) => mission.id === day.mission_id)).length;
    const nextSequenceDay = allDays.find((day) => day.mission_id && !completed.has(day.mission_id))?.day;
    const isUnlocked = (day) => Boolean(day.mission_id && (completed.has(day.mission_id) || day.day === nextSequenceDay));
    document.getElementById('academyProgressText').textContent = `${finishedDays} / 60 DAYS`;
    document.getElementById('academyAvailability').textContent = nextSequenceDay
      ? `${availableDays} lessons built · next in order: day ${String(nextSequenceDay).padStart(2, '0')}`
      : `${availableDays} lessons built · all cleared, replay any day`;
    document.getElementById('academyProgressBar').style.width = `${Math.round((finishedDays / 60) * 100)}%`;
    const modules = this.curriculum.modules.map((module, moduleIndex) => {
      const panel = document.createElement('section');
      const moduleAvailable = module.days.some((day) => day.mission_id && this.missions.some((mission) => mission.id === day.mission_id));
      panel.className = `academy-module${moduleIndex === 0 ? ' current' : ''}`;
      const heading = document.createElement('div');
      heading.className = 'module-heading';
      const titleBlock = document.createElement('div');
      const week = document.createElement('small');
      const firstDay = module.days[0]?.day || 0;
      const lastDay = module.days[module.days.length - 1]?.day || firstDay;
      week.textContent = `DAYS ${String(firstDay).padStart(2, '0')}—${String(lastDay).padStart(2, '0')}`;
      const title = document.createElement('h3');
      title.textContent = module.title;
      const subtitle = document.createElement('p');
      subtitle.textContent = module.subtitle;
      titleBlock.append(week, title, subtitle);
      const status = document.createElement('span');
      status.className = 'module-status';
      const moduleUnlocked = module.days.filter(isUnlocked).length;
      status.textContent = moduleAvailable ? `${moduleUnlocked} / ${module.days.length} UNLOCKED` : 'COURSE MAP';
      heading.append(titleBlock, status);
      const days = document.createElement('div');
      days.className = 'module-days';
      module.days.forEach((day) => {
        const mission = day.mission_id ? this.missions.find((item) => item.id === day.mission_id) : null;
        const isDone = mission && completed.has(mission.id);
        const unlocked = mission && isUnlocked(day);
        const dayCard = unlocked ? document.createElement('button') : document.createElement('div');
        dayCard.className = `academy-day ${mission ? (isDone ? 'done' : unlocked ? 'available' : 'locked') : 'planned'}`;
        if (unlocked) {
          dayCard.type = 'button';
          dayCard.dataset.dayMission = mission.id;
          dayCard.setAttribute('aria-label', `Day ${day.day}: ${day.title}${isDone ? ', completed' : ''}`);
        } else if (mission) {
          dayCard.setAttribute('aria-label', `Day ${day.day}: ${day.title}, locked; clear day ${String(nextSequenceDay).padStart(2, '0')} first`);
        } else {
          dayCard.setAttribute('aria-label', `Day ${day.day}: ${day.title}, planned`);
        }
        const number = document.createElement('strong');
        number.textContent = String(day.day).padStart(2, '0');
        const state = document.createElement('span');
        state.textContent = mission ? (isDone ? 'DONE' : unlocked ? 'PLAY' : 'LOCKED') : 'PLAN';
        dayCard.append(number, state);
        days.append(dayCard);
      });
      panel.append(heading, days);
      return panel;
    });
    document.getElementById('academyModules').replaceChildren(...modules);
  }

  openNotes() {
    this.renderNotes();
    this.notesDialog.showModal();
  }

  saveManualNote() {
    const input = document.getElementById('manualNoteInput');
    const text = input.value.trim();
    if (!text) {
      this.showToast('Write a short note before saving.');
      input.focus();
      return;
    }
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.progress.notes.unshift({ missionId: `manual-${Date.now()}`, title: 'Personal study note', text, date });
    this.progress.notes = this.progress.notes.slice(0, 100);
    input.value = '';
    document.getElementById('manualNoteCount').textContent = '0 / 280';
    this.saveProgress();
    this.renderNotes();
    this.showToast('Note saved on this device.');
  }

  startLab(id, returnToMission = false) {
    const lab = LABS[id];
    if (!lab) return;
    this.returnMission = returnToMission && this.activeMission
      ? { mission: this.activeMission, questionIndex: this.questionIndex, correctAnswers: this.correctAnswers }
      : null;
    this.activeLab = { id, ...lab };
    this.labSelection = new Set();
    this.labOrder = lab.items.map((_, index) => index).reverse();
    document.getElementById('dialogCategory').textContent = lab.category;
    this.renderLab();
    this.dialog.showModal();
  }

  renderLab() {
    const lab = this.activeLab;
    if (!lab) return;
    this.stage.replaceChildren();
    const heading = document.createElement('h2');
    heading.id = 'dialogTitle';
    heading.textContent = lab.title;
    const intro = document.createElement('p');
    intro.className = 'dialog-intro';
    intro.textContent = lab.brief;
    const artifact = document.createElement('section');
    artifact.className = 'scenario-box';
    const label = document.createElement('strong');
    label.textContent = 'FICTIONAL ARTIFACT';
    const description = document.createElement('p');
    description.textContent = lab.artifact;
    artifact.append(label, description);
    const workbench = document.createElement('section');
    workbench.className = 'lab-workbench';
    const caption = document.createElement('strong');
    caption.textContent = lab.workbenchTitle || (lab.mode === 'select' ? 'SELECT THE BEST-FIT OPTIONS' : 'ARRANGE THE STEPS');
    workbench.append(caption);
    if (lab.mode === 'select') {
      lab.items.forEach((item, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `lab-choice${this.labSelection.has(index) ? ' selected' : ''}`;
        button.dataset.labChoice = String(index);
        button.setAttribute('aria-pressed', String(this.labSelection.has(index)));
        button.textContent = item.label;
        workbench.append(button);
      });
    } else {
      this.labOrder.forEach((itemIndex, position) => {
        const row = document.createElement('div');
        row.className = 'lab-order-row';
        const name = document.createElement('span');
        name.textContent = `${position + 1}. ${lab.items[itemIndex].label}`;
        row.append(name);
        const up = document.createElement('button');
        up.type = 'button'; up.dataset.labMove = String(position); up.dataset.direction = '-1';
        up.textContent = 'Move up'; up.disabled = position === 0; up.setAttribute('aria-label', `Move ${lab.items[itemIndex].label} up`);
        const down = document.createElement('button');
        down.type = 'button'; down.dataset.labMove = String(position); down.dataset.direction = '1';
        down.textContent = 'Move down'; down.disabled = position === this.labOrder.length - 1; down.setAttribute('aria-label', `Move ${lab.items[itemIndex].label} down`);
        row.append(up, down);
        workbench.append(row);
      });
    }
    const note = document.createElement('small');
    note.className = 'practice-note';
    note.textContent = 'Sandbox only: this exercise makes no network requests and does not inspect your device.';
    const check = document.createElement('button');
    check.type = 'button'; check.className = 'next-button'; check.dataset.labCheck = 'true'; check.textContent = 'Check my work';
    workbench.append(note, check);
    this.stage.append(heading, intro, artifact, workbench);
  }

  checkLab() {
    const lab = this.activeLab;
    if (!lab) return;
    let passed = false;
    if (lab.mode === 'select') {
      const expected = new Set(lab.items.flatMap((item, index) => item.clue ? [index] : []));
      passed = expected.size === this.labSelection.size && [...expected].every((index) => this.labSelection.has(index));
    } else {
      passed = this.labOrder.every((itemIndex, index) => itemIndex === index);
    }
    this.stage.replaceChildren();
    const result = document.createElement('div');
    result.className = `result-panel ${passed ? 'lab-pass' : 'lab-review'}`;
    const title = document.createElement('h2');
    title.id = 'dialogTitle'; title.textContent = passed ? 'Exercise complete' : 'Adjust your work';
    const body = document.createElement('p');
    body.textContent = passed ? lab.debrief : 'Compare the artifact with the goal, change your selections or order, then check again.';
    result.append(title, body);
    if (passed) {
      const firstCompletion = !this.progress.labsCompleted.includes(lab.id);
      if (firstCompletion) {
        this.progress.labsCompleted.push(lab.id);
        this.progress.xp += 25;
        this.updateStreak();
        this.saveProgress();
      }
      const reward = document.createElement('p');
      reward.className = 'lab-reward';
      reward.textContent = firstCompletion ? 'First completion · 25 XP' : 'Replay complete · no repeat XP';
      result.append(reward);
      this.renderLabs();
    }
    const action = document.createElement('button');
    action.type = 'button'; action.className = 'next-button'; action.dataset.labRetry = 'true';
    action.textContent = passed ? (this.returnMission ? 'Return to lesson' : 'Back to field office') : 'Try again';
    action.addEventListener('click', () => {
      if (passed) this.returnFromLab();
      else this.renderLab();
    });
    result.append(action);
    this.stage.append(result);
  }

  returnFromLab() {
    const snapshot = this.returnMission;
    this.activeLab = null;
    this.returnMission = null;
    if (!snapshot) {
      this.dialog.close();
      return;
    }
    this.activeMission = snapshot.mission;
    this.questionIndex = snapshot.questionIndex;
    this.correctAnswers = snapshot.correctAnswers;
    document.getElementById('dialogCategory').textContent = snapshot.mission.category;
    this.renderQuestion();
  }

  renderNotes() {
    const list = document.getElementById('savedNotes');
    if (!this.progress.notes.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-notes';
      empty.textContent = 'No field notes yet. Finish a case and save what you want to keep.';
      list.replaceChildren(empty);
      return;
    }
    const cards = this.progress.notes.map((note) => {
      const card = document.createElement('article');
      card.className = 'saved-note';
      const top = document.createElement('div');
      top.className = 'saved-note-top';
      const title = document.createElement('strong');
      title.textContent = note.title;
      const date = document.createElement('span');
      date.textContent = note.date;
      const copy = document.createElement('p');
      copy.textContent = note.text;
      top.append(title, date);
      card.append(top, copy);
      return card;
    });
    list.replaceChildren(...cards);
  }

  createMissionCard(mission, completed) {
    const article = document.createElement('article');
    article.className = `mission-card${completed ? ' complete' : ''}`;
    const top = document.createElement('div');
    top.className = 'card-top';
    const category = document.createElement('span');
    category.className = `category-pill${mission.tone === 'green' ? ' green-tone' : mission.tone === 'orange' ? ' orange-tone' : ''}`;
    category.textContent = mission.category;
    const difficulty = document.createElement('span');
    difficulty.className = 'difficulty';
    difficulty.textContent = mission.difficulty;
    top.append(category, difficulty);
    const heading = document.createElement('h3');
    heading.textContent = mission.title;
    const description = document.createElement('p');
    description.textContent = mission.description;
    const meta = document.createElement('div');
    meta.className = 'mission-meta';
    const time = document.createElement('span');
    time.textContent = `◷ ${mission.duration}`;
    const xp = document.createElement('span');
    xp.textContent = `✦ ${mission.xp} XP`;
    meta.append(time, xp);
    const button = document.createElement('button');
    button.className = 'mission-button';
    button.dataset.missionId = mission.id;
    button.textContent = completed ? 'Play again' : 'Start mission  →';
    article.append(top, heading, description, meta, button);
    return article;
  }

  startMission(mission) {
    if (!Array.isArray(mission.questions) || !mission.questions.length) {
      this.showToast('This mission is not ready yet.');
      return;
    }
    this.activeMission = mission;
    this.activeLab = null;
    this.returnMission = null;
    this.questionIndex = 0;
    this.correctAnswers = 0;
    this.answered = false;
    document.getElementById('dialogCategory').textContent = mission.category;
    this.renderQuestion();
    this.dialog.showModal();
  }

  renderQuestion(feedback = null) {
    const question = this.activeMission.questions[this.questionIndex];
    this.answered = false;
    this.displayOrder = question.options.map((_, index) => index);
    for (let index = this.displayOrder.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [this.displayOrder[index], this.displayOrder[swapIndex]] = [this.displayOrder[swapIndex], this.displayOrder[index]];
    }
    this.displayAnswerIndex = this.displayOrder.indexOf(question.answer);
    this.stage.replaceChildren();
    const title = document.createElement('h2');
    title.id = 'dialogTitle';
    title.textContent = this.activeMission.title;
    const intro = document.createElement('p');
    intro.className = 'dialog-intro';
    intro.textContent = this.activeMission.description;
    const lesson = document.createElement('div');
    lesson.className = 'lesson-brief';
    const lessonLabel = document.createElement('strong');
    lessonLabel.textContent = `FIELD GUIDE  /  DAY ${String(this.activeMission.day || 1).padStart(2, '0')}`;
    const lessonText = document.createElement('p');
    lessonText.textContent = this.activeMission.lesson || 'Read the scenario, choose a safe response, and use the debrief to reinforce the habit.';
    lesson.append(lessonLabel, lessonText);
    const scenario = document.createElement('div');
    scenario.className = 'scenario-box';
    const context = document.createElement('strong');
    context.textContent = 'THE SITUATION';
    const contextText = document.createElement('p');
    contextText.textContent = this.activeMission.scenario;
    scenario.append(context, contextText);
    const practice = this.activeMission.practice ? document.createElement('section') : null;
    if (practice) {
      practice.className = 'practice-card';
      const practiceHeading = document.createElement('strong');
      practiceHeading.textContent = 'FIELD PRACTICE';
      const practiceText = document.createElement('p');
      practiceText.textContent = this.activeMission.practice;
      const relatedLabButton = document.createElement('button');
      relatedLabButton.type = 'button';
      relatedLabButton.className = 'practice-launch';
      relatedLabButton.dataset.relatedLab = this.getRelatedLabId(this.activeMission);
      relatedLabButton.textContent = `Open related hands-on simulation: ${LABS[relatedLabButton.dataset.relatedLab].title}  →`;
      const safety = document.createElement('small');
      safety.textContent = 'Use only your own device/settings or the supplied fictional case. Never enter or share passwords or codes.';
      practice.append(practiceHeading, practiceText, relatedLabButton, safety);
    }
    const evidenceDesk = this.createEvidenceDesk(this.activeMission.evidence);
    const count = document.createElement('p');
    count.className = 'question-count';
    count.textContent = `DECISION ${this.questionIndex + 1} OF ${this.activeMission.questions.length}`;
    const prompt = document.createElement('p');
    prompt.className = 'question-title';
    prompt.textContent = question.prompt;
    const list = document.createElement('div');
    list.className = 'answer-list';
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', 'Choose your answer');
    this.displayOrder.forEach((sourceIndex, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-button';
      button.dataset.answerIndex = String(index);
      button.textContent = question.options[sourceIndex];
      list.append(button);
    });
    this.stage.append(title, intro, lesson, scenario);
    if (practice) this.stage.append(practice);
    if (evidenceDesk) this.stage.append(evidenceDesk);
    this.stage.append(count, prompt, list);
    if (feedback) this.showFeedback(feedback.correct, feedback.explanation);
  }

  createEvidenceDesk(evidence) {
    if (!Array.isArray(evidence) || evidence.length === 0) return null;
    const desk = document.createElement('section');
    desk.className = 'evidence-desk';
    desk.setAttribute('aria-label', 'Fictional case evidence');
    const heading = document.createElement('div');
    heading.className = 'evidence-heading';
    const label = document.createElement('strong');
    label.textContent = 'EVIDENCE DESK';
    const boundary = document.createElement('span');
    boundary.textContent = 'FICTIONAL / STATIC';
    heading.append(label, boundary);
    const list = document.createElement('ol');
    list.className = 'evidence-list';
    evidence.forEach((item, index) => {
      const row = document.createElement('li');
      const number = document.createElement('span');
      number.className = 'evidence-index';
      number.textContent = String(index + 1).padStart(2, '0');
      const details = document.createElement('div');
      details.className = 'evidence-copy';
      const time = document.createElement('time');
      time.textContent = item.time;
      const title = document.createElement('strong');
      title.textContent = item.label;
      const description = document.createElement('p');
      description.textContent = item.detail;
      details.append(time, title, description);
      row.append(number, details);
      list.append(row);
    });
    desk.append(heading, list);
    return desk;
  }

  answerQuestion(selectedIndex) {
    const question = this.activeMission.questions[this.questionIndex];
    const correct = selectedIndex === this.displayAnswerIndex;
    this.answered = true;
    const buttons = [...this.stage.querySelectorAll('[data-answer-index]')];
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === this.displayAnswerIndex) button.classList.add('correct');
      else if (index === selectedIndex) button.classList.add('incorrect');
    });
    if (correct) this.correctAnswers += 1;
    this.showFeedback(correct, question.explanation);
  }

  showFeedback(correct, explanation) {
    const practiceLaunch = this.stage.querySelector('[data-related-lab]');
    if (practiceLaunch) {
      practiceLaunch.disabled = true;
      practiceLaunch.textContent = 'Finish this decision to open practice';
    }
    const feedback = document.createElement('div');
    feedback.className = `feedback ${correct ? 'good' : 'try-again'}`;
    const heading = document.createElement('strong');
    heading.textContent = correct ? 'Good call. ' : 'Here’s the safer move. ';
    feedback.append(heading, document.createTextNode(explanation));
    const next = document.createElement('button');
    next.className = 'next-button';
    next.dataset.next = 'true';
    next.textContent = this.questionIndex + 1 < this.activeMission.questions.length ? 'Next decision  →' : 'See mission results  →';
    feedback.append(document.createElement('br'), next);
    this.stage.append(feedback);
    next.focus();
  }

  getRelatedLabId(mission) {
    const category = String(mission.category || '').toLowerCase();
    const title = String(mission.title || '').toLowerCase();
    if (category.includes('network')) return 'packet-route';
    if (category.includes('privacy') || category.includes('people')) return 'data-minimizer';
    if (category.includes('build') && (title.includes('input') || title.includes('access checks'))) return 'code-review';
    if (category.includes('build') || category.includes('configuration') || category.includes('secure')) return 'config-audit';
    if (category.includes('monitoring')) return 'alert-triage';
    if (category.includes('recovery') || category.includes('backup')) return 'recovery-check';
    if (category.includes('respond') || category.includes('capstone') || category.includes('field check')) return 'response-runbook';
    if (category.includes('identity') || category.includes('account') || category.includes('device')) return 'permission-desk';
    return 'signal-hunt';
  }

  nextStep() {
    if (!this.answered) return;
    if (this.questionIndex + 1 < this.activeMission.questions.length) {
      this.questionIndex += 1;
      this.renderQuestion();
      return;
    }
    this.finishMission();
  }

  finishMission() {
    const alreadyCompleted = this.progress.completed.includes(this.activeMission.id);
    const requiredCorrect = Math.ceil(this.activeMission.questions.length * 2 / 3);
    const passed = this.correctAnswers >= requiredCorrect;
    const earnedXp = passed && !alreadyCompleted ? this.activeMission.xp : 0;
    if (passed && !alreadyCompleted) this.progress.completed.push(this.activeMission.id);
    if (earnedXp) this.progress.xp += earnedXp;
    if (passed && !alreadyCompleted) this.updateStreak();
    if (earnedXp || (passed && !alreadyCompleted)) this.saveProgress();
    this.stage.replaceChildren();
    const result = document.createElement('div');
    result.className = 'result-panel';
    const symbol = document.createElement('div');
    symbol.className = 'result-emoji';
    symbol.textContent = passed ? '✦' : '↺';
    const title = document.createElement('h2');
    title.id = 'dialogTitle';
    title.textContent = passed ? 'Mission cleared' : 'Review, then retry';
    const score = document.createElement('div');
    score.className = 'result-score';
    score.textContent = `${this.correctAnswers} / ${this.activeMission.questions.length}`;
    const copy = document.createElement('p');
    copy.textContent = passed
      ? `${this.correctAnswers} of ${this.activeMission.questions.length} decisions met the ${requiredCorrect}-correct mastery check. ${earnedXp ? `You earned ${earnedXp} XP.` : alreadyCompleted ? 'This lesson was already cleared; replaying does not add XP.' : 'Your lesson is cleared.'}`
      : `${this.correctAnswers} of ${this.activeMission.questions.length} correct; ${requiredCorrect} are needed to clear this lesson. Review the explanations and retry. This attempt does not count toward course progress.`;
    const noteBox = document.createElement('div');
    noteBox.className = 'lesson-note';
    const noteLabel = document.createElement('label');
    noteLabel.setAttribute('for', 'fieldNoteInput');
    noteLabel.textContent = 'KEEP A FIELD NOTE';
    const takeaway = document.createElement('p');
    takeaway.textContent = this.activeMission.takeaway || 'Review the explanation and write the habit you want to remember.';
    const noteInput = document.createElement('textarea');
    noteInput.id = 'fieldNoteInput';
    noteInput.maxLength = 280;
    noteInput.placeholder = 'What will you remember from this case? (optional)';
    const existingNote = this.progress.notes.find((note) => note.missionId === this.activeMission.id);
    if (existingNote && existingNote.text !== this.activeMission.takeaway) noteInput.value = existingNote.text;
    const saveNote = document.createElement('button');
    saveNote.type = 'button';
    saveNote.dataset.saveNote = 'true';
    saveNote.textContent = existingNote ? 'Update field note' : 'Save field note';
    noteBox.append(noteLabel, takeaway, noteInput, saveNote);
    if (!passed) {
      const retry = document.createElement('button');
      retry.className = 'next-button';
      retry.dataset.retry = 'true';
      retry.textContent = 'Retry this case';
      retry.addEventListener('click', () => this.startMission(this.activeMission));
      result.append(symbol, title, score, copy, retry);
      this.stage.append(result);
      return;
    }
    const finish = document.createElement('button');
    finish.className = 'next-button';
    finish.dataset.finish = 'true';
    finish.textContent = 'Back to missions';
    result.append(symbol, title, score, copy, noteBox, finish);
    this.stage.append(result);
  }

  saveFieldNote() {
    if (!this.activeMission) return;
    const typedNote = document.getElementById('fieldNoteInput').value.trim();
    const text = typedNote || this.activeMission.takeaway || 'Review the explanation from this case.';
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const note = { missionId: this.activeMission.id, title: this.activeMission.title, text, date };
    const index = this.progress.notes.findIndex((item) => item.missionId === note.missionId);
    if (index === -1) this.progress.notes.unshift(note);
    else this.progress.notes[index] = note;
    this.progress.notes = this.progress.notes.slice(0, 100);
    this.saveProgress();
    const button = this.stage.querySelector('[data-save-note]');
    if (button) button.textContent = 'Field note saved ✓';
  }

  updateStreak() {
    const formatLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const today = formatLocalDate(new Date());
    if (this.progress.lastPlayed === today) return;
    const previous = new Date();
    previous.setDate(previous.getDate() - 1);
    const yesterday = formatLocalDate(previous);
    this.progress.streak = this.progress.lastPlayed === yesterday ? this.progress.streak + 1 : 1;
    this.progress.lastPlayed = today;
  }

  getLevel(xp) {
    if (xp >= 600) return { name: 'Guardian', progress: 100 };
    if (xp >= 300) return { name: 'Defender', progress: Math.round(((xp - 300) / 300) * 100) };
    if (xp >= 120) return { name: 'Scout', progress: Math.round(((xp - 120) / 180) * 100) };
    return { name: 'Rookie', progress: Math.round((xp / 120) * 100) };
  }

  saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      this.showToast('Could not save progress in this browser.');
    }
    this.render();
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.classList.remove('show'), 2400);
  }
}

window.addEventListener('DOMContentLoaded', () => new CyberHeistGame());
