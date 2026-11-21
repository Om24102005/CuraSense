// The scan catalogue (studies, groups, which kind of image and which body regions each covers), the urgency levels, and the upload limits.
// Shared by the website and the phone app. The AI service refuses a file that does not fit the selected study.

export const SCAN_TYPES = [
  // X-Ray
  { id: 'xray-chest', name: 'Chest X-Ray', description: 'Lungs, heart, ribs, pleural effusion' },
  { id: 'xray-bone', name: 'Bone / Limb X-Ray', description: 'Fractures, arthritis, density' },
  { id: 'xray-spine', name: 'Spinal X-Ray', description: 'Cervical, thoracic, lumbar vertebrae' },
  { id: 'xray-dental', name: 'Dental / Panoramic X-Ray', description: 'Teeth, jaw, sinuses, TMJ' },
  { id: 'xray-abdominal', name: 'Abdominal X-Ray (KUB)', description: 'Bowel, kidney stones, obstruction' },
  { id: 'xray-pelvis', name: 'Pelvic X-Ray', description: 'Pelvis, hip joints, sacrum' },
  { id: 'xray-hand', name: 'Hand / Wrist X-Ray', description: 'Carpal bones, fractures, arthritis' },
  { id: 'xray-foot', name: 'Foot / Ankle X-Ray', description: 'Fractures, plantar spur, arthritis' },
  { id: 'xray-skull', name: 'Skull X-Ray', description: 'Skull, sinuses, facial bones' },
  { id: 'xray-shoulder', name: 'Shoulder X-Ray', description: 'AC joint, rotator cuff calcification' },
  // CT Scan
  { id: 'ct-head', name: 'CT Head / Brain', description: 'Stroke, bleeding, tumors, hydrocephalus' },
  { id: 'ct-chest', name: 'CT Chest', description: 'Lung nodules, pulmonary embolism, lymph nodes' },
  { id: 'ct-abdomen', name: 'CT Abdomen & Pelvis', description: 'Liver, kidneys, bowel, masses' },
  { id: 'ct-spine', name: 'CT Spine', description: 'Vertebrae, disc herniation, stenosis' },
  { id: 'ct-coronary', name: 'CT Coronary Angiography (CTCA)', description: 'Coronary artery stenosis, calcium score' },
  { id: 'ct-pulmonary', name: 'CT Pulmonary Angiography (CTPA)', description: 'Pulmonary embolism, pulmonary arteries' },
  { id: 'ct-sinus', name: 'CT Sinus / Facial', description: 'Sinusitis, polyps, facial fractures' },
  { id: 'ct-urogram', name: 'CT Urogram / KUB', description: 'Kidneys, ureters, bladder, stones' },
  { id: 'ct-colonoscopy', name: 'CT Colonoscopy (Virtual)', description: 'Colon polyps, colorectal cancer screening' },
  { id: 'ct-neck', name: 'CT Neck', description: 'Lymph nodes, thyroid, carotid arteries' },
  // MRI
  { id: 'mri-brain', name: 'MRI Brain', description: 'Tumors, MS plaques, stroke, seizures' },
  { id: 'mri-spine-c', name: 'MRI Cervical Spine', description: 'Disc herniation, myelopathy, cord compression' },
  { id: 'mri-spine-l', name: 'MRI Lumbar / Thoracic Spine', description: 'Disc disease, stenosis, sciatica' },
  { id: 'mri-knee', name: 'MRI Knee', description: 'Meniscus, ACL/PCL, cartilage, effusion' },
  { id: 'mri-shoulder', name: 'MRI Shoulder', description: 'Rotator cuff, labrum, impingement' },
  { id: 'mri-hip', name: 'MRI Hip', description: 'AVN, labral tear, bursitis, stress fracture' },
  { id: 'mri-abdomen', name: 'MRI Abdomen', description: 'Liver, pancreas, adrenal, bile ducts' },
  { id: 'mri-pelvis', name: 'MRI Pelvis', description: 'Prostate, uterus, ovaries, rectum' },
  { id: 'mri-cardiac', name: 'Cardiac MRI', description: 'Cardiomyopathy, viability, pericardium' },
  { id: 'mri-breast', name: 'MRI Breast', description: 'Breast cancer screening, implant integrity' },
  { id: 'mri-angio', name: 'MRA (MRI Angiography)', description: 'Blood vessels, aneurysms, stenosis' },
  { id: 'mri-wrist', name: 'MRI Wrist / Hand', description: 'Ligament tears, TFCC, avascular necrosis' },
  { id: 'mri-ankle', name: 'MRI Ankle / Foot', description: 'Ligaments, tendons, stress fractures' },
  // Ultrasound
  { id: 'us-abdominal', name: 'Abdominal Ultrasound', description: 'Liver, gallbladder, spleen, aorta' },
  { id: 'us-pelvic', name: 'Pelvic Ultrasound', description: 'Uterus, ovaries, bladder' },
  { id: 'us-tv', name: 'Transvaginal Ultrasound (TVUS)', description: 'Endometrium, ovaries, fibroids, IUD' },
  { id: 'us-obstetric', name: 'Obstetric Ultrasound', description: 'Fetal development, dating, anomaly scan' },
  { id: 'us-thyroid', name: 'Thyroid Ultrasound', description: 'Nodules, goiter, cysts' },
  { id: 'us-breast', name: 'Breast Ultrasound', description: 'Cysts, masses, lymph nodes, abscess' },
  { id: 'us-renal', name: 'Renal Ultrasound', description: 'Kidneys, hydronephrosis, stones, cysts' },
  { id: 'us-doppler', name: 'Doppler / Vascular Ultrasound', description: 'DVT, carotid stenosis, blood flow' },
  { id: 'echo', name: 'Echocardiogram', description: 'Heart valves, EF, wall motion, pericardium' },
  { id: 'us-scrotal', name: 'Scrotal Ultrasound', description: 'Testes, epididymis, varicocele, hydrocele' },
  { id: 'us-msk', name: 'Musculoskeletal Ultrasound', description: 'Tendons, bursae, joints, guided injections' },
  // Nuclear Medicine / PET
  { id: 'pet', name: 'PET Scan (FDG-PET)', description: 'Cancer staging, metabolic activity' },
  { id: 'pet-ct', name: 'PET-CT', description: 'Combined metabolic + anatomical imaging' },
  { id: 'bone-scan', name: 'Bone Scan (Scintigraphy)', description: 'Metastases, stress fractures, infection' },
  { id: 'thyroid-scan', name: 'Thyroid Scan / I-131 Uptake', description: 'Hyperthyroidism, nodule function' },
  { id: 'spect', name: 'SPECT Scan', description: 'Brain perfusion, cardiac stress, infection' },
  // Mammography
  { id: 'mammo', name: 'Mammography (2D)', description: 'Breast cancer screening, microcalcifications' },
  { id: 'mammo-3d', name: '3D Mammography (Tomosynthesis)', description: 'Enhanced sensitivity, dense breasts' },
  // Other
  { id: 'skin', name: 'Skin Lesion / Dermoscopy', description: 'Melanoma, nevi, dermatological images' },
  { id: 'dexa', name: 'DEXA Scan (Bone Density)', description: 'Osteoporosis, T-score, Z-score' },
  { id: 'fluoroscopy', name: 'Fluoroscopy / Barium Study', description: 'Barium swallow, enema, GI dynamics' },
  { id: 'retinal', name: 'Retinal / Ophthalmic Imaging', description: 'Fundus, OCT, diabetic retinopathy' },
  { id: 'endoscopy', name: 'Endoscopy / Colonoscopy Image', description: 'GI mucosa, polyps, Barrett\'s esophagus' },
  { id: 'angiogram', name: 'Conventional Angiogram', description: 'Catheter-based vascular imaging' },
  { id: 'ekg', name: 'ECG / EKG Strip', description: 'Arrhythmia, MI, QT interval analysis' },
  // Cancer & Oncology — PET / Nuclear Medicine
  { id: 'onco-pet-full', name: 'Whole-Body FDG PET-CT (Staging)', description: 'Full cancer staging, recurrence detection, treatment response' },
  { id: 'onco-psma-pet', name: 'PSMA PET-CT (Ga-68 / F-18)', description: 'Prostate cancer staging, recurrence, PSMA-targeted therapy selection' },
  { id: 'onco-dotatate', name: 'DOTATATE PET-CT (Ga-68)', description: 'Neuroendocrine tumors, carcinoid, paraganglioma, pheochromocytoma' },
  { id: 'onco-axumin', name: 'Axumin (Fluciclovine F-18) PET', description: 'Biochemical recurrence of prostate cancer post-treatment' },
  { id: 'onco-mibg', name: 'MIBG Scan (I-123 / I-131)', description: 'Neuroblastoma, pheochromocytoma, paraganglioma, carcinoid' },
  { id: 'onco-thyroid-rai', name: 'Radioiodine Whole-Body Scan (I-131)', description: 'Differentiated thyroid cancer, RAI uptake, residual / recurrent disease' },
  { id: 'onco-octreotide', name: 'Octreotide / Somatostatin Receptor Scan', description: 'Neuroendocrine tumors, gastrinoma, carcinoid — SPECT/CT' },
  { id: 'onco-sentinel', name: 'Sentinel Lymph Node Lymphoscintigraphy', description: 'Lymphatic mapping — breast, melanoma, vulvar, endometrial cancer' },
  { id: 'onco-bone-spect', name: 'Bone Scan + SPECT/CT (Oncology)', description: 'Skeletal metastases — breast, prostate, lung, thyroid cancer' },
  { id: 'onco-head-neck-pet', name: 'Head & Neck Cancer PET-CT', description: 'SCC staging, unknown primary, nodal mapping, post-treatment response' },
  { id: 'onco-lymphoma-pet', name: 'Lymphoma PET-CT (Deauville Scoring)', description: 'Hodgkin / NHL staging, interim & end-of-treatment Deauville response' },
  { id: 'onco-melanoma-pet', name: 'Melanoma Whole-Body PET-CT', description: 'Distant metastases, nodal staging, treatment response monitoring' },
  { id: 'onco-lung-pet', name: 'Lung Cancer PET-CT (Staging)', description: 'NSCLC / SCLC mediastinal staging, nodal involvement, M-stage' },
  { id: 'onco-gi-pet', name: 'GI / Colorectal Cancer PET-CT', description: 'Colorectal, esophageal, gastric cancer staging and recurrence' },
  // Cancer & Oncology — CT Protocols
  { id: 'onco-ldct', name: 'Low-Dose CT Lung Cancer Screening (LDCT)', description: 'Annual screening for high-risk smokers; Lung-RADS nodule classification' },
  { id: 'onco-staging-cap', name: 'CT Chest / Abdomen / Pelvis (CAP Staging)', description: 'Pan-cancer full-body staging across all three regions in one study' },
  { id: 'onco-pancreas-ct', name: 'Pancreatic Protocol CT (Triphasic)', description: 'Pancreatic adenocarcinoma, IPMN, resectability assessment' },
  { id: 'onco-hepatic-ct', name: 'Hepatic Protocol CT (LI-RADS / HCC)', description: 'Arterial enhancement, washout, LI-RADS scoring for hepatocellular carcinoma' },
  { id: 'onco-urography-ct', name: 'CT Urography (Urothelial Cancer)', description: 'Bladder, ureteral, renal pelvis transitional cell carcinoma' },
  { id: 'onco-entero-ct', name: 'CT Enterography (Small Bowel Tumors)', description: 'GIST, small bowel adenocarcinoma, lymphoma, carcinoid' },
  { id: 'onco-ovarian-ct', name: 'Ovarian Cancer CT (Peritoneal Staging)', description: 'Peritoneal spread, omental disease, surgical resectability' },
  { id: 'onco-neck-ct', name: 'CT Neck (Lymphoma / Thyroid Cancer)', description: 'Cervical lymphadenopathy, thyroid mass, nodal levels I-VI' },
  // Cancer & Oncology — MRI Protocols
  { id: 'onco-wb-mri', name: 'Whole-Body MRI (Cancer Screening)', description: 'Metastases survey, multiple myeloma, lymphoma, Li-Fraumeni syndrome' },
  { id: 'onco-dw-mri', name: 'Diffusion-Weighted MRI (DW-MRI / DWIBS)', description: 'Tumor cellularity, treatment response, occult nodal / bone metastases' },
  { id: 'onco-dcemri', name: 'Dynamic Contrast-Enhanced MRI (DCE-MRI)', description: 'Tumor vascularity, angiogenesis quantification, therapy monitoring' },
  { id: 'onco-prostate-mri', name: 'Prostate mp-MRI (PI-RADS v2.1)', description: 'PCa detection & grading, targeted biopsy guidance, staging' },
  { id: 'onco-rectal-mri', name: 'Rectal Cancer MRI (mrTME Staging)', description: 'T/N/V staging, CRM, EMVI, neoadjuvant response, surgical planning' },
  { id: 'onco-liver-mri', name: 'Liver MRI with Hepatobiliary Contrast', description: 'HCC (Eovist / Primovist), cholangiocarcinoma, colorectal liver mets' },
  { id: 'onco-pancreas-mri', name: 'Pancreatic Protocol MRI / MRCP', description: 'Pancreatic cancer, branch-duct IPMN, biliary / ductal anatomy' },
  { id: 'onco-cervical-mri', name: 'Cervical Cancer MRI (FIGO Staging)', description: 'Parametrial invasion, vaginal / bladder extension, nodal involvement' },
  { id: 'onco-endo-mri', name: 'Endometrial / Uterine Cancer MRI', description: 'Myometrial invasion depth, cervical extension, nodal staging' },
  { id: 'onco-bladder-mri', name: 'Bladder Cancer MRI (VI-RADS)', description: 'Muscle invasion depth, extravesical spread, lymph nodes' },
  { id: 'onco-myeloma-mri', name: 'Multiple Myeloma Whole-Body MRI', description: 'Bone marrow infiltration patterns, focal lesions, response assessment' },
  { id: 'onco-brain-spec', name: 'Brain Tumor MRI Protocol (+ Spectroscopy)', description: 'Glioma grading, meningioma, metastases — perfusion, DWI, MR spectroscopy' },
  { id: 'onco-spine-mri', name: 'Spine MRI (Metastatic Cord Compression)', description: 'Vertebral metastases, epidural disease, MSCC — urgent oncology protocol' },
  { id: 'onco-breast-mri', name: 'Breast MRI (Neoadjuvant Response)', description: 'Pre- / post-chemotherapy extent, residual tumor, pathologic complete response' },
  // Cancer & Oncology — Ultrasound / Endoscopy
  { id: 'onco-eus', name: 'Endoscopic Ultrasound (EUS)', description: 'GI wall layers, pancreatic / biliary tumors, mediastinal nodes, FNA guidance' },
  { id: 'onco-ceus', name: 'Contrast-Enhanced Ultrasound (CEUS)', description: 'Liver lesion characterization, HCC LI-RADS, renal mass, SonoVue protocol' },
  { id: 'onco-thyroid-us', name: 'Thyroid Ultrasound (TI-RADS / FNA)', description: 'Thyroid nodule characterization, malignancy risk, biopsy guidance' },
  { id: 'onco-lymph-us', name: 'Lymph Node Ultrasound + Elastography', description: 'Cervical / axillary / inguinal nodal assessment, cortical morphology' },
  { id: 'onco-capsule', name: 'Capsule Endoscopy (Small Bowel Tumors)', description: 'Small bowel tumors, GIST, occult bleeding, polyposis syndromes' },
  { id: 'onco-ercp', name: 'ERCP / MRCP (Biliary & Pancreatic Cancer)', description: 'Cholangiocarcinoma, pancreatic cancer, bile duct stricture characterization' },
  // Cancer & Oncology — Breast Imaging
  { id: 'onco-cem', name: 'Contrast-Enhanced Mammography (CEM)', description: 'Breast cancer in dense breasts, neoadjuvant chemotherapy response monitoring' },
  { id: 'onco-mbi', name: 'Molecular Breast Imaging (MBI / BSGI)', description: 'Supplemental screening in dense tissue, post-lumpectomy recurrence' },
  { id: 'onco-ductogram', name: 'Ductography / Galactography', description: 'Intraductal papilloma, DCIS, pathologic nipple discharge workup' },
];

