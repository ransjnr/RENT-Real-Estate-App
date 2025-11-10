import { Card } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Tab = "Wishlist" | "Favorites";

export default function WishlistScreen() {
  const { wishlist, favorites } = useUserData();
  const [tab, setTab] = useState<Tab>("Wishlist");

  const ids = useMemo(
    () => Array.from(tab === "Wishlist" ? wishlist : favorites),
    [tab, wishlist, favorites]
  );

  const { data, loading, refetch } = useAppwrite<any[], { ids: string[] }>({
    fn: getPropertiesByIds,
    params: { ids },
    skip: ids.length === 0,
  });

  useEffect(() => {
    if (ids.length > 0) {
      refetch({ ids });
    }
  }, [ids.join(","), refetch]);

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 py-4">
        <Text className="text-xl font-rubik-bold text-black-300">Saved</Text>
        <View className="flex-row mt-3 gap-3">
          {["Wishlist", "Favorites"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t as Tab)}
              className={`px-3 py-2 rounded-full ${
                tab === t
                  ? "bg-primary-300"
                  : "bg-primary-100 border border-primary-200"
              }`}
            >
              <Text
                className={`text-sm ${
                  tab === t
                    ? "text-white font-rubik-bold"
                    : "text-black-300 font-rubik"
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary-300" />
        </View>
      ) : !data || data.length === 0 ? (
        <NoResults />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.$id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 32 }}
          columnWrapperStyle={{ gap: 5, paddingHorizontal: 5, flex: 1 }}
          renderItem={({ item }) => (
            <Card
              item={item}
              onPress={() => router.push(`/properties/${item.$id}`)}
            />
          )}
        />
      )}
    </View>
  );
}
