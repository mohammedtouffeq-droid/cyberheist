#!/usr/bin/env python3
"""Validate the player-facing 60-day map and playable scenario pack."""

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as source:
        return json.load(source)


def main() -> int:
    course = load_json(ROOT / "curriculum.json")
    mission_data = load_json(ROOT / "missions.json")
    errors: list[str] = []

    android_assets = ROOT / "android" / "app" / "src" / "main" / "assets"
    for name in ("curriculum.json", "missions.json"):
        source_path = ROOT / name
        asset_path = android_assets / name
        if not asset_path.is_file() or asset_path.read_bytes() != source_path.read_bytes():
            errors.append(f"Android asset {name} is missing or out of sync; run scripts/sync_android_content.py.")

    duration = course.get("program", {}).get("duration_days")
    modules = course.get("modules", [])
    days = [day for module in modules for day in module.get("days", [])]
    day_numbers = [day.get("day") for day in days]
    if duration != 60 or sorted(day_numbers) != list(range(1, 61)):
        errors.append("Course map must contain each day from 1 through 60 exactly once.")

    missions = mission_data.get("missions", [])
    mission_by_id = {mission.get("id"): mission for mission in missions}
    if len(mission_by_id) != len(missions) or None in mission_by_id:
        errors.append("Playable mission IDs must be present and unique.")

    for mission in missions:
        mission_id = mission.get("id", "<missing id>")
        if not mission.get("title") or not mission.get("description") or not mission.get("scenario"):
            errors.append(f"{mission_id}: title, description, and scenario are required.")
        if mission.get("day") and any(not mission.get(field) for field in ("lesson", "takeaway", "practice")):
            errors.append(f"{mission_id}: academy lessons need a field guide, takeaway, and safe practice task.")
        if not isinstance(mission.get("xp"), int) or mission["xp"] <= 0:
            errors.append(f"{mission_id}: XP must be a positive integer.")
        evidence = mission.get("evidence", [])
        if not isinstance(evidence, list):
            errors.append(f"{mission_id}: evidence must be a list of fictional, static artifacts.")
        else:
            for artifact_index, artifact in enumerate(evidence, start=1):
                if not all(isinstance(artifact.get(field), str) and artifact[field].strip() for field in ("time", "label", "detail")):
                    errors.append(f"{mission_id} evidence {artifact_index}: time, label, and detail are required.")
        questions = mission.get("questions", [])
        if len(questions) < 3:
            errors.append(f"{mission_id}: provide at least three decisions.")
        for index, question in enumerate(questions, start=1):
            options = question.get("options", [])
            answer = question.get("answer")
            if not question.get("prompt") or len(options) < 2 or not all(isinstance(option, str) and option for option in options):
                errors.append(f"{mission_id} question {index}: prompt and answer choices are required.")
            if not isinstance(answer, int) or answer < 0 or answer >= len(options):
                errors.append(f"{mission_id} question {index}: answer index is outside the answer list.")
            if not question.get("explanation"):
                errors.append(f"{mission_id} question {index}: explain the safer decision.")

    mapped_available: set[str] = set()
    for day in days:
        mission_id = day.get("mission_id")
        if not mission_id:
            continue
        mission = mission_by_id.get(mission_id)
        if not mission:
            errors.append(f"Day {day.get('day')}: references missing mission {mission_id}.")
        elif mission.get("day") != day.get("day"):
            errors.append(f"Day {day.get('day')}: mission {mission_id} has a mismatched day number.")
        else:
            mapped_available.add(mission_id)

    declared_available = course.get("program", {}).get("available_days")
    if declared_available != len(mapped_available):
        errors.append("Program available_days must match the authored, mapped daily lessons.")
    for mission in missions:
        if mission.get("day") and mission["day"] <= declared_available and mission["id"] not in mapped_available:
            errors.append(f"Playable day {mission['day']} is missing from the course map.")
    if declared_available == duration and len(mapped_available) != duration:
        errors.append("Every day in a fully available course must map to one playable lesson.")
    final_day = next((mission for mission in missions if mission.get("day") == duration), None)
    if final_day is None or len(final_day.get("questions", [])) < 8:
        errors.append("The final day must include a multi-domain assessment with at least eight decisions.")

    promise = course.get("program", {}).get("promise", "").lower()
    outcome = course.get("program", {}).get("outcome", "").lower()
    if "guarantee" in promise or "expert" in promise or "expert" in outcome:
        errors.append("Course copy must not promise expert status or a guaranteed outcome.")

    if errors:
        print("Content validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Content valid: {len(days)} course days, {len(mapped_available)} playable lessons, {len(missions)} missions.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
