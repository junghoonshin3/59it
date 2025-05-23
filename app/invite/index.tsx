import { View, Text, Keyboard } from "react-native";
import React from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import InviteCodeInput from "@/components/InviteCodeInput";
import ConfirmButton from "@/components/confirmbutton";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/useAuthStore";
import {
  findGroupByInviteCode,
  joinGroup,
} from "@/services/supabase/supabaseService";

export default function Invite() {
  const router = useRouter();
  const { user } = useAuthStore();
  const handleJoinByInviteCode = async (inviteCode: string) => {
    const group = await findGroupByInviteCode(inviteCode);
    if (!group) {
      // alert("해당 초대 코드로 그룹을 찾을 수 없습니다.");
      return;
    }
    if (user?.id) {
      await joinGroup(group.id, user.id);
      router.push("/maps"); // 참여 후 지도 화면으로 이동 등
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="w-full h-full bg-background px-[32px]">
        <Topbar
          title="코드입력"
          onPress={router.back}
          image={require("../../assets/images/back_button.png")}
        />

        <Text className="text-[14px] text-[#9EA3B2] text-regular mt-[40px] leading-[22px]">{`친구에게 받은 초대 코드를 입력하세요!\n해당 코드는 24시간 유지됩니다.`}</Text>

        <InviteCodeInput
          className="flex-row justify-between mt-[40px]"
          onCodeFilled={handleJoinByInviteCode}
        />
        <View className="flex-1"></View>
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
          title="참여하기"
          onPress={() => router.replace("/maps")}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
