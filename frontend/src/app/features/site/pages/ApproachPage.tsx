/* Approach: how an input becomes a result, and where its limits are. The five steps are the real request path;
   the worked examples are labelled illustrations, not patient data. */
import { useEffect, useState } from 'react';
import { ArrowRight, ClipboardCheck, Cpu, FileSearch, KeyRound, Layers, ScanSearch, ShieldCheck, TriangleAlert, UserCheck } from 'lucide-react';
import { backdropBus } from '../../../scenes/backdrops/bus';
import { CtaBand, PageHero, PageIndex, Reveal, Section, type PageProps } from '../ui';

const STEPS = [
  {
    icon: ClipboardCheck, name: 'Intake',
    what: 'You pick a tool and give it input: symptoms, an image or a report.',
    checked: 'Size limits apply: 2,000 characters of symptoms, 25 MB per image (6 per run), 15 MB per report.',
    see: 'A clear message if something is too large or the wrong kind.',
  },
  {
    icon: FileSearch, name: 'Verification',
    what: 'Uploads are read byte by byte at the gateway, not trusted by file name.',
    checked: 'A file that claims to be an image but is not one is refused (HTTP 415). Recognised signatures: JPEG, PNG, WEBP, GIF, BMP, TIFF, PDF, DICOM and plain text.',
    see: 'Nothing, when all is well. A refusal, when it is not.',
  },
  {
    icon: Cpu, name: 'Analysis',
    what: 'The gateway forwards the request to the AI engine, which builds a strict prompt and asks a language or vision model.',
    checked: 'If a provider fails the next one is tried. If every text provider is down, symptom triage falls back to simple keyword rules at a fixed low confidence.',
    see: 'A short wait while the model works.',
  },
  {
    icon: Layers, name: 'Structuring',
    what: 'The answer is parsed into fixed fields so every result has the same shape.',
    checked: 'Urgency is clamped to four levels. Lab flags are recomputed in code from the reference range on the report; CRITICAL is beyond 1.5 times the upper limit or under half the lower limit.',
    see: 'Conditions with likelihoods, biomarkers with flags, or findings with an urgency.',
  },
  {
    icon: UserCheck, name: 'Explanation and record',
    what: 'You get a plain-language summary and suggested next steps, and the text of the result is saved to your history.',
    checked: 'History is per user. The files you uploaded are not stored.',
    see: 'A result you can reopen later, and the decision, which stays with you.',
  },
];

const URGENCY = [
  { label: 'ALL CLEAR', hint: 'Nothing here needs action.', tone: 'ok' },
  { label: 'MONITOR', hint: 'Keep an eye on it.', tone: 'watch' },
  { label: 'CONCERNING', hint: 'Talk to a clinician soon.', tone: 'warn' },
  { label: 'EMERGENCY', hint: 'Seek urgent help now.', tone: 'bad' },
];

const BIO = [
  { n: 'Haemoglobin', v: '10.2', u: 'g/dL', lo: 13, hi: 17, val: 10.2, flag: 'LOW' },
  { n: 'White cell count', v: '14.8', u: '×10³/µL', lo: 4, hi: 11, val: 14.8, flag: 'HIGH' },
  { n: 'Glucose (fasting)', v: '92', u: 'mg/dL', lo: 70, hi: 99, val: 92, flag: 'NORMAL' },
  { n: 'Creatinine', v: '3.4', u: 'mg/dL', lo: 0.7, hi: 1.3, val: 3.4, flag: 'CRITICAL' },
];

const PRINCIPLES = [
  { icon: ShieldCheck, name: 'Verify before analysing', how: 'Uploads are checked byte by byte and size-capped at the gateway before any model sees them.' },
  { icon: KeyRound, name: 'Keys stay on the server', how: 'The browser never holds AI credentials, and the AI engine answers only the gateway.' },
  { icon: Layers, name: 'The same shape every time', how: 'Every result is parsed into fixed fields, with urgency limited to four levels.' },
  { icon: ScanSearch, name: 'Fallbacks are explicit', how: 'When every AI provider is down, triage uses plain keyword rules at a fixed low confidence instead of inventing a confident score.' },
  { icon: UserCheck, name: 'You stay in charge', how: 'A result is a suggestion with a stated urgency. It never books, orders or notifies anyone for you.' },
  { icon: ClipboardCheck, name: 'Your history is yours', how: 'Results are saved per user, and the files you upload are not kept.' },
];

