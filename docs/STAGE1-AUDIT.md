# Lernova Stage 1 — audit and plan

Date: 9 November 2026. This document does not change the app. It records what is on `main` and on the live site, and it proposes the Stage 2 design. Nothing here was merged or deployed by this audit.

## 1. Repo and live site

Confirmed with `gh pr list` and `git log origin/main`:

| PR | Title | State | Merge commit on `main` |
| --- | --- | --- | --- |
| #1 | Redesign the portal as Lernova | Merged | `673d13a` |
| #2 | Load lessons and quizzes on demand | Merged | `fc84463` |
| #3 | Rewrite Klasse 11 lessons into one structure | Merged | `6a46062` |

`main` is not stopped at PR #3. The tip is `a252ff2` (“Add Klasse 10 lessons and merge the reviewed texts.”), one commit after the #3 merge. That commit is what GitHub Pages is serving.

Live site: https://mujtaba517.github.io/fisi-klasse11-portal/

Checked 9 November 2026. `index.html` and `k10-fuit.html` returned HTTP 200. `Last-Modified` was `Mon, 09 Nov 2026 14:08:31 GMT`. The live home page already contains the Klasse 10 cards (`k10-fuit.html` and the six other `k10-*.html` pages) and the sentence that some class materials exist only as scans.

Screenshots in `docs/stage1-before/` were taken of that live site in headless Chrome, not of an older branch. There is no separate marketing landing page. `login.html` is the public page. `index.html` is the signed-in dashboard.

Google Drive was not read. The Drive MCP server in this environment is unauthenticated (`needsAuth`). Grade 10 worksheets and any further Grade 11 handouts that live only in Drive are not in this inventory.

## 2. Before screenshots

64 viewport screenshots. Desktop is 1280×900. Mobile is 390×844. Themes are `dark` and `light`. Languages are `de` and `fa`. A signed-in session was set in the browser only so the protected pages would render. The account is not a real student.

Name pattern: `docs/stage1-before/{page}-{lang}-{theme}-{width}.png`

Pages: `login`, `dashboard`, `subject` (`it-systeme.html`), `lesson` (`it-systeme.html#osi`), `quiz`, `flashcards`, `settings` (drawer open on the dashboard), `klasse10` (`klasse-10.html`).

Paths called out for review:

- Desktop dashboard, German, dark: `docs/stage1-before/dashboard-de-dark-1280.png`
- Mobile dashboard, Persian, dark: `docs/stage1-before/dashboard-fa-dark-390.png`
- Desktop subject, German, dark: `docs/stage1-before/subject-de-dark-1280.png`
- Mobile subject, Persian, dark: `docs/stage1-before/subject-fa-dark-390.png`
- Desktop lesson, German, dark: `docs/stage1-before/lesson-de-dark-1280.png`
- Mobile lesson, Persian, dark: `docs/stage1-before/lesson-fa-dark-390.png`

## 3. Visual and UX findings

These are from the screenshots and the CSS that produced them. Contrast numbers below were calculated from the tokens in `styles.css`, not from a Lighthouse accessibility score. No Lighthouse run was done for this audit.

### What feels cold

`login.html` (desktop, dark and light) is a single card in a large empty field. The headline is motivational and does not name a subject, a class, or a next task. The same is true of the dashboard hero (“Schön, dass du da bist…” / the Persian equivalent). On a 900px-tall desktop and on a 390×844 phone, that hero plus the three tool cards fill the first screen. The grade switcher and the subject cards sit below it. A returning student does not see “continue IT-Systeme” or any progress.

Subject cards, tool cards, and lesson cards share one dark (or white) rectangle, one small icon, and the word “Öffnen” / “مطالعه کن”. Nothing on the card says how many lessons it has, whether one was started, or how hard it is. The dashboard, the subject list, and Klasse 10 therefore look like the same directory three times.

### Navigation and page structure

