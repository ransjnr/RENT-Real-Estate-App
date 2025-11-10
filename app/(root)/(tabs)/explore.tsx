import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TermType = "All" | "Short-Term" | "Long-Term";

const Explore = () => {
  const [termType, setTermType] = useState<TermType>("All");
  const [longTermStars, setLongTermStars] = useState<number | null>(null);

  const [limit, setLimit] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const params = useMemo(() => {
    return { filter: "All", query: "", limit } as {
      filter: string;
      query: string;
      limit: number;
    };
  }, [limit]);

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite<any[], typeof params>({
    fn: getProperties,
    params,
    skip: true,
  });

  useEffect(() => {
    refetch(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const filtered = useMemo(() => {
    if (!properties) return [] as any[];
    let list = properties;
    if (termType === "Short-Term") {
      // heuristic: cheaper properties as short-term sample
      list = list.filter((p: any) => (p.price ?? 0) < 3000);
    } else if (termType === "Long-Term") {
      list = list.filter((p: any) => (p.price ?? 0) >= 3000);
      if (longTermStars) {
        list = list.filter(
          (p: any) => Math.round(p.rating ?? 0) === longTermStars
        );
      }
    }
    return list;
  }, [properties, termType, longTermStars]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 py-4">
        <Text className="text-xl font-rubik-bold text-black-300">Explore</Text>
        <Search />

        {/* Primary filters (property types) */}
        <Filters />

        {/* Term tabs */}
        <View className="flex-row mt-3 gap-4">
          {["All", "Short-Term", "Long-Term"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTermType(t as TermType)}
              className={`px-3 py-2 rounded-full ${
                termType === t
                  ? "bg-primary-300"
                  : "bg-primary-100 border border-primary-200"
              }`}
            >
              <Text
                className={`text-sm ${
                  termType === t
                    ? "text-white font-rubik-bold"
                    : "text-black-300 font-rubik"
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Long-term sub tabs for star ratings */}
        {termType === "Long-Term" && (
          <View className="flex-row mt-3 gap-2">
            {[null, 1, 2, 3, 4, 5].map((stars, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setLongTermStars(stars as any)}
                className={`px-3 py-1.5 rounded-full ${
                  longTermStars === stars ? "bg-black-300" : "bg-primary-100"
                }`}
              >
                <Text
                  className={`text-xs ${
                    longTermStars === stars ? "text-white" : "text-black-300"
                  }`}
                >
                  {stars === null ? "All" : `${stars}★`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary-300" />
        </View>
      ) : filtered.length === 0 ? (
        <NoResults />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.$id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 32 }}
          columnWrapperStyle={{ gap: 5, paddingHorizontal: 5, flex: 1 }}
          onEndReachedThreshold={0.5}
          onEndReached={() => setLimit((l) => l + 20)}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await refetch(params);
            setRefreshing(false);
          }}
          renderItem={({ item }) => (
            <Card item={item} onPress={() => handleCardPress(item.$id)} />
          )}
        />
      )}
    </View>
  );
};

export default Explore;
