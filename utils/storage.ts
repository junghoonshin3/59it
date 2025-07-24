// utils/storage.ts
import * as SecureStore from "expo-secure-store";

// SecureStore를 위한 커스텀 스토리지 어댑터
export const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name, {
        requireAuthentication: false,
        keychainService: "LocationSharingService",
      });
      return value;
    } catch (error) {
      console.error("SecureStore getItem 오류:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value, {
        requireAuthentication: false,
        keychainService: "LocationSharingService",
      });
    } catch (error) {
      console.error("SecureStore setItem 오류:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name, {
        keychainService: "LocationSharingService",
      });
    } catch (error) {
      console.error("SecureStore removeItem 오류:", error);
    }
  },
};
