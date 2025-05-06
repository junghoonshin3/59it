// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  // 문자열 저장
  setString: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },

  getString: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },

  // 불린 저장 및 가져오기
  setBoolean: async (key: string, value: boolean) => {
    await AsyncStorage.setItem(key, value ? "true" : "false");
  },

  getBoolean: async (key: string): Promise<boolean> => {
    const val = await AsyncStorage.getItem(key);
    return val === "true";
  },

  // 객체 저장
  setObject: async <T>(key: string, value: T) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    const json = await AsyncStorage.getItem(key);
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  },

  // 삭제
  remove: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};
