import { View, Text, Image, ImageSourcePropType } from "react-native";
import React from "react";

type PermissionItemProps = {
  icon: ImageSourcePropType;
  title: string;
  description: string;
};

export default function PermissionItem({
  icon,
  title,
  description,
}: PermissionItemProps) {
  return (
    <View className="flex-row ps-[20px] pe-[8px] pt-[15px] pb-[15px] items-center bg-[#777C89] rounded-[12px]">
      <Image className="me-[14px]" source={icon} resizeMode="contain" />
      <View className="flex-1">
        <Text className="text-[10px] leading-[22px] font-medium tracking-[-0.5px] text-white">
          {title}
        </Text>
        <Text className="text-[10px] leading-[22px] font-medium tracking-[-0.5px] text-white">
          {description}
        </Text>
      </View>
    </View>
  );
}
