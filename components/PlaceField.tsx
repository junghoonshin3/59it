import React from "react";
import {
  View,
  Text,
  ImageSourcePropType,
  Image,
  TouchableOpacity,
} from "react-native";

type PlaceFieldProps = {
  label: string;
  value: string;
  className?: string;
  icon?: ImageSourcePropType;
  onShareCode?: () => void;
};

export default function PlaceField({
  label,
  value,
  className = "",
  icon,
  onShareCode,
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
        {icon ? (
          <TouchableOpacity
            style={{ position: "absolute", right: 20 }}
            onPress={onShareCode}
          >
            <Image source={icon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
