/* CyberHeist is a local-only learning game. All actions run against fictional scenarios. */
const STORAGE_KEY = 'cyberheist.learning.v1';

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
      lastPlayed: typeof parsed.lastPlayed === 'string' ? parsed.lastPlayed : null,
      streak: Number.isFinite(parsed.streak) ? Math.max(0, parsed.streak) : 0
    };
  } catch {
    return { xp: 0, completed: [], notes: [], lastPlayed: null, streak: 0 };
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
    this.toastTimer = null;
    this.grid = document.getElementById('missionGrid');
    this.dialog = document.getElementById('missionDialog');
    this.academyDialog = document.getElementById('academyDialog');
    this.notesDialog = document.getElementById('notesDialog');
    this.stage = document.getElementById('missionStage');
    this.toast = document.getElementById('toast');
    this.bindEvents();
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
    document.querySelectorAll('.nav-link, .mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link, .mobile-link').forEach((item) => item.classList.remove('active'));
        document.querySelectorAll(`[href="${link.getAttribute('href')}"]`).forEach((item) => item.classList.add('active'));
      });
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
    const completed = new Set(this.progress.completed);
    const completedCount = this.missions.filter((mission) => completed.has(mission.id)).length;
    const level = this.getLevel(this.progress.xp);
    document.getElementById('levelValue').textContent = level.name;
    document.getElementById('xpValue').textContent = `${this.progress.xp} XP`;
    document.getElementById('xpProgress').style.width = `${level.progress}%`;
    document.getElementById('completedValue').textContent = `${completedCount} / ${this.missions.length}`;
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
    this.grid.replaceChildren(...this.missions.map((mission) => this.createMissionCard(mission, completed.has(mission.id))));
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
    document.getElementById('academyProgressText').textContent = `${finishedDays} / 60 DAYS`;
    document.getElementById('academyAvailability').textContent = `${availableDays} of 60 lessons ready to play`;
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
      status.textContent = moduleAvailable ? `${module.days.filter((day) => day.mission_id && this.missions.some((mission) => mission.id === day.mission_id)).length} READY` : 'COURSE MAP';
      heading.append(titleBlock, status);
      const days = document.createElement('div');
      days.className = 'module-days';
      module.days.forEach((day) => {
        const mission = day.mission_id ? this.missions.find((item) => item.id === day.mission_id) : null;
        const isDone = mission && completed.has(mission.id);
        const dayCard = mission ? document.createElement('button') : document.createElement('div');
        dayCard.className = `academy-day ${mission ? (isDone ? 'done' : 'available') : 'planned'}`;
        if (mission) {
          dayCard.type = 'button';
          dayCard.dataset.dayMission = mission.id;
          dayCard.setAttribute('aria-label', `Day ${day.day}: ${day.title}${isDone ? ', completed' : ''}`);
        } else {
          dayCard.setAttribute('aria-label', `Day ${day.day}: ${day.title}, planned`);
        }
        const number = document.createElement('strong');
        number.textContent = String(day.day).padStart(2, '0');
        const state = document.createElement('span');
        state.textContent = mission ? (isDone ? 'DONE' : 'PLAY') : 'PLAN';
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
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-button';
      button.dataset.answerIndex = String(index);
      button.textContent = option;
      list.append(button);
    });
    this.stage.append(title, intro, lesson, scenario);
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
    const correct = selectedIndex === question.answer;
    this.answered = true;
    const buttons = [...this.stage.querySelectorAll('[data-answer-index]')];
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add('correct');
      else if (index === selectedIndex) button.classList.add('incorrect');
    });
    if (correct) this.correctAnswers += 1;
    this.showFeedback(correct, question.explanation);
  }

  showFeedback(correct, explanation) {
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
    const earnedXp = alreadyCompleted ? 0 : this.activeMission.xp;
    if (!alreadyCompleted) this.progress.completed.push(this.activeMission.id);
    this.progress.xp += earnedXp;
    this.updateStreak();
    this.saveProgress();
    this.stage.replaceChildren();
    const result = document.createElement('div');
    result.className = 'result-panel';
    const symbol = document.createElement('div');
    symbol.className = 'result-emoji';
    symbol.textContent = '✦';
    const title = document.createElement('h2');
    title.id = 'dialogTitle';
    title.textContent = 'Mission cleared!';
    const score = document.createElement('div');
    score.className = 'result-score';
    score.textContent = `${this.correctAnswers} / ${this.activeMission.questions.length}`;
    const copy = document.createElement('p');
    copy.textContent = `${this.correctAnswers === this.activeMission.questions.length ? 'Excellent instincts.' : 'Every choice is a chance to learn.'} ${earnedXp ? `You earned ${earnedXp} XP.` : 'You already earned XP for this mission, so replaying is just for practice.'}`;
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
