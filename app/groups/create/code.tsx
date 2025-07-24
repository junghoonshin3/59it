import ConfirmButton from "@/components/confirmbutton";

import InviteCodeText from "@/components/InviteCodeText";
import Topbar from "@/components/topbar";
import { shareGroupInviteCode } from "@/utils/share";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function CreateCode() {
  const router = useRouter();
  const { inviteCode, groupName } = useLocalSearchParams<{
    inviteCode: string;
    groupName: string;
  }>();

  const handleShare = async () => {
    await shareGroupInviteCode({ inviteCode, groupName });
    router.dismissTo("/maps");
  };
  const handleClose = async () => {
    router.dismissTo("/maps");
  };
  return (
    <View className="flex-1 bg-background px-[32px]">
      <Topbar title="코드생성" />
      <Text className="text-[14px] text-[#9EA3B2] text-regular mt-[40px] leading-[22px]">{`초대 코드가 생성되었습니다!\n코드를 친구에게 공유하세요.\n해당 코드는 24시간 유지됩니다.`}</Text>
      <InviteCodeText code={inviteCode} className="mt-[40px]" />
      <View className="flex-1" />
      <View className="flex-row w-full gap-3">
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] flex-1 rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
          title="친구에게 공유하기"
          disabled={false}
          indicatorColor="#ffffff"
          loading={false}
          onPress={handleShare}
        />
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] flex-1 rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
          title="나가기"
          disabled={false}
          indicatorColor="#ffffff"
          loading={false}
          onPress={handleClose}
        />
      </View>
    </View>
  );
}
