import { useUserData } from "@/lib/user-data";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, sendMessage } = useUserData();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const list = useMemo(
    () => (id && messages[id] ? messages[id] : []),
    [messages, id]
  );

  const onSend = async () => {
    if (!id || !text.trim()) return;
    await sendMessage(id, "guest", text.trim());
    setText("");
    // Auto host reply (dummy)
    setTimeout(() => {
      sendMessage(id, "host", "Thanks for reaching out! How can I help?").catch(
        () => {}
      );
    }, 600);
  };

  useEffect(() => {
    if (!text) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View
            className={`px-3 py-2 rounded-md max-w-[80%] ${
              item.from === "guest"
                ? "self-end bg-primary-300"
                : "self-start bg-primary-100"
            }`}
          >
            <Text
              className={`${
                item.from === "guest" ? "text-white" : "text-black-300"
              }`}
            >
              {item.text}
            </Text>
            <Text
              className={`mt-1 text-[10px] ${
                item.from === "guest" ? "text-white/80" : "text-black-300/60"
              }`}
            >
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
      />
      {typing && (
        <View className="px-4 pb-1">
          <Text className="text-black-200 text-xs">Typing…</Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View className="flex-row items-center gap-2 px-4 py-3 border-t border-primary-200">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message host"
            className="flex-1 bg-primary-100 px-3 py-2 rounded-md"
          />
          <TouchableOpacity
            onPress={onSend}
            className="bg-primary-300 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-rubik-medium">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
