import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Place } from "@/types/types";

type PlaceItemProps = {
  onPress: () => void;
  place: Place;
};

function PlaceItemComponent({ onPress, place }: PlaceItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 px-[20px] pt-[10px] pb-[10px]"
    >
      <Text className="text-white">{place.displayName.text}</Text>
      <Text className="text-white">{place.formattedAddress}</Text>
    </TouchableOpacity>
  );
}

// 메모이제이션 적용
export default React.memo(
  PlaceItemComponent,
  (prevProps, nextProps) =>
    prevProps.place.place_id === nextProps.place.place_id // 필요 시 더 정밀 비교 가능
);
