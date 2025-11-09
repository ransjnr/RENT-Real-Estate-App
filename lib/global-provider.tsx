import React, { createContext, ReactNode, useContext, useEffect } from "react";

import { AppUser, getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: AppUser | null;
  loading: boolean;
  refetch: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite<AppUser | null, Record<string, never>>({
    fn: getCurrentUser,
    params: {} as Record<string, never>,
  });

  const isLoggedIn = !!user;

  // Log auth state changes for debugging
  useEffect(() => {
    console.log("[GlobalProvider] Auth state:", {
      isLoggedIn,
      loading,
      hasUser: !!user,
    });
  }, [isLoggedIn, loading, user]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
