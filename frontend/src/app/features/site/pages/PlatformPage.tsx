/* Platform: what the three tools take in and return, how a request travels, what surrounds the analysis, what it runs on.
   Every statement here is backed by the code (see the research brief in the session notes); nothing is a marketing number. */
import { useState } from 'react';
import { ArrowRight, CalendarCheck, Cpu, Database, FlaskConical, Globe, History, LayoutDashboard, ScanLine, Server, Settings, ShieldAlert, Sparkles, Stethoscope, Watch } from 'lucide-react';
import { CtaBand, LiveStatus, PageHero, PageIndex, Reveal, Section, type PageProps } from '../ui';

const TOOLS = [
  {
    icon: Stethoscope, name: 'Symptom triage',
    text: 'Pick from common symptoms or describe your own. You get ranked possible conditions with a likelihood for each, an urgency level and suggested next steps.',
    rows: [
      ['In', '197 preset symptoms in 14 categories, plus free text (up to 2,000 characters). Wearable readings are added when available.'],
      ['Out', '2 to 4 possible conditions with a likelihood, one of four urgency levels, a short narrative and recommendations.'],
      ['Runs on', 'A chain of hosted language models. If every provider is down, simple keyword rules answer at a fixed low confidence.'],
    ],
  },
  {
    icon: ScanLine, name: 'Scan reading',
    text: 'Upload a medical image and get a written, AI-assisted read: the main finding, secondary observations, an urgency rating and a recommendation.',
    rows: [
      ['In', 'Up to 6 images per run, 25 MB each. X-ray, CT, MRI, ultrasound and skin-lesion images are recognised automatically.'],
      ['Out', 'A primary finding, up to two secondary findings, urgency (Normal, Monitor, Urgent, Critical) and a recommendation. Text only: no heatmaps or bounding boxes.'],
      ['Runs on', 'Hosted vision-language models (Pixtral 12B, Llama 4).'],
    ],
  },
  {
    icon: FlaskConical, name: 'Lab report analysis',
    text: 'Paste a report or upload a file. Each biomarker is extracted, compared with the reference range printed on the report, and flagged.',
    rows: [
      ['In', 'Pasted text (up to 60,000 characters), or a PDF, text, CSV or image file up to 15 MB.'],
      ['Out', 'Each biomarker with its value, unit and range bar, flagged LOW, NORMAL, HIGH or CRITICAL, plus an overall urgency and recommendations.'],
      ['Checked in code', 'Flags are recomputed from the range on the report. CRITICAL means more than 1.5 times the upper limit or less than half the lower limit.'],
    ],
  },
];

const NODES = [
  {
    id: 'browser', icon: Globe, name: 'Your browser', tag: 'React',
    text: 'The interface you are using. It talks only to the CuraSense API gateway.',
    facts: ['Holds no AI credentials: those live in the server environment', 'Checks file size and type before anything is uploaded', 'Keeps your session as a signed token that expires after 24 hours'],
  },
  {
    id: 'gateway', icon: Server, name: 'API gateway', tag: 'Node.js · Express',
    text: 'The front door. Nothing reaches the AI engine except through it.',
    facts: ['Verifies your session token on every protected call', 'Reads uploads byte by byte and refuses files that are not what they claim (HTTP 415)', 'Allows 20 AI requests per 10 minutes per user, per tool', 'Holds the shared secret the AI engine requires'],
  },
  {
    id: 'engine', icon: Cpu, name: 'AI engine', tag: 'Python · FastAPI',
    text: 'Builds the prompt, calls the model providers and turns the answer into a fixed result shape.',
    facts: ['Answers only requests that carry the gateway’s shared secret', 'Asks for JSON-only answers in triage and validates them', 'Tries providers in order; the first to answer wins', 'Recomputes lab flags in code instead of trusting the model'],
  },
  {
    id: 'models', icon: Sparkles, name: 'Model providers', tag: 'Hosted models',
    text: 'Third-party language and vision models. Your input is sent to the provider that answers.',
    facts: ['Text: DeepSeek, Mistral 7B Instruct (Hugging Face), Mistral, Llama 3.3 70B (Groq)', 'Vision: Pixtral 12B (Hugging Face, then Mistral), Llama 4 Scout and Maverick (Groq)', 'A provider without a configured key is skipped', 'These are the defaults and can be changed in configuration'],
  },
  {
    id: 'db', icon: Database, name: 'Database', tag: 'MongoDB',
    text: 'Where your account and your saved results live.',
    facts: ['Stores name, email, a bcrypt password hash and role', 'Stores preferences and the text of each analysis: diagnosis, confidence, urgency, conditions, biomarkers', 'Does not store the files you upload'],
  },
];

const TOOLKIT = [
  { icon: LayoutDashboard, name: 'Dashboard', text: 'Totals, analyses run today and average confidence at a glance.', who: 'Everyone' },
  { icon: History, name: 'History', text: 'Every analysis is saved to your account. Reopen the full report, or star the ones you want to keep close.', who: 'Everyone' },
  { icon: CalendarCheck, name: 'Consultation booking', text: 'A guided demo flow: attach an analysis, pick a sample doctor, a mode and a slot. Doctors and availability are simulated and nothing is actually booked.', who: 'Everyone · demo' },
  { icon: Settings, name: 'Settings', text: 'Units, high-contrast and large-text modes, plus saved dependants and emergency contacts.', who: 'Everyone' },
  { icon: Watch, name: 'Wearable context', text: 'An API accepts resting heart rate, HRV, sleep and SpO₂ readings and adds them to symptom analysis. There is no companion app yet.', who: 'API' },
  { icon: ShieldAlert, name: 'Overwatch', text: 'Platform totals, the user list with account removal, and the latest 100 analyses across all users.', who: 'Admins' },
];

