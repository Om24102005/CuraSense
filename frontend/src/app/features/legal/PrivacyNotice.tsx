/* The privacy notice, shown on /privacy and inside the consent step. Every statement must stay true of the code.
   It deliberately names no AI vendor or model (the owner's decision), but it must keep saying that a third party processes the data. */
export const PRIVACY_UPDATED = '21 November 2026';

export function PrivacyNotice() {
  return (
    <div className="legal">
      <p className="legal-date">Last updated {PRIVACY_UPDATED}</p>

      <h2>Who runs CuraSense</h2>
      <p>CuraSense is run by Omendar Singh, as an individual.</p>

      <h2>What CuraSense stores</h2>
      <ul>
        <li><b>Your account:</b> your name, your email address, your password as a one-way hash, and your authenticator secret in encrypted form.</li>
        <li><b>Your health information:</b> the analyses saved to your history, and any family members, emergency contacts and wearable readings you add.</li>
        <li><b>Your settings:</b> your language, units, display and AI preferences.</li>
        <li><b>On this device:</b> your sign-in token, your settings and a copy of your history are kept in your browser or app storage.</li>
      </ul>

      <h2>Third-party AI processing</h2>
      <p>
        To produce a result, what you submit is sent to a third-party AI service provider. That includes the symptoms you enter, the
        scans and documents you upload, the report text you paste, and any wearable readings saved to your account.
        This information may be processed outside your country.
      </p>
      <p>Leave names, addresses and ID numbers out of what you submit wherever you can. An analysis runs only after you have agreed to this.</p>

      <h2>How long it is kept</h2>
      <p>
        Your information stays in CuraSense until you delete your account. Deleting it removes your account and saved analyses from the
        CuraSense database. Anything already sent for analysis is handled under the AI provider's own terms, and CuraSense cannot delete
        copies that provider may hold.
      </p>

      <h2>Your choices</h2>
      <p>You can change your name and password, and delete your account and saved analyses, at any time in Settings.</p>

      <h2>Not medical advice</h2>
      <p>
        CuraSense is a decision-support tool. It is not a medical device and does not replace a clinician.
        If someone may be in danger, call your local emergency number now.
      </p>

      <h2>Changes to this notice</h2>
      <p>If this notice changes in a way that affects how your health information is handled, you will be asked to agree again before your next analysis.</p>
    </div>
  );
}
