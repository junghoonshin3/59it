import {
  SplashScreen,
  Stack,
  router,
  useRootNavigationState,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navReady = useRootNavigationState();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!navReady?.key) return; // 라우터 준비될 때까지 대기

      // 앱 초기화 로직 (예: 온보딩 확인)
      const seen = await AsyncStorage.getItem("onboardingSeen");

      if (!seen) {
        router.replace("/onboarding");
      } else {
        router.replace("/signin"); // 온보딩이 끝났으면 홈으로
      }
      setAppReady(true);
    };
    init();
  }, [navReady?.stale]);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync(); // 준비 끝나면 스플래시 종료
    }
  }, [appReady]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
      {!appReady && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-white z-50">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}
    </SafeAreaView>
  );
}
