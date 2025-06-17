// components/login/LoginScreen.tsx
import React from "react";
import { View, Image, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import {
  signInWithGoogle,
  signInWithKakao,
} from "@/services/supabase/authService";
import LoginButton from "@/components/loginbutton";
import Topbar from "@/components/topbar";
import { useAuthStore } from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const router = useRouter();
  const { initAuth } = useAuthStore();
  const handleLogin = async (provider: "google" | "kakao") => {
    try {
      const user =
        provider === "google"
          ? await signInWithGoogle()
          : await signInWithKakao();
      if (user) {
        await initAuth();
        router.replace("/maps");
      }
    } catch (error: any) {
      Alert.alert(
        "로그인 실패",
        error?.message || "로그인 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <SafeAreaView className="w-full h-full bg-background px-[32px] items-center">
      <Topbar title="로그인" />
      <Image
        source={require("@/assets/images/logo.png")}
        resizeMode="contain"
        className="w-[200px] h-[200px] mt-[34px]"
      />

      <LoginButton
        title="카카오 로그인"
        onPress={() => handleLogin("kakao")}
        backgroundColor="#FEE500"
        textColor="#000000"
        description="카카오 로그인"
        image={require("@/assets/images/kakao_login.png")}
      />

      <LoginButton
        title="구글 로그인"
        onPress={() => handleLogin("google")}
        backgroundColor="#ffffff"
        textColor="#000000"
        description="구글 로그인"
        image={require("@/assets/images/google_login.png")}
      />
    </SafeAreaView>
  );
}
