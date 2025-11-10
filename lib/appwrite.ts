import { dummyProperties } from "@/constants/dummy-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Models,
} from "react-native-appwrite";

export const config = {
  platform: "com.bst.rent",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
};

export const client = new Client();

// Validate and set client configuration defensively to avoid runtime "startsWith" on undefined
(() => {
  const endpoint =
    typeof config.endpoint === "string" ? config.endpoint : undefined;
  const projectId =
    typeof config.projectId === "string" ? config.projectId : undefined;
  const platform = config.platform;

  if (!endpoint || endpoint.trim() === "") {
    console.warn(
      "[Appwrite] EXPO_PUBLIC_APPWRITE_ENDPOINT is missing. Skipping client.setEndpoint()."
    );
  } else {
    client.setEndpoint(endpoint);
  }

  if (!projectId || projectId.trim() === "") {
    console.warn(
      "[Appwrite] EXPO_PUBLIC_APPWRITE_PROJECT_ID is missing. Skipping client.setProject()."
    );
  } else {
    client.setProject(projectId);
  }

  if (typeof platform === "string" && platform.trim() !== "") {
    client.setPlatform(platform);
  }
})();

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login(email: string, password: string) {
  // Always use dummy mode - Appwrite authentication disabled for now
  // This ensures the app works without Appwrite configuration
  console.log("[Appwrite] Using dummy auth mode");
  await AsyncStorage.setItem("dummy_auth_logged_in", "true");
  await AsyncStorage.setItem("dummy_auth_email", email);
  await AsyncStorage.setItem("dummy_auth_name", email.split("@")[0]);
  return true;

  /* Appwrite authentication - disabled for now
  // Check if we have a valid client configuration
  if (!config.endpoint || !config.projectId || config.endpoint.trim() === "" || config.projectId.trim() === "") {
    console.log("[Appwrite] No Appwrite configuration, using dummy auth");
    await AsyncStorage.setItem("dummy_auth_logged_in", "true");
    await AsyncStorage.setItem("dummy_auth_email", email);
    await AsyncStorage.setItem("dummy_auth_name", email.split("@")[0]);
    return true;
  }

  // Try to use Appwrite, but fall back to dummy mode if it fails
  try {
    const session = await account.createEmailPasswordSession(email, password);
    if (!session) throw new Error("Failed to create a session");
    console.log("[Appwrite] Login successful");
    return true;
  } catch (appwriteError: any) {
    // If Appwrite fails for any reason, fall back to dummy mode silently
    console.log(
      "[Appwrite] Appwrite login failed, falling back to dummy auth:",
      appwriteError.message || "Unknown error"
    );
    await AsyncStorage.setItem("dummy_auth_logged_in", "true");
    await AsyncStorage.setItem("dummy_auth_email", email);
    await AsyncStorage.setItem("dummy_auth_name", email.split("@")[0]);
    return true;
  }
  */
}

export async function signup(email: string, password: string, name: string) {
  // Always use dummy mode - Appwrite authentication disabled for now
  // This ensures the app works without Appwrite configuration
  console.log("[Appwrite] Using dummy signup mode");
  await AsyncStorage.setItem("dummy_auth_logged_in", "true");
  await AsyncStorage.setItem("dummy_auth_email", email);
  await AsyncStorage.setItem("dummy_auth_name", name);
  return true;

  /* Appwrite authentication - disabled for now
  // Check if we have a valid client configuration
  if (!config.endpoint || !config.projectId || config.endpoint.trim() === "" || config.projectId.trim() === "") {
    console.log("[Appwrite] No Appwrite configuration, using dummy signup");
    await AsyncStorage.setItem("dummy_auth_logged_in", "true");
    await AsyncStorage.setItem("dummy_auth_email", email);
    await AsyncStorage.setItem("dummy_auth_name", name);
    return true;
  }

  // Try to use Appwrite, but fall back to dummy mode if it fails
  try {
    const user = await account.create(ID.unique(), email, password, name);
    if (!user) throw new Error("Failed to create account");
    console.log("[Appwrite] Signup successful");
    return true;
  } catch (appwriteError: any) {
    // If Appwrite fails for any reason, fall back to dummy mode silently
    console.log(
      "[Appwrite] Appwrite signup failed, falling back to dummy signup:",
      appwriteError.message || "Unknown error"
    );
    await AsyncStorage.setItem("dummy_auth_logged_in", "true");
    await AsyncStorage.setItem("dummy_auth_email", email);
    await AsyncStorage.setItem("dummy_auth_name", name);
    return true;
  }
  */
}

