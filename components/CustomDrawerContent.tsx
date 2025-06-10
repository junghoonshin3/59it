import { View, Text } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { UserAvatar } from "@/components/UserAvatar";

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { user } = useAuthStore();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#181A20" }}
      >
        <View className="p-[20px] flex-1 justify-center items-center">
          <UserAvatar
            className="w-[96] h-[96px] rounded-full items-center justify-center bg-background"
            imageUrl={user?.user_metadata.picture}
          />
          <Text className="text-white">{user?.user_metadata.name}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ padding: 20, paddingBottom: bottom + 5 }}>
        <Text>Footer</Text>
      </View>
    </View>
  );
}
