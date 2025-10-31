import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecurityCenter() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-primary-100">
        <Text className="text-xl font-rubik-bold text-black-300">Security</Text>
      </View>
      <View className="px-6 py-6">
        <Text className="text-black-200">
          Manage login and security settings. Coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
