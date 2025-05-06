import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as TaskManager from "expo-task-manager";
import { useLocationStore } from "@/store/useLocationStore";
import { TASK_NAME } from "@/constants/taskName";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

TaskManager.defineTask(
  TASK_NAME.locationTask,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.error("백그라운드 위치 추적 오류:", error);
      return;
    }

    console.log("위치 데이터:", locations);
    const size = locations.length;
    useLocationStore.getState().setLocation({
      latitude: locations[size - 1].coords.latitude,
      longitude: locations[size - 1].coords.longitude,
    });
  }
);

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "#181A20",
        paddingBottom: insets.bottom,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          statusBarStyle: "light",
          contentStyle: {
            paddingTop: insets.top,
            backgroundColor: "#181A20",
          },
        }}
      >
        <Stack.Screen
          name="maps/index"
          options={{
            statusBarStyle: "dark",
            contentStyle: {
              paddingBottom: insets.bottom,
            },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
