// components/CreateOrJoinGroupSheet.tsx

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import ConfirmButton from "@/components/confirmbutton";
import { router } from "expo-router";
import { BottomSheetView } from "@gorhom/bottom-sheet";

type Props = {
  onClose: () => void;
};

export default function CreateOrJoinGroupSheet({ onClose }: Props) {
  return (
    <BottomSheetView className="px-[32px]">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onClose}
          className="justify-center items-center"
        >
          <Image
            source={require("@/assets/images/back_button.png")}
            resizeMode="contain"
            className="w-[28px] h-[28px]"
          />
        </TouchableOpacity>
        <View className="w-[5px]" />
        <Text className="text-white text-[20px] font-semibold">그룹</Text>
      </View>

      <View className="flex-row mt-[20px]">
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center flex-1"
          title="모임 생성"
          onPress={() => router.push("/groups/create")}
        />
        <View className="w-[10px]" />
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center flex-1"
          title="모임 참여"
          onPress={() => router.push("/groups/join")}
        />
      </View>
    </BottomSheetView>
  );
}
