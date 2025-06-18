import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

export type UserAvatarProps = {
  imageUrl?: string;
  onPress?: () => void;
  className: string;
};

export const useravatar = ({
  imageUrl,
  onPress,
  className,
}: UserAvatarProps) => {
  return (
    <TouchableOpacity
      onPress={onPress ?? undefined}
      disabled={onPress ? false : true}
    >
      <View className="justify-center">
        <View className={className}>
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("@/assets/images/profile_user.png")
            }
            className="w-full h-full rounded-full"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
