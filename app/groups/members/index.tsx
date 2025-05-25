import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getGroupMembers } from "@/services/supabase/supabaseService";
import { UserProfile } from "@/types/types";
import { FlatList } from "react-native-gesture-handler";
import { UserAvatar } from "@/components/useravatar";
import Topbar from "@/components/topbar";
import ConfirmButton from "@/components/confirmbutton";

export default function Memebers() {
  const { groupId, hostId } = useLocalSearchParams<{
    groupId: string;
    hostId: string;
  }>();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getMemebers = async () => {
      let members = await getGroupMembers(groupId);
      console.log("members : ", members);
      setMembers(members);
    };
    getMemebers();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: UserProfile }) => (
      <View className="flex-row pt-[10px] pb-[10px] justify-center items-center">
        <View>
          <UserAvatar imageUrl={item.profile_image} />
          {hostId === item.id ? (
            <Image
              tintColor={"#FFD700"}
              className="absolute top-0 left-0"
              source={require("@/assets/images/crown.png")}
            />
          ) : null}
        </View>
        <View className="flex-1 justify-center px-[10px]">
          <Text className="text-white">{item.nickname}</Text>
        </View>
        {hostId !== item.id ? (
          <ConfirmButton
            className="justify-center w-[50px] h-[30px] bg-primary justify-center items-center rounded-[8px]"
            title="삭제"
            onPress={() => {}}
          />
        ) : null}
      </View>
    ),
    []
  );

  return (
    <View className="flex-1 px-[32px]">
      <Topbar
        onPress={() => {
          router.back();
        }}
        title="모임 멤버"
        image={require("@/assets/images/back_button.png")}
      />
      <FlatList data={members} renderItem={renderItem} />
    </View>
  );
}
