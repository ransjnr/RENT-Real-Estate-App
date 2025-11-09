import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";

type Props = {
  images: string[];
  height?: number;
};

const { width } = Dimensions.get("window");

export default function GalleryCarousel({ images, height = 256 }: Props) {
  const [index, setIndex] = useState(0);
  const data = useMemo(() => images ?? [], [images]);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (i !== index) setIndex(i);
  };
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(uri, i) => uri + i}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width, height }} />
        )}
      />
      {data.length > 1 && (
        <View className="absolute bottom-3 self-center flex-row gap-1">
          {data.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                i === index ? "bg-white w-6" : "bg-white/60 w-2"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}








