import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getPredictions, savePrediction } from '@curasense/shared/api/predictions';
import { normalizePrediction, type Prediction } from '@curasense/shared/history';
import { useAuth } from '../auth/AuthContext';

interface Value {
  items: Prediction[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  /** Saves a finished analysis and puts it at the top of the list. */
  add: (record: object) => Promise<void>;
  toggleLike: (id: string) => void;
}

const PredictionsContext = createContext<Value | null>(null);
const newestFirst = (a: Prediction, b: Prediction) => b.timestamp.getTime() - a.timestamp.getTime();

/** The signed-in user's analyses, shared by the Home, Analyze and History tabs. Likes are kept on this phone only, as on the website. */
export function PredictionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const likesKey = `curasense_likes_${user?.id ?? 'me'}`;
  const [items, setItems] = useState<Prediction[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await getPredictions();
    if (res.error || !res.data) setError(res.error || 'Could not load your history.');
    else { setError(''); setItems((res.data.predictions ?? []).map(normalizePrediction).sort(newestFirst)); }
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    AsyncStorage.getItem(likesKey).then((raw) => setLikedIds(raw ? JSON.parse(raw) : [])).catch(() => setLikedIds([]));
  }, [likesKey]);

  const add = useCallback(async (record: object) => {
    const res = await savePrediction(record);
    if (res.data) setItems((prev) => [normalizePrediction({ ...record, ...(res.data as object) }), ...prev]);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(likesKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [likesKey]);

  const value = useMemo<Value>(() => ({
    items: items.map((p) => ({ ...p, liked: likedIds.includes(p.id) })),
    loading, error, refresh, add, toggleLike,
  }), [items, likedIds, loading, error, refresh, add, toggleLike]);

  return <PredictionsContext.Provider value={value}>{children}</PredictionsContext.Provider>;
}

export function usePredictions(): Value {
  const ctx = useContext(PredictionsContext);
  if (!ctx) throw new Error('usePredictions must be used inside <PredictionsProvider>');
  return ctx;
}
