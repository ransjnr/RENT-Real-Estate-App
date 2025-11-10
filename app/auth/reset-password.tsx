import images from "@/constants/images";
import { resetPassword } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ userId?: string; secret?: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleReset = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!params.userId || !params.secret) {
      Alert.alert("Error", "Invalid reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(
        params.userId,
        params.secret,
        password
      );
      if (result) {
        Alert.alert(
          "Success",
          "Your password has been reset successfully. You can now login with your new password.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/auth/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Could not reset password. Please try again.");
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
          {/* Logo Section */}
          <View className="items-center mb-4">
            <Image
              source={images.logo}
              className="w-32 h-32 mb-2"
              resizeMode="contain"
            />
          </View>

          <View className="mb-4">
            <Text className="text-2xl font-rubik-bold text-black-300 mb-2">
              Reset Password
            </Text>
            <Text className="text-base font-rubik text-black-200 mb-4">
              Enter your new password below
            </Text>

            {/* Password Input */}
            <View className="mb-3">
              <Text className="text-sm font-rubik-medium text-black-300 mb-2">
                New Password
              </Text>
              <View className="flex-row items-center border border-primary-200 rounded-xl px-4 py-3 bg-primary-50">
                <TextInput
                  className="flex-1 text-black-300 font-rubik"
                  placeholder="Enter new password"
                  placeholderTextColor="#8F90A6"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Text className="text-primary-300 font-rubik-medium text-sm">
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-black-200 mt-1">
                Must be at least 6 characters
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-rubik-medium text-black-300 mb-2">
                Confirm New Password
              </Text>
              <View className="flex-row items-center border border-primary-200 rounded-xl px-4 py-3 bg-primary-50">
                <TextInput
                  className="flex-1 text-black-300 font-rubik"
                  placeholder="Confirm new password"
                  placeholderTextColor="#8F90A6"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2"
                >
                  <Text className="text-primary-300 font-rubik-medium text-sm">
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              onPress={handleReset}
              disabled={loading}
              className={`bg-primary-300 rounded-xl py-3 items-center justify-center mb-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-rubik-bold text-lg">
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              className="items-center"
            >
              <Text className="text-primary-300 font-rubik-medium text-sm">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
