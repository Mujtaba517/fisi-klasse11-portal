# Content review, Klasse 11

This note records factual corrections and what was removed. It does not add Klasse 10 topics.

## Factual corrections

- OSI: the old short cards put the switch on layer 1. A switch forwards frames on layer 2. Layer 1 is the signal: cable, plug and link LED.
- OSI: TCP, ports and applications were bundled as “L4–7”. TCP/UDP and ports are layer 4. The application is layer 7. Layers 5 and 6 are rarely split in daily work.
- Troubleshooting: “gateway works, website does not” was treated as one DNS-or-firewall case. The lesson now separates an outside IP (`8.8.8.8`) from a name. DNS is the next check only when the IP answers and the name does not.
- Subnetting: usable hosts are block size minus 2 for ordinary networks. `/31` and `/32` do not use that rule. The old “≈ 254” line did not say why two addresses are removed.
- NAT: private ranges are `10.0.0.0/8`, `172.16.0.0/12` and `192.168.0.0/16`. NAT translates addresses. It is not a firewall. `203.0.113.0/24` is only an example range.
- Gateway: `.1` is common, not guaranteed. Read it from `ipconfig` or `ip addr`.
- ESP32: classic boards use 2.4 GHz, not 5 GHz. GPIO logic is 3.3 V. USB may supply 5 V, but 5 V on a GPIO can damage the pin.
- Baud rate: both sides need the same setting. The line can forgive a small clock error. It does not forgive 115200 against 9600.
- MQTT QoS: 0 is at most once, 1 is at least once, 2 is exactly once. Older cards and explanations stopped at 0 and 1.
- JSON: common with REST, not required by REST.
- Router-on-a-stick: matching `dot1Q 10` to VLAN 10 is required. Reusing `10` in the third octet is the lab agreement, not an IP law.
- Article 20 of the Basic Law: paragraph 1 names republic, democracy, social state and federal state. Paragraph 2 is popular sovereignty and the exercise of power through separate organs. Representation and majority rule explain democracy. They are not extra headings of Article 20. The old sentence that the republic “is not the list of the hour” was removed because it was vague and mixed those levels.
- High-level languages: the processor executes machine code. A high-level language is translated by a compiler or an interpreter. The old quiz line said it must be compiled.
- English grades and the date 8 October 2026 stay labelled as this course plan. May 2020 remains the curriculum edition. They are not the same date.

## Removed

- The second, shorter topic cards inside each subject page. They duplicated the lesson pack and, on OSI, contradicted it. The page now renders only the structured pack.
- The repeated closing line “Bezug: Lehrplanrichtlinien … Keine amtliche IHK-Aufgabe” on every lesson. One source note sits above the topic list instead.
- The separate “Übung / Antwort zeigen” blocks. Their check is now inside Beispiel or Merke, so every lesson has the same sections.
- The vague PuG wording about the republic not being “the list of the hour”.

## Still thin

- Quiz coverage is still the partial bank from before (73 questions, not 50 per subject). Explanations were corrected where they were wrong or easy to misread. Not every explanation was rewritten into a long paragraph.
- Lernfeld pages (`lf6.html` to `lf9.html`) stay as the existing outlines. The subject lessons are the structured texts.
- Klasse 10 now has lessons from the readable class materials: networks, computers, Python, economics, English, projects and training law. Scanned pages were not transcribed, and no worksheet answers were invented.
- The Klasse 11 lesson packs were replaced with the reviewed definition, explanation, example and key points. Older quiz questions were kept, and one checked question per lesson was added when that question was not already there.
