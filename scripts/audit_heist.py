import json
import os

repo = r"C:\Users\hp\cyberheist"
missions_path = os.path.join(repo, "missions.json")

print("=== 1. CHECKING MISSIONS.JSON ===")
with open(missions_path, "r", encoding="utf-8") as f:
    data = json.load(f)
missions = data.get("missions", [])
print(f"Total Active Missions: {len(missions)}")

errors = []
for m in missions:
    m_id = m.get("id")
    title = m.get("title")
    target = m.get("target")
    steps = m.get("solution_commands", [])
    if not m_id or not title:
        errors.append(f"Missing ID or Title in {m}")
    if len(steps) < 3:
        errors.append(f"Mission {m_id} has less than 3 steps")
    for s in steps:
        if "cmd" not in s or "output" not in s:
            errors.append(f"Invalid step in {m_id}: {s}")
    reward = m.get("reward_credits")
    print(f"- [{m_id}] {title} | Target: {target} | Steps: {len(steps)} | Bounty: {reward} credits")

if not errors:
    print("\n>>> ALL MISSIONS ARE 100% VALID & ERROR-FREE! <<<")
else:
    print("\nERRORS FOUND:", errors)

# Check total lines of code across project
print("\n=== 2. TOTAL LINES OF CODE IN PROJECT ===")
total_lines = 0
for root, dirs, files in os.walk(repo):
    if ".git" in root:
        continue
    for f in files:
        fp = os.path.join(root, f)
        try:
            with open(fp, "r", encoding="utf-8") as fl:
                lines = len(fl.readlines())
                total_lines += lines
                print(f"{f}: {lines} lines")
        except Exception:
            pass

print(f"\nTOTAL PROJECT CODE: {total_lines} LINES WRITTEN!")
