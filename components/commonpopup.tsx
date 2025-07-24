import React from "react";
import { Modal, View, Text, Pressable } from "react-native";

export type CommonModalProps = {
  visible: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function CommonModal({
  visible,
  title,
  description = "",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: CommonModalProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-[80%] bg-[#1F222A] rounded-2xl p-6 items-center">
          <Text className="text-white text-lg font-semibold mb-3">{title}</Text>
          <Text className="text-gray-300 text-sm text-center mb-6">
            {description}
          </Text>
          <View className="flex-row justify-end w-full">
            {onCancel && (
              <Pressable
                className="bg-gray-600 rounded-xl px-4 py-2 mr-2"
                onPress={onCancel}
              >
                <Text className="text-white font-medium">{cancelText}</Text>
              </Pressable>
            )}
            {onConfirm && (
              <Pressable
                className="bg-[#0075FF] rounded-xl px-4 py-2"
                onPress={onConfirm}
              >
                <Text className="text-white font-medium">{confirmText}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
