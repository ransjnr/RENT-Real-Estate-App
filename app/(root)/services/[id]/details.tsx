import { services } from "@/constants/data";
import { currencySymbol } from "@/lib/payments";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceDetailsForm() {
  const params = useLocalSearchParams<{
    id: string;
    date: string;
    time: string;
    address: string;
    notes?: string;
    total: string;
  }>();

  const service = services.find((s) => s.id === params.id);
  const { addBooking } = useUserData();
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

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

  const canContinue =
    fullName.trim().length > 2 &&
    phone.trim().length > 6 &&
    email.trim().length > 5 &&
    email.includes("@");

  const onPay = async () => {
    if (!canContinue) {
      Alert.alert(
        "Incomplete",
        "Please fill in all required fields correctly."
      );
      return;
    }

    // Create service booking
    const bookingId = `service-${Date.now()}`;
    await addBooking({
      id: bookingId,
      propertyId: `service-${service.id}`,
      serviceId: service.id,
      serviceName: service.name,
      checkIn: params.date,
      checkOut: params.date, // Same day for services
      total: Number(params.total),
      guests: 1,
      status: "confirmed",
      type: "service",
      date: params.date,
      time: params.time,
      address: params.address,
      notes: params.notes || "",
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
    });

    router.replace({
      pathname: "/services/[id]/confirmation",
      params: {
        id: bookingId,
        serviceId: service.id,
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
            Your Contact Details
          </Text>
          <Text className="text-black-200 mb-6">
            We'll share these with the service provider only after payment.
          </Text>

          {/* Booking Summary */}
          <View className="bg-primary-100 rounded-lg p-4 mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              Booking Summary
            </Text>
            <Text className="text-sm text-black-200 mb-1">
              {service.name} by {service.provider}
            </Text>
            <Text className="text-sm text-black-200 mb-1">
              {formatDate(params.date)} at {params.time}
            </Text>
            <Text className="text-sm text-black-200 mb-2">
              {params.address}
            </Text>
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
          </View>

          {/* Payment Button */}
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
