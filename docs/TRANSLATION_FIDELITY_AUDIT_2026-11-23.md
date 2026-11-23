# Translation fidelity review — 2026-11-23

Status: **BLOCKED — NOT APPROVED FOR PRODUCTION**

## Source of truth
Romanian HTML pages in this repository. English pages are translations only, not AI-authored reinterpretations. Do not modify the original Romanian content to make the English version pass tests.

## Confirmed structural differences (h1–h3)
| Romanian source | English target | RO headings | EN headings | Status |
|---|---|---:|---:|---|
| metoda-clar.html (current method content) | en/root-balancing.html | 19 | 5 | Re-translate |
| legi-universale.html | en/universal-laws.html | 16 | 13 | Re-translate |
| acasa.html | en/index.html | 6 | 5 | Review |
| constelatii.html | en/systemic-constellations.html | 22 | 5 | Re-translate |
| lucram-impreuna.html | en/work-with-me.html | 16 | 5 | Re-translate |
| sedinte-individuale.html | en/individual-sessions.html | 7 | 6 | Review |
| despre-mine.html | en/about.html | 7 | 5 | Review |
| live.html | en/weekly-live.html | 6 | 5 | Review |
| program-nivelul-de-merit.html | en/self-worth-programme.html | 11 | 5 | Re-translate |

Heading counts are only a screening indicator, not proof of fidelity or a guarantee of missing sections.

## Confirmed unacceptable AI commentary
The EN universal laws page contained “The Romanian source page presents…” and “These English summaries follow…”. These were removed on the preview branch. The remaining text still needs full source-to-target editorial review.

## Required acceptance criteria
1. Match each source section to an English section, preserving meaning, examples, sequence, and material details.
2. No new claims, disclaimers, therapeutic promises, summaries or commentary absent from the Romanian original.
3. Preserve exact service details, links, CTA and booking options; do not activate Brevo.
4. Check all 82 translated articles and 17 English pages, not just the nine sampled here.
5. Run automated QA, then review the Cloudflare Preview visually before any production merge.

Draft PR: https://github.com/iuliabobeica65-tech/Intoarcerealatine-nou/pull/85

This document records observed source-code differences; it does not certify translations.
