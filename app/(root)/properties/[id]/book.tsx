import Calendar from "@/components/Calendar";
import { getPropertiesByIds } from "@/lib/appwrite";
import { currencySymbol } from "@/lib/payments";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function nightsBetween(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const ms = d2.getTime() - d1.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function BookProperty() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addBooking, bookings } = useUserData();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const { data: propData } = useAppwrite<any[], string[]>({
    fn: getPropertiesByIds,
    params: id ? ([id as string] as any) : (undefined as any),
  });
  const price = useMemo(() => {
    const p = propData?.[0]?.price;
    return typeof p === "number" ? p : 150;
  }, [propData]);
  const nights = useMemo(
    () => (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0),
    [checkIn, checkOut]
  );
  const total = nights * price;

  const isAvailable = (pid: string, a: string, b: string) => {
    const start = new Date(a).getTime();
    const end = new Date(b).getTime();
    if (!isFinite(start) || !isFinite(end) || end <= start) return false;
    return !bookings.some(
      (bk) =>
        bk.propertyId === pid &&
        Math.max(start, new Date(bk.checkIn).getTime()) <
          Math.min(end, new Date(bk.checkOut).getTime())
    );
  };

  const onConfirm = async () => {
    if (!id || !checkIn || !checkOut || nights <= 0) {
      Alert.alert(
        "Incomplete",
        "Please select valid check-in and check-out dates."
      );
      return;
    }
    if (!isAvailable(id as string, checkIn, checkOut)) {
      Alert.alert("Unavailable", "Selected dates are not available.");
      return;
    }
    router.push({
      pathname: "/booking/review",
      params: {
        propertyId: id as string,
        checkIn,
        checkOut,
        total: String(total),
      } as any,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 py-4">
        <Text className="text-xl font-rubik-bold text-black-300">
          Book Your Stay
        </Text>

        <View className="mt-5">
          <Text className="text-black-300 font-rubik-medium mb-2">
            Select Dates
          </Text>
          <Calendar
            startDate={checkIn}
            endDate={checkOut}
            onChange={(s, e) => {
              setCheckIn(s || "");
              setCheckOut(e || "");
            }}
          />
          <View className="flex-row gap-2 mt-2">
            <TouchableOpacity
              className="bg-primary-100 px-3 py-1 rounded-md"
              onPress={() => {
                const d = new Date();
                const ci = d.toISOString().slice(0, 10);
                const co = new Date(d.getTime() + 24 * 3600 * 1000)
                  .toISOString()
                  .slice(0, 10);
                setCheckIn(ci);
                setCheckOut(co);
              }}
            >
              <Text className="text-black-300">Tonight</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary-100 px-3 py-1 rounded-md"
              onPress={() => {
                const now = new Date();
                const day = now.getDay();
                const satOffset = (6 - day + 7) % 7;
                const sat = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate() + satOffset
                );
                const sun = new Date(
                  sat.getFullYear(),
                  sat.getMonth(),
                  sat.getDate() + 1
                );
                setCheckIn(sat.toISOString().slice(0, 10));
                setCheckOut(sun.toISOString().slice(0, 10));
              }}
            >
              <Text className="text-black-300">This Weekend</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 p-4 bg-primary-100 rounded-md">
          <Text className="text-black-300 font-rubik-medium">
            Booking Summary
          </Text>
          <Text className="text-black-300 mt-2">
            {currencySymbol}
            {price} x {nights} nights
          </Text>
          <Text className="text-black-300 font-rubik-bold mt-1">
            Total: {currencySymbol}
            {total}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-black-300 font-rubik-medium mb-2">
            Optional Add-ons
          </Text>
          <Text className="text-black-100">High-Speed Internet — $5</Text>
          <Text className="text-black-100">Weekly Cleaning — $50</Text>
          <Text className="text-black-100">Welcome Grocery Pack — $75</Text>
        </View>

        <TouchableOpacity
          onPress={onConfirm}
          className="mt-8 bg-primary-300 px-5 py-3 rounded-md"
        >
          <Text className="text-white font-rubik-bold text-center">
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
