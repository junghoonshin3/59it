import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { LocaleConfig } from "react-native-calendars";
import dayjs from "dayjs";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/CustomDrawerContent";

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
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "#181A20",
      }}
    >
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerItemStyle: { display: "none" },
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="(stacks)"
          options={{
            drawerItemStyle: { display: "flex" },
            drawerLabelStyle: { color: "#ffffff" },
            drawerLabel: "지도",
          }}
        />
        <Drawer.Screen
          name="profile/index"
          options={{
            drawerItemStyle: { display: "flex" },
            drawerLabelStyle: { color: "#ffffff" },
            drawerLabel: "내 정보",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
