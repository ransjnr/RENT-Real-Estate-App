import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingDetails() {
  const params = useLocalSearchParams<{
    propertyId: string;
    checkIn: string;
    checkOut: string;
    total: string;
    guests?: string;
  }>();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const onPay = () => {
    router.push({
      pathname: "/payments/paystack",
      params: {
        propertyId: params.propertyId,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        total: params.total,
        name: fullName,
        phone,
        guests: params.guests,
      } as any,
    });
  };

  const canContinue = fullName.trim().length > 2 && phone.trim().length > 6;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-6">
        <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
          Your details
        </Text>
        <Text className="text-black-200 mb-6">
          We'll share these with your host only after payment.
        </Text>

        <View className="mb-4">
          <Text className="text-black-300 font-rubik-medium mb-2">
            Full name
          </Text>
          <TextInput
            className="border border-primary-200 rounded-md px-3 py-2 text-black-300"
            placeholder="Enter your full name"
            placeholderTextColor="#8F90A6"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View className="mb-4">
          <Text className="text-black-300 font-rubik-medium mb-2">
            Phone number
          </Text>
          <TextInput
            className="border border-primary-2 rounded-md px-3 py-2 text-black-300"
            placeholder="Enter your phone number"
            placeholderTextColor="#8F90A6"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          disabled={!canContinue}
          onPress={onPay}
          className={`mt-8 px-5 py-3 rounded-md ${
            canContinue ? "bg-primary-300" : "bg-primary-200"
          }`}
        >
          <Text className="text-white font-rubik-bold text-center">
            Go to payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
