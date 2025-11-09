import images from "@/constants/images";
import { verifyEmail } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    userId?: string;
    secret?: string;
  }>();
  const { refetch } = useGlobalContext();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    // If we have userId and secret from URL params (email verification link)
    if (params.userId && params.secret) {
      setLoading(true);
      try {
        const result = await verifyEmail(params.userId, params.secret);
        if (result) {
          await refetch();
          Alert.alert("Success", "Your email has been verified successfully!", [
            {
              text: "OK",
              onPress: () => router.replace("/"),
            },
          ]);
        } else {
          Alert.alert("Error", "Could not verify email. Please try again.");
        }
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      // For dummy mode or manual verification
      Alert.alert(
        "Verification",
        "In demo mode, verification is automatically successful.",
        [
          {
            text: "OK",
            onPress: async () => {
              await refetch();
              router.replace("/");
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="flex-1 px-6 py-8"
          >
            {/* Logo Section */}
            <View className="items-center mt-8 mb-8">
              <View className="w-20 h-20 bg-primary-300 rounded-3xl items-center justify-center mb-4 shadow-lg">
                <Text className="text-3xl font-rubik-bold text-white">R</Text>
              </View>
              <Text className="text-3xl font-rubik-bold text-black-300 mb-2">
                RENT
              </Text>
            </View>

            {/* Illustration */}
            <View className="items-center mb-8">
              <Image
                source={images.onboarding}
                className="w-56 h-56"
                resizeMode="contain"
              />
            </View>

            <View className="mb-6">
              <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
                Verify Your Email
              </Text>
              <Text className="text-base font-rubik text-black-200 mb-2">
                We've sent a verification code to:
              </Text>
              {params.email && (
                <Text className="text-base font-rubik-bold text-primary-300 mb-6">
                  {params.email}
                </Text>
              )}
              <Text className="text-base font-rubik text-black-200 mb-6">
                Please enter the 6-digit code below
              </Text>

              {/* Code Input */}
              <View className="flex-row justify-between mb-6">
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-12 h-14 border border-primary-200 rounded-xl text-center text-xl font-rubik-bold text-black-300 bg-primary-50"
                    value={digit}
                    onChangeText={(value) => handleCodeChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                onPress={handleVerify}
                disabled={loading || code.join("").length !== 6}
                className={`bg-primary-300 rounded-xl py-4 items-center justify-center mb-4 ${
                  loading || code.join("").length !== 6 ? "opacity-50" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-rubik-bold text-lg">
                    Verify Email
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center justify-center">
                <Text className="text-black-200 font-rubik text-sm">
                  Didn't receive the code?{" "}
                </Text>
                <TouchableOpacity>
                  <Text className="text-primary-300 font-rubik-bold text-sm">
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