The header on Klasse 11 pages is one flat row: Home, seven subjects, three tools. It does not show Klasse 10 at all. `klasse-10.html` uses a shorter header (Home, Kurzerklärer, Karteikarten, Quiz) and its own grade switcher. The two grades are not one navigation system.

On desktop the subject row already crowds the header. Opening settings on `dashboard-de-dark-1280.png` covers the right side of that row and clips the third tool card. On `settings-fa-dark-390.png` the Persian drawer does not fit the 390px width: the close control is cut off at the screen edge and the title is clipped. The page behind stays visible beside the drawer. Desktop German settings open cleanly on the right. Mobile Persian settings do not.

Quiz, flashcards, and a lesson do not share a frame. The quiz is a setup form. A lesson is a card under a topic list. Flashcards are one German term and a definition. There is no shared “you are here / what is next” pattern beyond the lesson breadcrumb.

The quiz setup (`quiz-de-dark-1280.png`) says the bank is only Jahrgangsstufe 11 and points at `docs/QUIZ-COVERAGE.md`. The same screen says “152 Fragen verfügbar”. That number is every subject in both grades (see section 4). The coverage file still says 73 questions and still names the removed file `quiz-data.js`. A learner who follows the link is sent to a developer document with the old count.

### Readability

Lesson text sits in a card that uses the page container, `min(1080px, 100% - 2rem)`. On the desktop OSI lesson the explanation is one long paragraph across that width. There is no reading measure near 65 characters. Section headings (Definition, Erklärung, Beispiel, Merke) are only slightly stronger than the body.

`goal` and `summary` exist on every lesson object and are empty strings on all 81 lessons. `lesson.js` hides them when empty, so the live OSI lesson has no Lernziel and no Zusammenfassung. The template promised by PR #3 is not what the page shows.

### Focus, contrast, touch

`:focus { outline: none }` is set, and `:focus-visible` draws a 2px outline in `--focus` (`#9dbbff` in dark, `#1d4ed8` in light). Keyboard focus is styled. The screenshots do not show a focused control, so this audit does not claim a focus failure from a picture.

Calculated contrast of the current tokens:

| Pair | Ratio |
| --- | --- |
| Dark text `#e8edf2` on `#101418` | 15.7 |
| Dark muted `#aeb8c4` on `#101418` | 9.2 |
| Dark muted on card `#1c232c` | 7.9 |
| Light text `#161b22` on `#f3f5f7` | 15.8 |
| Light muted `#5c6775` on `#f3f5f7` | 5.3 |
| White on dark primary button `#3c6df0` | 4.5 |

Body and muted text meet WCAG AA for normal text on these backgrounds. The white label on `#3c6df0` is at the 4.5:1 line. That is the tight spot, not the muted paragraphs. The flat look is not a contrast failure.

Topic rows on the 390px subject page are full-width and tall enough to tap. The header language pills and the gear are about 44px. The broken piece on that width is the settings drawer, not the topic list.

### RTL and mixed direction

Persian dashboard, subject, and lesson screenshots use `dir=rtl`. The brand sits on the right. Topic titles align to the right. The OSI lesson in Persian keeps Latin tokens (OSI, MAC, VLAN, `192.168.10.1`) inside the Persian sentences. Those tokens are not isolated in their own direction runs, so a Latin address sits in the middle of a right-to-left line. The breadcrumb on the Persian lesson is readable as Home / Klasse 11 / subject / topic when read from the right. The subject page still prints the pathway in German: “Klasse 11 · Fachinformatiker Systemintegration”. That line is not in the language table.

The login language control shows “فا” as a small pill. On the desktop login shot it is easy to miss next to DE and EN.

## 4. Content audit, Grade 11

Counts are from the lesson packs and quiz files on `a252ff2`, which match the live site. Legacy questions are stored both in `quiz/legacy.js` and in the subject file. The subject number below is the size of that subject file. The 12 legacy items are not an extra 12 on top.

