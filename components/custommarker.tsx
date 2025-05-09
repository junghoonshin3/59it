import React from "react";
import { View, Text, Image } from "react-native";

type MarkerViewProps = {
  imageUrl: string;
  name?: string;
  isOnline?: boolean;
};

export function CustomMarkerView({
  imageUrl,
  name,
  isOnline,
}: MarkerViewProps) {
  return (
    <View>
      {/* 프로필 이미지 */}
      <View className="w-[38px] h-[38px] rounded-full border-[2px] border-sky-500 shadow-md bg-white">
        <Image
          source={{ uri: imageUrl }}
          className="flex-1 rounded-full"
          resizeMode="cover"
        />
        {/* 온라인 상태 점 */}
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500" />
        )}
      </View>
    </View>
  );
}
