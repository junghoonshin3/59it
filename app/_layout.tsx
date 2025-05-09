import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { TASK_NAME } from "@/constants/taskName";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "#181A20",
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          statusBarStyle: "light",
          contentStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: "#181A20",
          },
        }}
      >
        <Stack.Screen
          name="maps/index"
          options={{
            statusBarStyle: "dark",
            statusBarTranslucent: true,
            statusBarBackgroundColor: "#ffffff00",
            contentStyle: {
              paddingBottom: insets.bottom,
              backgroundColor: "#181A20",
            },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
