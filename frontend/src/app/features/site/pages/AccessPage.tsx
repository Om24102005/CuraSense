/* Access: how an account works, what protects it, and what the live system is doing. Honest about the demo status. */
import { ArrowRight, Check, ChevronDown, Fingerprint, Gauge, KeyRound, LockKeyhole, QrCode, RefreshCw, ShieldAlert, UploadCloud, UserCog, Users } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { CtaBand, LiveStatus, PageHero, PageIndex, Reveal, Section, type PageProps } from '../ui';

const JOURNEY = [
  { icon: Users, name: 'Create your account', text: 'Choose a name, an email and a password. Nothing else is asked, and no payment details are ever requested.' },
  { icon: QrCode, name: 'Scan the QR code', text: 'Open Google Authenticator or any authenticator app, scan the code (or type the key by hand) and the account is added.' },
  { icon: Fingerprint, name: 'Enter the 6-digit code', text: 'Codes refresh every 30 seconds. The server accepts the current code with 30 seconds of clock drift either way.' },
  { icon: Check, name: 'You are in', text: 'Your dashboard opens. From then on, signing in takes your password and a fresh code.' },
];

const ACCOUNTS = [
  { icon: Users, name: 'Standard account', text: 'Everything a person needs to use CuraSense.', items: ['The three analysis tools', 'Dashboard and per-user history', 'Settings, saved dependants and emergency contacts', 'The consultation booking demo'] },
  { icon: UserCog, name: 'Administrator', text: 'Assigned by the platform owner in the database, never by sign-up.', items: ['Everything in a standard account', 'Overwatch: platform totals and the latest 100 analyses', 'The user list, with account removal'] },
];

const PROTECTIONS = [
  { icon: LockKeyhole, name: 'Hashed passwords', text: 'Passwords are stored as bcrypt hashes, never in clear text.' },
  { icon: Fingerprint, name: 'Authenticator-app second factor', text: 'Time-based one-time codes: 6 digits, 30 seconds, set up during sign-up.' },
  { icon: Gauge, name: 'Short-lived sessions', text: 'A session lasts 24 hours. The half-finished two-factor step uses a separate 15-minute token that cannot open protected pages.' },
  { icon: RefreshCw, name: 'Rate-limited AI', text: 'Each user can make 20 AI requests per 10 minutes, per tool.' },
  { icon: UploadCloud, name: 'Checked uploads', text: 'Files are verified byte by byte and size-capped. CuraSense does not store them; only the text of the result is saved.' },
  { icon: KeyRound, name: 'Keys off the browser', text: 'AI credentials live in the server environment. The browser, and anyone reading its traffic, never sees them.' },
];

const FAQ = [
  ['Does it cost anything?', 'No. Accounts are free while CuraSense is a demo, and no payment details are requested at any point.'],
  ['Is a result a diagnosis?', 'No. CuraSense is decision support. It is not a medical device, and it does not replace a clinician. In an emergency, call your local emergency number.'],
  ['Where does my data go?', 'Your account, settings and the text of each analysis are stored in the CuraSense database. The text, images and reports you submit are also sent to third-party AI providers so they can analyse them. Uploaded files are not stored by CuraSense.'],
  ['Which AI models read my input?', 'Hosted language and vision models from Hugging Face, Mistral, DeepSeek and Groq, tried in order. The Platform page lists the defaults.'],
  ['How does password recovery work?', 'Enter your email and you receive a 6-digit, single-use code that is valid for 30 minutes, then choose a new password. In this demo the code is shown on screen rather than emailed.'],
  ['I lost my authenticator. What now?', 'Self-service recovery of the authenticator is not part of this demo build. The platform owner can help.'],
  ['Can I delete my account?', 'Not yourself, in this demo. An administrator can remove an account, and its saved analyses go with it.'],
];

const INDEX = [{ id: 'journey', label: 'Sign-up' }, { id: 'accounts', label: 'Accounts' }, { id: 'protections', label: 'Protections' }, { id: 'status', label: 'Status' }, { id: 'faq', label: 'Questions' }];

export default function AccessPage({ navigate, onOpenAuth }: PageProps) {
  return (
    <>
      <PageHero
        eyebrow="Access"
        title={<>Join in a minute. <span className="grad">Lock it down</span> in one more.</>}
        lede="CuraSense is a demo, so accounts are free. Sign-up walks you through setting up an authenticator app, so a password alone is never enough to get in."
        actions={<>
          <button type="button" className="lp-btn lp-btn-primary pg-btn" onClick={() => onOpenAuth('register')}>Create an account <ArrowRight size={17} aria-hidden /></button>
          <button type="button" className="lp-btn lp-btn-ghost pg-btn" onClick={() => onOpenAuth('login')}>Sign in</button>
        </>}
        aside={<LiveStatus title="System status" />}
      />
      <PageIndex items={INDEX} />

      <Section id="journey" eyebrow="Sign-up" title="Four steps to your dashboard." lede="This is exactly what the sign-up form does.">
        <ol className="aj">
          {JOURNEY.map((j, i) => (
            <Reveal key={j.name} as="li" delay={i * 90} className="aj-step">
              <span className="aj-n">{i + 1}</span>
              <span className="pg-ic"><j.icon size={22} aria-hidden /></span>
              <h3>{j.name}</h3>
              <p>{j.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section id="accounts" eyebrow="Accounts" title="Two kinds of account." lede="Roles are simple on purpose.">
        <div className="pg-grid c2">
          {ACCOUNTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 90} className="pg-card pg-role">
              <span className="pg-ic"><a.icon size={22} aria-hidden /></span>
              <h3>{a.name}</h3>
              <p>{a.text}</p>
              <ul className="pg-ticks">{a.items.map((it) => <li key={it}><Check size={16} aria-hidden />{it}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="protections" eyebrow="Protections" title="What protects your account." lede="Every item below is something the code does today.">
        <div className="pg-grid c3">
          {PROTECTIONS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 70} className="pg-card pg-mini">
              <span className="pg-ic sm"><p.icon size={18} aria-hidden /></span>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="pg-note warn">
          <ShieldAlert size={18} aria-hidden />
          <span><b>Demo notice.</b> CuraSense is a demonstration build and has not been through a security or compliance audit. Please do not enter real patient data.</span>
        </Reveal>
      </Section>

      <Section id="status" eyebrow="Status" title="Is it up right now?" lede="This is the same live check as the ACTIVE pill in the navigation bar, refreshed every 15 seconds.">
        <Reveal className="pg-status"><LiveStatus title="Live system check" /></Reveal>
      </Section>

      <Section id="faq" eyebrow="Questions" title="Straight answers.">
        <Reveal data-no-cs-transition>
          <Accordion.Root type="single" collapsible className="fq" defaultValue="q0">
            {FAQ.map(([q, a], i) => (
              <Accordion.Item key={q} value={`q${i}`} className="fq-item">
                <Accordion.Header>
                  <Accordion.Trigger className="fq-trigger">{q}<ChevronDown size={18} aria-hidden /></Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="fq-content"><p>{a}</p></Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </Section>

      <CtaBand
        title="Ready when you are."
        text="Create your account, set up your authenticator, and run your first analysis."
        primary={{ label: 'Create an account', onClick: () => onOpenAuth('register') }}
        secondary={{ label: 'See the platform', onClick: () => navigate('platform') }}
      />
    </>
  );
}
