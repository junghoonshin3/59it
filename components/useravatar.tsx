import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";

export type UserAvatarProps = {
  imageUrl?: string;
  isOnline?: boolean;
  onPress?: () => void;
};

export const UserAvatar = ({
  imageUrl,
  isOnline = false,
  onPress,
}: UserAvatarProps) => {
  return (
    <TouchableOpacity
      onPress={onPress ?? undefined}
      disabled={onPress ? false : true}
    >
      <View className="justify-center">
        <View className="w-[68px] h-[68px] rounded-full items-center justify-center border-[2px] border-[#0075FF] bg-background">
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("@/assets/images/profile_user.png")
            }
            className="w-[60px] h-[60px] rounded-full"
          />
          {isOnline && (
            <View className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-white" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
