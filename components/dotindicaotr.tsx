import { View, Text } from "react-native";
import React from "react";

type DotIndicatorProps = {
  currentPage: number;
  totalPages: number;
};

export default function DotIndicator({
  currentPage,
  totalPages,
}: DotIndicatorProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
      }}
    >
      {Array.from({ length: totalPages }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === currentPage ? 32 : 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: i === currentPage ? "#0075FF" : "#D9D9D9",
            marginBottom: 32,
          }}
        />
      ))}
    </View>
  );
}
