// utils/storage.ts
import * as SecureStore from "expo-secure-store";

export const storage = {
  // 문자열 저장 및 가져오기
  setString: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },

  getString: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },

  // 불린 저장 및 가져오기
  setBoolean: async (key: string, value: boolean) => {
    await SecureStore.setItemAsync(key, value ? "true" : "false");
  },

  getBoolean: async (key: string): Promise<boolean> => {
    const val = await SecureStore.getItemAsync(key);
    return val === "true";
  },

  // 객체 저장 및 가져오기 (JSON 문자열로 변환)
  setObject: async <T>(key: string, value: T) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    const json = await SecureStore.getItemAsync(key);
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  },

  // 삭제
  remove: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
