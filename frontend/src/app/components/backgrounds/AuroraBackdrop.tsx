/* Backdrop: aurora colour fields, ECG-paper floor, biomarker meteors and a
   scan bar, plus film grain on top of the whole page. Pure CSS, no JS. */
export default function AuroraBackdrop() {
  return (
    <>
      <div aria-hidden className="cs-aurora">
        <i className="cs-aurora-field cs-aurora-a" />
        <i className="cs-aurora-field cs-aurora-b" />
        <i className="cs-aurora-field cs-aurora-c" />
        <i className="dm-floor" />
        <i className="dm-scan" />
        <i className="dm-meteor" /><i className="dm-meteor" /><i className="dm-meteor" /><i className="dm-meteor" />
      </div>
      <i aria-hidden className="dm-grain" />
    </>
  );
}
