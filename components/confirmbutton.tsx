import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

type ConfirmButtonProps = {
  className?: string;
  onPress: () => void;
  title: string;
  disabled?: boolean;
};

export default function ConfirmButton({
  className,
  onPress,
  title,
  disabled,
}: ConfirmButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={
        className ??
        "bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center"
      }
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
