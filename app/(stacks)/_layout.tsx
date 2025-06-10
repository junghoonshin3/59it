import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StackLayout = () => {
  const insets = useSafeAreaInsets();
  return (
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
  );
};

export default StackLayout;
