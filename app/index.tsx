import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { hasLocationPermissions } from "@/services/locationService";
import * as SplashScreen from "expo-splash-screen";
import { Loading } from "@/components/loading";
import { storage } from "@/utils/storage";
import { supabase } from "@/services/supabase/supabaseService";
export default function index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      // 앱 초기화 로직 (예: 온보딩 확인)
      try {
        const hasOnboarded = await storage.getBoolean("onboardingSeen");
        const { isForgroundPermission, isBackgroundPermission } =
          await hasLocationPermissions();
        const session = await supabase.auth.getSession();
        if (!isForgroundPermission || !isBackgroundPermission) {
          router.replace("/permission");
        } else if (!hasOnboarded) {
          router.replace("/onboarding");
        } else if (!session) {
          router.replace("/auth/signin");
        } else {
          router.replace("/maps");
        }
      } catch (e) {
        console.error("초기화 오류:", e);
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync(); // 여기서 splash 종료
      }
    };
    init();
  }, []);

  if (!loading) {
    return null; // Splash가 켜져 있으므로 로딩 UI 불필요
  }

  return <Loading></Loading>;
}
