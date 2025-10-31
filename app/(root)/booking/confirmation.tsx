import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingConfirmation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
          Booking Confirmed
        </Text>
        <Text className="text-black-200">Reference: {id}</Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="mt-6 bg-primary-300 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-rubik-bold">Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

