import images from "@/constants/images";
import * as Linking from "expo-linking";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  address?: string;
};

export default function MapPreview({ address }: Props) {
  const openMaps = () => {
    const query = address ? encodeURIComponent(address) : "";
    const url = query
      ? `https://www.google.com/maps/search/?api=1&query=${query}`
      : `https://www.google.com/maps`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="mt-4 rounded-lg overflow-hidden border border-primary-100">
      <Image source={images.map} className="w-full h-36" />
      <View className="flex-row items-center justify-between px-4 py-2 bg-white">
        <Text className="text-black-300 font-rubik">Map Preview</Text>
        <TouchableOpacity
          onPress={openMaps}
          className="bg-primary-300 px-3 py-1.5 rounded-md"
        >
          <Text className="text-white font-rubik-medium">Open Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}







