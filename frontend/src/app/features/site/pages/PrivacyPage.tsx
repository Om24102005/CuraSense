/* The public privacy notice at /privacy. */
import { PrivacyNotice } from '../../legal/PrivacyNotice';
import { PageHero, Reveal } from '../ui';

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy notice" lede="What CuraSense stores, who processes it, and how you can remove it." />
      <section className="pg-section">
        <Reveal className="legal-plate" data-lg="plate"><PrivacyNotice /></Reveal>
      </section>
    </>
  );
}
