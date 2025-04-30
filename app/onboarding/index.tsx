import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slide from "../../components/slide";
import "../../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Onboarding() {
  // 온보딩이 끝났는지 확인하는 AsyncStorage
  const finishOnboarding = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    router.replace("/"); // 온보딩 끝나면 로그인으로
  };

  return (
    <View className="flex-1 bg-background">
      <PagerView style={styles.pagerView} initialPage={0}>
        <View className="flex-1" key="1">
          <Slide
            title="나 이제 출발해~"
            description={`혹시 항상 약속시간에 늦게 나오는 친구가 있지 않나요?`}
            image={require("../../assets/images/onboarding/call.png")}
          />
        </View>
        <View className="flex-1" key="2">
          <Slide
            title="난 도착했는데?"
            description="약속장소에 도착했지만 친구가 안 보인다면?"
            image={require("../../assets/images/onboarding/waste.png")}
          />
        </View>
        <View className="flex-1" key="3">
          <Slide
            title="친구의 위치를 확인하세요!"
            description={`거짓말은 이제 안통합니다!\n 친구의 위치를 실시간으로 확인하세요.`}
            image={require("../../assets/images/onboarding/map.png")}
          />
        </View>
      </PagerView>
      <Pressable
        onPress={finishOnboarding}
        className="h-[60px] bg-primary rounded-[16px] mb-[16px] ms-[32px] me-[32px] items-center justify-center"
      >
        <Text className="text-white text-base font-semibold">시작하기</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