const STACK = [
  { group: 'Interface', items: ['React 18', 'Vite', 'Tailwind CSS 4', 'GSAP', 'three.js (the living cell)', 'Radix UI'] },
  { group: 'API gateway', items: ['Node.js', 'Express', 'JSON Web Tokens', 'bcrypt', 'TOTP authenticator codes', 'Multer uploads'] },
  { group: 'AI engine', items: ['Python 3.12', 'FastAPI', 'Pydantic', 'pypdf', 'Provider fallback chain'] },
  { group: 'Data', items: ['MongoDB', 'Mongoose'] },
  { group: 'Quality', items: ['22 browser end-to-end tests (Playwright)', '8 API tests', 'Run against a fake AI gateway: they prove the plumbing, not medical accuracy'] },
];

const INDEX = [{ id: 'tools', label: 'Tools' }, { id: 'architecture', label: 'Architecture' }, { id: 'toolkit', label: 'Toolkit' }, { id: 'stack', label: 'Stack' }];

export default function PlatformPage({ navigate, onOpenAuth }: PageProps) {
  const [sel, setSel] = useState('gateway');
  const node = NODES.find((n) => n.id === sel)!;

  return (
    <>
      <PageHero
        eyebrow="Platform"
        title={<>Symptoms, scans and lab reports, <span className="grad">read in one place.</span></>}
        lede="CuraSense gives you three AI-assisted analysis tools behind one account, plus a history of everything you have run. This page shows what each tool takes in, what it returns, and what it runs on."
        actions={<>
          <button type="button" className="lp-btn lp-btn-primary pg-btn" onClick={() => onOpenAuth('register')}>Create an account <ArrowRight size={17} aria-hidden /></button>
          <button type="button" className="lp-btn lp-btn-ghost pg-btn" onClick={() => navigate('approach')}>See the approach</button>
        </>}
        aside={<LiveStatus />}
      />
      <PageIndex items={INDEX} />

      <Section id="tools" eyebrow="The tools" title="Three tools, one result format." lede="Every analysis ends the same way: a plain-language summary, an urgency level and the next steps worth considering.">
        <div className="pg-grid c3">
          {TOOLS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80} className="pg-card pg-tool">
              <span className="pg-ic"><t.icon size={22} aria-hidden /></span>
              <h3>{t.name}</h3>
              <p>{t.text}</p>
              <dl className="pg-kv">
                {t.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </Reveal>
          ))}
        </div>
        <Reveal className="pg-note">
          <b>Smart routing.</b> A lab report uploaded in the scan tool is sent to the lab tool, and a radiology image uploaded in the lab tool goes the other way, so a file never lands in the wrong place.
        </Reveal>
      </Section>

      <Section id="architecture" eyebrow="Architecture" title="How a request travels." lede="Select a stop to see what it does and what it never does.">
        <Reveal className="am" data-no-cs-transition>
          <div className="am-flow" role="group" aria-label="Request path">
            {NODES.map((n, i) => (
              <div key={n.id} className="am-cell" data-id={n.id}>
                <button type="button" className="am-node" aria-pressed={sel === n.id} onClick={() => setSel(n.id)} onMouseEnter={() => setSel(n.id)} onFocus={() => setSel(n.id)}>
                  <span className="am-ic"><n.icon size={20} aria-hidden /></span>
                  <b>{n.name}</b>
                  <small>{n.tag}</small>
                </button>
                {i < 3 && <span className="am-link" aria-hidden />}
                {n.id === 'gateway' && <span className="am-link am-down" aria-hidden />}
              </div>
            ))}
          </div>
          <div className="am-detail" aria-live="polite" key={node.id}>
            <p className="am-detail-tag"><node.icon size={16} aria-hidden />{node.name} <small>{node.tag}</small></p>
            <p className="am-detail-text">{node.text}</p>
            <ul>{node.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          </div>
        </Reveal>
      </Section>

      <Section id="toolkit" eyebrow="Around the analysis" title="Everything else you get." lede="The tools are the centre; these keep your results useful afterwards.">
        <div className="pg-grid c3">
          {TOOLKIT.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 70} className="pg-card pg-mini">
              <span className="pg-ic sm"><t.icon size={18} aria-hidden /></span>
              <h3>{t.name}</h3>
              <p>{t.text}</p>
              <span className="pg-tag">{t.who}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="stack" eyebrow="Under the hood" title="What it runs on." lede="The technologies behind the interface, the gateway and the AI engine. Model providers are configurable; the ones listed above are the defaults.">
        <div className="pg-stack">
          {STACK.map((g, i) => (
            <Reveal key={g.group} delay={i * 60} className="pg-card pg-stack-row">
              <h3>{g.group}</h3>
              <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Try the three tools."
        text="Accounts are free while CuraSense is a demo. Sign-up takes a minute and walks you through setting up an authenticator app."
        primary={{ label: 'Create an account', onClick: () => onOpenAuth('register') }}
        secondary={{ label: 'Read the approach', onClick: () => navigate('approach') }}
      />
    </>
  );
}
