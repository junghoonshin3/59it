import { Text, Image, View } from "react-native";
import React from "react";

type SlideProps = {
  title: string;
  description: string;
  image?: any; // require(...) 이미지
};

export default function Slide({ title, description, image }: SlideProps) {
  return (
    <View className="w-full h-full justify-center items-center">
      {image && (
        <Image source={image} className="w-60 h-60 mb-6" resizeMode="contain" />
      )}
      <Text className="text-[32px] leading-[44px] font-semibold text-center text-white tracking-[-0.8px]">
        {title}
      </Text>
      <Text className="mt-[36px] text-[14px] leading-[22px] font-semibold text-center text-white tracking-[-0.8px]">
        {description}
      </Text>
    </View>
  );
}
