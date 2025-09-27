import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Models,
  OAuthProvider,
  Query,
} from "react-native-appwrite";

export const config = {
  platform: "com.bst.highestate",
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

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login() {
  try {
    // Ensure WebBrowser can complete the auth session on iOS
    WebBrowser.maybeCompleteAuthSession();

    const redirectUri = Linking.createURL("/");
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error("Failed to login");

    const browserResult = await WebBrowser.openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (
      browserResult.type !== "success" ||
      !("url" in browserResult) ||
      !browserResult.url
    ) {
      throw new Error("Failed to login");
    }

    // Parse the callback URL returned by the OAuth flow
    const callbackUrl = new URL(browserResult.url);

    const secret = callbackUrl.searchParams.get("secret")?.toString();
    const userId = callbackUrl.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Failed to login");

    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create a session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
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
  } catch (error) {
    console.error(error);
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
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents as unknown as (Models.Document & {
      image: string;
      name: string;
      address: string;
      price: number;
      rating: number;
      type: string;
    })[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties(params?: {
  filter: string;
  query: string;
  limit?: number;
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
  const { filter = "", query = "", limit } = params || {};
  console.log("Search params:", { filter, query, limit });

  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }

    if (query && query.trim() !== "") {
      console.log("Adding search query for:", query);
      // Try multiple search approaches for better results
      const searchQueries = [];

      // Direct search
      searchQueries.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

      // If query is a number, also search for "Property X" format
      if (!isNaN(Number(query))) {
        searchQueries.push(
          Query.or([
            Query.search("name", `Property ${query}`),
            Query.search("address", `City ${query}`),
          ])
        );
      }

      // If multiple search approaches, combine them with OR
      if (searchQueries.length > 1) {
        buildQuery.push(Query.or(searchQueries));
      } else {
        buildQuery.push(searchQueries[0]);
      }
    } else {
      console.log("No search query provided");
    }

    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    console.log("Build query:", buildQuery);

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    console.log("Search results:", result.documents.length);
    return result.documents as unknown as (Models.Document & {
      image: string;
      name: string;
      address: string;
      price: number;
      rating: number;
      type: string;
    })[];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
