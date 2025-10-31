import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

export default function BookingConfirmation() {
  const { id, propertyId } = useLocalSearchParams<{
    id: string;
    propertyId?: string;
  }>();
  const { data: prop } = useAppwrite<any[], string[]>({
    fn: getPropertiesByIds,
    params: propertyId ? ([propertyId] as any) : (undefined as any),
  });
  const item = prop?.[0];
  return (
    <RNSafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
          Booking Confirmed
        </Text>
        <Text className="text-black-200">Reference: {id}</Text>
        {item ? (
          <View className="mt-4 items-center">
            <Text className="text-black-300 font-rubik-medium">
              {item.name}
            </Text>
            <Text className="text-black-200 text-center">{item.address}</Text>
          </View>
        ) : null}
        <View className="mt-6 bg-primary-100 rounded-md p-4 w-full">
          <Text className="text-black-300 font-rubik-medium mb-1">
            What's next
          </Text>
          <Text className="text-black-200">
            • Check your email for your receipt and check-in details.
          </Text>
          <Text className="text-black-200">
            • You can message the host for any questions.
          </Text>
        </View>
        {propertyId ? (
          <TouchableOpacity
            onPress={() => router.replace(`/messages/${propertyId}`)}
            className="mt-4 bg-primary-100 px-5 py-3 rounded-md w-full"
          >
            <Text className="text-black-300 font-rubik-bold text-center">
              Message Host
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() =>
            router.replace({
              pathname: "/",
              params: { justBooked: "1", propertyId } as any,
            })
          }
          className="mt-6 bg-primary-300 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-rubik-bold">Go Home</Text>
        </TouchableOpacity>
      </View>
    </RNSafeAreaView>
  );
}
