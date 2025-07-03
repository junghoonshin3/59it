import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Loading } from "@/components/loading";
import { supabase } from "@/services/supabase/supabaseService";
import { secureStorage } from "@/utils/storage";
import { hasLocationPermissions } from "@/services/locationService";

export default function index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      // 앱 초기화 로직 (예: 온보딩 확인)
      try {
        const hasOnboarded = await secureStorage.getItem("onboardingSeen");
        const { isBackgroundPermission, isForgroundPermission } =
          await hasLocationPermissions();

        const { data } = await supabase.auth.getSession();
        if (!isBackgroundPermission || !isForgroundPermission) {
          router.replace("/permission");
        } else if (!hasOnboarded) {
          router.replace("/onboarding");
        } else if (!data || !data.session || !data.session.user) {
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
