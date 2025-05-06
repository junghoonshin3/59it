import { View, Image } from "react-native";
import React, { useState } from "react";
import { login } from "@react-native-seoul/kakao-login";
import { supabase } from "@/services/supabaseService";
import { useRouter } from "expo-router";
import LoginButton from "../../components/loginbutton";
import Topbar from "@/components/topbar";
import { startLocationUpdatesAsync } from "@/services/locationService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const router = useRouter();
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        access_token: token.accessToken,
        token: token.idToken,
      });
      if (error) {
        console.error("login error", error);
        return;
      }
      await startLocationUpdatesAsync();
      router.replace("/maps"); // 로그인 성공하면 메인으로
    } catch (err) {
      console.error("login err", err);
    }
  };

  return (
    <View className="w-full h-full bg-background ps-[32px] pe-[32px] items-center">
      <Topbar title="로그인" />
      <View className="mt-[34px]">
        <Image
          source={require("../../assets/images/logo.png")}
          resizeMode="contain"
          className="w-[200px] h-[200px] mt-[34px]"
        />
      </View>

      <LoginButton
        title="카카오로 로그인"
        onPress={signInWithKakao}
        backgroundColor="#FEE500"
        textColor="#000000"
        description="카카오 로그인"
        image={require("../../assets/images/kakao_login.png")}
      />
    </View>
  );
}
