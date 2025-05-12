import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Pressable } from "react-native-gesture-handler";

type FormFieldProps = {
  className: string;
  label: string;
  placeholder: string;
  icon?: any; // require(...) 이미지
  error: string;
  readOnly?: boolean;
  value: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
};

export default function FormField({
  className,
  label,
  placeholder,
  icon,
  error,
  readOnly,
  value,
  onChangeText,
  onPress,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused ? "#0075FF" : "#252932";

  return (
    <View className={className}>
      <Text className="text-[14px] text-[#92A3B2] leading-[22px] tracking-[-0.5px]">
        {label}
      </Text>
      <Pressable onPress={onPress ?? undefined}>
        <View
          className="flex-row h-[60px] items-center rounded-[16px] mt-[5px]"
          style={{
            backgroundColor: isFocused ? "#192436" : "#252932",
            borderWidth: 1,
            borderColor: borderColor,
          }}
          pointerEvents={onPress ? "none" : undefined}
        >
          <Image
            source={icon}
            className="w-[24px] h-[24px] ms-[20px]"
            resizeMode="contain"
          />

          <TextInput
            readOnly={readOnly}
            className="ms-[10px] me-[10px] text-white flex-1"
            placeholder={placeholder}
            value={value}
            placeholderTextColor={"#777C89"}
            cursorColor={"#ffffff"}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </Pressable>
    </View>
  );
}