export async function sendPasswordResetEmail(email: string) {
  try {
    // Check if we have a valid client configuration
    if (!config.endpoint || !config.projectId) {
      console.log("[Appwrite] No Appwrite configuration, using dummy reset");
      // For dummy mode, always return true
      return true;
    }

    await account.createRecovery(
      email,
      `${Linking.createURL("/auth/reset-password")}`
    );

    console.log("[Appwrite] Password reset email sent");
    return true;
  } catch (error: any) {
    console.error("[Appwrite] Password reset error:", error);
    throw new Error(error.message || "Could not send reset email");
  }
}

export async function resetPassword(
  userId: string,
  secret: string,
  newPassword: string
) {
  try {
    // Check if we have a valid client configuration
    if (!config.endpoint || !config.projectId) {
      console.log("[Appwrite] No Appwrite configuration, using dummy reset");
      return true;
    }

    await account.updateRecovery(userId, secret, newPassword);

    console.log("[Appwrite] Password reset successful");
    return true;
  } catch (error: any) {
    console.error("[Appwrite] Password reset error:", error);
    throw new Error(error.message || "Could not reset password");
  }
}

export async function verifyEmail(userId: string, secret: string) {
  try {
    // Check if we have a valid client configuration
    if (!config.endpoint || !config.projectId) {
      console.log(
        "[Appwrite] No Appwrite configuration, using dummy verification"
      );
      return true;
    }

    await account.updateVerification(userId, secret);

    console.log("[Appwrite] Email verification successful");
    return true;
  } catch (error: any) {
    console.error("[Appwrite] Email verification error:", error);
    throw new Error(error.message || "Could not verify email");
  }
}

export async function logout() {
  // Always clear dummy auth state first
  try {
    await AsyncStorage.removeItem("dummy_auth_logged_in");
    await AsyncStorage.removeItem("dummy_auth_email");
    await AsyncStorage.removeItem("dummy_auth_name");
    console.log("[Appwrite] Dummy auth state cleared");
  } catch (storageError) {
    console.error("[Appwrite] Error clearing dummy auth state:", storageError);
  }

  // Try to clear Appwrite session if configured
  try {
    // Check if we have a valid client configuration
    if (
      !config.endpoint ||
      !config.projectId ||
      config.endpoint.trim() === "" ||
      config.projectId.trim() === ""
    ) {
      console.log(
        "[Appwrite] No Appwrite configuration, using dummy logout only"
      );
      return true; // Already cleared dummy state above
    }

    try {
      await account.deleteSession("current");
      console.log("[Appwrite] Appwrite session deleted");
      return true;
    } catch (sessionError) {
      // If session deletion fails (e.g., no session exists), still allow logout
      console.log(
        "[Appwrite] Session deletion failed (may not be logged in), but dummy state cleared"
      );
      return true; // Already cleared dummy state above
    }
  } catch (error) {
    console.error("[Appwrite] Logout error:", error);
    // Even if there's an error, dummy state is already cleared
    return true;
  }
}