export const SCAN_GROUPS = [
  { label: 'X-Ray', filter: (t: { id: string }) => t.id.startsWith('xray') },
  { label: 'CT Scan', filter: (t: { id: string }) => t.id.startsWith('ct-') },
  { label: 'MRI', filter: (t: { id: string }) => t.id.startsWith('mri-') },
  { label: 'Ultrasound', filter: (t: { id: string }) => t.id.startsWith('us-') || t.id === 'echo' },
  { label: 'Nuclear Medicine/PET', filter: (t: { id: string }) => ['pet', 'pet-ct', 'bone-scan', 'thyroid-scan', 'spect'].includes(t.id) },
  { label: 'Mammography', filter: (t: { id: string }) => t.id.startsWith('mammo') },
  { label: 'Cancer & Oncology', filter: (t: { id: string }) => t.id.startsWith('onco-') },
  { label: 'Other Imaging', filter: (t: { id: string }) => ['skin', 'dexa', 'fluoroscopy', 'retinal', 'endoscopy', 'angiogram', 'ekg'].includes(t.id) },
];

/* The kind of scan each study is. The AI service refuses files that are not this kind, so a
   CT study only analyses CT images. Prefix rules cover most ids; the rest are listed here. */
export const MODALITY_OF_ID: Record<string, string> = Object.fromEntries(Object.entries({
  nuclear: ['pet', 'pet-ct', 'bone-scan', 'thyroid-scan', 'spect', 'pet-full', 'psma-pet', 'dotatate', 'axumin', 'mibg', 'thyroid-rai', 'octreotide', 'sentinel', 'bone-spect', 'head-neck-pet', 'lymphoma-pet', 'melanoma-pet', 'lung-pet', 'gi-pet', 'mbi'],
  ct: ['ldct', 'staging-cap', 'pancreas-ct', 'hepatic-ct', 'urography-ct', 'entero-ct', 'ovarian-ct', 'neck-ct'],
  mri: ['wb-mri', 'dw-mri', 'dcemri', 'prostate-mri', 'rectal-mri', 'liver-mri', 'pancreas-mri', 'cervical-mri', 'endo-mri', 'bladder-mri', 'myeloma-mri', 'brain-spec', 'spine-mri', 'breast-mri'],
  ultrasound: ['echo', 'eus', 'ceus', 'thyroid-us', 'lymph-us'],
  mammogram: ['cem', 'ductogram'],
  skin_lesion: ['skin'], dexa: ['dexa'], retinal: ['retinal'], ecg: ['ekg'],
  endoscopy: ['endoscopy', 'capsule'], fluoroscopy: ['fluoroscopy', 'angiogram', 'ercp'],
}).flatMap(([modality, ids]) => ids.map(id => [id, modality])));

