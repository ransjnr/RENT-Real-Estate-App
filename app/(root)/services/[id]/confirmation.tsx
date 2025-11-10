import { services } from "@/constants/data";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceConfirmation() {
  const { id, serviceId } = useLocalSearchParams<{
    id: string;
    serviceId: string;
  }>();

  const service = services.find((s) => s.id === serviceId);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 py-4 items-center">
          {/* Success Icon */}
          <View className="w-20 h-20 bg-primary-300 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl text-white">✓</Text>
          </View>

          <Text className="text-2xl font-rubik-bold text-black-300 mb-2 text-center">
            Service Booking Confirmed!
          </Text>
          <Text className="text-black-200 text-center mb-6">
            Your booking reference: {id}
          </Text>

          {service && (
            <View className="bg-primary-100 rounded-lg p-4 w-full mb-4">
              <Text className="text-lg font-rubik-bold text-black-300 mb-2">
                {service.name}
              </Text>
              <Text className="text-sm text-black-200 mb-1">
                {service.provider}
              </Text>
              <Text className="text-base font-rubik-medium text-primary-300 mt-2">
                {service.category}
              </Text>
            </View>
          )}

          {/* What's Next */}
          <View className="bg-primary-100 rounded-lg p-4 w-full mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              What's Next
            </Text>
            <Text className="text-black-200 mb-2">
              • Check your email for booking confirmation and receipt
            </Text>
            <Text className="text-black-200 mb-2">
              • The service provider will contact you 24 hours before the
              scheduled time
            </Text>
            <Text className="text-black-200 mb-2">
              • You can reschedule or cancel up to 24 hours before the service
            </Text>
            <Text className="text-black-200">
              • If you have any questions, contact the service provider directly
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/",
                params: { justBookedService: "1", serviceId } as any,
              })
            }
            className="bg-primary-300 px-5 py-4 rounded-lg w-full mb-3"
          >
            <Text className="text-white font-rubik-bold text-center text-lg">
              Back to Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/my-bookings")}
            className="bg-primary-100 px-5 py-4 rounded-lg w-full"
          >
            <Text className="text-black-300 font-rubik-bold text-center text-lg">
              View My Bookings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
