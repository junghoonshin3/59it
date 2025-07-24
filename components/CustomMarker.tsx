import { View, Text, ImageURISource, ImageRequireSource } from "react-native";
import React from "react";
import { Callout, Marker } from "react-native-maps";
import { Location } from "@/store/useLocationStore";
import { Image } from "react-native";

export default function CustomMarker(params: {
  location: Location;
  nickName: string;
  profileUrl?: string;
}) {
  return (
    <Marker
      key={`${params.location.latitude},${params.location.longitude}`}
      coordinate={{
        latitude: params.location.latitude,
        longitude: params.location.longitude,
      }}
    >
      {params.profileUrl && (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: params.profileUrl }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />
        </View>
      )}
      <Callout tooltip={true}>
        <View className="p-[10px] bg-[#181A20CC] rounded-[8px]">
          <Text
            className="text-white w-full"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {params.nickName}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}
