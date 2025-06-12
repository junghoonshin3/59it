import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import Slide from "@/components/slide";
import DotIndicator from "@/components/dotindicaotr";
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const session = useAuthStore((state) => state.session);
  // 온보딩이 끝났는지 확인하는 AsyncStorage
  const finishOnboarding = async () => {
    await storage.setBoolean("onboardingSeen", true);
    if (session) {
      router.replace("/maps"); // 이미 로그인을 한 경우 맵화면으로 이동
    } else {
      router.replace("/auth/signin"); // 로그인을 위해 signin 화면으로 이동
    }
  };

  const [currentPage, setCurrentPage] = useState<number>(0);
  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle={"light-content"} />
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        <View className="flex-1" key="1">
          <Slide
            title="나 이제 출발해~"
            description={`혹시 항상 약속시간에 늦게 나오는 친구가 있지 않나요?`}
            image={require("@/assets/images/onboarding/call.png")}
          />
        </View>
        <View className="flex-1" key="2">
          <Slide
            title="난 도착했는데?"
            description="약속장소에 도착했지만 친구가 안 보인다면?"
            image={require("@/assets/images/onboarding/waste.png")}
          />
        </View>
        <View className="flex-1" key="3">
          <Slide
            title="친구의 위치를 확인하세요!"
            description={`거짓말은 이제 안통합니다!\n 친구의 위치를 실시간으로 확인하세요.`}
            image={require("@/assets/images/onboarding/map.png")}
          />
        </View>
      </PagerView>
      <DotIndicator currentPage={currentPage} totalPages={3} />
      <Pressable
        onPress={finishOnboarding}
        className="h-[60px] bg-primary rounded-[16px] mb-[16px] ms-[32px] me-[32px] items-center justify-center"
      >
        <Text className="text-white text-base font-semibold">시작하기</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
