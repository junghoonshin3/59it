import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { LocaleConfig } from "react-native-calendars";
import dayjs from "dayjs";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
