import icons from "@/constants/icons";
import { getPropertiesByIds } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
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
  const { messages, sendMessage, bookings } = useUserData() as any;
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null as any);
  const { data: prop } = useAppwrite<any[], { ids: string[] }>({
    fn: getPropertiesByIds,
    params: { ids: id ? [id] : [] },
    skip: !id,
  });
  const item = prop?.[0];
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

  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) {
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 50);
    }
  }, [list.length]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 flex-row items-center gap-3 border-b border-primary-100">
        <TouchableOpacity
          onPress={() => {
            try {
              // @ts-ignore - canGoBack may not exist on older versions
              if (
                typeof router.canGoBack === "function" &&
                router.canGoBack()
              ) {
                router.back();
              } else if (id) {
                router.replace(`/properties/${id}`);
              } else {
                router.replace("/");
              }
            } catch {
              if (id) router.replace(`/properties/${id}`);
              else router.replace("/");
            }
          }}
          className="w-9 h-9 items-center justify-center"
        >
          <Image source={icons.backArrow} className="w-5 h-5" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-black-300 font-rubik-bold text-base">
            {item?.name || "Host"}
          </Text>
          <Text className="text-black-200 text-xs">Host chat</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 8 }}
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
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-black-200">Say hello to your host</Text>
          </View>
        }
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
        <View className="px-4 pt-2">
          <View className="flex-row items-center gap-3 mb-2">
            <TouchableOpacity
              onPress={async () => {
                try {
                  const geo: any = (global as any).navigator?.geolocation;
                  if (!geo) throw new Error("Geolocation not available");
                  geo.getCurrentPosition(
                    async (pos: any) => {
                      const { latitude, longitude } = pos.coords || {};
                      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                      await sendMessage(
                        id as string,
                        "guest",
                        `My current location: ${mapsLink}`
                      );
                    },
                    async () => {
                      await sendMessage(
                        id as string,
                        "guest",
                        "I tried to share my location, but permissions are blocked."
                      );
                    },
                    { enableHighAccuracy: true, timeout: 8000 }
                  );
                } catch (e) {
                  await sendMessage(
                    id as string,
                    "guest",
                    "Location sharing isn't available on this device."
                  );
                }
              }}
              className="bg-primary-100 rounded-md px-3 py-2 flex-row items-center gap-2"
            >
              <Image source={icons.location} className="w-4 h-4" />
              <Text className="text-black-300 text-xs">Share location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const bk = (bookings || []).find(
                  (b: any) => b.propertyId === id
                );
                if (bk) {
                  await sendMessage(
                    id as string,
                    "guest",
                    `Booking details:\nCheck-in: ${bk.checkIn}\nCheck-out: ${bk.checkOut}\nTotal: ${bk.total}`
                  );
                } else {
                  await sendMessage(
                    id as string,
                    "guest",
                    "Here are my booking details: I'll share once confirmed."
                  );
                }
              }}
              className="bg-primary-100 rounded-md px-3 py-2 flex-row items-center gap-2"
            >
              <Image source={icons.calendar} className="w-4 h-4" />
              <Text className="text-black-300 text-xs">Share booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await sendMessage(
                  id as string,
                  "guest",
                  "My contact card:\nName: [Your Name]\nPhone: [Your Phone]"
                );
              }}
              className="bg-primary-100 rounded-md px-3 py-2 flex-row items-center gap-2"
            >
              <Image source={icons.phone} className="w-4 h-4" />
              <Text className="text-black-300 text-xs">Share contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await sendMessage(
                  id as string,
                  "guest",
                  "ETA update: I expect to arrive around 3:00 PM."
                );
              }}
              className="bg-primary-100 rounded-md px-3 py-2 flex-row items-center gap-2"
            >
              <Image source={icons.info} className="w-4 h-4" />
              <Text className="text-black-300 text-xs">Share ETA</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center gap-2 px-4 py-3 border-t border-primary-200">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message host"
            className="flex-1 bg-primary-100 px-3 py-2 rounded-md"
          />
          <TouchableOpacity
            disabled={!text.trim()}
            onPress={onSend}
            className={`px-3 py-2 rounded-md ${
              text.trim() ? "bg-primary-300" : "bg-primary-200"
            }`}
          >
            <Image source={icons.send} className="w-5 h-5" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
