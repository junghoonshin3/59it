import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

export const Loading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
};
