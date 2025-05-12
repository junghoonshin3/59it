import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

type SearchBarProps = {
  className?: string;
  placeholder: string;
  icon?: any; // require(...) 이미지
  error?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
};

export default function SearchBar({
  className = "",
  placeholder,
  icon,
  error = "",
  value,
  onChangeText,
  onSearch,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused ? "#0075FF" : "#252932";

  return (
    <View className={className}>
      <View
        className="flex-row h-[60px] items-center rounded-[16px] mt-[5px] pe-[20px]"
        style={{
          backgroundColor: isFocused ? "#192436" : "#252932",
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        <TextInput
          className="ms-[20px] me-[10px] text-white flex-1"
          placeholder={placeholder}
          value={value}
          placeholderTextColor={"#777C89"}
          cursorColor={"#ffffff"}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={onSearch}>
          <Image
            source={icon}
            className="w-[24px] h-[24px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {!!error && (
        <Text className="text-red-500 text-[12px] mt-[4px]">{error}</Text>
      )}
    </View>
  );
}
