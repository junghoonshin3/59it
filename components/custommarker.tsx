import React, { FunctionComponent, memo } from "react";
import { View, Text, Image } from "react-native";
import { Callout, Marker } from "react-native-maps";

type MarkerViewProps = {
  imageUrl?: string;
  name?: string;
  isOnline?: boolean;
  coordinate: any;
};

export const CustomMarkerView: FunctionComponent<MarkerViewProps> = memo(
  ({ imageUrl, name, isOnline, coordinate }) => {
    let content = (
      <View className="w-[38px] h-[38px] rounded-full items-center justify-center border-[2px] border-[#0075FF] bg-background">
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../assets/images/default_group_image.png")
          }
          resizeMode="contain"
          className={`w-[30px] h-[30px] rounded-full`}
        />
        {/* 온라인 상태 점 */}
        {isOnline && (
          <View className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500" />
        )}
      </View>
    );
    let callOut = (
      <Callout className="flex-1">
        <Text className="bg-white ">{name}</Text>
      </Callout>
    );
    return (
      <Marker
        className="justify-center items-center"
        tracksInfoWindowChanges={false}
        coordinate={coordinate}
        tracksViewChanges={false}
      >
        {content}
        {callOut}
      </Marker>
    );
  }
);
