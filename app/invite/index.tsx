import { View, Text } from "react-native";
import React from "react";
import Topbar from "@/components/topbar";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import InviteCodeInput from "@/components/InviteCodeInput";
import ConfirmButton from "@/components/confirmbutton";

export default function Invite() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background px-[32px]">
      <Topbar
        title="코드입력"
        onPress={router.back}
        image={require("../../assets/images/back_button.png")}
      />

      <Text className="text-[14px] text-[#9EA3B2] text-regular mt-[40px] leading-[22px]">{`초대 코드가 생성되었습니다!\n코드를 친구에게 공유하세요.\n해당 코드는 24시간 유지됩니다.`}</Text>

      <InviteCodeInput
        className="flex-row justify-between mt-[40px]"
        onCodeFilled={(code) => {
          console.log("입력 완료:", code);
          // 여기에 서버 검증, 초대 로직 추가 가능
        }}
      />
      <View className="flex-1"></View>
      <ConfirmButton
        className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
        title="참여하기"
        onPress={() => router.replace("/maps")}
      />
    </View>
  );
}
