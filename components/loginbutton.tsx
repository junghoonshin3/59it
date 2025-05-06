import { View, Text, Button, TouchableOpacity, Image } from "react-native";
import React from "react";

type LoginButtonProps = {
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  image?: any; // require(...) 이미지
  onPress: () => void;
};

export default function LoginButton({
  title,
  description,
  backgroundColor,
  textColor,
  image,
  onPress,
}: LoginButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: backgroundColor }}
      className="flex-row w-full h-[60px]  rounded-[16px] pt-[18px] pb-[18px] border-[1px] border-[#35383F] justify-center mt-[40px]"
    >
      <Image
        source={image}
        className="w-[24px] h-[24px]"
        resizeMode="contain"
      />
      <Text
        className={`text-[16px] leading-[24px] font-medium text-center text-[${textColor}] tracking-[-0.5px] ms-[12px]`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
