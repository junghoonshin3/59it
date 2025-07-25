import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "59it",
  slug: "59it",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "com.anonymous.x59it",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.x59it",
    infoPlist: {
      UIBackgroundModes: ["location"],
      NSLocationAlwaysAndWhenInUseUsageDescription: "이 앱은 백그라운드에서도 위치를 사용합니다.",
      NSLocationWhenInUseUsageDescription: "이 앱은 사용자의 위치를 추적합니다."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.anonymous.x59it",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    },
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_LOCATION"
    ],
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: "pan",
    googleServicesFile: "./google-services.json"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#181A20"
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them with your friends."
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location.",
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true
      }
    ],
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public/"
          ],
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
          kotlinVersion: "2.0.21",
          enableProguardInReleaseBuilds: true,
          extraProguardRules: "-keep class com.kakao.sdk.**.model.* { <fields>; } -keep class * extends com.google.gson.TypeAdapter -dontwarn org.bouncycastle.jsse.** -dontwarn org.conscrypt.* -dontwarn org.openjsse.**"
        },
        ios: {
          deploymentTarget: "15.1"
        }
      }
    ],
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
        kotlinVersion: "1.9.0"
      }
    ],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
      }
    ],
    ["@react-native-google-signin/google-signin"]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "25658808-6397-4f60-bfce-b173c7fa3d6e"
    }
  }
});