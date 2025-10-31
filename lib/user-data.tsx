import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type PropertyId = string;

type Message = {
  id: string;
  propertyId: string;
  from: "guest" | "host";
  text: string;
  createdAt: number;
  read?: boolean;
};

type Booking = {
  id: string;
  propertyId: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  total: number;
  createdAt: number;
};

type Review = {
  id: string;
  propertyId: string;
  author: string;
  rating: number; // 1-5
  text: string;
  createdAt: number;
};

type UserDataContextType = {
  wishlist: Set<PropertyId>;
  favorites: Set<PropertyId>;
  messages: Record<PropertyId, Message[]>;
  bookings: Booking[];
  reviews: Record<PropertyId, Review[]>;
  toggleWishlist: (id: PropertyId) => Promise<void>;
  toggleFavorite: (id: PropertyId) => Promise<void>;
  sendMessage: (
    propertyId: PropertyId,
    from: "guest" | "host",
    text: string
  ) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  addReview: (review: Omit<Review, "id" | "createdAt">) => Promise<void>;
  clearAll: () => Promise<void>;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

const STORAGE_KEYS = {
  wishlist: "userdata:wishlist",
  favorites: "userdata:favorites",
  messages: "userdata:messages",
  bookings: "userdata:bookings",
  reviews: "userdata:reviews",
};

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<Set<PropertyId>>(new Set());
  const [favorites, setFavorites] = useState<Set<PropertyId>>(new Set());
  const [messages, setMessages] = useState<Record<PropertyId, Message[]>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Record<PropertyId, Review[]>>({});

  useEffect(() => {
    (async () => {
      try {
        const [w, f, m, b, r] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.wishlist),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.messages),
          AsyncStorage.getItem(STORAGE_KEYS.bookings),
          AsyncStorage.getItem(STORAGE_KEYS.reviews),
        ]);
        if (w) setWishlist(new Set(JSON.parse(w)));
        if (f) setFavorites(new Set(JSON.parse(f)));
        if (m) setMessages(JSON.parse(m));
        if (b) setBookings(JSON.parse(b));
        if (r) setReviews(JSON.parse(r));
      } catch {}
    })();
  }, []);

  const persist = useCallback(
    async (
      w: Set<PropertyId>,
      f: Set<PropertyId>,
      m: Record<PropertyId, Message[]>,
      b: Booking[],
      r: Record<PropertyId, Review[]>
    ) => {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.wishlist,
          JSON.stringify(Array.from(w))
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.favorites,
          JSON.stringify(Array.from(f))
        ),
        AsyncStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(m)),
        AsyncStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(b)),
        AsyncStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(r)),
      ]);
    },
    []
  );

  const toggleWishlist = useCallback(
    async (id: PropertyId) => {
      setWishlist((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        persist(next, favorites, messages, bookings, reviews).catch(() => {});
        return next;
      });
    },
    [favorites, messages, bookings, reviews, persist]
  );

  const toggleFavorite = useCallback(
    async (id: PropertyId) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        persist(wishlist, next, messages, bookings, reviews).catch(() => {});
        return next;
      });
    },
    [wishlist, messages, bookings, reviews, persist]
  );

  const sendMessage = useCallback(
    async (propertyId: PropertyId, from: "guest" | "host", text: string) => {
      setMessages((prev) => {
        const list = prev[propertyId] ? [...prev[propertyId]] : [];
        list.push({
          id: Math.random().toString(36).slice(2),
          propertyId,
          from,
          text,
          createdAt: Date.now(),
        });
        const next = { ...prev, [propertyId]: list };
        persist(wishlist, favorites, next, bookings, reviews).catch(() => {});
        return next;
      });
    },
    [wishlist, favorites, bookings, reviews, persist]
  );

  const addBooking = useCallback(
    async (booking: Booking) => {
      setBookings((prev) => {
        const next = [booking, ...prev];
        persist(wishlist, favorites, messages, next, reviews).catch(() => {});
        return next;
      });
    },
    [wishlist, favorites, messages, reviews, persist]
  );

  const addReview = useCallback(
    async (review: Omit<Review, "id" | "createdAt">) => {
      setReviews((prev) => {
        const list = prev[review.propertyId]
          ? [...prev[review.propertyId]]
          : [];
        list.unshift({
          ...review,
          id: Math.random().toString(36).slice(2),
          createdAt: Date.now(),
        });
        const next = { ...prev, [review.propertyId]: list };
        persist(wishlist, favorites, messages, bookings, next).catch(() => {});
        return next;
      });
    },
    [wishlist, favorites, messages, bookings, persist]
  );

  const clearAll = useCallback(async () => {
    setWishlist(new Set());
    setFavorites(new Set());
    setMessages({});
    setBookings([]);
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.wishlist),
      AsyncStorage.removeItem(STORAGE_KEYS.favorites),
      AsyncStorage.removeItem(STORAGE_KEYS.messages),
      AsyncStorage.removeItem(STORAGE_KEYS.bookings),
      AsyncStorage.removeItem(STORAGE_KEYS.reviews),
    ]);
  }, []);

  const value = useMemo<UserDataContextType>(
    () => ({
      wishlist,
      favorites,
      messages,
      bookings,
      reviews,
      toggleWishlist,
      toggleFavorite,
      sendMessage,
      addBooking,
      addReview,
      clearAll,
    }),
    [
      wishlist,
      favorites,
      messages,
      bookings,
      reviews,
      toggleWishlist,
      toggleFavorite,
      sendMessage,
      addBooking,
      addReview,
      clearAll,
    ]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
};
