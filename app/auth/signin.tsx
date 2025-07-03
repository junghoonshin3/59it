// components/login/LoginScreen.tsx
import React, { useMemo } from "react";
import { View, Image, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";

import LoginButton from "@/components/loginbutton";
import Topbar from "@/components/topbar";
import { useGoogleLogin, useKakaoLogin } from "@/api/auth/hooks/useAuth";

export default function SignIn() {
  const router = useRouter();
  const googleLoginMutation = useGoogleLogin();
  const kakaoLoginMutation = useKakaoLogin();
  // 로딩 상태 확인
  const isLoading = useMemo(() => {
    return googleLoginMutation.isPending || kakaoLoginMutation.isPending;
  }, [googleLoginMutation.isPending, kakaoLoginMutation.isPending]);

  const handleGoogleLogin = (): void => {
    if (isLoading) return; // 로딩 중일 때는 실행하지 않음
    googleLoginMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/maps");
      },
      onError: (error: Error) => {
        Alert.alert("오류", error.message || "구글 로그인에 실패했습니다.");
      },
    });
  };

  const handleKakaoLogin = (): void => {
    if (isLoading) return; // 로딩 중일 때는 실행하지 않음
    kakaoLoginMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace("/maps");
      },
      onError: (error: Error) => {
        Alert.alert("오류", error.message || "카카오 로그인에 실패했습니다.");
      },
    });
  };

  return (
    <View className="w-full h-full bg-background px-[32px] items-center">
      <Topbar title="로그인" />
      <Image
        source={require("@/assets/images/logo.png")}
        resizeMode="contain"
        className="w-[200px] h-[200px] mt-[34px]"
      />

      <LoginButton
        title="카카오 로그인"
        onPress={handleKakaoLogin}
        backgroundColor="#FEE500"
        textColor="#000000"
        description="카카오 로그인"
        disabled={isLoading}
        loading={kakaoLoginMutation.isPending}
        image={require("@/assets/images/kakao_login.png")}
      />

      <LoginButton
        title="구글 로그인"
        onPress={handleGoogleLogin}
        backgroundColor="#ffffff"
        textColor="#181A20"
        description="구글 로그인"
        disabled={isLoading}
        loading={googleLoginMutation.isPending}
        image={require("@/assets/images/google_login.png")}
      />
    </View>
  );
}
