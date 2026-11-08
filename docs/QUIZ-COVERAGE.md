# Quiz coverage

Partial bank. The target is at least 50 distinct questions per subject. This file is generated from `quiz-data.js` and is the count to trust.

These are original practice questions for Lernova. They are not official IHK tasks and not copied from an exam paper.

## Scope that was checked

The local file `bs_lpr_fachinformatiker.pdf` is the Bavarian Lehrplanrichtlinien for Fachinformatiker, Jahrgangsstufen 11–12, May 2020 (binding from school year 2020/21, ISB). Year 11, same for every Fachrichtung:

| Lernfeld | Hours | School subject in this portal |
| --- | --- | --- |
| 6 Serviceanfragen bearbeiten | 36 | BGWP |
| 7 Cyber-physische Systeme ergänzen | 72 | IT-Technik |
| 8 Daten systemübergreifend bereitstellen | 96 | AEuP |
| 9 Netzwerke und Dienste bereitstellen | 96 | IT-Systeme |

The same PDF says learning field 6 is taught before part 1 of the extended final exam. Year 12 splits by Fachrichtung (for Systemintegration: 10b, 11b, 12b) and is not covered here. PuG and Englisch are school subjects in the portal, not numbered Lernfelder in that table. Fachpraxis is the lab for the year-11 network field.

The KMK Rahmenlehrplan numbering is what the Bavarian footnote points at. This bank does not claim to cover the full AP1 or AP2 catalogue.

## Counts

| Subject | Questions | Target | Still short |
| --- | ---: | ---: | ---: |
| it-systeme | 21 | 50 | 29 |
| it-technik | 13 | 50 | 37 |
| aeup | 8 | 50 | 42 |
| bgwp | 10 | 50 | 40 |
| fachpraxis | 6 | 50 | 44 |
| pug | 7 | 50 | 43 |
| englisch | 8 | 50 | 42 |
| **total** | **73** | **350** | **277** |

## Types

- it-systeme: multi 1, order 2, short 1, single 17
- it-technik: single 13
- aeup: single 8
- bgwp: single 10
- fachpraxis: order 1, single 5
- pug: single 7
- englisch: multi 1, single 7

## Topics with at least one question

- it-systeme: dhcp (3), dns (1), ip (2), ipv6 (1), nat (1), osi (2), routing (1), security (2), subnet (4), topo (1), troubleshoot (1), vlan (2)
- it-technik: baud (1), esp32 (2), iotcps (1), mqtt (4), prellen (1), pull (1), sensor (2), wlan (1)
- aeup: er (2), json (2), modelle (1), rel (1), welt (2)
- bgwp: eepk (1), incident (2), itsm (1), org (1), sla (3), support (2)
- fachpraxis: dhcp (1), router (1), switch (1), szenario (1), test (2)
- pug: bericht (2), demo (1), direkt (1), gewalt (1), struktur (2)
- englisch: machine (2), noten (2), themen (2), vocab (2)

## Gaps

- No subject reaches 50. The missing numbers are in the table above.
- Jahrgangsstufe 12 and the direction-specific learning fields are out of scope and have no questions.
- Short-answer items are not auto-graded. Ordering and multiple-answer items are.
- The original 12-question quiz is kept (`legacy: true`) and also counts in its subject.
- Explainers stay short lessons; they are not a second question bank.
