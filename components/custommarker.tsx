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
      <View className="rounded-full items-center justify-center border-[2px] border-[#0075FF] bg-background">
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../assets/images/default_group_image.png")
          }
          resizeMode="contain"
          className={`w-[40px] h-[40px] rounded-full`}
        />
      </View>
    );
    let callOut = (
      <Callout tooltip={true}>
        <View className="p-[10px] bg-[#181A20CC] rounded-[8px]">
          <Text
            className="text-white w-full"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>
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
