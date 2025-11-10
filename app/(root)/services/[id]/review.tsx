import { services } from "@/constants/data";
import { currencySymbol } from "@/lib/payments";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceReview() {
  const params = useLocalSearchParams<{
    id: string;
    date: string;
    time: string;
    address: string;
    notes?: string;
    total: string;
  }>();

  const service = services.find((s) => s.id === params.id);

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

  const onContinue = () => {
    router.push({
      pathname: "/services/[id]/details",
      params: {
        id: service.id,
        date: params.date,
        time: params.time,
        address: params.address,
        notes: params.notes || "",
        total: params.total,
      } as any,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-5 py-4">
          <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
            Review Your Booking
          </Text>
          <Text className="text-black-200 mb-6">
            Please review your service booking details before proceeding.
          </Text>

          {/* Service Summary */}
          <View className="bg-primary-100 rounded-lg p-4 mb-4">
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

          {/* Booking Details */}
          <View className="bg-primary-100 rounded-lg p-4 mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Booking Details
            </Text>
            <View className="mb-3">
              <Text className="text-sm font-rubik-medium text-black-200 mb-1">
                Date
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {formatDate(params.date)}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-sm font-rubik-medium text-black-200 mb-1">
                Time
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {params.time}
              </Text>
            </View>
            <View>
              <Text className="text-sm font-rubik-medium text-black-200 mb-1">
                Service Address
              </Text>
              <Text className="text-base font-rubik-bold text-black-300">
                {params.address}
              </Text>
            </View>
            {params.notes && params.notes.trim().length > 0 && (
              <View className="mt-3 pt-3 border-t border-primary-200">
                <Text className="text-sm font-rubik-medium text-black-200 mb-1">
                  Additional Notes
                </Text>
                <Text className="text-base font-rubik text-black-300">
                  {params.notes}
                </Text>
              </View>
            )}
          </View>

          {/* Service Terms */}
          <View className="bg-primary-100 rounded-lg p-4 mb-4">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Service Terms
            </Text>
            <Text className="text-black-200 mb-2">
              • Service provider will arrive within the scheduled time window
            </Text>
            <Text className="text-black-200 mb-2">
              • Payment is required before service begins
            </Text>
            <Text className="text-black-200 mb-2">
              • Cancellation must be made at least 24 hours in advance
            </Text>
            <Text className="text-black-200 mb-2">
              • Satisfaction guarantee - we'll return if you're not happy
            </Text>
            <Text className="text-black-200">
              • All service providers are licensed and insured
            </Text>
          </View>

          {/* Price Summary */}
          <View className="bg-primary-100 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-black-300 font-rubik-medium">
                Service Fee
              </Text>
              <Text className="text-black-300 font-rubik-bold">
                {currencySymbol}
                {params.total}
              </Text>
            </View>
            <View className="border-t border-primary-200 pt-2 mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-rubik-bold text-black-300">
                  Total
                </Text>
                <Text className="text-xl font-rubik-bold text-primary-300">
                  {currencySymbol}
                  {params.total}
                </Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={onContinue}
            className="bg-primary-300 px-5 py-4 rounded-lg"
          >
            <Text className="text-white font-rubik-bold text-center text-lg">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