const LIMITS = [
  'CuraSense is decision support, not a medical device and not a diagnosis. In an emergency, call your local emergency number.',
  'The confidence figure comes from the AI model itself. It has not been calibrated or independently validated.',
  'Image reads are written descriptions. There are no highlighted regions, measurements or comparisons with earlier scans.',
  'Your input is sent to third-party AI providers so they can analyse it. Do not submit anything you are not comfortable sharing with them.',
  'Consultation booking and wearable sync are demonstrations in this build: no appointment is made and there is no companion app.',
];

const INDEX = [{ id: 'pipeline', label: 'Pipeline' }, { id: 'example', label: 'Worked example' }, { id: 'principles', label: 'Principles' }, { id: 'limits', label: 'Limits' }];

export default function ApproachPage({ navigate, onOpenAuth }: PageProps) {
  const [step, setStep] = useState(0);
  const [ex, setEx] = useState<'symptoms' | 'scan' | 'lab'>('symptoms');
  const s = STEPS[step];

  // The light in the background follows the step being read.
  useEffect(() => { backdropBus.focus = 0.12 + (step / (STEPS.length - 1)) * 0.76; }, [step]);
  useEffect(() => () => { backdropBus.focus = 0.5; }, []);

  return (
    <>
      <PageHero
        eyebrow="Approach"
        title={<>From raw input to an answer <span className="grad">you can check.</span></>}
        lede="CuraSense is decision support. It reads what you give it, structures what it finds, and shows the result in plain language with an urgency level. The decision stays with you and your clinician."
        actions={<>
          <button type="button" className="lp-btn lp-btn-primary pg-btn" onClick={() => onOpenAuth('register')}>Create an account <ArrowRight size={17} aria-hidden /></button>
          <button type="button" className="lp-btn lp-btn-ghost pg-btn" onClick={() => navigate('platform')}>See the platform</button>
        </>}
        aside={
          <div className="pg-card pg-scale">
            <p className="pg-eyebrow"><i aria-hidden />How to read the urgency</p>
            <ol>
              {URGENCY.map((u) => (
                <li key={u.label} data-tone={u.tone}><i aria-hidden /><b>{u.label}</b><span>{u.hint}</span></li>
              ))}
            </ol>
            <small>The four levels used by the symptom tool. Scans use Normal, Monitor, Urgent and Critical.</small>
          </div>
        }
      />
      <PageIndex items={INDEX} />

      <Section id="pipeline" eyebrow="The pipeline" title="Five steps, every time." lede="This is the real path of a request. Select a step to see what happens, what is checked and what you see.">
        <Reveal className="ps" data-no-cs-transition>
          <div className="ps-list" role="tablist" aria-label="Pipeline steps" aria-orientation="vertical">
            {STEPS.map((st, i) => (
              <button
                key={st.name} type="button" role="tab" id={`ps-t-${i}`} aria-selected={step === i} aria-controls="ps-panel"
                tabIndex={step === i ? 0 : -1}
                className="ps-step" data-done={i < step}
                onClick={() => setStep(i)} onMouseEnter={() => setStep(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setStep((step + 1) % STEPS.length); (document.getElementById(`ps-t-${(step + 1) % STEPS.length}`))?.focus(); }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const p = (step + STEPS.length - 1) % STEPS.length; setStep(p); document.getElementById(`ps-t-${p}`)?.focus(); }
                }}
              >
                <span className="ps-n">{i + 1}</span>
                <span className="ps-name">{st.name}</span>
              </button>
            ))}
          </div>
          <div className="ps-panel" id="ps-panel" role="tabpanel" aria-labelledby={`ps-t-${step}`} key={step}>
            <span className="pg-ic"><s.icon size={22} aria-hidden /></span>
            <h3>{s.name}</h3>
            <dl>
              <div><dt>What happens</dt><dd>{s.what}</dd></div>
              <div><dt>What is checked</dt><dd>{s.checked}</dd></div>
              <div><dt>What you see</dt><dd>{s.see}</dd></div>
            </dl>
          </div>
        </Reveal>
      </Section>

      <Section id="example" eyebrow="Worked example" title="One idea, three tools." lede="An illustration of what a result looks like. The cases below are invented to show the format; they are not real patients.">
        <Reveal className="ex" data-no-cs-transition>
          <div className="ex-tabs" role="tablist" aria-label="Example tool">
            {([['symptoms', 'Symptoms'], ['scan', 'Scan'], ['lab', 'Lab report']] as const).map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={ex === id} className="ex-tab" onClick={() => setEx(id)}>{label}</button>
            ))}
          </div>
          <div className="ex-body" key={ex}>
            <span className="ex-flag">Illustrative example</span>
            {ex === 'symptoms' && (
              <>
                <p className="ex-in"><b>Input</b> Persistent cough · Fever · Shortness of breath</p>
                <div className="ex-card">
                  <p className="ex-urg" data-tone="warn"><i aria-hidden />CONCERNING</p>
                  <ul className="ex-bars">
                    {[['Community-acquired pneumonia', 46], ['Acute bronchitis', 31], ['Influenza', 17]].map(([n, v]) => (
                      <li key={n as string}><span>{n}</span><i style={{ ['--w' as string]: `${v}%` }} /><em>{v}%</em></li>
                    ))}
                  </ul>
                  <p className="ex-rec">See a clinician within a day. Seek urgent care if breathing becomes harder.</p>
                </div>
              </>
            )}
            {ex === 'scan' && (
              <>
                <p className="ex-in"><b>Input</b> Chest X-ray, front view · detected automatically as an X-ray</p>
                <div className="ex-card">
                  <p className="ex-urg" data-tone="warn"><i aria-hidden />URGENT</p>
                  <dl className="ex-find">
                    <div><dt>Primary finding</dt><dd>Patchy opacity in the right lower zone, in keeping with consolidation.</dd></div>
                    <div><dt>Secondary</dt><dd>No pleural effusion seen. Heart size within normal limits.</dd></div>
                  </dl>
                  <p className="ex-rec">Clinical correlation and follow-up imaging are advised.</p>
                </div>
              </>
            )}
            {ex === 'lab' && (
              <>
                <p className="ex-in"><b>Input</b> A pasted blood-test report, four of its lines shown</p>
                <div className="ex-card">
                  <p className="ex-urg" data-tone="bad"><i aria-hidden />CRITICAL VALUE FOUND</p>
                  <ul className="ex-bio">
                    {BIO.map((b) => {
                      const span = (b.hi - b.lo) * 3, start = b.lo - (b.hi - b.lo);
                      const pos = Math.max(2, Math.min(98, ((b.val - start) / span) * 100));
                      return (
                        <li key={b.n} data-flag={b.flag}>
                          <span className="ex-bio-n">{b.n}<small>{b.v} {b.u}</small></span>
                          <span className="ex-range" aria-hidden><i style={{ left: `${((b.lo - start) / span) * 100}%`, width: `${((b.hi - b.lo) / span) * 100}%` }} /><u style={{ left: `${pos}%` }} /></span>
                          <em>{b.flag}</em>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="ex-rec">Creatinine is more than 1.5 times the upper limit, so it is marked CRITICAL by the rule in step 4.</p>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </Section>

      <Section id="principles" eyebrow="Principles" title="How it is built, in practice." lede="Each principle names the mechanism behind it, so you can judge it rather than take it on trust.">
        <div className="pg-grid c3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 70} className="pg-card pg-mini">
              <span className="pg-ic sm"><p.icon size={18} aria-hidden /></span>
              <h3>{p.name}</h3>
              <p>{p.how}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="limits" eyebrow="Limits" title="What to keep in mind." lede="Trust is easier to keep than to win back, so here is what CuraSense does not do.">
        <Reveal className="pg-card lim">
          <ul>
            {LIMITS.map((l) => <li key={l}><TriangleAlert size={18} aria-hidden /><span>{l}</span></li>)}
          </ul>
        </Reveal>
      </Section>

      <CtaBand
        title="See a result for yourself."
        text="Run one of the three tools on your own input. Accounts are free while CuraSense is a demo."
        primary={{ label: 'Create an account', onClick: () => onOpenAuth('register') }}
        secondary={{ label: 'How access works', onClick: () => navigate('access') }}
      />
    </>
  );
}