/* The body regions each study covers. The AI service reads which regions a file shows and refuses one that does not fit the
   selected study (a chest CT under "CT Head / Brain"); a whole-body image does not fit a one-region study either. 'whole_body'
   here means "any region" (survey studies). A study that is not listed takes any region: the kind of image already says what
   it is (skin, retina, ECG, endoscopy), and a region adds nothing. */
export const IDS_BY_REGION: Record<string, string[]> = {
  head: ['xray-dental', 'xray-skull', 'ct-head', 'ct-sinus', 'mri-brain', 'onco-brain-spec', 'onco-head-neck-pet'],
  neck: ['ct-neck', 'us-thyroid', 'thyroid-scan', 'fluoroscopy', 'onco-neck-ct', 'onco-thyroid-us', 'onco-head-neck-pet'],
  chest: ['xray-chest', 'ct-chest', 'ct-pulmonary', 'fluoroscopy', 'onco-ldct', 'onco-staging-cap'],
  heart: ['ct-coronary', 'mri-cardiac', 'echo'],
  breast: ['mri-breast', 'us-breast', 'mammo', 'mammo-3d', 'onco-breast-mri', 'onco-cem', 'onco-mbi', 'onco-ductogram'],
  abdomen: ['xray-abdominal', 'ct-abdomen', 'ct-urogram', 'ct-colonoscopy', 'mri-abdomen', 'us-abdominal', 'us-obstetric', 'us-renal', 'fluoroscopy',
    'onco-staging-cap', 'onco-pancreas-ct', 'onco-hepatic-ct', 'onco-urography-ct', 'onco-entero-ct', 'onco-ovarian-ct', 'onco-liver-mri', 'onco-pancreas-mri', 'onco-ceus', 'onco-ercp'],
  pelvis: ['xray-abdominal', 'xray-pelvis', 'ct-abdomen', 'ct-urogram', 'ct-colonoscopy', 'mri-hip', 'mri-pelvis', 'us-pelvic', 'us-tv', 'us-obstetric', 'us-scrotal', 'fluoroscopy',
    'onco-staging-cap', 'onco-urography-ct', 'onco-entero-ct', 'onco-ovarian-ct', 'onco-prostate-mri', 'onco-rectal-mri', 'onco-cervical-mri', 'onco-endo-mri', 'onco-bladder-mri'],
  spine: ['xray-spine', 'ct-spine', 'mri-spine-c', 'mri-spine-l', 'onco-spine-mri'],
  upper_limb: ['xray-bone', 'xray-hand', 'xray-shoulder', 'mri-shoulder', 'mri-wrist', 'us-msk'],
  lower_limb: ['xray-bone', 'xray-pelvis', 'xray-foot', 'mri-knee', 'mri-hip', 'mri-ankle', 'us-msk'],
  whole_body: ['mri-angio', 'us-doppler', 'pet', 'pet-ct', 'bone-scan', 'spect', 'dexa', 'onco-pet-full', 'onco-psma-pet', 'onco-dotatate', 'onco-axumin', 'onco-mibg',
    'onco-thyroid-rai', 'onco-octreotide', 'onco-sentinel', 'onco-bone-spect', 'onco-lymphoma-pet', 'onco-melanoma-pet', 'onco-lung-pet', 'onco-gi-pet',
    'onco-wb-mri', 'onco-dw-mri', 'onco-dcemri', 'onco-myeloma-mri', 'onco-lymph-us'],
};
export const REGIONS_OF_ID: Record<string, string[]> = {};
for (const [region, ids] of Object.entries(IDS_BY_REGION)) for (const id of ids) (REGIONS_OF_ID[id] ??= []).push(region);
export const regionsOf = (id: string) => (REGIONS_OF_ID[id] ?? []).join(',');

