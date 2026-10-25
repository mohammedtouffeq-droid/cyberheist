/* CyberHeist is a local-only learning game. All actions run against fictional scenarios. */
const STORAGE_KEY = 'cyberheist.learning.v1';

const fallbackMissions = [
  {
    id: 'phishing-first-look', title: 'The too-good-to-be-true parcel', category: 'SPOT THE SCAM', tone: 'orange', difficulty: 'Starter', duration: '3 min', xp: 60,
    description: 'Learn to slow down and verify a message before you click.',
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
      lastPlayed: typeof parsed.lastPlayed === 'string' ? parsed.lastPlayed : null,
      streak: Number.isFinite(parsed.streak) ? Math.max(0, parsed.streak) : 0
    };
  } catch {
    return { xp: 0, completed: [], lastPlayed: null, streak: 0 };
  }
}

class CyberHeistGame {
  constructor() {
    this.progress = readProgress();
    this.missions = [];
    this.activeMission = null;
    this.questionIndex = 0;
    this.correctAnswers = 0;
    this.answered = false;
    this.toastTimer = null;
    this.grid = document.getElementById('missionGrid');
    this.dialog = document.getElementById('missionDialog');
    this.stage = document.getElementById('missionStage');
    this.toast = document.getElementById('toast');
    this.bindEvents();
    this.loadMissions();
  }

  bindEvents() {
    document.getElementById('closeDialog').addEventListener('click', () => this.dialog.close());
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
    this.render();
  }

  render() {
    const completed = new Set(this.progress.completed);
    const completedCount = this.missions.filter((mission) => completed.has(mission.id)).length;
    const level = this.getLevel(this.progress.xp);
    document.getElementById('levelValue').textContent = level.name;
    document.getElementById('xpValue').textContent = `${this.progress.xp} XP earned`;
    document.getElementById('completedValue').textContent = `${completedCount} / ${this.missions.length}`;
    document.getElementById('missionCount').textContent = `${this.missions.length} missions`;
    document.getElementById('streakValue').textContent = `${this.progress.streak} day${this.progress.streak === 1 ? '' : 's'} streak`;
    this.grid.replaceChildren(...this.missions.map((mission) => this.createMissionCard(mission, completed.has(mission.id))));
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
    const scenario = document.createElement('div');
    scenario.className = 'scenario-box';
    const context = document.createElement('strong');
    context.textContent = 'THE SITUATION';
    const contextText = document.createElement('p');
    contextText.textContent = this.activeMission.scenario;
    scenario.append(context, contextText);
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
    this.stage.append(title, intro, scenario, count, prompt, list);
    if (feedback) this.showFeedback(feedback.correct, feedback.explanation);
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
    const finish = document.createElement('button');
    finish.className = 'next-button';
    finish.dataset.finish = 'true';
    finish.textContent = 'Back to missions';
    result.append(symbol, title, score, copy, finish);
    this.stage.append(result);
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
    if (xp >= 600) return { name: 'Guardian' };
    if (xp >= 300) return { name: 'Defender' };
    if (xp >= 120) return { name: 'Scout' };
    return { name: 'Rookie' };
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
