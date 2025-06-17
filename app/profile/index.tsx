import { View, Text, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";

export default function MyPage() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background px-[32px]">
      <Topbar
        title="내 정보"
        onPress={router.back}
        image={require("@/assets/images/back_button.png")}
      />
    </SafeAreaView>
  );
}
