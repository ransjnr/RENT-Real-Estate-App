import { useUserData } from "@/lib/user-data";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { notifications, markAllNotificationsRead } = useUserData();

  useEffect(() => {
    markAllNotificationsRead().catch(() => {});
  }, [markAllNotificationsRead]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-primary-100">
        <Text className="text-xl font-rubik-bold text-black-300">
          Notifications
        </Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (item.propertyId)
                router.push(`/properties/${item.propertyId}`);
            }}
            className="bg-primary-100 rounded-md p-4"
          >
            <Text className="text-black-300 font-rubik-medium">
              {item.title}
            </Text>
            <Text className="text-black-200 mt-1">{item.body}</Text>
            {item.referenceId ? (
              <Text className="text-black-100 mt-1">
                Ref: {item.referenceId}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-black-200">You're all caught up</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
