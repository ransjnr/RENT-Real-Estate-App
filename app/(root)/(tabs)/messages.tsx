import { useUserData } from "@/lib/user-data";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function MessagesScreen() {
  const { messages } = useUserData();
  const threads = useMemo(
    () =>
      Object.entries(messages).sort((a, b) => {
        const la = a[1][a[1].length - 1]?.createdAt ?? 0;
        const lb = b[1][b[1].length - 1]?.createdAt ?? 0;
        return lb - la;
      }),
    [messages]
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 py-4">
        <Text className="text-xl font-rubik-bold text-black-300">Messages</Text>
      </View>
      <FlatList
        data={threads}
        keyExtractor={([propertyId]) => propertyId}
        renderItem={({ item: [propertyId, msgs] }) => (
          <TouchableOpacity
            onPress={() => router.push(`/messages/${propertyId}`)}
            className="px-5 py-4 border-b border-primary-200"
          >
            <Text className="text-black-300 font-rubik-medium">
              Property {propertyId}
            </Text>
            <Text
              className="text-black-100 font-rubik text-xs"
              numberOfLines={1}
            >
              {msgs[msgs.length - 1]?.text || "Start chatting with the host"}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="px-5 py-8">
            <Text className="text-black-100 font-rubik">No messages yet.</Text>
          </View>
        )}
      />
    </View>
  );
}







