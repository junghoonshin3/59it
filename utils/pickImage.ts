// utils/pickImage.ts
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export type GalleyImage = {
  base64: string;
  name: string;
};

export const pickImage = async () => {
  try {
    // 권한 확인
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "갤러리에 접근하려면 권한이 필요합니다.", [
        { text: "취소", style: "cancel" },
        { text: "설정으로 이동", onPress: () => Linking.openSettings() },
      ]);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: true,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
  } catch (e) {
    console.error("이미지 선택 에러:", e);
    Alert.alert("오류", "이미지를 선택하는 중 오류가 발생했습니다.");
  }
};
