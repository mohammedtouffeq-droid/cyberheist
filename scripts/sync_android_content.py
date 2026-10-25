#!/usr/bin/env python3
"""Copy the browser's source course files into the Android asset bundle."""

from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "android" / "app" / "src" / "main" / "assets"


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    for name in ("curriculum.json", "missions.json"):
        shutil.copy2(ROOT / name, ASSETS / name)
    print("Android course assets synced from the repository root.")


if __name__ == "__main__":
    main()
