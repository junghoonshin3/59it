import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { LocaleConfig } from "react-native-calendars";
import dayjs from "dayjs";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BACKGROUND_LOCATION_TASK } from "@/constants/taskName";
import * as TaskManager from "expo-task-manager";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocationObject } from "expo-location";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import { upsertGroupMemberLocation } from "@/api/groups/groups";
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

// 백그라운드 태스크 정의
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("백그라운드 위치 업데이트 오류:", error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: LocationObject[] };
    const location = locations[0];

    if (location) {
      try {
        const groupId =
          useLocationSharingStore.getState().currentSharingGroup?.id;
        const userId = useLocationSharingStore.getState().currentSharingUserId;
        if (groupId && userId) {
          const locationObj = {
            group_id: groupId,
            user_id: userId,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            is_sharing: true,
          };
          console.log(
            `백그라운드 ~~~ ! locationObj >>>>>>>>>>>>>>>>> `,
            locationObj
          );

          await upsertGroupMemberLocation(locationObj);
        }
      } catch (updateError) {
        console.error("백그라운드 위치 업데이트 실패:", updateError);
      }
    }
  }
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <QueryClientProvider client={queryClient}>
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
                contentStyle: {
                  paddingBottom: insets.bottom,
                  backgroundColor: "#181A20",
                },
              }}
            />
          </Stack>
        </BottomSheetModalProvider>
        {/* <StatusBar style="light" /> */}
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
