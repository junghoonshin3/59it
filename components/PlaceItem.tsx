import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Place } from "@/store/usePlaceStore";

type PlaceItemProps = {
  onPress: () => void;
  place: Place;
};

export default function PlaceItem({ onPress, place }: PlaceItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full px-[20px] pt-[10px] pb-[10px]"
    >
      <Text className="text-white">{place.displayName.text}</Text>
      <Text className="text-white">{place.formattedAddress}</Text>
    </TouchableOpacity>
  );
}
