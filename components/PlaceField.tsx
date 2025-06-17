import React from "react";
import { View, Text } from "react-native";

type PlaceFieldProps = {
  label: string;
  value: string;
  className?: string;
};

export default function PlaceField({
  label,
  value,
  className = "",
}: PlaceFieldProps) {
  return (
    <View className={className}>
      <Text className="text-[14px] text-[#92A3B2] leading-[22px] tracking-[-0.5px]">
        {label}
      </Text>
      <View
        className="h-[60px] mt-[5px] rounded-[16px] justify-center px-[16px]"
        style={{
          backgroundColor: "#252932",
          borderColor: "#252932",
          borderWidth: 1,
        }}
      >
        <Text className="text-white text-[16px]">{value}</Text>
      </View>
    </View>
  );
}