| Subject | Lessons | Lesson ids | Questions in the subject file |
| --- | ---: | --- | ---: |
| IT-Systeme | 12 | osi, ip, subnet, vlan, dhcp, dns, routing, nat, ipv6, topo, troubleshoot, security | 32 |
| IT-Technik | 8 | iotcps, sensor, esp32, pull, prellen, baud, wlan, mqtt | 21 |
| AEuP | 5 | welt, modelle, er, rel, json | 12 |
| BGWP | 6 | itsm, org, eepk, sla, incident, support | 16 |
| Fachpraxis | 5 | szenario, switch, router, dhcp, test | 11 |
| Politik und Gesellschaft | 5 | struktur, demo, direkt, gewalt, bericht | 12 |
| Englisch | 4 | noten, machine, vocab, themen | 12 |
| **Grade 11** | **45** |  | **116** |

Grade 10, already on `main` and live, is listed so the 152 on the quiz screen is explained. It is not part of the Grade 11 rewrite.

| Klasse 10 page | Lessons | Questions |
| --- | ---: | ---: |
| k10-fuit | 5 | 5 |
| k10-ittechnik | 5 | 5 |
| k10-aeup | 8 | 8 |
| k10-bgwp | 5 | 5 |
| k10-englisch | 6 | 6 |
| k10-projekt | 3 | 3 |
| k10-pug | 4 | 4 |
| **Klasse 10** | **36** | **36** |

Unique question ids in the repo: 152. The 12 duplicates are only `legacy-01` through `legacy-12`, each once in a subject file and once in `quiz/legacy.js`.

Every one of the 81 lessons has `goal: ""` and `summary: ""`. None has a diagram, a table, prior knowledge, a step list, or a practice question inside the lesson. A lesson is a definition, one explanation paragraph, one short example, and three “Merke” bullets.

What is thin or still wrong, by subject:

- **IT-Systeme.** Twelve short texts for a 96-hour learning field. OSI still says layer 4 to 7 “carry TCP or UDP, ports and programs”. That bundles the transport layer and the application. The example is one sentence (ping the gateway, then suspect DNS or a firewall). Subnetting, DHCP, and the lab commands are not worked step by step on this page. No diagram of a small office network.
- **IT-Technik.** Eight texts. They name ESP32, pull resistors, debounce, baud, WLAN, and MQTT, but each is one paragraph. There is no wiring sketch and no full sketch the student can read line by line.
- **AEuP.** Five texts for a 96-hour field. JSON and REST share one lesson. There is no worked SQL query, no ER diagram, and no second data example. The explanation of data types is one paragraph.
- **BGWP.** Six texts. SLA, incident, and support levels are defined. There is no filled ticket, no eEPK figure, and no practice dialogue. The curriculum asks for a recorded status and a conversation. The page does not show either.
- **Fachpraxis.** Five texts. The separate “goal” lesson was folded into “Szenario”. The page describes VLAN 10 and VLAN 20 in prose. It does not show the switch and router command sequence as a checked lab, and it has no “what you should see in ipconfig” block.
- **Politik und Gesellschaft.** Five texts on Article 20, direct democracy, separation of powers, and the Berichtsheft. They are short and have no source excerpt. The curriculum PDF’s year-11 table does not contain this subject’s lessons. The weekly-hours tables mention Politik und Gesellschaft. The lesson text is not mapped to a page in a source file in this repo.
- **Englisch.** Four texts: grade weights, machine language, a word list, and what the course practises. The German UI explains the English course. English and Persian versions exist. This is not the missing “Englisch für gewerblich-technische Berufe” syllabus. That other Lehrplan is named in the Bavarian PDF and is not in the repo.

English and Persian lesson bodies for IT-Systeme were checked: all 12 Persian explanations contain Arabic script, and the English OSI explanation is English. Quiz stems for all subject files have `de`, `en`, and `fa`. The untranslated pieces that are actually shown are the hardcoded German pathway line on subject pages, the German subject names in the header, and the developer path `docs/QUIZ-COVERAGE.md` on the quiz form.

