// Small derivations shared by the components. Colors are handled in CSS via the
// single `--accent` custom property, so this only computes structural extras.

export const SITE = {
  name: 'AISixteen',
  origin: 'https://aisixteen.com',
  email: 'info@aisixteen.com',
  tagline: 'Apps that keep to themselves.', // hero headline; edit here to change
}

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'games', label: 'Games' },
  { key: 'tools', label: 'Creative tools' },
  { key: 'ai', label: 'AI & utilities' },
  { key: 'science', label: 'Sky & science' },
]

export const appStoreUrl = (app) => `https://apps.apple.com/app/id${app.appStoreId}`

export const deviceLabel = (device) =>
  device === 'ios' ? 'iPhone' : device === 'ipad' ? 'iPad' : 'Mac'

// Folder that holds an app's media (icon/screenshot/preview.mp4 live together).
export const appFolder = (app) => app.icon.split('/')[0]

// Supported devices line (defaults unless an app overrides).
export const platformsOf = (app) => app.platforms || 'iPhone, iPad & Mac'

// Honest, generated FAQ — one source for both the visible accordion and FAQPage schema.
export const faqsOf = (app) => app.faqs || [
  { q: `Does ${app.name} work offline?`, a: `Yes. ${app.name} runs entirely on your device, so it works with no internet connection.` },
  { q: 'Is there an account or subscription?', a: `No. There's no sign-up, no login, and no subscription — just download ${app.name} from the App Store and open it.` },
  { q: `What data does ${app.name} collect?`, a: 'None. It collects, stores, and transmits zero personal data — nothing ever leaves your device.' },
  { q: 'Which devices are supported?', a: `${app.name} is available for ${platformsOf(app)}.` },
]
