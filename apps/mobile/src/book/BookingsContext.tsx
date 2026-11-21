import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { parseBookings, parseContact, type ContactInfo, type StoredBooking } from '@curasense/shared/booking';
import { useAuth } from '../auth/AuthContext';

interface Value {
  bookings: StoredBooking[];
  contact: ContactInfo;
  /** False until the saved bookings have been read. */
  loaded: boolean;
  add: (booking: StoredBooking) => void;
  cancel: (reference: string) => void;
  saveContact: (contact: ContactInfo) => void;
  /** Counts "start a new booking" requests, so the wizard can clear itself when another screen asks for a fresh one. */
  fresh: number;
  startNew: () => void;
}

const BookingsContext = createContext<Value | null>(null);

/**
 * The user's consultation bookings and contact details. There is no booking server, so they live on this phone, one set per
 * account (the website keeps one set per browser, so a second person on the same browser saw the first one's).
 */
export function BookingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const who = user?.id ?? 'me';
  const name = user?.name ?? '';
  const bookKey = `curasense_bookings_${who}`;
  const contactKey = `curasense_contact_${who}`;
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [contact, setContact] = useState<ContactInfo>(() => parseContact(null, name));
  const [loaded, setLoaded] = useState(false);
  const [fresh, setFresh] = useState(0);

  useEffect(() => {
    let live = true;
    setLoaded(false);
    Promise.all([AsyncStorage.getItem(bookKey), AsyncStorage.getItem(contactKey)])
      .then(([b, c]) => { if (live) { setBookings(parseBookings(b)); setContact(parseContact(c, name)); } })
      .catch(() => { if (live) { setBookings([]); setContact(parseContact(null, name)); } })
      .finally(() => { if (live) setLoaded(true); });
    return () => { live = false; };
  }, [bookKey, contactKey, name]);

  const add = useCallback((booking: StoredBooking) => {
    setBookings((prev) => {
      const next = [booking, ...prev];
      AsyncStorage.setItem(bookKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [bookKey]);

  const cancel = useCallback((reference: string) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.reference !== reference);
      AsyncStorage.setItem(bookKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [bookKey]);

  const saveContact = useCallback((next: ContactInfo) => {
    setContact(next);
    AsyncStorage.setItem(contactKey, JSON.stringify(next)).catch(() => {});
  }, [contactKey]);

  const startNew = useCallback(() => setFresh((n) => n + 1), []);
  const value = useMemo(() => ({ bookings, contact, loaded, add, cancel, saveContact, fresh, startNew }), [bookings, contact, loaded, add, cancel, saveContact, fresh, startNew]);
  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): Value {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used inside <BookingsProvider>');
  return ctx;
}
