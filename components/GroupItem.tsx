import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";

export type GroupItemProps = {
  groupName: string;
  group_image_url?: string;
  onPress?: () => void;
};

export const GroupItem = ({
  groupName,
  group_image_url,
  onPress,
}: GroupItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[68px] h-[68px] items-center justify-center"
    >
      <View className="w-[68px] h-[68px] rounded-full items-center justify-center border-[2px] border-[#0075FF] bg-background">
        <Image
          source={
            group_image_url
              ? { uri: group_image_url }
              : require("../assets/images/default_group_image.png")
          }
          resizeMode="contain"
          className={`${
            group_image_url ? "w-[60px] h-[60px]" : ""
          } rounded-full`}
        />
      </View>
      <Text
        className="text-xs text-center text-white mt-4"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {groupName}
      </Text>
    </TouchableOpacity>
  );
};
