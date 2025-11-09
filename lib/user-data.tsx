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

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read?: boolean;
  propertyId?: string;
  referenceId?: string;
};

type UserDataContextType = {
  wishlist: Set<PropertyId>;
  favorites: Set<PropertyId>;
  messages: Record<PropertyId, Message[]>;
  bookings: Booking[];
  reviews: Record<PropertyId, Review[]>;
  notifications: NotificationItem[];
  unreadNotifications: number;
  toggleWishlist: (id: PropertyId) => Promise<void>;
  toggleFavorite: (id: PropertyId) => Promise<void>;
  sendMessage: (
    propertyId: PropertyId,
    from: "guest" | "host",
    text: string
  ) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  addReview: (review: Omit<Review, "id" | "createdAt">) => Promise<void>;
  addNotification: (
    n: Omit<NotificationItem, "id" | "createdAt" | "read">
  ) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
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
  notifications: "userdata:notifications",
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
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [w, f, m, b, r, n] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.wishlist),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.messages),
          AsyncStorage.getItem(STORAGE_KEYS.bookings),
          AsyncStorage.getItem(STORAGE_KEYS.reviews),
          AsyncStorage.getItem(STORAGE_KEYS.notifications),
        ]);
        if (w) setWishlist(new Set(JSON.parse(w)));
        if (f) setFavorites(new Set(JSON.parse(f)));
        if (m) setMessages(JSON.parse(m));
        if (b) setBookings(JSON.parse(b));
        if (r) setReviews(JSON.parse(r));
        if (n) setNotifications(JSON.parse(n));
      } catch (error) {
        console.error("[UserDataProvider] Error loading data:", error);
      } finally {
        setIsInitialized(true);
      }
    })();
  }, []);

  const persist = useCallback(
    async (
      w: Set<PropertyId>,
      f: Set<PropertyId>,
      m: Record<PropertyId, Message[]>,
      b: Booking[],
      r: Record<PropertyId, Review[]>,
      n: NotificationItem[]
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
        AsyncStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(n)),
      ]);
    },
    []
  );

  const toggleWishlist = useCallback(
    async (id: PropertyId) => {
      setWishlist((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        persist(
          next,
          favorites,
          messages,
          bookings,
          reviews,
          notifications
        ).catch(() => {});
        return next;
      });
    },
    [favorites, messages, bookings, reviews, notifications, persist]
  );

  const toggleFavorite = useCallback(
    async (id: PropertyId) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        persist(
          wishlist,
          next,
          messages,
          bookings,
          reviews,
          notifications
        ).catch(() => {});
        return next;
      });
    },
    [wishlist, messages, bookings, reviews, notifications, persist]
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
        persist(
          wishlist,
          favorites,
          next,
          bookings,
          reviews,
          notifications
        ).catch(() => {});
        return next;
      });
    },
    [wishlist, favorites, bookings, reviews, notifications, persist]
  );

  const addBooking = useCallback(
    async (booking: Booking) => {
      setBookings((prev) => {
        const next = [booking, ...prev];
        persist(
          wishlist,
          favorites,
          messages,
          next,
          reviews,
          notifications
        ).catch(() => {});
        return next;
      });
    },
    [wishlist, favorites, messages, reviews, notifications, persist]
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
        persist(
          wishlist,
          favorites,
          messages,
          bookings,
          next,
          notifications
        ).catch(() => {});
        return next;
      });
    },
    [wishlist, favorites, messages, bookings, notifications, persist]
  );

  const addNotification = useCallback(
    async (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => {
      setNotifications((prev) => {
        const item: NotificationItem = {
          ...n,
          id: Math.random().toString(36).slice(2),
          createdAt: Date.now(),
          read: false,
        };
        const next = [item, ...prev];
        persist(wishlist, favorites, messages, bookings, reviews, next).catch(
          () => {}
        );
        return next;
      });
    },
    [wishlist, favorites, messages, bookings, reviews, persist]
  );

  const markAllNotificationsRead = useCallback(async () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      persist(wishlist, favorites, messages, bookings, reviews, next).catch(
        () => {}
      );
      return next;
    });
  }, [wishlist, favorites, messages, bookings, reviews, persist]);

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
      notifications,
      unreadNotifications: notifications.filter((n) => !n.read).length,
      toggleWishlist,
      toggleFavorite,
      sendMessage,
      addBooking,
      addReview,
      addNotification,
      markAllNotificationsRead,
      clearAll,
    }),
    [
      wishlist,
      favorites,
      messages,
      bookings,
      reviews,
      notifications,
      toggleWishlist,
      toggleFavorite,
      sendMessage,
      addBooking,
      addReview,
      addNotification,
      markAllNotificationsRead,
      clearAll,
    ]
  );

  // Always provide the context value, even during initialization
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