`docs/QUIZ-COVERAGE.md` is stale. It says 73 questions, targets of 50 per subject, and “generated from quiz-data.js”. Current subject files have the counts in the table above. None of the seven Grade 11 subjects has 50 questions.

## 5. Source inventory

Only files that are in the git history of this repository are listed. Nothing was inferred from a filename alone about the contents of a scan.

| File | What it is | What it can be mapped to | Gap |
| --- | --- | --- | --- |
| `bs_lpr_fachinformatiker.pdf` | 36 pages, text extracts. Lehrplanrichtlinien für die Berufsschule, Fachinformatiker/Fachinformatikerin, Jahrgangsstufen 11 bis 12, Bayerisches Staatsministerium für Unterricht und Kultus, May 2020, binding from school year 2020/21, ISB. | Year 11 table, page 12 of the PDF: LF 6 Serviceanfragen bearbeiten, 36 h, subject Betriebs- und Gesamtwirtschaftliche Prozesse, maps to `bgwp.html` and `lf6.html`. LF 7 Cyber-physische Systeme ergänzen, 72 h, IT-Technik, maps to `it-technik.html` and `lf7.html`. LF 8 Daten systemübergreifend bereitstellen, 96 h, Anwendungsentwicklung und Programmierung, maps to `aeup.html` and `lf8.html`. LF 9 Netzwerke und Dienste bereitstellen, 96 h, IT-Systeme, maps to `it-systeme.html`, `fachpraxis.html` (the lab, not a separate Lernfeld), and `lf9.html`. The Zielformulierungen are on PDF pages 16–19. | The PDF states competencies. It does not contain the OSI worksheet, the VLAN lab commands, the ESP32 sketches, or the quiz items. Englisch is explicitly a different Lehrplan (“Englisch für gewerblich-technische Berufe”), which is not in the repo. Year 12 fields are in the PDF and are not lessons here. |
| `it-systeme_FUIT11_1.2.pdf.pdf` | 6 pages, added in commit `395ce48`. Each page has one image and no extractable text (`pypdf` returned 2–4 characters per page). | The filename is the only clue: IT-Systeme, FU-IT, Klasse 11, version 1.2. That is the same subject as `it-systeme.html`. | The scan was not read. No heading inside it was mapped to `osi`, `subnet`, or any other lesson id. Do not treat the current OSI lesson as a transcription of this file. |
| `IT_Grundschutz_Kompendium_Edition2023.pdf` | 858 pages, text extracts. BSI IT-Grundschutz-Kompendium, Reguvis, ISBN 978-3-8462-0906-6, © 2023 BSI. | None. No lesson, quiz item, or HTML page cites this file. | It is in the repo and unused by the pages. It is not a Klasse 11 worksheet. |
| `lessons/grade-10/README.txt` | One sentence: scanned worksheet pages were not transcribed. | Klasse 10 lesson folder. | Confirms the scans are not in git. |
| `docs/QUIZ-COVERAGE.md` | Written during PR #3’s history and not updated for `a252ff2`. | Claims the counts for the old 73-question bank. | Do not use it as the current count. |
| `docs/CONTENT-REVIEW.md` | Edited in `a252ff2`. | Says Klasse 10 lessons follow readable headings and that scans were not transcribed. | It does not name a Drive file or a page range. |
| `docs/ARCHITECTURE-PROPOSAL.md` | Proposal only. | Not a curriculum source. | — |

Klasse 10 lessons (`lessons/grade-10/*.js`) state in the product copy that they follow readable headings and “dem üblichen Stoff”, and that they are not a transcription and contain no invented worksheet solutions. `k10-ittechnik` says the history worksheet was not readable as text and that the lesson is a usual overview with no dates from class. Those sentences are the only source notes. The scans themselves are not in the repository. This audit does not assign a Drive file to any Klasse 10 topic.

## 6. Design references

Visited in headless Chrome on 9 November 2026, 1280×900, no account. Login walls are stated as seen. Nothing was copied.

