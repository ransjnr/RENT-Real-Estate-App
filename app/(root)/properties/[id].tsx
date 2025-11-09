import GalleryCarousel from "@/components/GalleryCarousel";
import MapPreview from "@/components/MapPreview";
import Reviews from "@/components/Reviews";
import images from "@/constants/images";
import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Helper function to get image source - handles both local assets (number) and URIs (string)
const getImageSource = (image: string | number): ImageSourcePropType => {
  if (typeof image === "number") {
    // Local asset (require)
    return image;
  }
  if (
    typeof image === "string" &&
    (image.startsWith("http") || image.startsWith("https"))
  ) {
    // Remote URI
    return { uri: image };
  }
  // Fallback to local asset if it's a string but not a URI
  return images.newYork;
};

const Property = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { wishlist, favorites, toggleFavorite, toggleWishlist } = useUserData();
  const { data, loading, refetch } = useAppwrite<any[], string[]>({
    fn: getPropertiesByIds,
    params: { ids: id ? [id as string] : [] },
    skip: !id,
  });

  useEffect(() => {
    if (id) refetch({ ids: [id as string] });
  }, [id, refetch]);

  const item = data?.[0];

  if (loading || !item) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" className="text-primary-300" />
      </View>
    );
  }

  const wished = wishlist.has(item.$id);
  const faved = favorites.has(item.$id);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {Array.isArray((item as any).gallery) &&
      (item as any).gallery.length > 0 ? (
        <GalleryCarousel images={(item as any).gallery} />
      ) : (
        <Image
          source={getImageSource(item.image as string | number)}
          className="w-full h-64"
        />
      )}
      <View className="px-5 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-rubik-bold text-black-300">
            {item.name}
          </Text>
          <Text className="text-base font-rubik text-black-100">
            ${item.price}/night
          </Text>
        </View>
        <Text className="text-black-100 mt-2">{item.address}</Text>
        <MapPreview address={item.address} />
        <Text className="text-black-100 mt-1">Rating: {item.rating}★</Text>

        <View className="flex-row mt-4 gap-3">
          <TouchableOpacity
            onPress={() => toggleWishlist(item.$id)}
            className={`px-4 py-2 rounded-md ${
              wished ? "bg-black-300" : "bg-primary-100"
            }`}
          >
            <Text className={`${wished ? "text-white" : "text-black-300"}`}>
              {wished ? "Wishlisted" : "Add to Wishlist"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.$id)}
            className={`px-4 py-2 rounded-md ${
              faved ? "bg-black-300" : "bg-primary-100"
            }`}
          >
            <Text className={`${faved ? "text-white" : "text-black-300"}`}>
              {faved ? "Favorited" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mt-4 gap-3">
          <TouchableOpacity
            onPress={() => router.push(`/messages/${item.$id}`)}
            className="bg-primary-100 px-4 py-2 rounded-md"
          >
            <Text className="text-black-300">Message Host</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/properties/${item.$id}/book`)}
            className="bg-primary-300 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-rubik-medium">Book Now</Text>
          </TouchableOpacity>
        </View>

        <Reviews propertyId={item.$id} />
      </View>
    </ScrollView>
  );
};

export default Property;
