import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { LocaleConfig } from "react-native-calendars";
import dayjs from "dayjs";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { LOCATION_TASK_NAME } from "@/constants/taskName";
import * as TaskManager from "expo-task-manager";
import { insertOrUpdateLocation } from "@/services/supabase/supabaseService";
import { storage } from "@/utils/storage";
import { SharingGroup } from "@/types/types";
SplashScreen.preventAutoHideAsync();

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";
dayjs.locale("ko");

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error(error);
    return;
  }
  const sharingGroup = await storage.getObject<SharingGroup>(
    "selectedSharingGroup"
  );

  if (!sharingGroup || !data) return;
  console.log("data >> ", JSON.stringify(data));
  const lastIndex = data.locations.length - 1;
  console.log("length>>>", lastIndex);
  await insertOrUpdateLocation({
    user_id: sharingGroup.user_id,
    group_id: sharingGroup.group_id,
    latitude: data.locations[lastIndex].coords.latitude,
    longitude: data.locations[lastIndex].coords.longitude,
    updated_at: new Date().toDateString(),
  });
});

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "#181A20",
      }}
    >
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
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
              contentStyle: {
                paddingBottom: insets.bottom,
                backgroundColor: "#181A20",
              },
            }}
          />
        </Stack>
      </BottomSheetModalProvider>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
