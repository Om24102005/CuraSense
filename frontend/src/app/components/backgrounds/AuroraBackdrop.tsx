/* Aurora colour fields behind the app. Pure CSS, no JS. Temporary until the
   redesign's own backdrop replaces it. */
export default function AuroraBackdrop() {
  return (
    <div aria-hidden className="cs-aurora">
      <i className="cs-aurora-field cs-aurora-a" />
      <i className="cs-aurora-field cs-aurora-b" />
      <i className="cs-aurora-field cs-aurora-c" />
    </div>
  );
}