export async function updateUserName(name: string) {
  try {
    if (!name || name.trim().length < 2) throw new Error("Invalid name");
    await account.updateName(name.trim());
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export type AppUser = {
  $id: string;
  name: string;
  email: string;
  avatar: string;
};

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    // Check if we have a valid client configuration
    if (
      !config.endpoint ||
      !config.projectId ||
      config.endpoint.trim() === "" ||
      config.projectId.trim() === ""
    ) {
      console.log(
        "[getCurrentUser] No Appwrite configuration, checking dummy auth"
      );
      // For dummy mode, check if user is logged in
      const isLoggedIn = await AsyncStorage.getItem("dummy_auth_logged_in");
      if (isLoggedIn === "true") {
        const email = await AsyncStorage.getItem("dummy_auth_email");
        const name = await AsyncStorage.getItem("dummy_auth_name");
        return {
          $id: "dummy-user-1",
          name: name || "Demo User",
          email: email || "demo@rent.com",
          avatar: avatar.getInitials(name || "Demo User").toString(),
        };
      }
      return null;
    }

    // Try to use Appwrite, but fall back to dummy mode if it fails
    try {
      const response = await account.get();
      if (response && response.$id) {
        const userAvatar = avatar.getInitials(response.name);
        return {
          $id: response.$id,
          name: response.name,
          email: response.email,
          avatar: userAvatar.toString(),
        };
      }
      return null;
    } catch (appwriteError: any) {
      // If Appwrite fails, fall back to dummy mode
      console.log(
        "[getCurrentUser] Appwrite failed, falling back to dummy auth:",
        appwriteError.message || "Unknown error"
      );
      const isLoggedIn = await AsyncStorage.getItem("dummy_auth_logged_in");
      if (isLoggedIn === "true") {
        const email = await AsyncStorage.getItem("dummy_auth_email");
        const name = await AsyncStorage.getItem("dummy_auth_name");
        return {
          $id: "dummy-user-1",
          name: name || "Demo User",
          email: email || "demo@rent.com",
          avatar: avatar.getInitials(name || "Demo User").toString(),
        };
      }
      return null;
    }
  } catch (error: any) {
    console.error("[getCurrentUser] Error:", error);
    // Even if there's an unexpected error, try dummy mode as fallback
    try {
      const isLoggedIn = await AsyncStorage.getItem("dummy_auth_logged_in");
      if (isLoggedIn === "true") {
        const email = await AsyncStorage.getItem("dummy_auth_email");
        const name = await AsyncStorage.getItem("dummy_auth_name");
        return {
          $id: "dummy-user-1",
          name: name || "Demo User",
          email: email || "demo@rent.com",
          avatar: avatar.getInitials(name || "Demo User").toString(),
        };
      }
    } catch {
      // Ignore AsyncStorage errors
    }
    return null;
  }
}

export async function getLatestProperties(): Promise<
  (Models.Document & {
    image: string;
    name: string;
    address: string;
    price: number;
    rating: number;
    type: string;
  })[]
> {
  // Return dummy data - latest 5 properties
  return new Promise((resolve) => {
    setTimeout(() => {
      const latest = [...dummyProperties]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      resolve(latest as any);
    }, 300); // Simulate network delay
  });
}

export async function getProperties(params?: {
  filter: string;
  query: string;
  limit?: number;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
}): Promise<
  (Models.Document & {
    image: string;
    name: string;
    address: string;
    price: number;
    rating: number;
    type: string;
  })[]
> {
  const {
    filter = "",
    query = "",
    limit = 100,
    priceMin,
    priceMax,
    minRating,
  } = params || {};

  // Use dummy data instead of Appwrite
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...dummyProperties];

      // Filter by type
      if (filter && filter !== "All") {
        filtered = filtered.filter((p) => p.type === filter);
      }

      // Search query
      if (query && query.trim() !== "") {
        const searchLower = query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.address.toLowerCase().includes(searchLower) ||
            p.type.toLowerCase().includes(searchLower)
        );
      }

      // Price range
      if (typeof priceMin === "number") {
        filtered = filtered.filter((p) => p.price >= priceMin);
      }
      if (typeof priceMax === "number") {
        filtered = filtered.filter((p) => p.price <= priceMax);
      }

      // Minimum rating
      if (typeof minRating === "number") {
        filtered = filtered.filter((p) => p.rating >= minRating);
      }

      // Apply limit
      if (limit) {
        filtered = filtered.slice(0, limit);
      }

      resolve(filtered as any);
    }, 300); // Simulate network delay
  });
}

export async function getPropertiesByIds(
  params?: string[] | { ids?: string[] }
): Promise<
  (Models.Document & {
    image: string;
    name: string;
    address: string;
    price: number;
    rating: number;
    type: string;
  })[]
> {
  // Handle both direct array call and object params from useAppwrite
  let ids: string[] | undefined;

  if (Array.isArray(params)) {
    // Direct array call (backward compatibility)
    ids = params;
  } else if (params && typeof params === "object" && "ids" in params) {
    // Object params from useAppwrite
    ids = params.ids;
  } else {
    ids = undefined;
  }

  // Handle undefined, null, or empty arrays
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  // Use dummy data instead of Appwrite
  return new Promise((resolve) => {
    setTimeout(() => {
      const validIds = ids!.filter((id) => id && typeof id === "string");
      const found = dummyProperties.filter((p) => validIds.includes(p.$id));
      resolve(found as any);
    }, 200); // Simulate network delay
  });
}
