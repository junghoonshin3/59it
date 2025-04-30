import { View, Text, TextInput, Image } from "react-native";
import React from "react";

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
  return (
    <View className={className}>
      <Text className="text-[14px] text-[#92A3B2] leading-[22px] tracking-[-0.5px]">
        {label}
      </Text>
      <View className="flex-row w-full h-[60px] bg-[#252932] items-center rounded-[16px] mt-[5px]">
        <Image
          source={icon}
          className="w-[24px] h-[24px] ms-[20px]"
          resizeMode="contain"
        />
        <TextInput
          readOnly={readOnly}
          className="ms-[5px]"
          placeholder={placeholder}
          value={value}
          placeholderTextColor={"#777C89"}
          cursorColor={"#ffffff"}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}
