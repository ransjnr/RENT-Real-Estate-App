import { getPropertiesByIds } from "@/lib/appwrite";
import { currencySymbol } from "@/lib/payments";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function nightsBetween(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const ms = d2.getTime() - d1.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

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
  const [email, setEmail] = useState("");

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
        email,
        guests: params.guests,
      } as any,
    });
  };

  const canContinue =
    fullName.trim().length > 2 &&
    phone.trim().length > 6 &&
    email.trim().length > 5 &&
    email.includes("@");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 py-6">
          <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
            Your Contact Details
          </Text>
          <Text className="text-black-200 mb-6">
            We'll share these with your host only after payment confirmation.
          </Text>

          {/* Booking Summary */}
          {property && (
            <View className="bg-primary-100 rounded-lg p-4 mb-6">
              <Text className="text-lg font-rubik-bold text-black-300 mb-2">
                Booking Summary
              </Text>
              <Text className="text-sm text-black-200 mb-1">
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
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm font-rubik-medium text-black-200">
                    Guests
                  </Text>
                  <Text className="text-sm font-rubik-bold text-black-300">
                    {params.guests || "1"}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm font-rubik-medium text-black-200">
                    Duration
                  </Text>
                  <Text className="text-sm font-rubik-bold text-black-300">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </Text>
                </View>
                <View className="border-t border-primary-200 pt-2 mt-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-base font-rubik-bold text-black-300">
                      Total
                    </Text>
                    <Text className="text-xl font-rubik-bold text-primary-300">
                      {currencySymbol}
                      {params.total}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Contact Form */}
          <View className="mb-4">
            <Text className="text-black-300 font-rubik-medium mb-2">
              Full Name *
            </Text>
            <TextInput
              className="border border-primary-200 rounded-md px-4 py-3 text-black-300 bg-white"
              placeholder="Enter your full name"
              placeholderTextColor="#8F90A6"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-black-300 font-rubik-medium mb-2">
              Phone Number *
            </Text>
            <TextInput
              className="border border-primary-200 rounded-md px-4 py-3 text-black-300 bg-white"
              placeholder="Enter your phone number"
              placeholderTextColor="#8F90A6"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View className="mb-6">
            <Text className="text-black-300 font-rubik-medium mb-2">
              Email Address *
            </Text>
            <TextInput
              className="border border-primary-200 rounded-md px-4 py-3 text-black-300 bg-white"
              placeholder="Enter your email address"
              placeholderTextColor="#8F90A6"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Text className="text-xs text-black-200 mt-1">
              We'll send your booking confirmation here
            </Text>
          </View>

          <TouchableOpacity
            disabled={!canContinue}
            onPress={onPay}
            className={`px-5 py-4 rounded-lg ${
              canContinue ? "bg-primary-300" : "bg-primary-200"
            }`}
          >
            <Text className="text-white font-rubik-bold text-center text-lg">
              Proceed to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
