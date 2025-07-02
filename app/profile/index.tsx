import { View, Text, StatusBar, Alert } from "react-native";
import React from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import ConfirmButton from "@/components/confirmbutton";
import { stopLocationUpdatesAsync } from "@/services/locationService";
import { useLogout } from "@/api/auth/hooks/useAuth";

export default function MyPage() {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        await stopLocationUpdatesAsync();
        router.dismissAll();
        router.replace("/auth/signin");
      },
      onError: async () => {
        Alert.alert("오류", "로그아웃에 실패했습니다.");
      },
    });
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
        indicatorColor="#ffffff"
        loading={logoutMutation.isPending}
        disabled={logoutMutation.isPending}
        onPress={handleLogout}
      />
    </View>
  );
}
