import { useGlobalContext } from "@/lib/global-provider";
import { buildPaystackInlineHtml, paymentsConfig } from "@/lib/payments";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Text, View } from "react-native";

let WebView: any;
try {
  WebView = require("react-native-webview").WebView;
} catch (e) {
  WebView = null;
}

export default function PaystackScreen() {
  const { user } = useGlobalContext();
  const { addBooking } = useUserData();
  const params = useLocalSearchParams<{
    propertyId: string;
    checkIn: string;
    checkOut: string;
    total: string; // as number string
    name?: string;
  }>();

  const total = Number(params.total || 0);
  const amountKobo = Math.max(0, Math.round(total * 100));
  const email = user?.email || "guest@example.com";
  const reference = useMemo(
    () => `REF_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const html = useMemo(() => {
    return buildPaystackInlineHtml({
      publicKey: paymentsConfig.paystackPublicKey,
      email,
      amountKobo,
      reference,
      currency: "NGN",
      metadata: {
        propertyId: params.propertyId,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        total,
      },
    });
  }, [
    email,
    amountKobo,
    reference,
    params.propertyId,
    params.checkIn,
    params.checkOut,
    total,
  ]);

  const onMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent?.data || "{}");
      if (data.event === "success") {
        await addBooking({
          id: reference,
          propertyId: params.propertyId,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          total,
          createdAt: Date.now(),
        });
        router.replace({
          pathname: "/booking/confirmation",
          params: { id: reference } as any,
        });
      } else if (data.event === "closed") {
        Alert.alert("Payment cancelled");
        router.back();
      }
    } catch (err) {}
  };

  if (!WebView) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-black-300 text-center">
          Payment screen requires react-native-webview. Please install it and
          reload.
        </Text>
      </View>
    );
  }

  if (!paymentsConfig.paystackPublicKey) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-black-300 text-center">
          Missing EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY. Add it to your env and
          restart.
        </Text>
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      onMessage={onMessage}
      javaScriptEnabled
    />
  );
}

