/* Short explainers – all subjects – FA / DE / EN */
const EXPLAINERS = {
  /* ===== BGWP ===== */
  ticket: {
    cat:'bgwp', ico:'🎫',
    title:{fa:'تیکت چیست؟',de:'Was ist ein Ticket?',en:'What is a ticket?'},
    blurb:{fa:'ثبت درخواست کاربر',de:'Nutzeranfrage dokumentieren',en:'Log a user request'},
    steps:{
      fa:[
        {t:'چرا تیکت؟',x:'هر درخواست باید ثبت شود تا فراموش نشود و قابل پیگیری باشد.',e:'خانم احمدی زنگ زد: پرینتر کار نمی‌کند → تیکت باز می‌کنی.'},
        {t:'چه چیزی بنویسی؟',x:'نام، مشکل، از کی، اولویت، اقدام‌ها.',e:'«پرینتر طبقه ۲ از ۱۰:۰۰ کاغذ نمی‌گیرد.»'},
        {t:'بعد چه؟',x:'حل کن یا Escalate کن و در پایان تیکت را ببند.',e:'Restart کردی و کار کرد → تیکت بسته با توضیح.'}
      ],
      de:[
        {t:'Warum ein Ticket?',x:'Jede Anfrage wird dokumentiert und nachverfolgbar.',e:'Frau A. ruft: Drucker defekt → Ticket öffnen.'},
        {t:'Was eintragen?',x:'Name, Problem, seit wann, Prio, Maßnahmen.',e:'«Drucker 2. OG seit 10:00 kein Papier.»'},
        {t:'Danach?',x:'Lösen oder eskalieren, dann schließen.',e:'Neustart half → Ticket mit Notiz schließen.'}
      ],
      en:[
        {t:'Why a ticket?',x:'Every request is logged so it can be tracked.',e:'Ms A calls: printer broken → open a ticket.'},
        {t:'What to write?',x:'Name, problem, since when, priority, actions.',e:'“Floor 2 printer since 10:00 won’t take paper.”'},
        {t:'Then what?',x:'Fix or escalate, then close the ticket.',e:'Restart worked → close ticket with a note.'}
      ]
    }
  },
  sla: {
    cat:'bgwp', ico:'⏱️',
    title:{fa:'SLA چیست؟',de:'Was ist ein SLA?',en:'What is an SLA?'},
    blurb:{fa:'قول زمان خدمت',de:'Zeitversprechen',en:'Time promise'},
    steps:{
      fa:[
        {t:'SLA یعنی چه؟',x:'قول کتبی شرکت درباره زمان پاسخ و حل.',e:'«تا ۳۰ دقیقه جواب می‌دهیم.»'},
        {t:'دو زمان',x:'Reaktionszeit = اولین پاسخ · Lösungszeit = تا حل.',e:'اولویت بالا: ۳۰ دقیقه / ۴ ساعت.'},
        {t:'نقض SLA',x:'اگر دیر جواب بدهی، قول شکسته شده.',e:'تیکت ۱۰:۰۰؛ ساعت ۱۰:۳۵ هنوز جوابی نیست.'}
      ],
      de:[
        {t:'Was bedeutet SLA?',x:'Schriftliche Zusage zu Antwort- und Lösungszeit.',e:'„Wir antworten in 30 Minuten.“'},
        {t:'Zwei Zeiten',x:'Reaktionszeit und Lösungszeit.',e:'Hohe Prio: 30 Min. / 4 Std.'},
        {t:'SLA-Verstoß',x:'Zu späte Antwort = Versprechen gebrochen.',e:'Ticket 10:00 – um 10:35 noch keine Antwort.'}
      ],
      en:[
        {t:'What is an SLA?',x:'Written promise about response and resolution time.',e:'“We reply within 30 minutes.”'},
        {t:'Two times',x:'Response time and resolution time.',e:'High priority: 30 min / 4 hours.'},
        {t:'SLA breach',x:'Late reply means the promise is broken.',e:'Ticket at 10:00 – still no reply at 10:35.'}
      ]
    }
  },
  levels: {
    cat:'bgwp', ico:'📶',
    title:{fa:'سطح پشتیبانی',de:'Support-Level',en:'Support levels'},
    blurb:{fa:'1st / 2nd / 3rd',de:'1st / 2nd / 3rd',en:'1st / 2nd / 3rd'},
    steps:{
      fa:[
        {t:'1st Level',x:'خط اول: ثبت، راهنمای ساده، ریست رمز.',e:'Outlook را Repair می‌کنی.'},
        {t:'2nd Level',x:'متخصص‌تر: سرور، شبکه پیچیده.',e:'پروفایل خراب → به 2nd با لاگ.'},
        {t:'3rd Level',x:'سازنده نرم‌افزار یا سخت‌افزار.',e:'باگ مایکروسافت → Vendor.'}
      ],
      de:[
        {t:'1st Level',x:'Aufnahme, Standardhilfe, Passwort-Reset.',e:'Outlook-Reparatur.'},
        {t:'2nd Level',x:'Spezialisten: Server, komplexes Netz.',e:'Kaputtes Profil → 2nd mit Log.'},
        {t:'3rd Level',x:'Hersteller.',e:'Microsoft-Bug → Vendor.'}
      ],
      en:[
        {t:'1st level',x:'Log, simple help, password reset.',e:'Repair Outlook.'},
        {t:'2nd level',x:'Specialists: servers, complex network.',e:'Broken profile → 2nd with logs.'},
        {t:'3rd level',x:'Vendor.',e:'Microsoft bug → vendor.'}
      ]
    }
  },
  incident: {
    cat:'bgwp', ico:'🚨',
    title:{fa:'Incident در مقابل Problem',de:'Incident vs. Problem',en:'Incident vs problem'},
    blurb:{fa:'الان خراب در مقابل علت ریشه‌ای',de:'Jetzt gestört vs. Ursache',en:'Broken now vs root cause'},
    steps:{
      fa:[
        {t:'Incident',x:'الان سرویس خراب است → سریع برگردان.',e:'پرینتر Hang کرد → Restart.'},
        {t:'Problem',x:'چرا چند بار تکرار شد؟ علت را پیدا کن.',e:'درایور قدیمی باعث Hang مکرر است.'},
        {t:'ترتیب',x:'اول Incident را آرام کن، بعد روی Problem کار کن.',e:'امروز چاپ؛ فردا آپدیت درایور.'}
      ],
      de:[
        {t:'Incident',x:'Service jetzt gestört → schnell wiederherstellen.',e:'Drucker hängt → Neustart.'},
        {t:'Problem',x:'Warum wiederholt? Ursache finden.',e:'Alter Treiber verursacht Hänger.'},
        {t:'Reihenfolge',x:'Zuerst Incident, dann Problem.',e:'Heute drucken; morgen Treiber-Update.'}
      ],
      en:[
        {t:'Incident',x:'Service is down now → restore quickly.',e:'Printer hung → restart.'},
        {t:'Problem',x:'Why does it repeat? Find the cause.',e:'Old driver causes repeated hangs.'},
        {t:'Order',x:'Calm the incident first, then work the problem.',e:'Print today; update driver tomorrow.'}
      ]
    }
  },
  deesc: {
    cat:'bgwp', ico:'🤝',
    title:{fa:'Deeskalation',de:'Deeskalation',en:'De-escalation'},
    blurb:{fa:'آرام کردن کاربر عصبانی',de:'Wütenden Nutzer beruhigen',en:'Calm an angry user'},
    steps:{
      fa:[
        {t:'اول گوش بده',x:'نوکش نکن. بگذار مشکل را بگوید.',e:'«متوجه می‌شوم چقدر اذیت‌کننده است.»'},
        {t:'قول واقع‌بینانه',x:'نگو «فوری ۱۰۰٪» اگر نمی‌توانی.',e:'«الان قدم‌به‌قدم چک می‌کنیم.»'},
        {t:'بعد فنی شو',x:'وقتی آرام شد سؤال فنی بپرس.',e:'از کی؟ پیام خطا؟ خانه یا دفتر؟'}
      ],
      de:[
        {t:'Zuerst zuhören',x:'Nicht unterbrechen. Problem schildern lassen.',e:'„Ich verstehe den Ärger.“'},
        {t:'Realistische Zusage',x:'Kein „sofort 100 %“, wenn unmöglich.',e:'„Wir prüfen Schritt für Schritt.“'},
        {t:'Dann Technik',x:'Wenn ruhiger: technische Fragen.',e:'Seit wann? Fehlermeldung? Home oder Büro?'}
      ],
      en:[
        {t:'Listen first',x:'Don’t interrupt. Let them describe the issue.',e:'“I understand how frustrating that is.”'},
        {t:'Realistic promise',x:'Don’t say “100% immediate” if you can’t.',e:'“We’ll check step by step now.”'},
        {t:'Then technical',x:'When calmer, ask technical questions.',e:'Since when? Error message? Home or office?'}
      ]
    }
  },

  /* ===== IT-Technik ===== */
  cps: {
    cat:'ittec', ico:'🤖',
    title:{fa:'CPS چیست؟',de:'Was ist CPS?',en:'What is CPS?'},
    blurb:{fa:'دنیای فیزیکی + IT',de:'Physik + IT',en:'Physical world + IT'},
    steps:{
      fa:[
        {t:'ایده',x:'سنسور دنیای واقعی را می‌خواند؛ IT تصمیم می‌گیرد؛ عملگر عمل می‌کند.',e:'ترموستات هوشمند خانه.'},
        {t:'اجزا',x:'Sensor → Controller → Netzwerk → IT → Aktor.',e:'DHT22 → ESP32 → WLAN → اپ → رله فن.'},
        {t:'چرا مهم؟',x:'کارخانه، انبار، ساختمان‌های هوشمند همه CPS هستند.',e:'سردخانه با آلارم دما.'}
      ],
      de:[
        {t:'Idee',x:'Sensor misst, IT entscheidet, Aktor handelt.',e:'Smart-Thermostat zu Hause.'},
        {t:'Bausteine',x:'Sensor → Controller → Netz → IT → Aktor.',e:'DHT22 → ESP32 → WLAN → App → Lüfterrelais.'},
        {t:'Warum wichtig?',x:'Fabrik, Lager, Smart Building = CPS.',e:'Kühlraum mit Temperatur-Alarm.'}
      ],
      en:[
        {t:'Idea',x:'Sensor reads the world; IT decides; actuator acts.',e:'Smart home thermostat.'},
        {t:'Parts',x:'Sensor → controller → network → IT → actuator.',e:'DHT22 → ESP32 → Wi-Fi → app → fan relay.'},
        {t:'Why it matters',x:'Factories, warehouses, smart buildings are CPS.',e:'Cold storage with temperature alarm.'}
      ]
    }
  },
  mqtt: {
    cat:'ittec', ico:'📨',
    title:{fa:'MQTT چیست؟',de:'Was ist MQTT?',en:'What is MQTT?'},
    blurb:{fa:'پیام سبک برای IoT',de:'Leichte IoT-Nachrichten',en:'Lightweight IoT messaging'},
    steps:{
      fa:[
        {t:'مدل',x:'Publish روی یک Topic · Subscribe همان Topic را گوش می‌دهد · Broker واسط است.',e:'موضوع lager/temp'},
        {t:'QoS',x:'0 ممکن است گم شود · 1 حداقل یک‌بار می‌رسد.',e:'آلارم مهم → QoS 1'},
        {t:'امنیت',x:'روی اینترنت عمومی بدون رمز خطرناک است.',e:'TLS و رمز عبور برای Broker.'}
      ],
      de:[
        {t:'Modell',x:'Publish auf Topic · Subscribe hört zu · Broker vermittelt.',e:'Topic lager/temp'},
        {t:'QoS',x:'0 kann verloren gehen · 1 mindestens einmal.',e:'Wichtiger Alarm → QoS 1'},
        {t:'Sicherheit',x:'Im öffentlichen Netz ohne Schutz riskant.',e:'TLS und Passwort für Broker.'}
      ],
      en:[
        {t:'Model',x:'Publish on a topic · subscribe listens · broker mediates.',e:'Topic lager/temp'},
        {t:'QoS',x:'0 may be lost · 1 arrives at least once.',e:'Important alarm → QoS 1'},
        {t:'Security',x:'Plain on the public internet is risky.',e:'TLS and password for the broker.'}
      ]
    }
  },

  /* ===== AEuP ===== */
  sources: {
    cat:'aeup', ico:'🗄️',
    title:{fa:'منابع داده',de:'Datenquellen',en:'Data sources'},
    blurb:{fa:'DB، فایل، API',de:'DB, Datei, API',en:'DB, file, API'},
    steps:{
      fa:[
        {t:'انواع',x:'پایگاه داده، فایل CSV/Excel، API وب.',e:'فروش در MySQL · انبار در CSV · سفارش از API'},
        {t:'قبل از اتصال',x:'داده شخصی؟ مجوز؟ چقدر تازه است؟',e:'لیست مشتری با ایمیل = داده شخصی'},
        {t:'هدف',x:'ترکیب امن و قابل فهم برای کاربر.',e:'یک گزارش واحد برای مدیر'}
      ],
      de:[
        {t:'Arten',x:'Datenbank, CSV/Excel, Web-API.',e:'Verkauf MySQL · Lager CSV · Shop-API'},
        {t:'Vor dem Zugriff',x:'Personendaten? Recht? Aktualität?',e:'Kundenliste mit E-Mail = Personendaten'},
        {t:'Ziel',x:'Sicher und verständlich kombinieren.',e:'Ein Bericht für die Leitung'}
      ],
      en:[
        {t:'Types',x:'Database, CSV/Excel, web API.',e:'Sales MySQL · warehouse CSV · shop API'},
        {t:'Before connecting',x:'Personal data? Permission? Freshness?',e:'Customer list with email = personal data'},
        {t:'Goal',x:'Combine safely and clearly.',e:'One report for the manager'}
      ]
    }
  },
  sqljoin: {
    cat:'aeup', ico:'🔗',
    title:{fa:'JOIN در SQL',de:'SQL JOIN',en:'SQL JOIN'},
    blurb:{fa:'چسباندن جداول',de:'Tabellen verbinden',en:'Link tables'},
    steps:{
      fa:[
        {t:'چرا؟',x:'داده در چند جدول است؛ با کلید مشترک وصل می‌شوند.',e:'User و Ticket با user_id'},
        {t:'JOIN ساده',x:'SELECT ... FROM A JOIN B ON A.id = B.a_id',e:'تیکت‌های باز علی'},
        {t:'نکته',x:'بدون شرط ON نتیجه بی‌معنی و خیلی بزرگ می‌شود.',e:'همیشه کلید را مشخص کن'}
      ],
      de:[
        {t:'Warum?',x:'Daten in mehreren Tabellen – über Schlüssel verbinden.',e:'User und Ticket über user_id'},
        {t:'Einfacher JOIN',x:'SELECT ... FROM A JOIN B ON A.id = B.a_id',e:'Offene Tickets von Ali'},
        {t:'Tipp',x:'Ohne ON wird es sinnlos und riesig.',e:'Schlüssel immer angeben'}
      ],
      en:[
        {t:'Why?',x:'Data lives in several tables – join on a shared key.',e:'User and Ticket via user_id'},
        {t:'Simple JOIN',x:'SELECT ... FROM A JOIN B ON A.id = B.a_id',e:'Ali’s open tickets'},
        {t:'Tip',x:'Without ON the result is huge and wrong.',e:'Always specify the key'}
      ]
    }
  },
  rest: {
    cat:'aeup', ico:'🌐',
    title:{fa:'REST و JSON',de:'REST und JSON',en:'REST and JSON'},
    blurb:{fa:'API مدرن',de:'Moderne API',en:'Modern API'},
    steps:{
      fa:[
        {t:'REST',x:'GET بخوان · POST بساز · روی URL.',e:'GET /tickets'},
        {t:'JSON',x:'فرمت متنی خوانا برای داده.',e:'{"id":5,"title":"VPN down"}'},
        {t:'کد وضعیت',x:'200 اوکی · 404 پیدا نشد · 401 بدون اجازه.',e:'توکن اشتباه → 401'}
      ],
      de:[
        {t:'REST',x:'GET lesen · POST anlegen · über URL.',e:'GET /tickets'},
        {t:'JSON',x:'Lesbares Textformat für Daten.',e:'{"id":5,"title":"VPN down"}'},
        {t:'Statuscodes',x:'200 ok · 404 nicht gefunden · 401 keine Berechtigung.',e:'Falsches Token → 401'}
      ],
      en:[
        {t:'REST',x:'GET read · POST create · via URL.',e:'GET /tickets'},
        {t:'JSON',x:'Readable text format for data.',e:'{"id":5,"title":"VPN down"}'},
        {t:'Status codes',x:'200 ok · 404 not found · 401 unauthorized.',e:'Wrong token → 401'}
      ]
    }
  },

  /* ===== IT-Systeme ===== */
  osi: {
    cat:'itsys', ico:'📶',
    title:{fa:'OSI خیلی ساده',de:'OSI ganz einfach',en:'OSI made simple'},
    blurb:{fa:'عیب‌یابی لایه به لایه',de:'Schicht für Schicht prüfen',en:'Troubleshoot layer by layer'},
    steps:{
      fa:[
        {t:'از پایین شروع کن',x:'کابل و لینک قبل از نرم‌افزار.',e:'لینک سوئیچ خاموش است؟'},
        {t:'IP و Gateway',x:'لایه ۳: آدرس و مسیر خروجی.',e:'ping به Gateway'},
        {t:'برنامه',x:'اگر شبکه اوکی است، سرویس/DNS/پورت را چک کن.',e:'سایت باز نمی‌شود ولی ping اوکی → DNS'}
      ],
      de:[
        {t:'Von unten starten',x:'Kabel und Link vor Software.',e:'Switch-Link aus?'},
        {t:'IP und Gateway',x:'Schicht 3: Adresse und Ausgang.',e:'Ping zum Gateway'},
        {t:'Anwendung',x:'Wenn Netz ok: Dienst/DNS/Port.',e:'Website nein, Ping ja → DNS'}
      ],
      en:[
        {t:'Start at the bottom',x:'Cable and link before software.',e:'Is the switch link down?'},
        {t:'IP and gateway',x:'Layer 3: address and exit path.',e:'Ping the gateway'},
        {t:'Application',x:'If the network is fine, check service/DNS/port.',e:'Site fails but ping works → DNS'}
      ]
    }
  },
  ipgw: {
    cat:'itsys', ico:'🔢',
    title:{fa:'IP و Gateway',de:'IP und Gateway',en:'IP and gateway'},
    blurb:{fa:'آدرس و در خروجی',de:'Adresse und Ausgang',en:'Address and exit door'},
    steps:{
      fa:[
        {t:'IP',x:'آدرس دستگاه در شبکه.',e:'192.168.10.50'},
        {t:'Mask',x:'کدام قسمت شبکه است.',e:'255.255.255.0 → شبکه 192.168.10.x'},
        {t:'Gateway',x:'در به شبکه‌های دیگر / اینترنت.',e:'معمولاً .1 مثل 192.168.10.1'}
      ],
      de:[
        {t:'IP',x:'Adresse des Geräts im Netz.',e:'192.168.10.50'},
        {t:'Maske',x:'Welcher Teil ist das Netz.',e:'255.255.255.0 → Netz 192.168.10.x'},
        {t:'Gateway',x:'Tür zu anderen Netzen / Internet.',e:'Meist .1 wie 192.168.10.1'}
      ],
      en:[
        {t:'IP',x:'The device address on the network.',e:'192.168.10.50'},
        {t:'Mask',x:'Which part is the network.',e:'255.255.255.0 → network 192.168.10.x'},
        {t:'Gateway',x:'Door to other networks / the internet.',e:'Usually .1 such as 192.168.10.1'}
      ]
    }
  },
  subnet: {
    cat:'itsys', ico:'✂️',
    title:{fa:'Subnetting ساده',de:'Subnetting einfach',en:'Simple subnetting'},
    blurb:{fa:'تکه کردن شبکه',de:'Netz zerteilen',en:'Split a network'},
    steps:{
      fa:[
        {t:'چرا؟',x:'شبکه بزرگ را برای نظم و امنیت تکه می‌کنی.',e:'اداری و مهمان جدا'},
        {t:'/24 و /25',x:'/24 حدود ۲۵۴ host · نصف کردن → دو /25.',e:'192.168.50.0/25 و .128/25'},
        {t:'/26',x:'حدود ۶۲ host قابل استفاده.',e:'برای بخش کوچک کافی است'}
      ],
      de:[
        {t:'Warum?',x:'Großes Netz für Ordnung und Sicherheit teilen.',e:'Büro und Gäste getrennt'},
        {t:'/24 und /25',x:'/24 ca. 254 Hosts · halbieren → zwei /25.',e:'192.168.50.0/25 und .128/25'},
        {t:'/26',x:'Ca. 62 nutzbare Hosts.',e:'Für kleine Abteilung genug'}
      ],
      en:[
        {t:'Why?',x:'Split a large network for order and security.',e:'Office and guests separated'},
        {t:'/24 and /25',x:'/24 ≈ 254 hosts · half → two /25s.',e:'192.168.50.0/25 and .128/25'},
        {t:'/26',x:'About 62 usable hosts.',e:'Enough for a small team'}
      ]
    }
  },
  vlan: {
    cat:'itsys', ico:'🔀',
    title:{fa:'VLAN چیست؟',de:'Was ist ein VLAN?',en:'What is a VLAN?'},
    blurb:{fa:'شبکه منطقی روی سوئیچ',de:'Logisches Netz am Switch',en:'Logical network on a switch'},
    steps:{
      fa:[
        {t:'ایده',x:'چند شبکه منطقی روی یک سوئیچ فیزیکی.',e:'VLAN 10 اداری · 20 فنی'},
        {t:'Access / Trunk',x:'Access = یک VLAN برای PC · Trunk = چند VLAN به روتر.',e:'PC روی Access 10'},
        {t:'بین VLANها',x:'جدا هستند؛ برای ارتباط به Routing نیاز است.',e:'Router-on-a-Stick'}
      ],
      de:[
        {t:'Idee',x:'Mehrere logische Netze auf einem Switch.',e:'VLAN 10 Büro · 20 Technik'},
        {t:'Access / Trunk',x:'Access = ein VLAN · Trunk = mehrere zum Router.',e:'PC an Access 10'},
        {t:'Zwischen VLANs',x:'Getrennt – Routing nötig.',e:'Router-on-a-Stick'}
      ],
      en:[
        {t:'Idea',x:'Several logical networks on one switch.',e:'VLAN 10 office · 20 tech'},
        {t:'Access / trunk',x:'Access = one VLAN · trunk = many toward the router.',e:'PC on access 10'},
        {t:'Between VLANs',x:'Isolated – routing is required.',e:'Router-on-a-stick'}
      ]
    }
  },
  dhcp: {
    cat:'itsys', ico:'📡',
    title:{fa:'DHCP چیست؟',de:'Was ist DHCP?',en:'What is DHCP?'},
    blurb:{fa:'IP خودکار',de:'IP automatisch',en:'Automatic IP'},
    steps:{
      fa:[
        {t:'کار DHCP',x:'به کلاینت IP، Mask، Gateway و DNS می‌دهد.',e:'PC روشن می‌شود و 192.168.10.105 می‌گیرد'},
        {t:'DORA',x:'Discover → Offer → Request → Ack.',e:'درخواست · پیشنهاد · قبول · تأیید'},
        {t:'Exclude',x:'آدرس سرور و پرینتر را از Pool خارج کن.',e:'Gateway .1 را exclude کن'}
      ],
      de:[
        {t:'Aufgabe',x:'Gibt IP, Maske, Gateway und DNS.',e:'PC bekommt 192.168.10.105'},
        {t:'DORA',x:'Discover → Offer → Request → Ack.',e:'Fragen · Angebot · Annehmen · Bestätigen'},
        {t:'Exclude',x:'Server- und Drucker-IPs aus dem Pool nehmen.',e:'Gateway .1 excluden'}
      ],
      en:[
        {t:'Job of DHCP',x:'Gives IP, mask, gateway and DNS.',e:'PC gets 192.168.10.105'},
        {t:'DORA',x:'Discover → Offer → Request → Ack.',e:'Ask · offer · accept · confirm'},
        {t:'Exclude',x:'Keep server and printer IPs out of the pool.',e:'Exclude gateway .1'}
      ]
    }
  },
  dns: {
    cat:'itsys', ico:'🔤',
    title:{fa:'DNS چیست؟',de:'Was ist DNS?',en:'What is DNS?'},
    blurb:{fa:'نام به IP',de:'Name zu IP',en:'Name to IP'},
    steps:{
      fa:[
        {t:'کار DNS',x:'نام خوانا را به IP ترجمه می‌کند.',e:'files.firma.local → 192.168.10.10'},
        {t:'عیب‌یابی',x:'IP پینگ می‌شود ولی نام نه → DNS.',e:'ping 1.1.1.1 اوکی · google.com نه'},
        {t:'تنظیم',x:'کلاینت DNS را از DHCP یا دستی می‌گیرد.',e:'8.8.8.8 یا DNS داخلی شرکت'}
      ],
      de:[
        {t:'Aufgabe',x:'Lesbaren Namen in IP übersetzen.',e:'files.firma.local → 192.168.10.10'},
        {t:'Fehlerbild',x:'IP pingbar, Name nicht → DNS.',e:'ping 1.1.1.1 ok · google.com nicht'},
        {t:'Einstellung',x:'Client bekommt DNS per DHCP oder manuell.',e:'8.8.8.8 oder interner DNS'}
      ],
      en:[
        {t:'Job of DNS',x:'Translate a readable name to an IP.',e:'files.firma.local → 192.168.10.10'},
        {t:'Troubleshooting',x:'IP pings but name fails → DNS.',e:'ping 1.1.1.1 ok · google.com not'},
        {t:'Setting',x:'Client gets DNS from DHCP or manually.',e:'8.8.8.8 or company DNS'}
      ]
    }
  },

  /* ===== Fachpraxis ===== */
  laborder: {
    cat:'fp', ico:'🛠️',
    title:{fa:'ترتیب کار آزمایشگاه',de:'Labor-Ablauf',en:'Lab workflow'},
    blurb:{fa:'از طرح تا ping',de:'Vom Plan zum Ping',en:'From plan to ping'},
    steps:{
      fa:[
        {t:'طرح IP',x:'قبل از کابل، آدرس‌ها را روی کاغذ بنویس.',e:'VLAN10 = 192.168.10.0/24 · GW .1'},
        {t:'سوئیچ بعد روتر',x:'VLAN و Access/Trunk · بعد Subinterface.',e:'Trunk به روتر روی fa0/24'},
        {t:'DHCP و تست',x:'Pool بساز · PC را DHCP بگذار · ping کن.',e:'ping Gateway و VLAN دیگر'}
      ],
      de:[
        {t:'IP-Plan',x:'Adressen vor dem Kabeln notieren.',e:'VLAN10 = 192.168.10.0/24 · GW .1'},
        {t:'Switch dann Router',x:'VLAN und Access/Trunk · dann Subinterface.',e:'Trunk zum Router an fa0/24'},
        {t:'DHCP und Test',x:'Pool · PC auf DHCP · pingen.',e:'Ping Gateway und anderes VLAN'}
      ],
      en:[
        {t:'IP plan',x:'Write addresses on paper before cabling.',e:'VLAN10 = 192.168.10.0/24 · GW .1'},
        {t:'Switch then router',x:'VLAN and access/trunk · then subinterfaces.',e:'Trunk to router on fa0/24'},
        {t:'DHCP and test',x:'Build pool · set PC to DHCP · ping.',e:'Ping gateway and other VLAN'}
      ]
    }
  },
  trunk: {
    cat:'fp', ico:'🔌',
    title:{fa:'Access و Trunk',de:'Access und Trunk',en:'Access and trunk'},
    blurb:{fa:'پورت سوئیچ',de:'Switch-Port',en:'Switch port'},
    steps:{
      fa:[
        {t:'Access',x:'یک VLAN برای یک PC یا پرینتر.',e:'fa0/1 access vlan 10'},
        {t:'Trunk',x:'چند VLAN روی یک کابل (معمولاً به روتر).',e:'fa0/24 mode trunk'},
        {t:'اشتباه رایج',x:'PC را Trunk نگذار مگر بدانی چرا.',e:'PC روی Access می‌ماند'}
      ],
      de:[
        {t:'Access',x:'Ein VLAN für PC oder Drucker.',e:'fa0/1 access vlan 10'},
        {t:'Trunk',x:'Mehrere VLANs auf einem Kabel (oft zum Router).',e:'fa0/24 mode trunk'},
        {t:'Häufiger Fehler',x:'PC nicht als Trunk, außer du weißt warum.',e:'PC bleibt Access'}
      ],
      en:[
        {t:'Access',x:'One VLAN for a PC or printer.',e:'fa0/1 access vlan 10'},
        {t:'Trunk',x:'Many VLANs on one cable (often to the router).',e:'fa0/24 mode trunk'},
        {t:'Common mistake',x:'Don’t put a PC in trunk mode unless you know why.',e:'PC stays access'}
      ]
    }
  },

  /* ===== PuG ===== */
  gov: {
    cat:'pug', ico:'🏛️',
    title:{fa:'دولت فعلی آلمان',de:'Aktuelle Regierung',en:'Current German government'},
    blurb:{fa:'Merz و ائتلاف',de:'Merz und Koalition',en:'Merz and coalition'},
    steps:{
      fa:[
        {t:'صدراعظم',x:'Friedrich Merz (CDU) – وضعیت پاییز ۲۰۲۶.',e:'ائتلاف بزرگ با SPD'},
        {t:'ائتلاف',x:'CDU/CSU با SPD دولت را می‌چرخانند.',e:'باید روی قانون‌ها توافق کنند'},
        {t:'برای امتحان',x:'بدان چه کسی حکومت می‌کند و نقش Bundestag چیست.',e:'Bundestag قانون می‌گذارد'}
      ],
      de:[
        {t:'Kanzler',x:'Friedrich Merz (CDU) – Stand Herbst 2026.',e:'Große Koalition mit SPD'},
        {t:'Koalition',x:'CDU/CSU und SPD regieren gemeinsam.',e:'Gesetze müssen ausgehandelt werden'},
        {t:'Für die Prüfung',x:'Wer regiert? Was macht der Bundestag?',e:'Bundestag macht Gesetze'}
      ],
      en:[
        {t:'Chancellor',x:'Friedrich Merz (CDU) – autumn 2026 context.',e:'Grand coalition with SPD'},
        {t:'Coalition',x:'CDU/CSU and SPD govern together.',e:'They must agree on laws'},
        {t:'For the exam',x:'Know who governs and what the Bundestag does.',e:'Bundestag makes laws'}
      ]
    }
  },
  bericht: {
    cat:'pug', ico:'📓',
    title:{fa:'Berichtsheft',de:'Berichtsheft',en:'Training record'},
    blurb:{fa:'دفترچه گزارش Ausbildung',de:'Ausbildungsnachweis',en:'Apprenticeship log'},
    steps:{
      fa:[
        {t:'چیست؟',x:'گزارش هفتگی کار و یادگیری تو.',e:'چه کار کردی، چه یاد گرفتی'},
        {t:'چرا مهم؟',x:'اثبات Ausbildung و اغلب پیش‌نیاز آزمون.',e:'بدون آن ممکن است به آزمون راه ندهند'},
        {t:'نکته',x:'منظم و صادقانه بنویس؛ کپی الکی نکن.',e:'هفته‌ای چند جمله واقعی بهتر از متن جعلی است'}
      ],
      de:[
        {t:'Was ist das?',x:'Wöchentlicher Nachweis deiner Arbeit und des Lernens.',e:'Was getan, was gelernt'},
        {t:'Warum wichtig?',x:'Nachweis der Ausbildung und oft Prüfungsvoraussetzung.',e:'Ohne kann die Zulassung fehlen'},
        {t:'Tipp',x:'Regelmäßig und ehrlich – keine Fake-Texte.',e:'Ein paar echte Sätze pro Woche'}
      ],
      en:[
        {t:'What is it?',x:'Weekly record of your work and learning.',e:'What you did and learned'},
        {t:'Why important?',x:'Proof of training and often required for the exam.',e:'Without it you may not be admitted'},
        {t:'Tip',x:'Write regularly and honestly – no fake text.',e:'A few real sentences each week'}
      ]
    }
  }
};
