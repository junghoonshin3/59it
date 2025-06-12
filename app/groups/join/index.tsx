import { View, Text, Keyboard } from "react-native";
import React, { useRef, useState } from "react";
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
import CommonModal from "@/components/commonpopup";

export default function JoinGroup() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [code, setCode] = useState(Array(6).fill(""));
  const [errorObj, setErrorObj] = useState<{
    visible: boolean;
    title: string;
    description: string;
  } | null>(null);
  const [joinActive, setJoinActive] = useState(false);
  const handleJoinByInviteCode = async () => {
    const newCode = code.join("");
    const group = await findGroupByInviteCode(newCode);
    if (!group) {
      setErrorObj({
        visible: true,
        title: "모임찾기 오류",
        description: "유효하지 않은 초대 코드입니다. 다시 확인해주세요.",
      });
      setJoinActive(false);
      return;
    }
    if (user?.id) {
      await joinGroup(group.id, user.id);
      router.push("/maps"); // 참여 후 지도 화면으로 이동 등
    }
  };

  const resetCode = () => {
    setCode(Array(6).fill(""));
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <CommonModal
        title={errorObj?.title}
        description={errorObj?.description}
        visible={errorObj?.visible ?? false}
        onConfirm={() => {
          setErrorObj(null);
          resetCode();
        }}
      />

      <View className="w-full h-full bg-background px-[32px]">
        <Topbar
          title="코드입력"
          onPress={router.back}
          image={require("@/assets/images/back_button.png")}
        />

        <Text className="text-[14px] text-[#9EA3B2] text-regular mt-[40px] leading-[22px]">{`친구에게 받은 초대 코드를 입력하세요!\n해당 코드는 24시간 유지됩니다.`}</Text>

        <InviteCodeInput
          value={code}
          onChange={setCode}
          className="flex-row justify-between mt-[40px]"
        />
        <View className="flex-1"></View>
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
          title="참여하기"
          disabled={joinActive}
          onPress={handleJoinByInviteCode}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
