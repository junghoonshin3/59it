import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

type ConfirmButtonProps = {
  className?: string;
  onPress: () => void;
  title: string;
  indicatorColor?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function ConfirmButton({
  className,
  onPress,
  title,
  indicatorColor,
  loading,
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
      {loading && (
        <ActivityIndicator
          size="small"
          color={indicatorColor}
          className="mr-3"
        />
      )}
      {!loading && (
        <Text className="text-white text-lg font-bold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
