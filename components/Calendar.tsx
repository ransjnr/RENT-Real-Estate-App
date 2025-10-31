import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  onChange: (start: string | null, end: string | null) => void;
};

function toKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildMonth(base: Date) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    );
  }
  return { year, month, days };
}

export default function Calendar({ startDate, endDate, onChange }: Props) {
  const [cursor, setCursor] = useState(() => new Date());
  const [start, setStart] = useState<string | null>(startDate || null);
  const [end, setEnd] = useState<string | null>(endDate || null);

  const { year, month, days } = useMemo(() => buildMonth(cursor), [cursor]);

  const select = (d: Date) => {
    const key = toKey(d);
    if (!start || (start && end)) {
      setStart(key);
      setEnd(null);
      onChange(key, null);
      return;
    }
    // ensure chronological order
    if (key < start) {
      setEnd(start);
      setStart(key);
      onChange(key, start);
    } else {
      setEnd(key);
      onChange(start, key);
    }
  };

  const inRange = (key: string) =>
    start && end ? key > start && key < end : false;
  const isSameMonth = (d: Date) => d.getMonth() === month;

  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={() => setCursor(new Date(year, month - 1, 1))}
        >
          <Text className="text-black-300 font-rubik-medium">◀</Text>
        </TouchableOpacity>
        <Text className="text-black-300 font-rubik-bold">
          {new Date(year, month).toLocaleString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <TouchableOpacity
          onPress={() => setCursor(new Date(year, month + 1, 1))}
        >
          <Text className="text-black-300 font-rubik-medium">▶</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <Text key={`${d}-${i}`} className="w-10 text-center text-black-200">
            {d}
          </Text>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {days.map((d) => {
          const key = toKey(d);
          const isStart = start === key;
          const isEnd = end === key;
          const faded = !isSameMonth(d);
          return (
            <TouchableOpacity
              key={key}
              onPress={() => select(d)}
              className={`m-0.5 items-center justify-center rounded ${
                isStart || isEnd
                  ? "bg-primary-300"
                  : inRange(key)
                  ? "bg-primary-100"
                  : "bg-white"
              }`}
              style={{ width: 40, height: 40 }}
            >
              <Text
                className={`${
                  isStart || isEnd
                    ? "text-white"
                    : faded
                    ? "text-black-100"
                    : "text-black-300"
                }`}
              >
                {d.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