| Site | What loaded | What did not |
| --- | --- | --- |
| Brilliant, `https://brilliant.org/` | Marketing page. H1 “Your personal tutor for math and coding”. Sign in and Sign up are in the header. | No lesson and no personal dashboard. |
| Brilliant, `https://brilliant.org/courses/` | Public topic list: Math, with course rows such as “Math Foundations” and a grade range, a one-line description, and a disclosure. A cookie notice covered the corner. | A direct course URL (`/courses/computer-science-essentials/`) returned the same topics page. No interactive lesson without an account. |
| Codecademy, `https://www.codecademy.com/catalog` | Public catalog, “Browse the full catalog”, course cards (Learn Python 3, Learn HTML, Learn SQL, …) with level and hours, plus filters. | The interactive editor did not open. |
| Codecademy, `https://www.codecademy.com/learn/learn-python-3` | HTTP 200. H1 “Learn Python 3”. The page also offers sign-up. | The in-lesson exercise was not reached. |
| Duolingo, `https://www.duolingo.com/` | Marketing page only: mascot, “Get started”, “I already have an account”, and a language strip. | No path, no lesson, no feedback after a wrong answer. An account is required for that. |
| Khan Academy, `https://www.khanacademy.org/` | Marketing home. A donation modal and a cookie dialog covered the first viewport even though unit titles were present in the DOM of another URL. | The home page is not a lesson. |
| Khan Academy, `https://www.khanacademy.org/computing/computer-science/algorithms` | HTTP 200. Title “Algorithms”. H1 “Unit 1: Algorithms”. Log in and Sign up stay in the header. | An individual exercise was not opened. Progress and the answer check require an account. |

Patterns worth using, without their branding:

- **Catalog before the lesson.** Brilliant’s topic rows and Codecademy’s cards say what the thing is and who it is for before the click. Lernova’s cards only say “Öffnen”.
- **A unit list with a name.** Khan’s public unit is “Unit 1: Algorithms”, not a flat bag of topics. Lernova’s subject page is closer to this than the dashboard is, but the topics have no order number, no time, and no “you stopped here”.
- **One job per screen.** Duolingo’s logged-out page does one thing. Lernova’s dashboard does welcome, tools, grade switch, subjects, and Lernfelder on one scroll.
- **Feedback after an attempt.** None of the four sites showed a wrong-answer explanation without an account. Lernova already shows explanation after “Check”. What it does not do is ask the student to try first and only then reveal a worked answer inside the lesson. That gap is in our lesson template, not something observed on a public lesson page.
- **Typography.** The public pages use a clear title, a short supporting line, and a lot of quiet space. Lernova’s type scale already has steps (`--fs-xs` through `--fs-3xl`). The lesson does not use a narrow measure, so the scale does not produce a readable column.

## 7. Proposed design system (not built)

Original to Lernova. Not the Brilliant blue blocks, not the Duolingo green, not the Khan donation layout.

### Color

Light is warm paper, not the current gray `#f3f5f7`. Dark is ink, not pure black, so code and Persian text do not glow.

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#f6f1e8` | `#14181d` |
| `--surface` | `#fffdf8` | `#1c2229` |
| `--text` | `#1c1915` | `#f3efe6` |
| `--muted` | `#5e564c` | `#c4bbae` |
| `--primary` | `#0f6e6b` | `#7dcec6` |
| `--on-primary` | `#ffffff` | `#10211f` |
| `--accent` | `#a15c2f` | `#e0a070` |
| `--line` | `#e4d9c8` | `#2e363c` |
| `--ok` | `#1f6b3a` | `#8fcea8` |
| `--danger` | `#8f2d2d` | `#f0a0a0` |
| `--focus` | `#0f6e6b` | `#f3efe6` |

`--muted` on `--bg` in both themes needs to stay at or above 4.5:1 before Stage 2 ships. The primary button must be checked again after the hex values are final. These hex values are a proposal, not a measured theme.

### Type and space

Keep Inter for Latin and Vazirmatn for Arabic. Do not add a third family.

