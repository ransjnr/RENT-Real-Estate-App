import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AdvancedFilters({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const params = useLocalSearchParams<{
    priceMin?: string;
    priceMax?: string;
    minRating?: string;
  }>();

  const [priceMin, setPriceMin] = useState<string>(params.priceMin || "");
  const [priceMax, setPriceMax] = useState<string>(params.priceMax || "");
  const [minRating, setMinRating] = useState<string>(params.minRating || "");

  const onApply = () => {
    router.setParams({ priceMin, priceMax, minRating });
    onClose();
  };

  const onClear = () => {
    setPriceMin("");
    setPriceMax("");
    setMinRating("");
    router.setParams({
      priceMin: undefined,
      priceMax: undefined,
      minRating: undefined,
    } as any);
    onClose();
  };

  return (
    <View>
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="w-full bg-white rounded-lg p-5">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Filters
            </Text>

            <Text className="text-black-300 font-rubik-medium mb-1">
              Price Min
            </Text>
            <TextInput
              placeholder="e.g. 1000"
              keyboardType="numeric"
              value={priceMin}
              onChangeText={setPriceMin}
              className="bg-primary-100 px-3 py-2 rounded-md mb-3"
            />

            <Text className="text-black-300 font-rubik-medium mb-1">
              Price Max
            </Text>
            <TextInput
              placeholder="e.g. 5000"
              keyboardType="numeric"
              value={priceMax}
              onChangeText={setPriceMax}
              className="bg-primary-100 px-3 py-2 rounded-md mb-3"
            />

            <Text className="text-black-300 font-rubik-medium mb-1">
              Min Rating
            </Text>
            <TextInput
              placeholder="1-5"
              keyboardType="numeric"
              value={minRating}
              onChangeText={setMinRating}
              className="bg-primary-100 px-3 py-2 rounded-md"
            />

            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                onPress={onClear}
                className="flex-1 bg-primary-100 px-4 py-2 rounded-md"
              >
                <Text className="text-black-300 text-center font-rubik-medium">
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-black-300 px-4 py-2 rounded-md"
              >
                <Text className="text-white text-center font-rubik-medium">
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onApply}
                className="flex-1 bg-primary-300 px-4 py-2 rounded-md"
              >
                <Text className="text-white text-center font-rubik-bold">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
