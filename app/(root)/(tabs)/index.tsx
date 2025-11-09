import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import { services } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Models } from "react-native-appwrite";

type Property = Models.Document & {
  image: string;
  name: string;
  address: string;
  price: number;
  rating: number;
  type: string;
};

type TabType = "All" | "Short term" | "Long term" | "Services";

//ScrollView
//FlatList (for list of items)

export default function Index() {
  const { user } = useGlobalContext();
  const { unreadNotifications, wishlist, favorites, bookings } = useUserData();
  const params = useLocalSearchParams<{
    filter?: string;
    query?: string;
    priceMin?: string;
    priceMax?: string;
    minRating?: string;
    justBooked?: string;
    propertyId?: string;
  }>();
  const [limit, setLimit] = React.useState(6);
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [longTermStarRating, setLongTermStarRating] = useState<number | null>(
    null
  );

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite<Property[], Record<string, never>>({
      fn: getLatestProperties,
    });

  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite<
    Property[],
    {
      filter: string;
      query: string;
      limit: number;
      priceMin?: number;
      priceMax?: number;
      minRating?: number;
    }
  >({
    fn: getProperties,
    params: {
      filter: params.filter || "All",
      query: params.query || "",
      limit: 100, // Fetch more to allow filtering and sorting
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
    },
    skip: true,
  });

  // Algorithm to order buildings based on user's past selections
  const orderedProperties = useMemo(() => {
    if (!properties) return [];

    // Create a map of property IDs to their relevance score
    const propertyScores = new Map<string, number>();

    // Get all property IDs from user's past selections
    const bookedPropertyIds = new Set(bookings.map((b) => b.propertyId));
    const favoritePropertyIds = favorites;
    const wishlistPropertyIds = wishlist;

    // Calculate scores based on user preferences
    properties.forEach((prop) => {
      let score = 0;

      // Highest priority: properties user has booked
      if (bookedPropertyIds.has(prop.$id)) {
        score += 100;
      }

      // High priority: properties user has favorited
      if (favoritePropertyIds.has(prop.$id)) {
        score += 50;
      }

      // Medium priority: properties in wishlist
      if (wishlistPropertyIds.has(prop.$id)) {
        score += 25;
      }

      // Boost score for similar properties (same type, similar price range)
      if (
        bookedPropertyIds.size > 0 ||
        favoritePropertyIds.size > 0 ||
        wishlistPropertyIds.size > 0
      ) {
        // This is a simplified similarity check - in production, you'd want more sophisticated matching
        score += 10; // Base relevance score
      }

      propertyScores.set(prop.$id, score);
    });

    // Sort properties by score (highest first), then by rating, then by creation date
    return [...properties].sort((a, b) => {
      const scoreA = propertyScores.get(a.$id) || 0;
      const scoreB = propertyScores.get(b.$id) || 0;

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // If scores are equal, sort by rating
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }

      // Finally, sort by creation date (newest first)
      return 0;
    });
  }, [properties, bookings, favorites, wishlist]);

  // Filter properties based on active tab
  const filteredProperties = useMemo(() => {
    if (!orderedProperties) return [];

    let filtered = orderedProperties;

    // Filter by tab type
    if (activeTab === "Short term") {
      // Heuristic: cheaper properties as short-term (less than 3000)
      filtered = filtered.filter((p) => (p.price ?? 0) < 3000);
    } else if (activeTab === "Long term") {
      // Heuristic: more expensive properties as long-term (3000 or more)
      filtered = filtered.filter((p) => (p.price ?? 0) >= 3000);

      // Filter by star rating if selected
      if (longTermStarRating !== null) {
        filtered = filtered.filter(
          (p) => Math.round(p.rating ?? 0) === longTermStarRating
        );
      }
    } else if (activeTab === "Services") {
      // Services tab is dummy - return empty array
      return [];
    }
    // "All" tab shows all properties

    // Apply limit
    return filtered.slice(0, limit);
  }, [orderedProperties, activeTab, longTermStarRating, limit]);

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  useEffect(() => {
    refetch({
      filter: params.filter || "All",
      query: params.query || "",
      limit: 100,
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.filter,
    params.query,
    params.priceMin,
    params.priceMax,
    params.minRating,
  ]);

  const onEndReached = () => {
    if (loading) return;
    setLimit((l) => l + 6);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch({
      filter: params.filter || "All",
      query: params.query || "",
      limit: 100,
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
    });
    setRefreshing(false);
  };

  // Header component that's shared across all tabs
  const HeaderComponent = (
    <View className="px-5 py-4">
      {/* Seed Data Button */}
      {/* <TouchableOpacity
        className="mb-4 bg-primary-300 px-4 py-2 rounded-md self-center"
        onPress={() => router.push("/dev/seed")}
      >
        <Text className="text-white font-rubik-medium">Seed Data</Text>
      </TouchableOpacity> */}
      <View className="flex flex-row items-center justify-between mt-5">
        <View className="flex flex-row items-center">
          <Image
            source={images.avatar}
            // source={{ uri: user?.avatar }}
            className="size-12 rounded-full"
          />
          <View className="flex flex-col items-start ml-2 justify-center">
            <Text className="text-xs font-rubik text-black-100">
              Good Morning
            </Text>
            <Text className="text-base font-rubik-medium text-black-300">
              {user?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push({ pathname: "/notifications" });
          }}
          className="relative"
        >
          <Image source={icons.bell} className="size-6" />
          {unreadNotifications > 0 ? (
            <View className="absolute -top-1 -right-1 bg-primary-300 rounded-full w-3 h-3" />
          ) : null}
        </TouchableOpacity>
      </View>
      <Search />

      {/* Main Tabs: All, Short term, Long term, Services */}
      <View className="mt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {(["All", "Short term", "Long term", "Services"] as TabType[]).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  setActiveTab(tab);
                  setLongTermStarRating(null); // Reset star rating when switching tabs
                }}
                className={`px-4 py-2 rounded-full mr-3 ${
                  activeTab === tab
                    ? "bg-primary-300"
                    : "bg-primary-100 border border-primary-200"
                }`}
              >
                <Text
                  className={`text-sm ${
                    activeTab === tab
                      ? "text-white font-rubik-bold"
                      : "text-black-300 font-rubik"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Star Rating Subtabs for Long term */}
        {activeTab === "Long term" && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
          >
            {[null, 1, 2, 3, 4, 5].map((stars) => (
              <TouchableOpacity
                key={stars === null ? "all" : stars}
                onPress={() => setLongTermStarRating(stars)}
                className={`px-3 py-1.5 rounded-full mr-2 ${
                  longTermStarRating === stars
                    ? "bg-black-300"
                    : "bg-primary-100 border border-primary-200"
                }`}
              >
                <Text
                  className={`text-xs ${
                    longTermStarRating === stars
                      ? "text-white font-rubik-bold"
                      : "text-black-300 font-rubik"
                  }`}
                >
                  {stars === null ? "All" : `${stars}★`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {params.justBooked === "1" ? (
        <View className="mt-3 bg-primary-100 rounded-md p-3">
          <Text className="text-black-300 font-rubik-medium">
            Booking confirmed
          </Text>
          <Text className="text-black-200">
            Check your email for details. You can message your host anytime.
          </Text>
          {params.propertyId ? (
            <TouchableOpacity
              onPress={() => router.push(`/messages/${params.propertyId}`)}
              className="mt-2 bg-white px-3 py-2 rounded-md self-start"
            >
              <Text className="text-black-300 font-rubik-medium">
                Message Host
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {activeTab !== "Services" && (
        <>
          <View className="my-5">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">
                Featured
              </Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {latestPropertiesLoading ? (
              <ActivityIndicator
                className="text-primary-300 mt-5"
                size="large"
              />
            ) : !latestProperties || latestProperties.length === 0 ? (
              <NoResults />
            ) : (
              <FlatList
                data={latestProperties || []}
                renderItem={({ item }) => (
                  <FeaturedCard
                    item={item}
                    onPress={() => handleCardPress(item.$id)}
                  />
                )}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{
                  gap: 10,
                  marginTop: 5,
                  paddingHorizontal: 5,
                }}
              />
            )}
          </View>

          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">
              Our Recommendation
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <Filters />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      {activeTab === "Services" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {HeaderComponent}
          <View className="px-5 pb-5">
            <Text className="text-xl font-rubik-bold text-black-300 mb-4">
              Available Services
            </Text>
            <Text className="text-black-200 font-rubik mb-5">
              Connect with trusted service providers for your property needs.
            </Text>

            <FlatList
              data={services}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white border border-primary-200 rounded-lg p-4 flex-1"
                  style={{ minWidth: "48%" }}
                  onPress={() =>
                    router.push({
                      pathname: "/services/[id]",
                      params: { id: item.id },
                    } as any)
                  }
                >
                  <Image
                    source={item.image}
                    className="w-full h-32 rounded-md mb-3"
                    resizeMode="cover"
                  />
                  <Text className="text-xs font-rubik-medium text-primary-300 mb-1">
                    {item.category}
                  </Text>
                  <Text
                    className="text-base font-rubik-bold text-black-300 mb-2"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-xs font-rubik text-black-200 mb-3"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Image source={icons.star} className="size-3 mr-1" />
                      <Text className="text-xs font-rubik-medium text-black-300">
                        {item.rating}
                      </Text>
                    </View>
                    <Text className="text-sm font-rubik-bold text-primary-300">
                      ${item.price}
                    </Text>
                  </View>
                  <Text className="text-xs font-rubik text-black-100 mb-1">
                    {item.provider}
                  </Text>
                  <Text className="text-xs font-rubik text-black-100">
                    {item.duration} • {item.availability}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredProperties || []}
          renderItem={({ item }) => (
            <Card item={item} onPress={() => handleCardPress(item.$id)} />
          )}
          keyExtractor={(item) => item.$id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 32 }}
          columnWrapperStyle={{ gap: 5, paddingHorizontal: 5, flex: 1 }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={<View className="h-20" />}
          ListEmptyComponent={
            loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <ActivityIndicator className="text-primary-300" size="large" />
              </View>
            ) : !filteredProperties || filteredProperties.length === 0 ? (
              <NoResults />
            ) : null
          }
          ListHeaderComponent={HeaderComponent}
        />
      )}
    </SafeAreaView>
  );
}
