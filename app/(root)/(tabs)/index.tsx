import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
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

//ScrollView
//FlatList (for list of items)

export default function Index() {
  const { user } = useGlobalContext();
  const { unreadNotifications } = useUserData();
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
      limit,
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
    },
    skip: true,
  });

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  useEffect(() => {
    refetch({
      filter: params.filter || "All",
      query: params.query || "",
      limit,
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
    });
  }, [
    params.filter,
    params.query,
    params.priceMin,
    params.priceMax,
    params.minRating,
    limit,
    refetch,
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
      limit,
      priceMin: params.priceMin ? Number(params.priceMin) : undefined,
      priceMax: params.priceMax ? Number(params.priceMax) : undefined,
      minRating: params.minRating ? Number(params.minRating) : undefined,
    });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <FlatList
        data={properties || []}
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
          ) : !properties || properties.length === 0 ? (
            <NoResults />
          ) : null
        }
        ListHeaderComponent={
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
            {params.justBooked === "1" ? (
              <View className="mt-3 bg-primary-100 rounded-md p-3">
                <Text className="text-black-300 font-rubik-medium">
                  Booking confirmed
                </Text>
                <Text className="text-black-200">
                  Check your email for details. You can message your host
                  anytime.
                </Text>
                {params.propertyId ? (
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/messages/${params.propertyId}`)
                    }
                    className="mt-2 bg-white px-3 py-2 rounded-md self-start"
                  >
                    <Text className="text-black-300 font-rubik-medium">
                      Message Host
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
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
          </View>
        }
      />
    </SafeAreaView>
  );
}
