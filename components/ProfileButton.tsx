import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import clsx from "clsx";

type Props = {
  profileImage: string; // 로컬 이미지일 경우 require 사용, 원격일 경우 URL
  size?: number;
  top?: number;
  className?: string;
  onPress: () => void;
};

export default function ProfileButton({
  profileImage,
  size = 36,
  top = 0,
  className,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx("absolute", className)}
      style={{
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
      }}
    >
      <Image
        source={
          typeof profileImage === "string"
            ? { uri: profileImage }
            : profileImage
        }
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}
