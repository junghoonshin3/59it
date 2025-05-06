import { View, Text, TextInput, Image } from "react-native";
import React, { useState } from "react";

type FormFieldProps = {
  className: string;
  label: string;
  placeholder: string;
  icon?: any; // require(...) 이미지
  error: string;
  readOnly?: boolean;
  value: string;
  onChangeText: (text: string) => void;
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
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused ? "#0075FF" : "#252932";

  return (
    <View className={className}>
      <Text className="text-[14px] text-[#92A3B2] leading-[22px] tracking-[-0.5px]">
        {label}
      </Text>
      <View
        className="flex-row h-[60px] items-center rounded-[16px] mt-[5px]"
        style={{
          backgroundColor: isFocused ? "#192436" : "#252932",
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        <Image
          source={icon}
          className="w-[24px] h-[24px] ms-[20px]"
          resizeMode="contain"
        />
        <TextInput
          readOnly={readOnly}
          className="ms-[5px] me-[10px] text-white flex-1"
          placeholder={placeholder}
          value={value}
          placeholderTextColor={"#777C89"}
          cursorColor={"#ffffff"}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
}
