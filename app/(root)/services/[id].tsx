import { services } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper function to get image source
const getImageSource = (image: string | number): ImageSourcePropType => {
  if (typeof image === "number") {
    return image;
  }
  if (
    typeof image === "string" &&
    (image.startsWith("http") || image.startsWith("https"))
  ) {
    return { uri: image };
  }
  return images.newYork;
};

export default function ServiceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-black-300 font-rubik-medium">
          Service not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary-300 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-rubik-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Image */}
        <View className="relative">
          <Image
            source={getImageSource(service.image)}
            className="w-full h-64"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-white/90 rounded-full p-2"
          >
            <Image source={icons.backArrow} className="w-5 h-5" />
          </TouchableOpacity>
        </View>

        <View className="px-5 py-4">
          {/* Service Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-rubik-bold text-black-300 flex-1">
              {service.name}
            </Text>
            <View className="flex-row items-center bg-primary-100 px-3 py-1.5 rounded-full ml-2">
              <Image source={icons.star} className="w-4 h-4" />
              <Text className="text-sm font-rubik-bold text-primary-300 ml-1">
                {service.rating}
              </Text>
            </View>
          </View>

          <Text className="text-base font-rubik-medium text-primary-300 mb-3">
            {service.provider}
          </Text>

          {/* Price */}
          <View className="bg-primary-100 rounded-lg p-4 mb-4">
            <Text className="text-3xl font-rubik-bold text-black-300">
              ${service.price}
            </Text>
            <Text className="text-sm text-black-200 mt-1">
              {service.duration}
            </Text>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              About this service
            </Text>
            <Text className="text-base font-rubik text-black-200 leading-6">
              {service.description}
            </Text>
          </View>

          {/* Service Details */}
          <View className="bg-primary-100 rounded-lg p-4 mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Service Details
            </Text>
            <View className="mb-2">
              <Text className="text-sm font-rubik-medium text-black-200">
                Category
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {service.category}
              </Text>
            </View>
            <View className="mb-2">
              <Text className="text-sm font-rubik-medium text-black-200">
                Duration
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {service.duration}
              </Text>
            </View>
            <View>
              <Text className="text-sm font-rubik-medium text-black-200">
                Availability
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {service.availability}
              </Text>
            </View>
          </View>

          {/* What's Included */}
          <View className="mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              What's included
            </Text>
            <View className="bg-primary-100 rounded-lg p-4">
              <Text className="text-black-200 mb-1">
                • Professional service by certified experts
              </Text>
              <Text className="text-black-200 mb-1">
                • Quality materials and equipment
              </Text>
              <Text className="text-black-200 mb-1">
                • Satisfaction guarantee
              </Text>
              <Text className="text-black-200 mb-1">
                • Follow-up support available
              </Text>
              <Text className="text-black-200">
                • Insurance coverage included
              </Text>
            </View>
          </View>

          {/* Reviews Section */}
          <View className="mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              Reviews
            </Text>
            <View className="bg-primary-100 rounded-lg p-4">
              <View className="flex-row items-center mb-3">
                <Text className="text-3xl font-rubik-bold text-black-300 mr-2">
                  {service.rating}
                </Text>
                <View>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Image
                        key={star}
                        source={icons.star}
                        className="w-4 h-4"
                        tintColor={
                          star <= Math.floor(service.rating)
                            ? "#FFD700"
                            : "#E0E0E0"
                        }
                      />
                    ))}
                  </View>
                  <Text className="text-sm text-black-200 mt-1">
                    Based on 127 reviews
                  </Text>
                </View>
              </View>
              <View className="border-t border-primary-200 pt-3">
                <Text className="text-sm font-rubik-medium text-black-300 mb-1">
                  Sarah M. • 2 days ago
                </Text>
                <Text className="text-black-200 text-sm">
                  "Excellent service! Professional team and great results.
                  Highly recommend!"
                </Text>
              </View>
            </View>
          </View>

          {/* Booking Button */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/services/[id]/book",
                params: { id: service.id },
              })
            }
            className="bg-primary-300 px-5 py-4 rounded-lg mt-4"
          >
            <Text className="text-white font-rubik-bold text-center text-lg">
              Book This Service
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
