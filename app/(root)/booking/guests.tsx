import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingGuests() {
  const params = useLocalSearchParams<{
    propertyId: string;
    checkIn: string;
    checkOut: string;
    total: string;
  }>();
  const [guests, setGuests] = useState<number>(1);

  const onNext = () => {
    router.push({
      pathname: "/booking/details",
      params: { ...params, guests: String(guests) } as any,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-6">
        <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
          Who's coming?
        </Text>
        <Text className="text-black-200 mb-6">
          Add the number of guests for this trip.
        </Text>

        <View className="flex-row items-center justify-between bg-primary-100 rounded-md p-4">
          <Text className="text-black-300 font-rubik-medium">Guests</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              className="bg-white px-3 py-2 rounded-md"
              onPress={() => setGuests((g) => Math.max(1, g - 1))}
            >
              <Text className="text-black-300 font-rubik-bold">-</Text>
            </TouchableOpacity>
            <Text className="text-black-300 font-rubik-bold min-w-[24px] text-center">
              {guests}
            </Text>
            <TouchableOpacity
              className="bg-white px-3 py-2 rounded-md"
              onPress={() => setGuests((g) => Math.min(10, g + 1))}
            >
              <Text className="text-black-300 font-rubik-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={onNext}
          className="mt-8 bg-primary-300 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-rubik-bold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
