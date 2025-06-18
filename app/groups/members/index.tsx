import { View, Text, TouchableOpacity, Image, Share } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  deleteGroup,
  getGroupMembers,
  leaveGroup,
} from "@/services/supabase/supabaseService";
import { GroupMember, UserProfile } from "@/types/types";
import { FlatList } from "react-native-gesture-handler";
import { UserAvatar } from "@/components/UserAvatar";
import Topbar from "@/components/topbar";
import ConfirmButton from "@/components/confirmbutton";
import CommonModal, { CommonModalProps } from "@/components/commonpopup";
import { useAuthStore } from "@/store/useAuthStore";

export default function Memebers() {
  const { groupId, hostId, inviteCode } = useLocalSearchParams<{
    groupId: string;
    hostId: string;
    inviteCode: string;
  }>();
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const { user } = useAuthStore();
  const router = useRouter();
  const [isDeleteGroup, setIsDeleteGroup] = useState<boolean>(false);
  useEffect(() => {
    const getMemebers = async () => {
      if (!user) return;
      let members = await getGroupMembers(groupId, user?.id);
      console.log("members : ", members);
      setMembers(members);
    };
    getMemebers();
  }, []);

  const renderItem = useCallback(({ item }: { item: GroupMember }) => {
    const isHost = hostId === user?.id;
    const isSelf = item.member.id === user?.id;

    return (
      <View className="flex-row pt-[10px] pb-[10px] justify-center items-center">
        <View>
          <UserAvatar
            className="w-[68px] h-[68px] rounded-full items-center justify-center bg-background"
            imageUrl={item.member.profile_image}
          />
          {hostId === item.member.id ? (
            <Image
              tintColor={"#FFD700"}
              className="absolute top-0 left-0"
              source={require("@/assets/images/crown.png")}
            />
          ) : null}
        </View>
        <View className="flex-1 justify-center px-[10px]">
          <Text className="text-white">{item.member.nickname}</Text>
        </View>
        {isHost && !isSelf ? (
          <ConfirmButton
            className="justify-center w-[50px] h-[30px] bg-primary justify-center items-center rounded-[8px]"
            title="삭제"
            onPress={() => {}}
          />
        ) : null}
      </View>
    );
  }, []);

  const handleShare = async () => {
    await Share.share({
      message: `모임 참여코드: ${inviteCode}\n\n앱에서 모임에 참여하세요!\n\n앱 다운로드 링크: https://example.com`, // 여기에 앱 다운로드 링크를 넣으세요
      title: "모임 참여코드 공유",
    });
  };

  const handleDeleteGroup = async () => {
    const data = await deleteGroup(groupId);
    setIsDeleteGroup(false);
    if (data.success) {
      router.dismissAll();
    }
  };

  const handleLeaveGroup = async () => {
    if (!user) {
      return;
    }
    const data = await leaveGroup(groupId, user.id);
    setIsDeleteGroup(false);
    if (data.success) {
      router.dismissAll();
    }
  };

  return (
    <View className="flex-1 px-[32px]">
      <CommonModal
        visible={isDeleteGroup}
        title={hostId === user?.id ? "모임삭제" : "모임탈퇴"}
        description={
          hostId === user?.id
            ? "참여한 모든 사용자들이 모임에서 탈퇴됩니다.\n모임을 정말 삭제하시겠습니까?"
            : "다시 참여하려면 초대코드가 필요합니다.\n모임에서 정말 탈퇴하시겠습니까?"
        }
        onCancel={() => {
          setIsDeleteGroup(false);
        }}
        onConfirm={() => {
          hostId === user?.id ? handleDeleteGroup() : handleLeaveGroup();
        }}
      />
      <Topbar
        onPress={() => {
          router.back();
        }}
        title="모임 멤버"
        image={require("@/assets/images/back_button.png")}
      />
      <View className="flex-row pt-[10px] pb-[10px] justify-center">
        <Text className="text-white text-[16px]">참여코드 : {inviteCode}</Text>
        <View className="flex-1" />
        <ConfirmButton
          className="justify-center h-[30px] bg-primary justify-center items-center rounded-[8px] px-[10px]"
          title="공유하기"
          onPress={handleShare}
        />
      </View>

      <FlatList className="flex-1" data={members} renderItem={renderItem} />
      {hostId !== user?.id ? (
        <ConfirmButton onPress={handleLeaveGroup} title="탈퇴하기" />
      ) : (
        <ConfirmButton
          onPress={() => {
            setIsDeleteGroup(true);
          }}
          title="해체하기"
        />
      )}
    </View>
  );
}
