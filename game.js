// ==========================================
// CYBERHEIST: NEURAL INFILTRATION GAME ENGINE
// ARCHITECT: MOHAMMED AHMED
// ==========================================

// --- AUDIO SYNTHESIZER (ZERO ASSETS / NATIVE WEB AUDIO API) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  playKeyClick() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
    });
  }
  playAlert() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const sounds = new SoundEngine();

// --- MATRIX RAIN BACKGROUND ---
function initMatrixRain() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const cols = Math.floor(w / 20);
  const ypos = Array(cols).fill(0);

  function matrix() {
    ctx.fillStyle = 'rgba(5, 8, 17, 0.06)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '14pt monospace';

    ypos.forEach((y, ind) => {
      const text = String.fromCharCode(Math.random() * 128);
      const x = ind * 20;
      ctx.fillText(text, x, y);
      if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
      else ypos[ind] = y + 20;
    });
  }
  setInterval(matrix, 50);
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

// --- GAME STATE & CONTROLLER ---
class CyberGame {
  constructor() {
    this.exp = parseInt(localStorage.getItem('cyber_exp') || '0');
    this.credits = parseInt(localStorage.getItem('cyber_credits') || '0');
    this.activeMission = null;
    this.stepIndex = 0;
    this.trace = 0;
    this.missions = [];
    this.traceInterval = null;

    this.output = document.getElementById('terminalOutput');
    this.input = document.getElementById('terminalInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.traceBar = document.getElementById('traceBar');
    this.tracePercent = document.getElementById('tracePercent');
    this.expDisplay = document.getElementById('expDisplay');
    this.credDisplay = document.getElementById('credDisplay');
    this.missionTitle = document.getElementById('missionTitle');
    this.missionDesc = document.getElementById('missionDesc');
    this.missionObjective = document.getElementById('missionObjective');
    this.breachProgress = document.getElementById('breachProgress');
    this.audioToggle = document.getElementById('audioToggle');

    this.init();
  }

  async init() {
    initMatrixRain();
    this.updateStats();
    await this.loadMissions();
    this.bindEvents();

    if (this.missions.length > 0) {
      this.selectMission(this.missions[0]);
    }
  }

  async loadMissions() {
    try {
      const res = await fetch('missions.json');
      const data = await res.json();
      this.missions = data.missions || [];
      this.printLine(`[SYSTEM] Loaded ${this.missions.length} active contract protocols.`, 'sys-msg');
    } catch (e) {
      this.printLine(`[ERROR] Could not load mission cache. Using emergency fallback.`, 'danger');
    }
  }

  bindEvents() {
    document.addEventListener('click', () => sounds.init(), { once: true });

    this.sendBtn.addEventListener('click', () => this.handleCommand());
    this.input.addEventListener('keydown', (e) => {
      sounds.playKeyClick();
      if (e.key === 'Enter') this.handleCommand();
    });

    document.querySelectorAll('.macro-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        this.input.value = cmd;
        this.handleCommand();
      });
    });

    this.audioToggle.addEventListener('click', () => {
      sounds.init();
      sounds.enabled = !sounds.enabled;
      this.audioToggle.textContent = sounds.enabled ? '🔊 AUDIO' : '🔇 MUTED';
      this.printLine(`Audio output: ${sounds.enabled ? 'ENABLED' : 'MUTED'}`, 'sys-msg');
    });
  }

  updateStats() {
    this.expDisplay.textContent = this.exp;
    this.credDisplay.textContent = `₿ ${this.credits}`;
    localStorage.setItem('cyber_exp', this.exp);
    localStorage.setItem('cyber_credits', this.credits);
  }

  printLine(text, type = 'sys-msg') {
    const div = document.createElement('div');
    div.className = `log-line ${type}`;
    div.textContent = text;
    this.output.appendChild(div);
    this.output.scrollTop = this.output.scrollHeight;
  }

  selectMission(m) {
    this.activeMission = m;
    this.stepIndex = 0;
    this.trace = 0;
    this.updateTrace(0);

    this.missionTitle.textContent = m.title;
    this.missionDesc.textContent = m.desc;
    this.missionObjective.textContent = `Execute '${m.solution_commands[0].cmd}' to initiate sequence.`;
    this.breachProgress.style.width = '0%';

    // Reset nodes visual
    document.querySelectorAll('.node-box').forEach(node => {
      node.classList.remove('breached');
      node.querySelector('.node-state').textContent = 'SECURE';
    });

    this.printLine(`\n[CONTRACT LOADED] ${m.title}`, 'cmd');
    this.printLine(`Target: ${m.target} | Difficulty: ${m.difficulty}`, 'sys-msg');
    this.startTraceTimer();
  }

  startTraceTimer() {
    if (this.traceInterval) clearInterval(this.traceInterval);
    this.traceInterval = setInterval(() => {
      if (!this.activeMission) return;
      this.trace = Math.min(100, this.trace + 1);
      this.updateTrace(this.trace);
      if (this.trace >= 100) {
        sounds.playAlert();
        this.printLine(`[CRITICAL ALERT] CORPORATE TRACE COMPLETE! YOUR IP WAS SEIZED! CONTRACT ABORTED.`, 'danger');
        clearInterval(this.traceInterval);
        setTimeout(() => this.selectMission(this.activeMission), 3000);
      }
    }, 1800);
  }

  updateTrace(val) {
    this.traceBar.style.width = `${val}%`;
    this.tracePercent.textContent = `${val}%`;
    if (val > 75) this.traceBar.style.background = '#ff0033';
    else if (val > 40) this.traceBar.style.background = '#ffcc00';
    else this.traceBar.style.background = 'var(--neon-red)';
  }

  handleCommand() {
    const raw = this.input.value.trim();
    if (!raw) return;
    this.input.value = '';

    this.printLine(`operator@heist:~# ${raw}`, 'cmd');
    const parts = raw.toLowerCase().split(' ');
    const cmd = parts[0];

    switch (cmd) {
      case 'help':
        this.printLine(`AVAILABLE PROTOCOLS:`, 'sys-msg');
        this.printLine(`  missions       - Display all available cyber contracts`, 'sys-msg');
        this.printLine(`  select <id>    - Select target contract (e.g., 'select M01')`, 'sys-msg');
        this.printLine(`  scan           - Scan target system topology & open ports`, 'sys-msg');
        this.printLine(`  nmap           - Deep port scan for vulnerabilities`, 'sys-msg');
        this.printLine(`  crack          - Decrypt target security hashes`, 'sys-msg');
        this.printLine(`  breach         - Siphon data vault & complete contract`, 'sys-msg');
        this.printLine(`  trace-shield   - Reset & scramble corporate trace counter`, 'sys-msg');
        this.printLine(`  clear          - Flush terminal buffer`, 'sys-msg');
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      case 'missions':
        this.printLine(`=== AVAILABLE CYBER CONTRACTS ===`, 'sys-msg');
        this.missions.forEach(m => {
          this.printLine(`[${m.id}] ${m.title} // REWARD: ₿ ${m.reward_credits} [${m.difficulty}]`, 'cmd-highlight');
        });
        this.printLine(`Type 'select <ID>' to activate contract.`, 'sys-msg');
        break;

      case 'select':
        const targetId = (parts[1] || '').toUpperCase();
        const found = this.missions.find(m => m.id === targetId);
        if (found) {
          this.selectMission(found);
        } else {
          this.printLine(`Contract '${targetId}' not found. Type 'missions' for active list.`, 'danger');
        }
        break;

      case 'trace-shield':
        this.trace = Math.max(0, this.trace - 40);
        this.updateTrace(this.trace);
        this.printLine(`[SHIELD] Neural trace counter scrambled (-40%).`, 'success');
        break;

      default:
        // Check if command advances active mission
        if (this.activeMission) {
          const expected = this.activeMission.solution_commands[this.stepIndex];
          if (expected && expected.cmd === cmd) {
            this.printLine(expected.output, 'success');
            sounds.playSuccess();
            this.stepIndex++;

            // Visual node update
            const nodes = document.querySelectorAll('.node-box');
            if (nodes[this.stepIndex - 1]) {
              nodes[this.stepIndex - 1].classList.add('breached');
              nodes[this.stepIndex - 1].querySelector('.node-state').textContent = 'PWNED';
            }

            const pct = Math.round((this.stepIndex / this.activeMission.solution_commands.length) * 100);
            this.breachProgress.style.width = `${pct}%`;

            if (this.stepIndex >= this.activeMission.solution_commands.length) {
              // Mission complete!
              clearInterval(this.traceInterval);
              this.credits += this.activeMission.reward_credits;
              this.exp += this.activeMission.reward_exp;
              this.updateStats();
              this.printLine(`>>> HEIST COMPLETED! +₿ ${this.activeMission.reward_credits} CREDITS, +${this.activeMission.reward_exp} EXP! <<<`, 'success');
              this.missionObjective.textContent = `CONTRACT COMPLETED! Run 'missions' for next target.`;
            } else {
              const nextCmd = this.activeMission.solution_commands[this.stepIndex].cmd;
              this.missionObjective.textContent = `Next step: Execute '${nextCmd}'`;
            }
          } else {
            sounds.playAlert();
            this.trace = Math.min(100, this.trace + 15);
            this.updateTrace(this.trace);
            this.printLine(`[ACCESS DENIED] Unrecognized sequence. Trace alerted (+15%)!`, 'danger');
          }
        } else {
          this.printLine(`Unknown protocol '${cmd}'. Type 'help' for command manual.`, 'warning');
        }
    }
  }
}

// Start Game
window.addEventListener('DOMContentLoaded', () => {
  new CyberGame();
});
