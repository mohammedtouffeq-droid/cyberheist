#!/usr/bin/env python3
"""
CYBERHEIST AUTONOMOUS CLOUD ENGINE
Architect: Mohammed Ahmed & Google Gemini 2.5 Pro
Executed automatically by GitHub Actions daily to generate new heist levels and features.
"""

import os
import json
import random
import urllib.request
from datetime import datetime, timezone

MISSIONS_FILE = os.path.join(os.path.dirname(__file__), "..", "missions.json")
CHANGELOG_FILE = os.path.join(os.path.dirname(__file__), "..", "CHANGELOG.md")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

TARGET_POOLS = [
    ("Hyperion Bio-Quantum Labs", "High-frequency biometric authentication grid with cryogenic cooling nodes."),
    ("Kuroshio DeepSea Data Haven", "Sub-oceanic fiber optic nexus storing classified trans-continental transactions."),
    ("Aetherius Orbital Defense Array", "Low-earth orbit satellite tracking telemetry and military drone telemetry."),
    ("Nakamoto Shadow DAO", "Decentralized automated liquidity reserves guarded by self-mutating smart contracts."),
    ("Valkyrie AI Research Core", "Experimental synthetic intelligence hub training autonomous cyber countermeasures."),
    ("Apex Global Petro-Vault", "Automated pipeline management systems and offshore reserve logistics.")
]

def load_missions():
    if os.path.exists(MISSIONS_FILE):
        with open(MISSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"missions": []}

def save_missions(data):
    with open(MISSIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def generate_procedural_mission(existing_count):
    next_id = f"M{existing_count + 1:02d}"
    target_name, target_desc = random.choice(TARGET_POOLS)
    difficulty = random.choice(["Adept", "Master", "Cyber-Lord", "Quantum-Elite"])
    credits = 1000 + (existing_count * 200) + random.randint(50, 400)
    exp = 500 + (existing_count * 90) + random.randint(20, 150)

    return {
        "id": next_id,
        "title": f"Operation BlackOut: {target_name.split()[0]} Incursion",
        "target": target_name,
        "difficulty": difficulty,
        "reward_credits": credits,
        "reward_exp": exp,
        "desc": target_desc,
        "nodes": ["PROXY", "FIREWALL", "DATABASE", "VAULT"],
        "solution_commands": [
            {"cmd": "scan", "output": f"[SCAN] Telemetry mapped for {target_name}. Quantum subnets located."},
            {"cmd": "nmap", "output": f"[NMAP] Vulnerable entry vector: Port {random.randint(8000, 9999)} (Zero-Day Exploitable)."},
            {"cmd": "crack", "output": f"[CRACK] Cipher {random.randint(100, 999)}-ALPHA neutralized. Bypass token issued."},
            {"cmd": "breach", "output": f"[BREACH SUCCESS] Vault penetrated! Exfiltrated ₿ {credits} and {exp} EXP!"}
        ]
    }

def generate_ai_mission(existing_count):
    next_id = f"M{existing_count + 1:02d}"
    prompt = f"Create 1 cyberpunk hacking mission id {next_id}. Output strictly JSON with keys: id, title, target, difficulty, reward_credits, reward_exp, desc, nodes, solution_commands."

    models = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-pro-latest"]
    for m in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={GEMINI_API_KEY}"
        payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
        try:
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=4) as resp:
                res_json = json.loads(resp.read().decode())
                text = res_json["candidates"][0]["content"]["parts"][0]["text"]
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                return json.loads(text)
        except Exception:
            continue

    return generate_procedural_mission(existing_count)

def update_changelog(new_mission):
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    entry = f"\n### [{now_str}] Cloud Build: Added {new_mission['id']} - {new_mission['title']}\n"
    entry += f"- Target: `{new_mission['target']}`\n"
    entry += f"- Difficulty: `{new_mission['difficulty']}` | Reward: `₿ {new_mission['reward_credits']}`\n"
    entry += f"- Architect: Mohammed Ahmed Autonomous Pipeline\n"

    mode = "a" if os.path.exists(CHANGELOG_FILE) else "w"
    with open(CHANGELOG_FILE, mode, encoding="utf-8") as f:
        if mode == "w":
            f.write("# CYBERHEIST // AUTONOMOUS BUILD LOG\n")
        f.write(entry)

def main():
    print(f"[CLOUD ENGINE] Starting Autonomous Heist Generation...")
    data = load_missions()
    current_count = len(data.get("missions", []))
    print(f"[CLOUD ENGINE] Current Mission Count: {current_count}")

    new_mission = generate_ai_mission(current_count)
    data["missions"].append(new_mission)
    data["last_updated"] = datetime.now(timezone.utc).isoformat()
    save_missions(data)
    update_changelog(new_mission)

    print(f"[CLOUD ENGINE] SUCCESS: Generated and saved {new_mission['id']}: {new_mission['title']}")

if __name__ == "__main__":
    main()
