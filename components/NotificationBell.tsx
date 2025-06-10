import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import clsx from "clsx";

type Props = {
  hasNotification?: boolean;
  size?: number;
  top?: number;
  className?: string;
  onPress: () => void;
};

export default function NotificationBell({
  hasNotification = false,
  size = 28,
  top = 0,
  className,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx("absolute right-4", className)}
      style={{
        top,
        width: size,
        height: size,
      }}
    >
      <Image
        source={require("@/assets/images/notification_bell_white.png")}
        className="w-full h-full"
        resizeMode="contain"
        tintColor={"#181A20"}
      />
      {hasNotification && (
        <View className="absolute top-[-2px] right-[-2px] w-[10px] h-[10px] rounded-full bg-red-500 border border-white" />
      )}
    </TouchableOpacity>
  );
}
