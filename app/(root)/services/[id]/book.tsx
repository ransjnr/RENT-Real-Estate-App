import Calendar from "@/components/Calendar";
import { services } from "@/constants/data";
import { currencySymbol } from "@/lib/payments";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookService() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = services.find((s) => s.id === id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Available time slots
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

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
    selectedDate.trim().length > 0 &&
    selectedTime.trim().length > 0 &&
    address.trim().length > 5;

  const onContinue = () => {
    if (!canContinue) {
      Alert.alert(
        "Incomplete",
        "Please select a date, time, and provide a service address."
      );
      return;
    }

    router.push({
      pathname: "/services/[id]/review",
      params: {
        id: service.id,
        date: selectedDate,
        time: selectedTime,
        address,
        notes,
        total: String(service.price),
      } as any,
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
            Book {service.name}
          </Text>
          <Text className="text-black-200 mb-6">
            Select your preferred date, time, and service location.
          </Text>

          {/* Service Summary */}
          <View className="bg-primary-100 rounded-lg p-4 mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              {service.name}
            </Text>
            <Text className="text-sm text-black-200 mb-1">
              {service.provider}
            </Text>
            <Text className="text-xl font-rubik-bold text-primary-300 mt-2">
              ${service.price}
            </Text>
          </View>

          {/* Date Selection */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Select Date
            </Text>
            <Calendar
              startDate={selectedDate}
              endDate=""
              onChange={(date) => setSelectedDate(date || "")}
            />
            <View className="flex-row gap-2 mt-3">
              <TouchableOpacity
                className="bg-primary-100 px-3 py-2 rounded-md"
                onPress={() => {
                  const today = new Date();
                  setSelectedDate(today.toISOString().slice(0, 10));
                }}
              >
                <Text className="text-black-300 font-rubik-medium">Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary-100 px-3 py-2 rounded-md"
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setSelectedDate(tomorrow.toISOString().slice(0, 10));
                }}
              >
                <Text className="text-black-300 font-rubik-medium">
                  Tomorrow
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Selection */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Select Time
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-md ${
                    selectedTime === time ? "bg-primary-300" : "bg-primary-100"
                  }`}
                >
                  <Text
                    className={`font-rubik-medium ${
                      selectedTime === time ? "text-white" : "text-black-300"
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Service Address */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              Service Address
            </Text>
            <TextInput
              className="border border-primary-200 rounded-md px-4 py-3 text-black-300 bg-white"
              placeholder="Enter the address where service is needed"
              placeholderTextColor="#8F90A6"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Additional Notes */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-black-300 mb-2">
              Additional Notes (Optional)
            </Text>
            <TextInput
              className="border border-primary-200 rounded-md px-4 py-3 text-black-300 bg-white"
              placeholder="Any special instructions or requirements..."
              placeholderTextColor="#8F90A6"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Price Summary */}
          <View className="bg-primary-100 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-black-300 font-rubik-medium">
                Service Fee
              </Text>
              <Text className="text-black-300 font-rubik-bold">
                {currencySymbol}
                {service.price}
              </Text>
            </View>
            <View className="border-t border-primary-200 pt-2 mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-rubik-bold text-black-300">
                  Total
                </Text>
                <Text className="text-xl font-rubik-bold text-primary-300">
                  {currencySymbol}
                  {service.price}
                </Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={onContinue}
            disabled={!canContinue}
            className={`px-5 py-4 rounded-lg ${
              canContinue ? "bg-primary-300" : "bg-primary-200"
            }`}
          >
            <Text className="text-white font-rubik-bold text-center text-lg">
              Continue to Review
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
