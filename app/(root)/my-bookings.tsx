import { FeaturedCard } from "@/components/Cards";
import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "Bookings" | "Favorites" | "Wishlist";

export default function MyBookingsScreen() {
  const { bookings, favorites, wishlist } = useUserData();
  const [tab, setTab] = React.useState<TabKey>("Bookings");

  const favoriteIds = React.useMemo(() => Array.from(favorites), [favorites]);
  const wishlistIds = React.useMemo(() => Array.from(wishlist), [wishlist]);
  const bookingPropertyIds = React.useMemo(
    () => Array.from(new Set(bookings.map((b) => b.propertyId))),
    [bookings]
  );
  const allIds = React.useMemo(
    () =>
      Array.from(
        new Set([...favoriteIds, ...wishlistIds, ...bookingPropertyIds])
      ),
    [favoriteIds, wishlistIds, bookingPropertyIds]
  );

  const { data: propsData } = useAppwrite<any[], string[]>({
    fn: getPropertiesByIds,
    params: allIds.length ? (allIds as any) : (undefined as any),
  });
  const propertyById = React.useMemo(() => {
    const map: Record<string, any> = {};
    (propsData || []).forEach((p: any) => (map[p.$id] = p));
    return map;
  }, [propsData]);

  const tabs: TabKey[] = ["Bookings", "Favorites", "Wishlist"];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-primary-100">
        <Text className="text-xl font-rubik-bold text-black-300">
          My Bookings
        </Text>
      </View>

      <View className="flex-row mx-6 mt-4 bg-primary-100 rounded-full p-1">
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`flex-1 py-2 rounded-full items-center ${
              tab === t ? "bg-white" : "bg-transparent"
            }`}
          >
            <Text
              className={`font-rubik-medium ${
                tab === t ? "text-black-300" : "text-black-200"
              }`}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "Bookings" ? (
        <View className="mt-4">
          {bookings.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-black-200">No bookings yet.</Text>
            </View>
          ) : (
            <FlatList
              data={bookings}
              keyExtractor={(b) => b.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, padding: 12 }}
              renderItem={({ item: b }) => {
                const p = propertyById[b.propertyId];
                return (
                  <TouchableOpacity
                    onPress={() => router.push(`/properties/${b.propertyId}`)}
                    className="w-56 bg-primary-100 rounded-lg p-3"
                  >
                    {p?.image ? (
                      <Image
                        source={{ uri: p.image }}
                        className="w-full h-28 rounded-md"
                      />
                    ) : null}
                    <Text
                      className="text-black-300 font-rubik-medium mt-2"
                      numberOfLines={1}
                    >
                      {p?.name || b.propertyId}
                    </Text>
                    <Text className="text-black-200 text-xs" numberOfLines={2}>
                      {b.checkIn} → {b.checkOut}
                    </Text>
                    <Text className="text-black-300 font-rubik-bold mt-1">
                      Total: {b.total}
                    </Text>
                    <View className="flex-row gap-2 mt-2">
                      <TouchableOpacity
                        onPress={() => router.push(`/messages/${b.propertyId}`)}
                        className="bg-white px-3 py-2 rounded-md"
                      >
                        <Text className="text-black-300 text-xs font-rubik-medium">
                          Message
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          router.push(`/properties/${b.propertyId}/book`)
                        }
                        className="bg-primary-300 px-3 py-2 rounded-md"
                      >
                        <Text className="text-white text-xs font-rubik-bold">
                          Rebook
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      ) : null}

      {tab === "Favorites" ? (
        <ScrollView className="mt-2" contentContainerStyle={{ padding: 12 }}>
          {favoriteIds.length === 0 ? (
            <Text className="text-black-200">No favorites yet.</Text>
          ) : (
            <FlatList
              data={favoriteIds}
              keyExtractor={(id) => id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item: pid }) => {
                const p = propertyById[pid];
                if (!p) return null;
                return (
                  <FeaturedCard
                    item={p}
                    onPress={() => router.push(`/properties/${pid}`)}
                  />
                );
              }}
            />
          )}
        </ScrollView>
      ) : null}

      {tab === "Wishlist" ? (
        <ScrollView className="mt-2" contentContainerStyle={{ padding: 12 }}>
          {wishlistIds.length === 0 ? (
            <Text className="text-black-200">No wishlisted items.</Text>
          ) : (
            <FlatList
              data={wishlistIds}
              keyExtractor={(id) => id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item: pid }) => {
                const p = propertyById[pid];
                if (!p) return null;
                return (
                  <FeaturedCard
                    item={p}
                    onPress={() => router.push(`/properties/${pid}`)}
                  />
                );
              }}
            />
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
