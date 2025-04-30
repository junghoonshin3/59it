import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          title: "홈",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "black" : "gray"}
            ></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
        name="[userName]"
        options={{
          title: "설정",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={24}
              color={focused ? "black" : "gray"}
            ></Ionicons>
          ),
        }}
      />
    </Tabs>
  );
}
