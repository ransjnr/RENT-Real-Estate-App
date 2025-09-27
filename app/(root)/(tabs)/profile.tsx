import { settings } from "@/constants/data";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItemProps {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  title,
  icon,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center justify-between py-3"
    >
      <View className="flex flex-row items-center gap-3">
        <Image source={icon} className="size-6" />
        <Text
          className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}
        >
          {title}
        </Text>
      </View>
      {showArrow && <Image source={icons.rightArrow} className="size-6" />}
    </TouchableOpacity>
  );
};
const Profile = () => {
  const { user, refetch } = useGlobalContext();
  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Logout successful");
      refetch();
    } else {
      Alert.alert("Logout failed");
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 7 }}
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>
        <View className="flex-row justify-center flex mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={images.avatar}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity className="absolute bottom-11 right-9">
              <Image source={icons.edit} className="size-7" />
            </TouchableOpacity>
            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>
        <View className="flex flex-col mt-10">
          <SettingsItem
            icon={icons.calendar}
            title="My Bookings"
            onPress={() => {}}
          />
          <SettingsItem
            icon={icons.wallet}
            title="Payments"
            onPress={() => {}}
          />
        </View>
        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} onPress={() => {}} />
          ))}
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            onPress={handleLogout}
            showArrow={false}
            textStyle="text-danger-default"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
