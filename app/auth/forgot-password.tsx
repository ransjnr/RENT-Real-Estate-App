import images from "@/constants/images";
import { sendPasswordResetEmail } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  const handleSendReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await sendPasswordResetEmail(email.trim());
      if (result) {
        setEmailSent(true);
        Alert.alert(
          "Email Sent",
          "We've sent a password reset link to your email. Please check your inbox."
        );
      } else {
        Alert.alert("Error", "Could not send reset email. Please try again.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="flex-1 px-6 py-4 justify-center"
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4 self-start"
          >
            <Text className="text-primary-300 font-rubik-medium text-base">
              ← Back
            </Text>
          </TouchableOpacity>

          {/* Logo Section */}
          <View className="items-center mb-4">
            <Image
              source={images.logo}
              className="w-32 h-32 mb-2"
              resizeMode="contain"
            />
          </View>

          {!emailSent ? (
            <View className="mb-4">
              <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
                Forgot Password?
              </Text>
              <Text className="text-base font-rubik text-black-200 mb-4">
                Don't worry! Enter your email address and we'll send you a link
                to reset your password.
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-sm font-rubik-medium text-black-300 mb-2">
                  Email Address
                </Text>
                <View className="flex-row items-center border border-primary-200 rounded-xl px-4 py-3 bg-primary-50">
                  <TextInput
                    className="flex-1 text-black-300 font-rubik"
                    placeholder="Enter your email"
                    placeholderTextColor="#8F90A6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Send Reset Button */}
              <TouchableOpacity
                onPress={handleSendReset}
                disabled={loading}
                className={`bg-primary-300 rounded-xl py-3 items-center justify-center mb-3 ${
                  loading ? "opacity-50" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-rubik-bold text-lg">
                    Send Reset Link
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mb-4">
              <View className="bg-primary-100 rounded-xl p-4 mb-4">
                <Text className="text-lg font-rubik-bold text-black-300 mb-2 text-center">
                  Check Your Email
                </Text>
                <Text className="text-base font-rubik text-black-200 text-center mb-3">
                  We've sent a password reset link to:
                </Text>
                <Text className="text-base font-rubik-bold text-primary-300 text-center mb-3">
                  {email}
                </Text>
                <Text className="text-sm font-rubik text-black-200 text-center">
                  Please check your inbox and follow the instructions to reset
                  your password.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/auth/login")}
                className="bg-primary-300 rounded-xl py-3 items-center justify-center mb-3"
              >
                <Text className="text-white font-rubik-bold text-lg">
                  Back to Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="bg-primary-100 rounded-xl py-3 items-center justify-center"
              >
                <Text className="text-primary-300 font-rubik-bold text-lg">
                  Resend Email
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