- Reading column: `max-width: 68ch` for lesson prose. Code blocks stay full width of that column and use `unicode-bidi: isolate` plus `dir="ltr"` so an IP address or a command does not reorder inside Persian.
- Scale, unchanged in spirit: 0.875rem meta, 1rem body, 1.25rem section, 1.75rem lesson title, 2.25rem page title.
- Space: 4, 8, 12, 16, 24, 32, 48 px. Cards use 16px padding on phones and 24px from 800px up.
- Touch: 44px minimum on header controls, topic rows, quiz options, and the settings close button.

### Components

- **Subject card.** Name, one sentence, lesson count, question count, and a text link. No progress number until progress exists. Do not invent a percent.
- **Lesson layout.** Breadcrumb, title, the template below, then a footer with the previous lesson, the next lesson, the subject quiz, and the flashcards. The prose column is 68ch. The page background stays the paper or ink color so the column is obvious.
- **Practice block.** The question is visible. The answer is hidden. “Check” reveals right or wrong and the explanation. A second control, “Show the worked answer”, reveals the model text only after that check. This matches the current quiz behavior and adds the missing lesson practice.
- **Breadcrumb and next step.** One trail: Home / grade / subject / lesson. The next step is a single sentence under the summary (“Next: IP-Adresse und Gateway”), not only a button at the corner.
- **Empty.** Klasse 10 already has lessons. The empty state is for a subject with no lesson file, a quiz filter with zero questions, and a search with no hits. Say what is missing and where to go. Do not show a fake lesson.
- **Loading.** The topic list and the quiz picker are filled by scripts. Reserve the list height so the page does not jump. A one-line “Loading this subject…” is enough if the pack is slow. No spinner library.
- **Error.** If `lessonHtml` returns nothing, show the topic title and “This lesson did not load.” Do not fall back to a second, shorter card. The quiz already disables Start when the count is zero. Keep that, and say which filter caused it.

### Lesson template for Stage 2

Every section is present even when short. Headings stay in the language table.

1. Title
2. Objectives (one to three lines). This replaces the empty `goal`.
3. Prior knowledge (links to earlier lessons, or “none”).
4. Intro (why this topic exists in the learning field).
5. Terms (a two-column list, not a paragraph).
6. Step by step (numbered).
7. Worked example (commands or a small case, with the expected result).
8. Diagram or table (one, even if it is a simple HTML table).
9. Common mistakes (separate from Merke).
10. Summary (short, required).
11. Practice questions (at least two).
12. Answers, hidden until the student checks an attempt.

## 8. Stage 2 sample

Stage 2 should not pretend to transcribe class worksheets.

The only class handout in the repo for a specific subject is `it-systeme_FUIT11_1.2.pdf.pdf`. It is six scanned pages. No text could be extracted, so no lesson id can be tied to a page of that file. Google Drive, where the user says the real Grade 10 materials and any further Grade 11 materials are, was not accessible.

The readable source that does map to a subject is `bs_lpr_fachinformatiker.pdf`, Lernfeld 9, “Netzwerke und Dienste bereitstellen”, 96 hours, subject IT-Systeme. That text is a competency statement. It does not contain the OSI diagram, the subnet arithmetic, or the VLAN lab the portal already sketches.

Recommendation: wait for the Drive files before writing the representative lesson, if that lesson must follow the class handout. When those files are here, the sample should be **IT-Systeme, one topic inside Lernfeld 9** (the handout’s own first teaching topic, not a topic chosen to look complete). Until then, a Stage 2 sample would only be able to restate the LF9 competency from the Bavarian PDF plus the short text already on `it-systeme.html`. That is not a new lesson.

Do not use Klasse 10 as the sample. The repo itself says those lessons are not transcriptions of the scans.

## 9. What this audit did not do

No app file was edited. No Lighthouse score was produced. No account was created on Brilliant, Codecademy, Duolingo, or Khan Academy. Drive was not opened. The 64 screenshots are the before set for a later redesign. They are not a usability test with a student.
