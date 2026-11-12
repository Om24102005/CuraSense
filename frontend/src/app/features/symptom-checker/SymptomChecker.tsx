import { analyzeSymptoms } from '../../services/api';
import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, CircleAlert, CircleCheck, X, Plus } from 'lucide-react';
import type { Prediction } from '../../App';
import { useTheme } from '../../App';
import gsap from 'gsap';
import { LoadingScreen } from '../../components/shared/LoadingScreen';
import MedicalAIOutput from '../../components/shared/MedicalAIOutput';
import { WrongPageNotice } from '../../components/shared/WrongPageNotice';
import SuccessBurst from '../../components/shared/SuccessBurst';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const SYMPTOMS = [
  // General / Constitutional
  { id: 'fever', name: 'Fever', category: 'General' },
  { id: 'high-fever', name: 'High Fever (>103°F / 39.4°C)', category: 'General' },
  { id: 'low-grade-fever', name: 'Low-Grade Fever', category: 'General' },
  { id: 'chills', name: 'Chills / Rigors', category: 'General' },
  { id: 'fatigue', name: 'Fatigue', category: 'General' },
  { id: 'weakness', name: 'Generalized Weakness', category: 'General' },
  { id: 'sweating', name: 'Excessive Sweating', category: 'General' },
  { id: 'night-sweats', name: 'Night Sweats', category: 'General' },
  { id: 'weight-loss', name: 'Unexplained Weight Loss', category: 'General' },
  { id: 'weight-gain', name: 'Unexplained Weight Gain', category: 'General' },
  { id: 'loss-appetite', name: 'Loss of Appetite', category: 'General' },
  { id: 'malaise', name: 'Malaise / General Discomfort', category: 'General' },
  { id: 'fainting', name: 'Fainting / Syncope', category: 'General' },
  { id: 'dehydration', name: 'Dehydration', category: 'General' },
  { id: 'pallor', name: 'Pallor / Pale Appearance', category: 'General' },
  // Respiratory
  { id: 'cough', name: 'Cough', category: 'Respiratory' },
  { id: 'dry-cough', name: 'Dry Cough', category: 'Respiratory' },
  { id: 'productive-cough', name: 'Productive Cough (with mucus)', category: 'Respiratory' },
  { id: 'shortness-breath', name: 'Shortness of Breath', category: 'Respiratory' },
  { id: 'shortness-exertion', name: 'Shortness of Breath on Exertion', category: 'Respiratory' },
  { id: 'wheezing', name: 'Wheezing', category: 'Respiratory' },
  { id: 'chest-tightness', name: 'Chest Tightness', category: 'Respiratory' },
  { id: 'rapid-breathing', name: 'Rapid Breathing (Tachypnea)', category: 'Respiratory' },
  { id: 'congestion', name: 'Nasal Congestion', category: 'Respiratory' },
  { id: 'runny-nose', name: 'Runny Nose (Rhinorrhea)', category: 'Respiratory' },
  { id: 'loss-smell', name: 'Loss of Smell (Anosmia)', category: 'Respiratory' },
  { id: 'loss-taste', name: 'Loss of Taste (Ageusia)', category: 'Respiratory' },
  { id: 'sneezing', name: 'Sneezing', category: 'Respiratory' },
  { id: 'hoarseness', name: 'Hoarseness / Voice Changes', category: 'Respiratory' },
  { id: 'sore-throat', name: 'Sore Throat', category: 'Respiratory' },
  { id: 'stridor', name: 'Stridor (Noisy Breathing)', category: 'Respiratory' },
  { id: 'coughing-blood', name: 'Coughing Up Blood (Hemoptysis)', category: 'Respiratory' },
  { id: 'sleep-apnea', name: 'Sleep Apnea / Loud Snoring', category: 'Respiratory' },
  { id: 'post-nasal-drip', name: 'Post-Nasal Drip', category: 'Respiratory' },
  { id: 'pleuritic-pain', name: 'Pleuritic Chest Pain (worse on breathing)', category: 'Respiratory' },
  // Cardiovascular
  { id: 'chest-pain', name: 'Chest Pain', category: 'Cardiovascular' },
  { id: 'chest-pressure', name: 'Chest Pressure / Heaviness', category: 'Cardiovascular' },
  { id: 'palpitations', name: 'Heart Palpitations', category: 'Cardiovascular' },
  { id: 'rapid-heartbeat', name: 'Rapid Heartbeat (Tachycardia)', category: 'Cardiovascular' },
  { id: 'slow-heartbeat', name: 'Slow Heartbeat (Bradycardia)', category: 'Cardiovascular' },
  { id: 'irregular-heartbeat', name: 'Irregular Heartbeat (Arrhythmia)', category: 'Cardiovascular' },
  { id: 'ankle-swelling', name: 'Ankle / Foot Swelling', category: 'Cardiovascular' },
  { id: 'leg-swelling', name: 'Leg Swelling (Edema)', category: 'Cardiovascular' },
  { id: 'cyanosis', name: 'Cyanosis (Bluish Lips / Fingertips)', category: 'Cardiovascular' },
  { id: 'cold-extremities', name: 'Cold Hands or Feet', category: 'Cardiovascular' },
  { id: 'orthopnea', name: 'Difficulty Lying Flat (Orthopnea)', category: 'Cardiovascular' },
  { id: 'claudication', name: 'Leg Pain While Walking (Claudication)', category: 'Cardiovascular' },
  { id: 'jugular-distension', name: 'Neck Vein Distension (JVD)', category: 'Cardiovascular' },
  // Neurological
  { id: 'headache', name: 'Headache', category: 'Neurological' },
  { id: 'migraine', name: 'Migraine', category: 'Neurological' },
  { id: 'dizziness', name: 'Dizziness', category: 'Neurological' },
  { id: 'vertigo', name: 'Vertigo (Room Spinning)', category: 'Neurological' },
  { id: 'numbness', name: 'Numbness / Loss of Sensation', category: 'Neurological' },
  { id: 'tingling', name: 'Tingling / Pins and Needles', category: 'Neurological' },
  { id: 'limb-weakness', name: 'Arm or Leg Weakness', category: 'Neurological' },
  { id: 'tremor', name: 'Tremor / Shaking', category: 'Neurological' },
  { id: 'seizures', name: 'Seizures / Convulsions', category: 'Neurological' },
  { id: 'memory-loss', name: 'Memory Loss / Forgetfulness', category: 'Neurological' },
  { id: 'confusion', name: 'Confusion / Disorientation', category: 'Neurological' },
  { id: 'speech-difficulty', name: 'Difficulty Speaking / Slurred Speech', category: 'Neurological' },
  { id: 'loss-balance', name: 'Loss of Balance / Poor Coordination', category: 'Neurological' },
  { id: 'light-sensitivity', name: 'Light Sensitivity (Photophobia)', category: 'Neurological' },
  { id: 'neck-stiffness', name: 'Neck Stiffness', category: 'Neurological' },
  { id: 'facial-droop', name: 'Facial Drooping / Asymmetry', category: 'Neurological' },
  { id: 'blackout', name: 'Blackout / Loss of Consciousness', category: 'Neurological' },
  { id: 'burning-sensation', name: 'Burning Sensation (Neuropathy)', category: 'Neurological' },
  // Digestive
  { id: 'nausea', name: 'Nausea', category: 'Digestive' },
  { id: 'vomiting', name: 'Vomiting', category: 'Digestive' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Digestive' },
  { id: 'constipation', name: 'Constipation', category: 'Digestive' },
  { id: 'abdominal-pain', name: 'Abdominal Pain', category: 'Digestive' },
  { id: 'bloating', name: 'Bloating', category: 'Digestive' },
  { id: 'gas', name: 'Excessive Gas / Flatulence', category: 'Digestive' },
  { id: 'heartburn', name: 'Heartburn / Acid Reflux (GERD)', category: 'Digestive' },
  { id: 'difficulty-swallowing', name: 'Difficulty Swallowing (Dysphagia)', category: 'Digestive' },
  { id: 'blood-stool', name: 'Blood in Stool (Hematochezia)', category: 'Digestive' },
  { id: 'black-stool', name: 'Black / Tarry Stools (Melena)', category: 'Digestive' },
  { id: 'jaundice-skin', name: 'Jaundice (Yellow Skin / Eyes)', category: 'Digestive' },
  { id: 'rectal-pain', name: 'Rectal Pain', category: 'Digestive' },
  { id: 'abdominal-cramping', name: 'Abdominal Cramping', category: 'Digestive' },
  { id: 'indigestion', name: 'Indigestion / Dyspepsia', category: 'Digestive' },
  { id: 'bloody-vomit', name: 'Vomiting Blood (Hematemesis)', category: 'Digestive' },
  { id: 'mucus-stool', name: 'Mucus in Stool', category: 'Digestive' },
  { id: 'anal-itching', name: 'Anal Itching / Discomfort', category: 'Digestive' },
  { id: 'hiccups-persistent', name: 'Persistent Hiccups', category: 'Digestive' },
  // Musculoskeletal
  { id: 'muscle-pain', name: 'Muscle Pain (Myalgia)', category: 'Musculoskeletal' },
  { id: 'joint-pain', name: 'Joint Pain (Arthralgia)', category: 'Musculoskeletal' },
  { id: 'back-pain-lower', name: 'Lower Back Pain', category: 'Musculoskeletal' },
  { id: 'back-pain-upper', name: 'Upper Back Pain', category: 'Musculoskeletal' },
  { id: 'neck-pain', name: 'Neck Pain', category: 'Musculoskeletal' },
  { id: 'shoulder-pain', name: 'Shoulder Pain', category: 'Musculoskeletal' },
  { id: 'hip-pain', name: 'Hip Pain', category: 'Musculoskeletal' },
  { id: 'knee-pain', name: 'Knee Pain', category: 'Musculoskeletal' },
  { id: 'muscle-weakness', name: 'Muscle Weakness', category: 'Musculoskeletal' },
  { id: 'muscle-stiffness', name: 'Muscle / Joint Morning Stiffness', category: 'Musculoskeletal' },
  { id: 'swollen-joints', name: 'Swollen Joints', category: 'Musculoskeletal' },
  { id: 'bone-pain', name: 'Bone Pain', category: 'Musculoskeletal' },
  { id: 'muscle-cramps', name: 'Muscle Cramps', category: 'Musculoskeletal' },
  { id: 'foot-pain', name: 'Foot / Heel Pain (Plantar Fasciitis)', category: 'Musculoskeletal' },
  { id: 'wrist-pain', name: 'Wrist / Hand Pain', category: 'Musculoskeletal' },
  { id: 'elbow-pain', name: 'Elbow Pain (Tennis / Golfer\'s Elbow)', category: 'Musculoskeletal' },
  { id: 'limited-range', name: 'Limited Range of Motion', category: 'Musculoskeletal' },
  // Dermatological
  { id: 'rash', name: 'Skin Rash', category: 'Dermatological' },
  { id: 'itching', name: 'Itching / Pruritus', category: 'Dermatological' },
  { id: 'hives', name: 'Hives / Urticaria', category: 'Dermatological' },
  { id: 'dry-skin', name: 'Dry Skin (Xerosis)', category: 'Dermatological' },
  { id: 'skin-discoloration', name: 'Skin Discoloration / Hyperpigmentation', category: 'Dermatological' },
  { id: 'easy-bruising', name: 'Easy Bruising', category: 'Dermatological' },
  { id: 'skin-lesions', name: 'Skin Lesions / Sores', category: 'Dermatological' },
  { id: 'hair-loss', name: 'Hair Loss (Alopecia)', category: 'Dermatological' },
  { id: 'nail-changes', name: 'Nail Discoloration / Abnormal Changes', category: 'Dermatological' },
  { id: 'acne', name: 'Acne / Pimples', category: 'Dermatological' },
  { id: 'skin-peeling', name: 'Skin Peeling / Flaking', category: 'Dermatological' },
  { id: 'blisters', name: 'Blisters / Vesicles', category: 'Dermatological' },
  { id: 'wound-slow-heal', name: 'Slow-Healing Wounds', category: 'Dermatological' },
  { id: 'petechiae', name: 'Petechiae (Small Red Dots)', category: 'Dermatological' },
  { id: 'stretch-marks', name: 'New Stretch Marks (Striae)', category: 'Dermatological' },
  // Urological / Renal
  { id: 'painful-urination', name: 'Painful Urination (Dysuria)', category: 'Urological' },
  { id: 'frequent-urination', name: 'Frequent Urination (Polyuria)', category: 'Urological' },
  { id: 'urinary-urgency', name: 'Sudden Urge to Urinate', category: 'Urological' },
  { id: 'blood-urine', name: 'Blood in Urine (Hematuria)', category: 'Urological' },
  { id: 'reduced-urine', name: 'Reduced Urine Output (Oliguria)', category: 'Urological' },
  { id: 'urinary-incontinence', name: 'Urinary Incontinence / Leakage', category: 'Urological' },
  { id: 'flank-pain', name: 'Flank / Kidney Pain', category: 'Urological' },
  { id: 'cloudy-urine', name: 'Cloudy / Foul-Smelling Urine', category: 'Urological' },
  { id: 'dark-urine', name: 'Dark / Cola-Colored Urine', category: 'Urological' },
  { id: 'urinary-retention', name: 'Urinary Retention (Unable to Urinate)', category: 'Urological' },
  { id: 'nocturia', name: 'Waking at Night to Urinate (Nocturia)', category: 'Urological' },
  { id: 'penile-discharge', name: 'Penile / Urethral Discharge', category: 'Urological' },
  { id: 'scrotal-swelling', name: 'Scrotal Swelling', category: 'Urological' },
  // Reproductive / Gynecological
  { id: 'irregular-periods', name: 'Irregular Periods', category: 'Reproductive' },
  { id: 'heavy-bleeding', name: 'Heavy Menstrual Bleeding (Menorrhagia)', category: 'Reproductive' },
  { id: 'painful-periods', name: 'Painful Periods (Dysmenorrhea)', category: 'Reproductive' },
  { id: 'missed-period', name: 'Missed Period / Amenorrhea', category: 'Reproductive' },
  { id: 'vaginal-discharge', name: 'Abnormal Vaginal Discharge', category: 'Reproductive' },
  { id: 'pelvic-pain', name: 'Pelvic Pain', category: 'Reproductive' },
  { id: 'breast-pain', name: 'Breast Pain / Tenderness', category: 'Reproductive' },
  { id: 'breast-lump', name: 'Breast Lump / Mass', category: 'Reproductive' },
  { id: 'hot-flashes', name: 'Hot Flashes / Menopausal Symptoms', category: 'Reproductive' },
  { id: 'erectile-dysfunction', name: 'Erectile Dysfunction', category: 'Reproductive' },
  { id: 'testicular-pain', name: 'Testicular Pain / Swelling', category: 'Reproductive' },
  { id: 'groin-pain', name: 'Groin Pain', category: 'Reproductive' },
  { id: 'low-libido', name: 'Low Libido / Decreased Sex Drive', category: 'Reproductive' },
  { id: 'nipple-discharge', name: 'Nipple Discharge', category: 'Reproductive' },
  // Endocrine / Metabolic
  { id: 'excessive-thirst', name: 'Excessive Thirst (Polydipsia)', category: 'Endocrine' },
  { id: 'excessive-hunger', name: 'Excessive Hunger (Polyphagia)', category: 'Endocrine' },
  { id: 'cold-intolerance', name: 'Cold Intolerance', category: 'Endocrine' },
  { id: 'heat-intolerance', name: 'Heat Intolerance', category: 'Endocrine' },
  { id: 'hair-thinning', name: 'Hair Thinning / Brittle Hair', category: 'Endocrine' },
  { id: 'puffiness', name: 'Facial / Periorbital Puffiness', category: 'Endocrine' },
  { id: 'neck-swelling', name: 'Goiter / Neck Swelling', category: 'Endocrine' },
  { id: 'increased-sweating', name: 'Increased / Abnormal Sweating', category: 'Endocrine' },
  { id: 'buffalo-hump', name: 'Fat Deposit on Upper Back (Buffalo Hump)', category: 'Endocrine' },
  { id: 'moon-face', name: 'Round / Moon Face', category: 'Endocrine' },
  // Mental Health
  { id: 'anxiety', name: 'Anxiety / Nervousness', category: 'Mental Health' },
  { id: 'depression', name: 'Depression / Persistent Sadness', category: 'Mental Health' },
  { id: 'mood-swings', name: 'Mood Swings', category: 'Mental Health' },
  { id: 'insomnia', name: 'Insomnia / Difficulty Sleeping', category: 'Mental Health' },
  { id: 'excessive-sleeping', name: 'Excessive Sleeping (Hypersomnia)', category: 'Mental Health' },
  { id: 'panic-attacks', name: 'Panic Attacks', category: 'Mental Health' },
  { id: 'concentration', name: 'Poor Concentration / Brain Fog', category: 'Mental Health' },
  { id: 'irritability', name: 'Irritability / Anger', category: 'Mental Health' },
  { id: 'social-withdrawal', name: 'Social Withdrawal / Isolation', category: 'Mental Health' },
  { id: 'hallucinations', name: 'Hallucinations (Visual / Auditory)', category: 'Mental Health' },
  { id: 'suicidal-thoughts', name: 'Suicidal / Self-Harm Thoughts', category: 'Mental Health' },
  // Eye / Ophthalmological
  { id: 'eye-pain', name: 'Eye Pain', category: 'Eye' },
  { id: 'red-eyes', name: 'Red / Bloodshot Eyes', category: 'Eye' },
  { id: 'blurred-vision', name: 'Blurred Vision', category: 'Eye' },
  { id: 'double-vision', name: 'Double Vision (Diplopia)', category: 'Eye' },
  { id: 'vision-loss', name: 'Sudden Vision Loss', category: 'Eye' },
  { id: 'watery-eyes', name: 'Watery / Teary Eyes', category: 'Eye' },
  { id: 'dry-eyes', name: 'Dry Eyes', category: 'Eye' },
  { id: 'eye-discharge', name: 'Eye Discharge / Crusty Eyes', category: 'Eye' },
  { id: 'yellow-eyes', name: 'Yellow Eyes (Icterus / Jaundice)', category: 'Eye' },
  { id: 'floaters', name: 'Floaters / Flashes of Light', category: 'Eye' },
  { id: 'swollen-eyelids', name: 'Swollen Eyelids', category: 'Eye' },
  { id: 'night-blindness', name: 'Night Blindness', category: 'Eye' },
  // ENT
  { id: 'ear-pain', name: 'Ear Pain (Otalgia)', category: 'ENT' },
  { id: 'ear-discharge', name: 'Ear Discharge / Fluid', category: 'ENT' },
  { id: 'tinnitus', name: 'Tinnitus (Ringing / Buzzing in Ears)', category: 'ENT' },
  { id: 'hearing-loss', name: 'Hearing Loss', category: 'ENT' },
  { id: 'nosebleed', name: 'Nosebleed (Epistaxis)', category: 'ENT' },
  { id: 'swollen-lymph-nodes', name: 'Swollen Lymph Nodes', category: 'ENT' },
  { id: 'neck-mass', name: 'Neck Mass / Lump', category: 'ENT' },
  { id: 'bad-breath', name: 'Bad Breath (Halitosis)', category: 'ENT' },
  { id: 'mouth-sores', name: 'Mouth Sores / Oral Ulcers', category: 'ENT' },
  { id: 'jaw-pain', name: 'Jaw Pain / TMJ Disorder', category: 'ENT' },
  { id: 'throat-lump', name: 'Lump in Throat Sensation (Globus)', category: 'ENT' },
  { id: 'facial-pain', name: 'Facial Pain / Pressure', category: 'ENT' },
  { id: 'toothache', name: 'Toothache / Dental Pain', category: 'ENT' },
  // Vascular / Hematological
  { id: 'bleeding-easily', name: 'Bleeding Easily / Prolonged Bleeding', category: 'Vascular' },
  { id: 'varicose-veins', name: 'Varicose Veins', category: 'Vascular' },
  { id: 'leg-cramps', name: 'Leg Cramps at Night', category: 'Vascular' },
  { id: 'blood-clot-symptoms', name: 'Blood Clot Symptoms (DVT / Leg Redness)', category: 'Vascular' },
  { id: 'anemia-symptoms', name: 'Anemia Symptoms (Fatigue / Pallor / Breathlessness)', category: 'Vascular' },
  { id: 'swollen-spleen', name: 'Swollen Spleen (Left-Side Fullness)', category: 'Vascular' },
  { id: 'frequent-infections', name: 'Frequent / Recurrent Infections', category: 'Vascular' },
];

interface SymptomCheckerProps {
  onPrediction: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
  onSwitchTab?: (tab: string) => void;
}

export function SymptomChecker({ onPrediction, onSwitchTab }: SymptomCheckerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // AutoAnimate: zero-config FLIP animation for the chip list as symptoms are
  // added/removed — no manual enter/exit choreography needed for this one.
  const [chipListRef] = useAutoAnimate<HTMLDivElement>({ duration: 220 });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [burstActive, setBurstActive] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sc-card',
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'expo.out' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const T = isDark ? {
    cardBg: 'rgba(12,12,26,0.78)', cardBdr: 'rgba(255,255,255,0.10)', shadow: '0 8px 32px rgba(0,0,0,0.5)',
    head: '#ffffff', sub: 'rgba(255,255,255,0.50)', text: '#ffffff', muted: 'rgba(255,255,255,0.45)',
    inpBg: 'rgba(255,255,255,0.06)', rowHov: 'rgba(255,255,255,0.06)', selBg: 'rgba(139,92,246,0.18)', selBdr: 'rgba(139,92,246,0.45)',
    catHead: 'rgba(255,255,255,0.35)', tagBg: 'rgba(139,92,246,0.20)', tagBdr: 'rgba(139,92,246,0.40)', resBg: 'rgba(99,102,241,0.12)',
    resBdr: 'rgba(99,102,241,0.28)', recBg: 'rgba(255,255,255,0.04)', recBdr: 'rgba(255,255,255,0.08)', amberBg: 'rgba(245,158,11,0.12)',
    amberBdr: 'rgba(245,158,11,0.30)', amberTxt: '#fde68a', btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 20px rgba(99,102,241,0.45)',
  } : {
    cardBg: 'rgba(255,255,255,0.97)', cardBdr: 'rgba(0,0,0,0.08)', shadow: '0 4px 20px rgba(0,0,0,0.07)',
    head: '#0a0a1a', sub: 'rgba(10,10,26,0.50)', text: '#0a0a1a', muted: 'rgba(10,10,26,0.45)',
    inpBg: 'rgba(0,0,0,0.04)', rowHov: 'rgba(0,0,0,0.04)', selBg: 'rgba(109,40,217,0.07)', selBdr: 'rgba(109,40,217,0.25)',
    catHead: 'rgba(10,10,26,0.40)', tagBg: 'rgba(109,40,217,0.10)', tagBdr: 'rgba(109,40,217,0.25)', resBg: 'rgba(99,102,241,0.06)',
    resBdr: 'rgba(99,102,241,0.18)', recBg: 'rgba(0,0,0,0.025)', recBdr: 'rgba(0,0,0,0.07)', amberBg: 'rgba(245,158,11,0.07)',
    amberBdr: 'rgba(245,158,11,0.22)', amberTxt: '#92400e', btnBg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', btnSh: '0 4px 16px rgba(99,102,241,0.30)',
  };

  const glass = { background: T.cardBg, border: `1px solid ${T.cardBdr}`, boxShadow: T.shadow, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '20px' };
  const S = "var(--font-display)";
  const I = "var(--font-body)";

  const filteredSymptoms = SYMPTOMS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories = [...new Set(SYMPTOMS.map(s => s.category))];
  const toggleSymptom = (id: string) => setSelectedSymptoms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const addCustomSymptom = () => {
    const trimmed = customSymptomInput.trim();
    if (trimmed && !customSymptoms.includes(trimmed)) {
      setCustomSymptoms(prev => [...prev, trimmed]);
    }
    setCustomSymptomInput('');
  };

  const removeCustomSymptom = (idx: number) => setCustomSymptoms(prev => prev.filter((_, i) => i !== idx));

  const hasAnySymptom = selectedSymptoms.length > 0 || customSymptoms.length > 0;

  const handleAnalyze = async () => {
    if (!hasAnySymptom) return;
    setAnalyzing(true); setResult(null);

    try {
      const symptomString = [
        ...selectedSymptoms.map(id => SYMPTOMS.find(s => s.id === id)?.name).filter(Boolean),
        ...customSymptoms,
      ].join(", ");

      // Authenticated call to the Node gateway, which proxies to the AI service.
      const res = await analyzeSymptoms(symptomString);
      if (res.error || !res.data) throw new Error(res.error || "API Gateway Offline");
      const data = res.data;

      // Backend may return structured fields in data.analysis, or a JSON string
      // in data.result when data.analysis is absent — try both.
      let a = (data.analysis || {}) as any;
      if (!a.assessment && data.result) {
        try {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          if (parsed && typeof parsed === 'object') a = parsed;
        } catch { /* data.result is plain text — leave a as-is */ }
      }

      // Refused: the text is not a description of symptoms. `redirect` names the right page, if any.
      if (a.redirect) {
        setResult({ refusal: { message: a.error, redirect: a.redirect } });
        return;
      }

      const urgencyRaw = String(a.urgency || 'medium').trim().toLowerCase();
      const urgency = (['low', 'medium', 'high', 'emergency'] as const).includes(urgencyRaw as any)
        ? (urgencyRaw as 'low' | 'medium' | 'high' | 'emergency')
        : 'medium';

      const rawAssessment = String(a.assessment || '').trim();
      let assessmentText = rawAssessment;
      // If the model double-encoded the assessment as JSON, unwrap it
      if (rawAssessment.startsWith('{') || rawAssessment.startsWith('[')) {
        try {
          const inner = JSON.parse(rawAssessment);
          if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
            assessmentText = String(inner.assessment || inner.text || inner.content || inner.clinical_notes || rawAssessment).trim();
          }
        } catch { /* not JSON — use as-is */ }
      }

      // Fallback: use data.result (legacy field) if assessment is still empty
      const fallbackText = typeof data.result === 'string' ? data.result.trim() : '';
      const details = assessmentText || fallbackText || 'Analysis complete. See conditions and recommendations below.';

      const mappedResult = {
        diagnosis: 'SYMPTOM DIAGNOSED',
        confidence: typeof a.confidence === 'number' ? a.confidence : 80,
        details,
        urgency,
        conditions: Array.isArray(a.conditions) ? a.conditions : [],
        recommendations: Array.isArray(a.recommendations) && a.recommendations.length
          ? a.recommendations
          : ['Review AI notes carefully.', 'Monitor vitals.', 'Consult a physician if symptoms worsen.'],
      };

      setResult(mappedResult);
      onPrediction({ type: 'symptom', ...mappedResult });
      setBurstActive(true);
      setTimeout(() => setBurstActive(false), 1400);

    } catch (error) {
      console.error(error);
      setResult({
        diagnosis: 'Connection Error',
        confidence: 0,
        details: 'Could not connect to AI Core. Ensure Python backend is running on port 8000.',
        urgency: 'low',
        conditions: [],
        recommendations: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Urgency display (emoji + color + label per level) ── */
  const URGENCY = {
    low: { emoji: '🟢', label: 'ALL CLEAR', color: '#10b981', sub: 'Self-care is appropriate.' },
    medium: { emoji: '🟡', label: 'MONITOR', color: '#f59e0b', sub: 'See a doctor in the next day or two.' },
    high: { emoji: '🟠', label: 'CONCERNING', color: '#f97316', sub: 'Consult a physician today.' },
    emergency: { emoji: '🚨', label: 'EMERGENCY', color: '#ef4444', sub: 'Seek immediate medical attention.' },
  } as const;

  if (analyzing) return <LoadingScreen message="NEURAL NETWORK PROCESSING..." variant="symptoms" subject={{ words: [...selectedSymptoms.map((id) => SYMPTOMS.find((s) => s.id === id)?.name ?? ''), ...customSymptoms] }} />;

  return (
    <div ref={ref} style={{ fontFamily: I }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Symptom picker ── */}
        <div className="sc-card" style={{ ...glass, padding: '1.75rem' }}>
          <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>Select Your Symptoms</h3>
          <p style={{ color: T.sub, fontSize: '0.82rem', marginBottom: '1.25rem' }}>Choose all symptoms you are currently experiencing</p>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }} />
            <input placeholder="Search symptoms..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', background: T.inpBg, border: `1px solid ${T.cardBdr}`, borderRadius: '12px', color: T.text, fontSize: '0.875rem', outline: 'none' }} />
          </div>

          {(selectedSymptoms.length > 0 || customSymptoms.length > 0) && (
            <div ref={chipListRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
              {selectedSymptoms.map(id => {
                const s = SYMPTOMS.find(x => x.id === id);
                return s ? (
                  <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: T.tagBg, border: `1px solid ${T.tagBdr}`, color: isDark ? '#a78bfa' : '#6d28d9' }}>
                    {s.name}
                    <button onClick={() => toggleSymptom(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              {customSymptoms.map((sym: string, idx: number) => (
                <span key={`custom-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: isDark ? 'rgba(20,184,166,0.18)' : 'rgba(20,184,166,0.10)', border: `1px solid ${isDark ? 'rgba(20,184,166,0.45)' : 'rgba(20,184,166,0.35)'}`, color: isDark ? '#5eead4' : '#0f766e' }}>
                  ✦ {sym}
                  <button onClick={() => removeCustomSymptom(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button onClick={() => { setSelectedSymptoms([]); setCustomSymptoms([]); }} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: 'none', border: `1px solid ${T.cardBdr}`, color: T.muted, cursor: 'pointer' }}>Clear all</button>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: T.catHead, marginBottom: '0.75rem' }}>{selectedSymptoms.length + customSymptoms.length} symptom(s) selected</p>

          {/* data-lenis-prevent tells Lenis (smooth scroll) not to swallow
              wheel events inside this container, so the inner list scrolls
              instead of scrolling the whole page. */}
          <div data-lenis-prevent style={{ maxHeight: '380px', overflowY: 'auto', overscrollBehavior: 'contain', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map(cat => {
              const catSymptoms = filteredSymptoms.filter(s => s.category === cat);
              if (!catSymptoms.length) return null;
              return (
                <div key={cat}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.catHead, fontFamily: S, marginBottom: '0.5rem' }}>{cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {catSymptoms.map(s => {
                      const sel = selectedSymptoms.includes(s.id);
                      return (
                        <label key={s.id} className="transition-all duration-200 cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem', borderRadius: '10px', background: sel ? T.selBg : 'transparent', border: `1px solid ${sel ? T.selBdr : 'transparent'}` }} onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = T.rowHov; }} onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '5px', border: `2px solid ${sel ? '#8b5cf6' : T.catHead}`, background: sel ? '#8b5cf6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                            {sel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <input type="checkbox" checked={sel} onChange={() => toggleSymptom(s.id)} style={{ display: 'none' }} />
                          <span style={{ fontSize: '0.85rem', color: T.text }}>{s.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Custom symptom input ── */}
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '14px', background: isDark ? 'rgba(20,184,166,0.06)' : 'rgba(20,184,166,0.04)', border: `1px dashed ${isDark ? 'rgba(20,184,166,0.30)' : 'rgba(20,184,166,0.25)'}` }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: S, color: isDark ? '#5eead4' : '#0f766e', marginBottom: '0.5rem' }}>
              CAN'T FIND YOUR SYMPTOM? ADD CUSTOM
            </label>
            <p style={{ fontSize: '0.7rem', color: T.muted, marginBottom: '0.6rem' }}>Describe any symptom not listed above — e.g. "burning sensation in palms", "clicking jaw"</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={customSymptomInput}
                onChange={e => setCustomSymptomInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSymptom(); } }}
                placeholder="e.g. pressure behind eyes, metallic taste..."
                style={{ flex: 1, padding: '0.55rem 0.85rem', background: T.inpBg, border: `1px solid ${T.cardBdr}`, borderRadius: '10px', color: T.text, fontSize: '0.82rem', outline: 'none', fontFamily: I }}
              />
              <button
                onClick={addCustomSymptom}
                disabled={!customSymptomInput.trim()}
                style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', background: isDark ? 'rgba(20,184,166,0.20)' : 'rgba(20,184,166,0.12)', border: `1px solid ${isDark ? 'rgba(20,184,166,0.40)' : 'rgba(20,184,166,0.30)'}`, color: isDark ? '#5eead4' : '#0f766e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          <button onClick={handleAnalyze} disabled={!hasAnySymptom || analyzing} className="w-full mt-5 transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed" style={{ padding: '0.9rem', borderRadius: '14px', background: T.btnBg, boxShadow: hasAnySymptom ? T.btnSh : 'none', color: '#fff', fontSize: '0.88rem', fontWeight: 700, fontFamily: S, border: 'none', cursor: hasAnySymptom ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.05em' }}>
            {analyzing ? (<><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...</>) : 'Analyze Symptoms'}
          </button>
        </div>

        {/* ── Right: Results ── */}
        <div
          className="sc-card sc-results-scroll"
          data-lenis-prevent
          style={{ ...glass, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}
        >
          <style>{`
            .sc-results-scroll::-webkit-scrollbar { width: 5px; }
            .sc-results-scroll::-webkit-scrollbar-track { background: transparent; }
            .sc-results-scroll::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(139,92,246,0.35)' : 'rgba(109,40,217,0.25)'}; border-radius: 999px; }
            .sc-results-scroll::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(139,92,246,0.6)' : 'rgba(109,40,217,0.45)'}; }
          `}</style>
          <div style={{ flexShrink: 0 }}>
            <h3 style={{ fontFamily: S, fontSize: '1.1rem', fontWeight: 700, color: T.head, marginBottom: '4px' }}>AI Analysis Results</h3>
            <p style={{ color: T.sub, fontSize: '0.82rem' }}>AI-powered prediction based on your symptoms</p>
          </div>

          {!result && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: T.muted }}>
              <CircleAlert className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p style={{ fontSize: '0.9rem' }}>Select symptoms and click "Analyze" to get AI predictions</p>
            </div>
          )}

          {result?.refusal && (
            <WrongPageNotice message={result.refusal.message} redirect={result.refusal.redirect} onSwitchTab={onSwitchTab} isDark={isDark} T={T} S={S} />
          )}

          {result && !result.refusal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ position: 'relative', overflow: 'hidden', padding: '1.25rem', borderRadius: '14px', background: T.resBg, border: `1px solid ${T.resBdr}` }}>
                <SuccessBurst active={burstActive} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '1.1rem' }}>{result.diagnosis}</h4>
                  <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, fontFamily: S, background: result.confidence >= 80 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: result.confidence >= 80 ? '#10b981' : '#f59e0b', border: `1px solid ${result.confidence >= 80 ? 'rgba(16,185,129,0.30)' : 'rgba(245,158,11,0.30)'}`, whiteSpace: 'nowrap' }}>{result.confidence}% confidence</span>
                </div>
                <MedicalAIOutput text={result.details} isDark={isDark} textColor={T.text} mutedColor={T.muted} />
              </div>

              {/* ── URGENCY BADGE ──
                  Big, color-coded card with emoji indicator. The user
                  should be able to glance at this and know the severity
                  without reading prose. */}
              {result.urgency && URGENCY[result.urgency as keyof typeof URGENCY] && (() => {
                const u = URGENCY[result.urgency as keyof typeof URGENCY];
                return (
                  <div style={{
                    padding: '1rem 1.1rem',
                    borderRadius: '14px',
                    background: `${u.color}14`,
                    border: `1px solid ${u.color}55`,
                    boxShadow: `0 0 24px -8px ${u.color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}>
                    <span style={{
                      fontSize: '2rem',
                      lineHeight: 1,
                      filter: result.urgency === 'emergency' ? `drop-shadow(0 0 8px ${u.color})` : 'none',
                      animation: result.urgency === 'emergency' ? 'sc-pulse 1.2s ease-in-out infinite' : undefined,
                    }}>{u.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: T.muted, fontFamily: S }}>URGENCY LEVEL</span>
                        <span style={{
                          fontFamily: S,
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: u.color,
                          letterSpacing: '0.05em',
                        }}>{u.label}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: T.text }}>{u.sub}</span>
                    </div>
                  </div>
                );
              })()}
              {/* keyframes for the emergency pulse — injected once via a
                  style tag so we don't need a separate stylesheet entry */}
              <style>{`@keyframes sc-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>

              {/* ── POTENTIAL CONDITIONS WITH PROBABILITY BARS ──
                  One row per condition: name on the left, probability bar
                  filling left→right, percentage on the right. The bar's
                  fill color matches the urgency color so the panel reads
                  as a single coherent visual. */}
              {result.conditions && result.conditions.length > 0 && (
                <div>
                  <h5 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                    Potential Conditions
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.conditions.map((c: { name: string; probability: number }, i: number) => {
                      const pct = Math.max(0, Math.min(100, c.probability));
                      // Highest-probability condition gets the urgency color; the rest dim.
                      const isTop = i === 0;
                      const u = URGENCY[(result.urgency as keyof typeof URGENCY) || 'medium'];
                      const barColor = isTop ? u.color : (isDark ? '#8b5cf6' : '#6366f1');
                      return (
                        <div key={i} style={{ background: T.recBg, border: `1px solid ${T.recBdr}`, borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: T.text }}>{c.name}</span>
                            <span style={{
                              fontFamily: S,
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              color: barColor,
                              fontVariantNumeric: 'tabular-nums',
                            }}>{pct}%</span>
                          </div>
                          <div style={{ height: '6px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${pct}%`,
                              borderRadius: '999px',
                              background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
                              boxShadow: `0 0 10px ${barColor}88`,
                              transition: 'width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: T.muted }}>Overall Confidence</span>
                  <span style={{ fontWeight: 700, color: T.text }}>{result.confidence}%</span>
                </div>
                <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.confidence}%`, borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transition: 'width 1s ease' }} />
                </div>
              </div>

              <div>
                <h5 style={{ fontFamily: S, fontWeight: 700, color: T.head, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
                  <CircleCheck className="w-4 h-4" style={{ color: '#10b981' }} /> System Recommendations
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.recommendations.map((rec: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0.65rem 0.85rem', borderRadius: '10px', background: T.recBg, border: `1px solid ${T.recBdr}` }}>
                      <span style={{ fontFamily: S, fontWeight: 700, color: '#8b5cf6', fontSize: '0.75rem', marginTop: '1px', flexShrink: 0 }}>{i + 1}.</span>
                      <span style={{ fontSize: '0.82rem', color: T.text }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: T.amberBg, border: `1px solid ${T.amberBdr}` }}>
                <p style={{ fontSize: '0.75rem', color: T.amberTxt }}>⚠️ This is an AI-based prediction for informational purposes only. Always consult with a qualified healthcare professional.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}