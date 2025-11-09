import icons from "@/constants/icons";
import images from "@/constants/images";
import { getPropertiesByIds, logout, updateUserName } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { useUserData } from "@/lib/user-data";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  Text,
  TextInput,
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
  const [editOpen, setEditOpen] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(user?.name || "");
  const handleLogout = async () => {
    try {
      console.log("[Profile] Starting logout...");
      const result = await logout();

      if (result) {
        console.log("[Profile] Logout successful, refetching user...");
        // Clear user data by refetching - this will return null and trigger redirect
        await refetch();
        console.log("[Profile] User refetched, should redirect now");
        // The AppLayout will automatically redirect to sign-in when isLoggedIn becomes false
      } else {
        // If logout returns false, still try to clear local state
        console.log(
          "[Profile] Logout returned false, clearing local state anyway"
        );
        await refetch();
      }
    } catch (error) {
      console.error("[Profile] Logout error:", error);
      // Even on error, try to clear local state
      try {
        await refetch();
      } catch (refetchError) {
        console.error("[Profile] Refetch error:", refetchError);
        Alert.alert(
          "Logout",
          "Logged out locally. Please restart the app if issues persist."
        );
      }
    }
  };

  const { wishlist, favorites, bookings } = useUserData();
  const favoriteIds = React.useMemo(() => Array.from(favorites), [favorites]);
  const wishlistIds = React.useMemo(() => Array.from(wishlist), [wishlist]);
  const bookingPropertyIds = React.useMemo(
    () => Array.from(new Set(bookings.map((b) => b.propertyId))),
    [bookings]
  );

  const allIds = React.useMemo(
    () =>
      Array.from(
        new Set([...favoriteIds, ...wishlistIds, ...bookingPropertyIds])
      ),
    [favoriteIds, wishlistIds, bookingPropertyIds]
  );

  const { data: propsData } = useAppwrite<any[], { ids: string[] }>({
    fn: getPropertiesByIds,
    params: { ids: allIds },
    skip: allIds.length === 0,
  });

  const propertyById = React.useMemo(() => {
    const map: Record<string, any> = {};
    (propsData || []).forEach((p: any) => (map[p.$id] = p));
    return map;
  }, [propsData]);

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
            <TouchableOpacity
              className="absolute bottom-11 right-9"
              onPress={() => {
                setNameDraft(user?.name || "");
                setEditOpen(true);
              }}
            >
              <Image source={icons.edit} className="size-7" />
            </TouchableOpacity>
            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>
        <View className="flex flex-col mt-10">
          <SettingsItem
            icon={icons.calendar}
            title="My Bookings"
            onPress={() => router.push("/my-bookings")}
          />
          <SettingsItem
            icon={icons.wallet}
            title="Payments"
            onPress={() => router.push("/payments")}
          />
          <SettingsItem
            icon={icons.shield}
            title="Security"
            onPress={() => router.push("/security")}
          />
          <SettingsItem
            icon={icons.language}
            title="Language"
            onPress={() => router.push("/language")}
          />
          <SettingsItem
            icon={icons.info}
            title="Help Center"
            onPress={() => router.push("/help-center")}
          />
          <SettingsItem
            icon={icons.bell}
            title="Notifications"
            onPress={() => router.push("/notifications")}
          />
        </View>
        {/* Additional settings from constants can be appended here if needed */}

        {/* Lists moved into My Bookings screen */}

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
      <Modal visible={editOpen} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 items-center justify-end">
          <View className="bg-white w-full rounded-t-2xl p-5">
            <Text className="text-lg font-rubik-bold text-black-300 mb-3">
              Edit profile
            </Text>
            <Text className="text-black-300 mb-2">Full name</Text>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="Enter your name"
              className="border border-primary-200 rounded-md px-3 py-2 text-black-300"
              placeholderTextColor="#8F90A6"
            />
            <View className="flex-row justify-end gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setEditOpen(false)}
                className="px-4 py-2 rounded-md bg-primary-100"
              >
                <Text className="text-black-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const ok = await updateUserName(nameDraft);
                  if (ok) {
                    setEditOpen(false);
                    refetch();
                  } else {
                    Alert.alert("Update failed", "Please try again.");
                  }
                }}
                className="px-4 py-2 rounded-md bg-primary-300"
              >
                <Text className="text-white font-rubik-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
