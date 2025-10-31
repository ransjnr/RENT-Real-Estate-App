import seed from "@/lib/seed";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SeedScreen() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const onRun = async () => {
    if (running) return;
    setRunning(true);
    setDone(false);
    setError(null);
    setLogs([]);

    // Capture console.log outputs
    const originalLog = console.log;
    const originalError = console.error;

    const capturedLogs: string[] = [];
    console.log = (...args: any[]) => {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg)
        )
        .join(" ");
      capturedLogs.push(message);
      setLogs([...capturedLogs]);
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg)
        )
        .join(" ");
      capturedLogs.push(`ERROR: ${message}`);
      setLogs([...capturedLogs]);
      originalError(...args);
    };

    try {
      await seed();
      setDone(true);
      Alert.alert(
        "Seed completed",
        "Database has been populated successfully!"
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
      Alert.alert(
        "Seed failed",
        errorMessage + "\n\nCheck the logs below for more details."
      );
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setRunning(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <Text className="text-2xl font-rubik-bold text-black-300 mb-4">
          Seed Database
        </Text>
        <Text className="text-sm font-rubik text-black-100 text-center mb-8">
          This will DELETE all existing documents in your collections and
          repopulate them with sample data.
        </Text>

        {running ? (
          <ActivityIndicator size="large" className="text-primary-300" />
        ) : (
          <TouchableOpacity
            onPress={onRun}
            className="bg-primary-300 px-6 py-3 rounded-md"
          >
            <Text className="text-white font-rubik-medium">Run Seed</Text>
          </TouchableOpacity>
        )}

        {done && !running ? (
          <Text className="text-green-600 mt-4 font-rubik">Done.</Text>
        ) : null}

        {error && (
          <View className="mt-4 p-4 bg-red-50 rounded-md w-full">
            <Text className="text-red-600 font-rubik-bold mb-2">Error:</Text>
            <Text className="text-red-700 font-rubik text-sm">{error}</Text>
          </View>
        )}

        {logs.length > 0 && (
          <View className="mt-4 p-4 bg-gray-50 rounded-md w-full max-h-64">
            <Text className="text-gray-700 font-rubik-bold mb-2">Logs:</Text>
            <View className="max-h-48">
              {logs.map((log, index) => (
                <Text
                  key={index}
                  className="text-gray-600 font-rubik text-xs mb-1"
                >
                  {log}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
