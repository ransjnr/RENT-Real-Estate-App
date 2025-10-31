import { useUserData } from "@/lib/user-data";
import React, { useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = { propertyId: string };

export default function Reviews({ propertyId }: Props) {
  const { reviews, addReview } = useUserData();
  const list = useMemo(() => reviews[propertyId] ?? [], [reviews, propertyId]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const onSubmit = async () => {
    if (!name.trim() || !text.trim()) {
      Alert.alert("Missing", "Please enter your name and review text.");
      return;
    }
    await addReview({
      propertyId,
      author: name.trim(),
      rating,
      text: text.trim(),
    });
    setText("");
  };

  return (
    <View className="mt-6">
      <Text className="text-lg font-rubik-bold text-black-300">Reviews</Text>
      <View className="mt-3 gap-2">
        {list.length === 0 ? (
          <Text className="text-black-200">No reviews yet.</Text>
        ) : (
          list.map((r) => (
            <View key={r.id} className="p-3 bg-primary-100 rounded-md">
              <Text className="font-rubik-medium text-black-300">
                {r.author} — {""}
                <Text className="text-black-300">
                  {""}
                  {r.rating}★
                </Text>
              </Text>
              <Text className="text-black-200 mt-1">{r.text}</Text>
            </View>
          ))
        )}
      </View>

      <View className="mt-5">
        <Text className="text-black-300 font-rubik-medium mb-1">
          Add a review
        </Text>
        <TextInput
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          className="bg-primary-100 px-3 py-2 rounded-md mb-2"
        />
        <View className="flex-row gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setRating(n)}
              className={`px-2 py-1 rounded ${
                rating === n ? "bg-black-300" : "bg-primary-100"
              }`}
            >
              <Text
                className={`${rating === n ? "text-white" : "text-black-300"}`}
              >
                {n}★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          placeholder="Write your thoughts..."
          value={text}
          onChangeText={setText}
          multiline
          className="bg-primary-100 px-3 py-2 rounded-md h-24"
        />
        <TouchableOpacity
          onPress={onSubmit}
          className="mt-3 bg-primary-300 px-4 py-2 rounded-md"
        >
          <Text className="text-white text-center font-rubik-bold">
            Submit Review
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