export const studyLabel = (id: string) => { const t = SCAN_TYPES.find(x => x.id === id); return t ? `${t.name} (${t.description})` : ''; };

export const modalityOf = (id: string) => {
  const bare = id.replace(/^onco-/, '');
  return MODALITY_OF_ID[bare] ?? (id.startsWith('xray') ? 'xray' : id.startsWith('ct-') ? 'ct' : id.startsWith('mri-') ? 'mri' : id.startsWith('us-') ? 'ultrasound' : id.startsWith('mammo') ? 'mammogram' : 'scan');
};

export const URGENCY_MAP: Record<string, { color: string; bg: string; label: string }> = {
  normal: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Normal' },
  low: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Low' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Medium' },
  moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Moderate' },
  high: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'High' },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.20)', label: 'Critical' },
  emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.25)', label: 'Emergency' },
  monitor: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Monitor' },
  urgent: { color: '#f97316', bg: 'rgba(249,115,22,0.18)', label: 'Urgent' },
};
export const URGENCY_ORDER = ['normal', 'low', 'monitor', 'medium', 'moderate', 'urgent', 'high', 'critical', 'emergency'];

// A multi-page file has one urgency line per page: show the worst one.
export const extractUrgency = (text: string) => {
  const levels = [...text.matchAll(/urgency\s*(?:level)?\s*(?:\*\*)?\s*[:：]\s*(?:\*\*)?\s*(normal|low|monitor|medium|moderate|urgent|high|critical|emergency)/gi)].map(m => m[1].toLowerCase());
  if (!levels.length) return null;
  return URGENCY_MAP[levels.reduce((worst, l) => (URGENCY_ORDER.indexOf(l) > URGENCY_ORDER.indexOf(worst) ? l : worst))];
};

export const MAX_FILES = 6;
export const MAX_FILE_MB = 25;
export const MAX_ZIP_MB = 60; // a ZIP of a whole study (DICOM series, images, PDFs); the server unpacks and reads it
