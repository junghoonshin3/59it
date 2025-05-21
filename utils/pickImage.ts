// utils/pickImage.ts
import * as ImagePicker from "expo-image-picker";

export type PickedImage = {
  base64: string;
  name: string;
};

export const pickImage = async (): Promise<PickedImage | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    base64: true,
  });

  if (result.canceled || !result.assets || !result.assets[0].base64) {
    return null;
  }

  const file = result.assets[0];

  return {
    base64: file.base64!,
    name: file.fileName || "이름없음",
  };
};
