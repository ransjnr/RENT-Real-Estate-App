import images from "@/constants/images";
import { signup } from "@/lib/appwrite";
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

export default function SignupScreen() {
  const { refetch, loading: authLoading, isLoggedIn } = useGlobalContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  React.useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/");
    }
  }, [authLoading, isLoggedIn]);

  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters");
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

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(email.trim(), password, name.trim());
      if (result) {
        // Navigate to verification screen
        router.push({
          pathname: "/auth/verify",
          params: { email: email.trim() } as any,
        });
      } else {
        Alert.alert(
          "Signup Failed",
          "Could not create account. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
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

          {/* Form */}
          <View className="mb-4">
            <Text className="text-2xl font-rubik-bold text-black-300 mb-1">
              Get Started
            </Text>
            <Text className="text-base font-rubik text-black-200 mb-4">
              Sign up to find your perfect home
            </Text>

            {/* Name Input */}
            <View className="mb-3">
              <Text className="text-sm font-rubik-medium text-black-300 mb-2">
                Full Name
              </Text>
              <View className="flex-row items-center border border-primary-200 rounded-xl px-4 py-3 bg-primary-50">
                <TextInput
                  className="flex-1 text-black-300 font-rubik"
                  placeholder="Enter your full name"
                  placeholderTextColor="#8F90A6"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

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
                  placeholder="Create a password"
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
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-primary-200 rounded-xl px-4 py-3 bg-primary-50">
                <TextInput
                  className="flex-1 text-black-300 font-rubik"
                  placeholder="Confirm your password"
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

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className={`bg-primary-300 rounded-xl py-3 items-center justify-center mb-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-rubik-bold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-black-200 font-rubik text-sm">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text className="text-primary-300 font-rubik-bold text-sm">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
