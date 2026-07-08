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
    appStoreId: '6782659268',
    icon: 'ephemeris_sky/icon.png',
    screenshot: 'ephemeris_sky/screenshot.png',
    tagline: 'The sky, computed for any moment.',
    short: 'Real planetary positions, aspects, and a live chart wheel — 100% on-device.',
    blurb: 'Turn any moment into a precise picture of the solar system. Ephemeris Sky computes real geocentric planetary positions, the aspects between them, and a live chart wheel for any date and time — and tracks each planet’s synodic cycle so you always know when the next retrograde begins.',
    features: [
      'Real geocentric planetary positions',
      'Aspects and a live chart wheel',
      'Tracks retrogrades, conjunctions & elongations',
      '100% on-device, no account, works offline'
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
  }
]

// The app spotlighted in the home hero's "Featured" card.
export const featuredSlug = 'ephemeris-sky'
