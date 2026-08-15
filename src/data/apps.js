// Single source of truth for every app shown on the site.
// `device` picks the landing-page preview frame: 'mac' | 'ipad' | 'ios'.
// `group` drives the category filter chips on the home page.
export const apps = [
  {
    slug: 'ephemeris-sky',
    name: 'Ephemeris Sky',
    category: 'Sky & science',
    group: 'science',
    accent: '#a78bfa',
    device: 'mac',
    icloud: true,        // saved charts sync via the user's own iCloud — keep privacy copy precise
    appStoreId: '6782659268',
    icon: 'ephemeris_sky/icon.png',
    screenshot: 'ephemeris_sky/screenshot.png',
    tagline: 'The sky, computed for any moment.',
    short: 'Natal charts, transits, real planetary positions and aspects — computed on your device.',
    blurb: 'Turn any moment into a precise picture of the solar system. Ephemeris Sky computes real geocentric planetary positions, the aspects between them, and a live chart wheel for any date and time. Save your natal chart and read today’s sky against it, choose your house system — Placidus, Koch, Whole Sign and more — and follow an event timeline of ingresses, lunations and aspects. It also tracks each planet’s synodic cycle, so you always know when the next retrograde begins.',
    features: [
      'Your natal chart, saved and synced through your own iCloud',
      'Natal plus transits — today’s sky on your own chart',
      'Houses and angles: Placidus, Koch, Whole Sign & more',
      'Positions, aspects, synodic cycle and an event timeline'
    ]
  },
  {
    slug: 'overtone-lab',
    name: 'Overtone Lab',
    category: 'Creative tools',
    group: 'tools',
    accent: '#8b7cff',
    device: 'mac',
    appStoreId: '6787524729',
    icon: 'overtonelab/icon.png',
    screenshot: 'overtonelab/screenshot.png',
    tagline: 'Twenty exact audio tools in one app.',
    short: 'A precision calculation studio for audio engineers, musicians, and instrument builders.',
    blurb: 'A precision calculation studio for audio engineers, musicians, and instrument builders — twenty exact tools in one app. Compute tempo and timing, SMPTE, pitch and harmonics, string tension, room acoustics, filters and crossovers, LUFS loudness, and more. Every formula is reference-validated.',
    features: [
      'Tempo, SMPTE timecode, pitch & harmonics',
      'Reverb, room modes, filters & crossovers',
      'ITU-R BS.1770 LUFS loudness metering',
      'Reference-validated · 100% offline & private'
    ]
  },
  {
    slug: 'indox-text',
    name: 'Indox Text',
    category: 'AI & utilities',
    group: 'ai',
    accent: '#4f8dff',
    device: 'ios',
    platforms: 'iPhone, iPad, Mac & Safari',
    appStoreId: '1603883417',
    icon: 'indoxtext/icon.jpg',
    screenshot: 'indoxtext/screenshot.png',
    tagline: 'Summarize anything, fully on-device.',
    short: 'Turn long articles and documents into quick, digestible summaries.',
    blurb: 'Transform lengthy articles, documents, and web pages into quick, digestible summaries — on iPhone, iPad, Mac, and Safari. Powered entirely by your device’s CPU and Neural Engine, Indox Text works offline and keeps your data private. No cloud, no servers, just fast AI summarization at your fingertips.',
    features: [
      'On-device AI — CPU & Neural Engine',
      'Works offline, nothing leaves your device',
      'iPhone, iPad, Mac & a Safari extension'
    ]
  },
  {
    slug: 'typing-mill',
    name: 'Typing Mill',
    category: 'AI & utilities',
    group: 'ai',
    accent: '#35c9c0',
    device: 'ipad',
    appStoreId: '1631148042',
    icon: 'typingmill/icon.png',
    screenshot: 'typingmill/screenshot.png',
    tagline: 'Master your typing speed, the fun way.',
    short: 'Practice with real words across four difficulty levels.',
    blurb: 'Master your typing speed with Typing Mill. Practice typing with real words across four difficulty levels, from beginner-friendly to expert challenges. A beautiful animated interface makes learning to type fast an enjoyable experience.',
    features: [
      'Practice with real words, not random letters',
      'Four difficulty levels, beginner to expert',
      'Beautiful animated interface'
    ]
  },
  {
    slug: 'golden-ratio-calculator',
    name: 'Golden Ratio Calculator',
    category: 'Creative tools',
    group: 'tools',
    accent: '#e0b24a',
    device: 'mac',
    appStoreId: '1570841203',
    icon: 'goldencalc/icon.png',
    screenshot: 'goldencalc/screenshot.png',
    tagline: 'Precise golden-ratio math, instantly.',
    short: 'For designers, architects, and mathematicians who need exact figures.',
    blurb: 'Calculate any part of the golden ratio instantly. Perfect for designers, architects, and mathematicians who need precise golden ratio calculations. Enter any value to reactively calculate the lesser, greater, and whole parts with professional precision.',
    features: [
      'Reactively calculates lesser, greater & whole parts',
      'Professional precision',
      'Built for designers, architects & mathematicians'
    ]
  },
  {
    slug: 'golden-ratio-calculator-lite',
    name: 'Golden Ratio Calculator Lite',
    category: 'Creative tools',
    group: 'tools',
    accent: '#f0cd6f',
    device: 'ios',
    appStoreId: '1570956847',
    icon: 'goldencalclite/icon.png',
    screenshot: 'goldencalclite/screenshot.png',
    tagline: 'The golden ratio, simplified.',
    short: 'A quick, streamlined calculator for everyday design work.',
    blurb: 'A simple, easy-to-use golden ratio calculator. Perfect for quick calculations when you need the golden ratio for your designs. Just enter any value and instantly see the lesser, greater, and whole parts. Streamlined and accessible for everyone.',
    features: [
      'Enter a value, instantly see every part',
      'Streamlined and accessible',
      'Free and quick'
    ]
  },
  {
    slug: 'big-pink-cat',
    name: 'Big Pink Cat',
    category: 'Games',
    group: 'games',
    accent: '#ff5c9a',
    device: 'ipad',
    appStoreId: '6497066161',
    icon: 'bigpinkcat/icon.png',
    screenshot: 'bigpinkcat/screenshot.png',
    tagline: 'A cosmic, choose-your-path story.',
    short: 'Meet the mysterious Pink Cat and uncover the secrets of the universe.',
    blurb: 'Embark on a cosmic visual adventure with Big Pink Cat. Meet the mysterious Pink Cat and uncover the secrets of the universe through an interactive story. Choose your path, shape your destiny, and discover what awaits among the stars.',
    features: [
      'Interactive, branching story',
      'Choose your path and shape your destiny',
      'Uncover secrets among the stars'
    ]
  },
  {
    slug: 'skyscraper-frog',
    name: 'Skyscraper Frog',
    category: 'Games',
    group: 'games',
    accent: '#5ad16a',
    device: 'mac',
    appStoreId: '1563057204',
    icon: 'froggo/icon.png',
    screenshot: 'froggo/screenshot.png',
    tagline: '8-bit leaping across the rooftops.',
    short: 'Guide the bravest frog over the tallest skyscrapers.',
    blurb: 'You and the bravest frog ever will experience a journey like no other. In this 8-bit style game, help choose the frog’s path across the roofs of the tallest skyscrapers. When the fly comes and goes, don’t miss your chance — eat it for a vital boost!',
    features: [
      'Retro 8-bit style',
      'Choose the frog’s path across the rooftops',
      'Catch the fly for a vital boost'
    ]
  },
  {
    slug: 'monstro-shooter',
    name: 'Monstro Shooter',
    category: 'Games',
    group: 'games',
    accent: '#ff6b3d',
    device: 'mac',
    appStoreId: '6752858611',
    icon: 'monstro_shooter/icon.png',
    screenshot: 'monstro_shooter/screenshot.png',
    tagline: 'Survive the alien invasion.',
    short: 'An intense top-down shooter across Mars deserts and asteroid fields.',
    blurb: 'Survive the alien invasion in this intense top-down shooter. Battle waves of deadly creatures across Mars deserts and asteroid fields. Control your exosuit, unleash firepower, and fight to stay alive against bugs, birds, walkers, and berserkers.',
    features: [
      'Top-down wave survival',
      'Mars deserts & asteroid fields',
      'Battle bugs, birds, walkers & berserkers'
    ]
  },
  {
    slug: 'kerf-calc',
    name: 'Kerf Calc',
    category: 'Creative tools',
    group: 'tools',
    accent: '#c9e34a',
    device: 'ios',
    appStoreId: '6788179502',
    icon: 'kerfcalc/icon.png',
    screenshot: 'kerfcalc/screenshot.png',
    tagline: 'The field calculator that shows its work.',
    short: 'Feet-inch-fraction math plus framing, concrete, and materials — offline.',
    blurb: 'Kerf Calc is the offline construction field calculator that just works — no account, no subscription. Punch feet-inch-fraction dimensions like a tape, then run rafters, stairs to code, concrete, rebar, roofing, drywall and more — each tool shows the exact formula and the code it cites (IRC, ASTM, NIST, ACI).',
    features: [
      'Feet-inch-fraction tape math, down to 1/64',
      'Framing: rafters, stairs to IRC/IBC code & pitch',
      'Concrete, rebar, roofing, drywall & materials',
      'Shows the formula and the code it cites · 100% offline'
    ]
  },
  {
    slug: 'truecourse-e6b',
    name: 'TrueCourse E6B',
    category: 'Sky & science',
    group: 'science',
    accent: '#2fd4e8',
    device: 'ios',
    appStoreId: '6788926819',
    icon: 'truecourse/icon.png',
    screenshot: 'truecourse/screenshot.png',
    tagline: 'The E6B you can trust on a checkride.',
    short: 'Wind triangle, true airspeed, density altitude, fuel, and weight & balance.',
    blurb: 'A modern E6B flight computer for student pilots, GA pilots, and CFIs — the digital whiz wheel you are taught to use for the FAA knowledge exam and every flight after it. Solve the wind triangle, true airspeed and Mach, density and pressure altitude, nav log, fuel, climb and descent, and weight & balance with a live CG envelope. Every number comes from validated, published formulas (FAA-H-8083 handbooks and the ICAO Standard Atmosphere).',
    features: [
      'Wind triangle — heading, groundspeed & crosswind, with a live vector diagram',
      'True airspeed, Mach, density, pressure & true altitude',
      'Nav log, fuel, climb/descent and weight & balance with a CG envelope',
      'Glass-cockpit readouts with a night mode · validated formulas, works offline'
    ]
  },
  {
    slug: 'earth-around',
    name: 'Earth Around',
    category: 'Sky & science',
    group: 'science',
    accent: '#4df0a0',
    device: 'ios',
    platforms: 'iPhone, iPad, Mac & Apple Watch',
    live: true,           // shows live public data — never claim it works fully offline
    liveSource: 'NOAA',
    appStoreId: '6794748918',
    icon: 'eartharound/icon.png',
    screenshot: 'eartharound/screenshot.png',
    tagline: 'Watch the Sun, from your wrist.',
    short: 'Live solar storms, aurora chance, and the solar wind driving them.',
    blurb: 'Earth Around watches the Sun for you. See whether a storm is happening right now on the NOAA G, R and S scales, what is driving it — solar wind speed and Bz — and live GOES X-ray flux for flares. Check tonight\'s aurora chance and view line, and read Hp30 for 30-minute storm resolution. On iPhone, iPad, Mac, and right on your Apple Watch.',
    features: [
      'Storm right now — live NOAA G · R · S scales',
      'Solar wind speed and Bz, plus GOES X-ray flare flux',
      'Aurora chance tonight with the view line',
      'Hp30 at 30-minute resolution · Apple Watch complications'
    ]
  },
  {
    slug: 'marine-nav',
    name: 'Marine Nav',
    category: 'Sky & science',
    group: 'science',
    accent: '#2e9fe0',
    device: 'ios',
    appStoreId: '6795571481',
    icon: 'marinenav/icon.png',
    screenshot: 'marinenav/screenshot.png',
    tagline: 'Tides, currents and celestial navigation.',
    short: 'Offline tide and tidal-current predictions, sight reduction, and magnetic declination.',
    blurb: 'An offline navigation toolkit for sailors and navigators. Predict tide heights and tidal currents — including slack water — work a celestial sight from sextant altitude to a fix, read magnetic declination from the World Magnetic Model, and solve great-circle distance and bearing. Everything is computed on your device from published data, so it keeps working with no signal at sea.',
    features: [
      'Tide heights and tidal currents, with slack water',
      'Celestial sight reduction — sextant altitude to a fix',
      'Magnetic declination from the World Magnetic Model',
      'Great-circle distance & bearing · 100% offline'
    ]
  },
  {
    slug: 'par',
    name: 'Par',
    category: 'Creative tools',
    group: 'tools',
    accent: '#ffa01e',
    device: 'ios',
    appStoreId: '6795570043',
    icon: 'par/icon.png',
    screenshot: 'par/screenshot.png',
    tagline: 'The financial calculator that cites its sources.',
    short: 'Ten tools — time value of money, bonds, amortization, cash flow and more.',
    blurb: 'An offline financial calculator for people who must have one: loan officers, mortgage and commercial real-estate underwriters, treasury and fixed-income desks, and candidates studying where only a financial calculator is permitted. Ten tools cover time value of money, amortization, bonds, cash flow, day count, depreciation, percent, rate conversion, real estate, and statistics — and every displayed number traces to a cited authority.',
    features: [
      'Ten tools: TVM, amortization, bonds, cash flow, depreciation & more',
      'Every result cites its authority — US Treasury, CFPB Reg Z & DD, IRS, NIST',
      'A running tape of your calculations you can review and save',
      'One-time purchase · no ads, no subscription, no account, no network'
    ]
  },
  {
    slug: 'storypole',
    name: 'Storypole',
    category: 'Creative tools',
    group: 'tools',
    accent: '#d9431c',
    device: 'ios',
    platforms: 'iPhone, iPad, Mac & Apple Watch',
    appStoreId: '6796056413',
    icon: 'storypole/icon.png',
    screenshot: 'storypole/screenshot.png',
    tagline: 'Layout, lumber and takeoff, on site.',
    short: 'Tape math, on-center layout, board feet, roof pitch and takeoff — all offline.',
    blurb: 'A job-site calculator for carpenters, framers and remodelers. Run feet-inch-fraction tape math, lay out equal spacing and on-center marks, size lumber in board feet with nominal-versus-dressed dimensions, work roof pitch and rafters, square up and solve miters and bevels, take off concrete in cubic yards, and check wire gauge. Everything runs on your device — including on your wrist, right at the wall.',
    features: [
      'Tape calculator with feet-inch-fraction math',
      'Layout: equal spacing, on-center marks and square-up',
      'Lumber board feet, roof pitch and rafters, miter and bevel',
      'Concrete takeoff, wire gauge and conversions · also on Apple Watch'
    ]
  },
  {
    slug: 'aircore',
    name: 'AirCore',
    category: 'Creative tools',
    group: 'tools',
    accent: '#1e90d6',
    device: 'ios',
    platforms: 'iPhone, iPad, Mac & Apple Watch',
    appStoreId: '6799999307',
    icon: 'aircore/icon.png',
    screenshot: 'aircore/screenshot.png',
    tagline: 'The offline air-side HVAC calculator.',
    short: 'Psychrometrics, duct, fan and pipe in one app — corrected for your site elevation, not sea level.',
    blurb: 'The air-side calculator for HVAC technicians, designers and contractors. Enter any two of dry bulb, wet bulb, dew point, relative humidity, humidity ratio, enthalpy or specific volume and AirCore solves the rest, putting the point on a real psychrometric chart — type a value and the point moves, drag the point and the values follow. Site elevation sits in the toolbar of every screen and every number is corrected to it, so you are not quietly working at sea level. Imperial and metric switch freely without re-rounding, and the physics lives in independently tested modules checked against published reference data.',
    features: [
      'Any two knowns solve the whole air state, plotted on a real chart',
      'Corrected for your site elevation — see what the altitude costs',
      'Air-side heat in any direction, and air mixing weighted by mass',
      'Duct from friction, fan laws, and pipe by Darcy or Hazen–Williams'
    ]
  }
]

// The app spotlighted in the home hero's "Featured" card.
export const featuredSlug = 'ephemeris-sky'
