import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingReview() {
  const params = useLocalSearchParams<{
    propertyId: string;
    checkIn: string;
    checkOut: string;
    total: string;
  }>();

  const onContinue = () => {
    router.push({
      pathname: "/booking/guests",
      params: { ...params } as any,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="text-2xl font-rubik-bold text-black-300 mt-2 mb-4">
          Review house rules
        </Text>

        <View className="bg-primary-100 rounded-md p-4 mb-3">
          <Text className="font-rubik-medium text-black-300 mb-2">
            Ground rules
          </Text>
          <Text className="text-black-200">• No parties or events</Text>
          <Text className="text-black-200">• No smoking</Text>
          <Text className="text-black-200">• Pets on request</Text>
          <Text className="text-black-200">• Check-in after 3:00 PM</Text>
          <Text className="text-black-200">
            • Respect quiet hours (10 PM – 7 AM)
          </Text>
        </View>

        <View className="bg-primary-100 rounded-md p-4 mb-3">
          <Text className="font-rubik-medium text-black-300 mb-2">
            Safety considerations
          </Text>
          <Text className="text-black-200">
            • Carbon monoxide alarm installed
          </Text>
          <Text className="text-black-200">• Smoke alarm installed</Text>
        </View>

        <Text className="text-black-300 mt-2">
          By continuing, you agree to follow the house rules and be a
          considerate guest.
        </Text>

        <TouchableOpacity
          onPress={onContinue}
          className="mt-6 bg-primary-300 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-rubik-bold text-center">
            Agree and continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
