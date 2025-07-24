import React from "react";
import { View, Text } from "react-native";

type InviteCodeTextProps = {
  code: string; // 예: "A1B2C3"
  className?: string;
};

export default function InviteCodeText({
  code,
  className = "",
}: InviteCodeTextProps) {
  console.log("code", code);
  return (
    <View className={`flex-row justify-between ${className}`}>
      {code.split("").map((char, index) => (
        <View
          key={index}
          className="w-[50px] h-[50px] rounded-[8px] border border-[#0075FF] items-center justify-center bg-[#0075FF10]"
        >
          <Text className="text-white text-[20px] font-semibold">{char}</Text>
        </View>
      ))}
    </View>
  );
}
