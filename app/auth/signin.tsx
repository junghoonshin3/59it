import { View, Image } from "react-native";
import React, { useState } from "react";
import { login } from "@react-native-seoul/kakao-login";
import { registerProfile, supabase } from "@/services/supabase/supabaseService";
import { useRouter } from "expo-router";
import LoginButton from "../../components/loginbutton";
import Topbar from "@/components/topbar";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

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
      if (data?.user) {
        const { error } = await registerProfile(data.user);
        if (error) {
          console.error("registerProfile error", error);
          return;
        }
      }

      if (error) {
        console.error("login error", error);
        return;
      }

      router.replace("/maps"); // 로그인 성공하면 메인으로
    } catch (err) {
      console.error("login err", err);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.type === "success") {
        // response.data.idToken
        console.log("response.data.idToken : ", response.data.idToken);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      // if (isErrorWithCode(error)) {
      //   switch (error.code) {
      //     case statusCodes.IN_PROGRESS:
      //       // operation (eg. sign in) already in progress
      //       break;
      //     case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      //       // Android only, play services not available or outdated
      //       break;
      //     default:
      //     // some other error happened
      //   }
      // } else {
      //   // an error that's not related to google sign in occurred
      // }
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
        title="카카오 로그인"
        onPress={signInWithGoogle}
        backgroundColor="#FEE500"
        textColor="#000000"
        description="카카오 로그인"
        image={require("../../assets/images/kakao_login.png")}
      />

      {/* <LoginButton
        title="구글 로그인"
        onPress={signInWithKakao}
        backgroundColor="#ffffff"
        textColor="#000000"
        description="구글 로그인"
        image={require("../../assets/images/google_login.png")}
      /> */}
    </View>
  );
}
