import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";

export type UserAvatarProps = {
  imageUrl: string;
  username: string;
  isOnline?: boolean;
  onPress?: () => void;
};

export const UserAvatar = ({
  imageUrl,
  username,
  isOnline = false,
  onPress,
}: UserAvatarProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center">
      <View className="w-[68px] h-[68px] rounded-full items-center justify-center border-[2px] border-[#0075FF] bg-background">
        <Image
          source={{ uri: imageUrl }}
          className="w-[60px] h-[60px] rounded-full"
        />
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-white" />
        )}
      </View>
      <Text className="text-xs text-center text-white mt-4">{username}</Text>
    </TouchableOpacity>
  );
};
