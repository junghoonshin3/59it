import { View, Text, StatusBar } from "react-native";
import React from "react";
import Topbar from "@/components/topbar";
import { useNavigation, useRouter } from "expo-router";
import ConfirmButton from "@/components/confirmbutton";
import { logOut } from "@/services/supabase/authService";
import { stopLocationUpdatesAsync } from "@/services/locationService";

export default function MyPage() {
  const navigation = useNavigation();
  const router = useRouter();
  const signOut = async () => {
    const result = await logOut();
    if (!result) return;
    await stopLocationUpdatesAsync();
    router.dismissAll();
    router.replace("/auth/signin");
  };
  return (
    <View className="flex-1 bg-background px-[32px]">
      <Topbar
        title="내 정보"
        onPress={router.back}
        image={require("@/assets/images/back_button.png")}
      />
      <ConfirmButton
        className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
        title="로그아웃"
        onPress={signOut}
      />
    </View>
  );
}
