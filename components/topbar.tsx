import { View, Image, Text, Touchable } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

type TopbarProps = {
  title?: string;
  image?: any; // require(...) 이미지
  onPress?: () => void;
};

export default function Topbar({ title, image, onPress }: TopbarProps) {
  return (
    <View className="w-full h-[56px] flex-row bg-background items-center justify-center">
      {image && (
        <TouchableOpacity onPress={onPress} className="absolute left-0">
          <Image
            source={image}
            resizeMode="contain"
            className="w-[28px] h-[28px]"
          />
        </TouchableOpacity>
      )}
      <Text className="text-[20px] text-white font-semibold leading-[34px] tracking-[-2.5px] ">
        {title}
      </Text>
    </View>
  );
}
