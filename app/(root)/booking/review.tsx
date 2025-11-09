import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function nightsBetween(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const ms = d2.getTime() - d1.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function BookingReview() {
  const params = useLocalSearchParams<{
    propertyId: string;
    checkIn: string;
    checkOut: string;
    total: string;
  }>();

  const { data: propData } = useAppwrite<any[], string[]>({
    fn: getPropertiesByIds,
    params: { ids: params.propertyId ? [params.propertyId] : [] },
    skip: !params.propertyId,
  });

  const property = propData?.[0];
  const nights = useMemo(
    () =>
      params.checkIn && params.checkOut
        ? nightsBetween(params.checkIn, params.checkOut)
        : 0,
    [params.checkIn, params.checkOut]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <Text className="text-2xl font-rubik-bold text-black-300 mt-2 mb-2">
          Review Your Booking
        </Text>
        <Text className="text-black-200 mb-6">
          Please review the house rules and booking details before continuing.
        </Text>

        {/* Booking Summary */}
        {property && (
          <View className="bg-primary-100 rounded-lg p-4 mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              {property.name}
            </Text>
            <Text className="text-sm text-black-200 mb-3">
              {property.address}
            </Text>
            <View className="border-t border-primary-200 pt-3">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-rubik-medium text-black-200">
                  Check-in
                </Text>
                <Text className="text-sm font-rubik-bold text-black-300">
                  {formatDate(params.checkIn)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-rubik-medium text-black-200">
                  Check-out
                </Text>
                <Text className="text-sm font-rubik-bold text-black-300">
                  {formatDate(params.checkOut)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm font-rubik-medium text-black-200">
                  Duration
                </Text>
                <Text className="text-sm font-rubik-bold text-black-300">
                  {nights} {nights === 1 ? "night" : "nights"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* House Rules */}
        <View className="bg-primary-100 rounded-lg p-4 mb-4">
          <Text className="text-lg font-rubik-bold text-black-300 mb-3">
            House Rules
          </Text>
          <View className="mb-2">
            <Text className="text-sm font-rubik-medium text-black-200 mb-1">
              Ground Rules
            </Text>
            <Text className="text-black-200 text-sm">
              • No parties or events
            </Text>
            <Text className="text-black-200 text-sm">• No smoking</Text>
            <Text className="text-black-200 text-sm">
              • Pets allowed on request
            </Text>
            <Text className="text-black-200 text-sm">
              • Check-in after 3:00 PM
            </Text>
            <Text className="text-black-200 text-sm">
              • Check-out before 11:00 AM
            </Text>
            <Text className="text-black-200 text-sm">
              • Respect quiet hours (10 PM – 7 AM)
            </Text>
          </View>
        </View>

        {/* Safety Features */}
        <View className="bg-primary-100 rounded-lg p-4 mb-4">
          <Text className="text-lg font-rubik-bold text-black-300 mb-3">
            Safety Features
          </Text>
          <Text className="text-black-200 text-sm mb-1">
            • Carbon monoxide alarm installed
          </Text>
          <Text className="text-black-200 text-sm mb-1">
            • Smoke alarm installed
          </Text>
          <Text className="text-black-200 text-sm mb-1">
            • First aid kit available
          </Text>
          <Text className="text-black-200 text-sm">
            • Fire extinguisher on premises
          </Text>
        </View>

        {/* Cancellation Policy */}
        <View className="bg-primary-100 rounded-lg p-4 mb-6">
          <Text className="text-lg font-rubik-bold text-black-300 mb-3">
            Cancellation Policy
          </Text>
          <Text className="text-black-200 text-sm mb-2">
            • Free cancellation up to 48 hours before check-in
          </Text>
          <Text className="text-black-200 text-sm mb-2">
            • 50% refund for cancellations 24-48 hours before check-in
          </Text>
          <Text className="text-black-200 text-sm">
            • No refund for cancellations less than 24 hours before check-in
          </Text>
        </View>

        <Text className="text-black-300 text-sm mb-6">
          By continuing, you agree to follow the house rules and be a
          considerate guest. You also agree to our cancellation policy.
        </Text>

        <TouchableOpacity
          onPress={onContinue}
          className="bg-primary-300 px-5 py-4 rounded-lg"
        >
          <Text className="text-white font-rubik-bold text-center text-lg">
            Agree and Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
