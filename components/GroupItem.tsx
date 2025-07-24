import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { clsx } from "clsx";

export type GroupItemProps = {
  groupName: string;
  group_image_url?: string;
  onPress?: () => void;
  isSelected: boolean;
  disabled: boolean;
};

export const GroupItem = ({
  groupName,
  group_image_url,
  onPress,
  isSelected,
  disabled = false,
}: GroupItemProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className="w-[68px] items-center justify-center"
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <View
        className={clsx(
          "w-[68px] h-[68px] rounded-full items-center justify-center border-[2px]",
          disabled
            ? "border-gray-600 bg-gray-800"
            : isSelected
            ? "border-[#00C2FF] bg-[#002E4D]"
            : "border-[#444] bg-background"
        )}
        style={
          isSelected && !disabled
            ? {
                shadowColor: "#00C2FF",
                shadowOpacity: 0.6,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }
            : {}
        }
      >
        <Image
          source={
            group_image_url
              ? { uri: group_image_url }
              : require("@/assets/images/default_group_image.png")
          }
          resizeMode="contain"
          className={clsx(
            "rounded-full",
            group_image_url ? "w-[60px] h-[60px]" : "w-[40px] h-[40px]"
          )}
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
      </View>
      <Text
        className={clsx(
          "text-xs text-center mt-4",
          disabled
            ? "text-gray-500"
            : isSelected
            ? "text-[#00C2FF] font-semibold"
            : "text-white"
        )}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {groupName}
      </Text>
    </TouchableOpacity>
  );
};
