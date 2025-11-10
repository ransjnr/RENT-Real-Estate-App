import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

export default function BookingConfirmation() {
  const { id, propertyId } = useLocalSearchParams<{
    id: string;
    propertyId?: string;
  }>();
  const { data: prop } = useAppwrite<any[], string[]>({
    fn: getPropertiesByIds,
    params: { ids: propertyId ? [propertyId] : [] },
    skip: !propertyId,
  });
  const item = prop?.[0];

  return (
    <RNSafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-1 items-center justify-center px-6 py-8">
          {/* Success Icon */}
          <View className="w-20 h-20 bg-primary-300 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl text-white">✓</Text>
          </View>

          <Text className="text-2xl font-rubik-bold text-black-300 mb-2 text-center">
            Booking Confirmed!
          </Text>
          <Text className="text-black-200 mb-1 text-center">
            Your booking reference
          </Text>
          <Text className="text-lg font-rubik-bold text-primary-300 mb-6">
            {id}
          </Text>

          {item ? (
            <View className="bg-primary-100 rounded-lg p-4 w-full mb-6">
              <Text className="text-lg font-rubik-bold text-black-300 mb-2">
                {item.name}
              </Text>
              <Text className="text-sm text-black-200 text-center">
                {item.address}
              </Text>
            </View>
          ) : null}

          {/* What's Next */}
          <View className="bg-primary-100 rounded-lg p-4 w-full mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              What's Next
            </Text>
            <Text className="text-black-200 mb-2 text-sm">
              • Check your email for your booking confirmation and receipt
            </Text>
            <Text className="text-black-200 mb-2 text-sm">
              • You'll receive check-in instructions 24 hours before arrival
            </Text>
            <Text className="text-black-200 mb-2 text-sm">
              • You can message the host anytime for questions or special
              requests
            </Text>
            <Text className="text-black-200 text-sm">
              • Save your booking reference for easy access to your reservation
            </Text>
          </View>

          {/* Important Information */}
          <View className="bg-primary-100 rounded-lg p-4 w-full mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Important Information
            </Text>
            <Text className="text-black-200 mb-2 text-sm">
              • Check-in time: After 3:00 PM
            </Text>
            <Text className="text-black-200 mb-2 text-sm">
              • Check-out time: Before 11:00 AM
            </Text>
            <Text className="text-black-200 text-sm">
              • Free cancellation up to 48 hours before check-in
            </Text>
          </View>

          {/* Action Buttons */}
          {propertyId ? (
            <TouchableOpacity
              onPress={() => router.replace(`/messages/${propertyId}`)}
              className="bg-primary-100 px-5 py-4 rounded-lg w-full mb-3"
            >
              <Text className="text-black-300 font-rubik-bold text-center text-lg">
                Message Host
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => router.push("/my-bookings")}
            className="bg-primary-100 px-5 py-4 rounded-lg w-full mb-3"
          >
            <Text className="text-black-300 font-rubik-bold text-center text-lg">
              View My Bookings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/",
                params: { justBooked: "1", propertyId } as any,
              })
            }
            className="bg-primary-300 px-5 py-4 rounded-lg w-full"
          >
            <Text className="text-white font-rubik-bold text-center text-lg">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </RNSafeAreaView>
  );
}
