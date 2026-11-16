import { useState } from 'react';
import { Share } from 'react-native';
import { resultToText, type Shareable } from '@curasense/shared/share';
import { Banner } from './Banner';
import { Button } from './Button';

/** Opens the system share sheet with the analysis as plain text. The person chooses where it goes; the app sends nothing itself. */
export function ShareButton({ result }: { result: Shareable }) {
  const [error, setError] = useState('');
  const share = async () => {
    setError('');
    try { await Share.share({ title: 'CuraSense analysis', message: resultToText(result) }); }
    catch { setError('Could not open the share sheet.'); }
  };
  return (
    <>
      <Button title="Share" variant="secondary" testID="share-result" accessibilityHint="Opens the share sheet with this analysis as text" onPress={share} />
      {error ? <Banner tone="error" testID="share-error">{error}</Banner> : null}
    </>
  );
}
