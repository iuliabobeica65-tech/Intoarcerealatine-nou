#!/usr/bin/env python3
"""Validează configurația Pages CMS față de fișierele JSON din repository.
Test static: nu autentifică proprietara și nu salvează modificări în CMS.
"""
from pathlib import Path
import json
import sys
import yaml

root = Path(__file__).resolve().parent.parent
schema = yaml.safe_load((root / ".pages.yml").read_text(encoding="utf-8"))
failures = []
field_count = 0
entry_count = 0

def check_fields(fields, obj, where):
    global field_count
    if not isinstance(obj, dict):
        failures.append(f"{where}: obiect așteptat"); return
    for field in fields:
        name = field.get("name")
        typ = field.get("type")
        if not name or not isinstance(name,str):
            failures.append(f"{where}: câmp fără identificator"); continue
        field_count += 1
        if name not in obj:
            failures.append(f"{where}: lipsește cheia {name}"); continue
        value = obj[name]
        opts = field.get("list", False)
        if opts:
            if not isinstance(value, list):
                failures.append(f"{where}.{name}: listă așteptată"); continue
            if isinstance(opts, dict):
                if "min" in opts and len(value) < opts["min"]: failures.append(f"{where}.{name}: sub min")
                if "max" in opts and len(value) > opts["max"]: failures.append(f"{where}.{name}: peste max")
            vals = value
        else:
            vals = [value]
        for i, element in enumerate(vals):
            sub = f"{where}.{name}" + (f"[{i}]" if opts else "")
            if typ == "object":
                check_fields(field.get("fields", []), element, sub)
            elif typ in ("string", "text", "image", "file", "rich-text") and not isinstance(element, str):
                failures.append(f"{sub}: șir de caractere așteptat")
            elif typ == "boolean" and not isinstance(element, bool):
                failures.append(f"{sub}: boolean așteptat")
            elif typ == "number" and not isinstance(element, (int, float)):
                failures.append(f"{sub}: număr așteptat")

def check_content(entries):
    global entry_count
    for e in entries:
        if e.get("type") == "group":
            check_content(e.get("items", [])); continue
        if e.get("type") != "file":
            continue
        entry_count += 1
        path = e.get("path", "")
        target = root / path
        if not target.is_file():
            failures.append(f"{path}: nu există"); continue
        if e.get("format") != "json": continue
        try:
            content = json.loads(target.read_text(encoding="utf-8"))
        except Exception as ex:
            failures.append(f"{path}: JSON invalid {ex}"); continue
        check_fields(e.get("fields", []), content, path)

check_content(schema.get("content", []))
if entry_count < 10:
    failures.append("Mai puțin de 10 fișiere CMS configurate")
if not (root / "assets" / "content-editor.js").is_file():
    failures.append("Lipsește scriptul CMS")
print(f"Pages CMS: {entry_count} fișiere, {field_count} câmpuri declarate verificate; erori: {len(failures)}")
for problem in failures:
    print("EROARE:", problem)
if failures:
    sys.exit(1)
