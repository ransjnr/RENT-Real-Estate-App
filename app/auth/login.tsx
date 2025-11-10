import images from "@/constants/images";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
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

export default function LoginScreen() {
  const { refetch, loading: authLoading, isLoggedIn } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  React.useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/");
    }
  }, [authLoading, isLoggedIn]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result) {
        // Wait for refetch to complete and state to update
        await refetch();
        // Small delay to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.replace("/");
      } else {
        Alert.alert(
          "Login Failed",
          "Invalid email or password. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
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
          <View className="items-center mb-6">
            <Image
              source={images.logo}
              className="w-32 h-32 mb-2"
              resizeMode="contain"
            />
          </View>

          {/* Form */}
          <View className="mb-4">
            <Text className="text-2xl font-rubik-bold text-black-300 mb-1">
              Welcome Back
            </Text>
            <Text className="text-base font-rubik text-black-200 mb-4">
              Sign in to continue to your account
            </Text>

            {/* Email Input */}
            <View className="mb-3">
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

            {/* Password Input */}
            <View className="mb-3">
              <Text className="text-sm font-rubik-medium text-black-300 mb-2">
                Password
              </Text>
              <View className="flex-row items-center border border-primary-200 rounded-xl px-4 py-3 bg-primary-50">
                <TextInput
                  className="flex-1 text-black-300 font-rubik"
                  placeholder="Enter your password"
                  placeholderTextColor="#8F90A6"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
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
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              className="self-end mb-4"
            >
              <Text className="text-primary-300 font-rubik-medium text-sm">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`bg-primary-300 rounded-xl py-3 items-center justify-center mb-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-rubik-bold text-lg">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-black-200 font-rubik text-sm">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text className="text-primary-300 font-rubik-bold text-sm">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
