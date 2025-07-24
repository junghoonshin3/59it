import React, { useRef, useState } from "react";
import { View, TextInput, Keyboard } from "react-native";

const CODE_LENGTH = 6;

type InviteCodeInputProps = {
  value: string[]; // 외부에서 전달
  onChange: (code: string[]) => void; // 외부에 변경 알림
  className?: string;
};

export default function InviteCodeInput({
  value,
  onChange,
  className,
}: InviteCodeInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(-1);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...value];
    newCode[index] = text.slice(-1).toUpperCase();
    onChange(newCode); // 외부로 코드 변경 알림

    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.length === CODE_LENGTH && !newCode.includes("")) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className={className}>
      {Array.from({ length: CODE_LENGTH }).map((_, idx) => {
        const isFocused = focusedIndex === idx;
        return (
          <TextInput
            key={idx}
            cursorColor={"#FFFFFF"}
            ref={(el) => (inputs.current[idx] = el)}
            value={value[idx]}
            onChangeText={(text) => handleChange(text, idx)}
            onFocus={() => setFocusedIndex(idx)}
            onBlur={() => setFocusedIndex(null)}
            onKeyPress={(e) => handleKeyPress(e, idx)}
            maxLength={1}
            multiline={false}
            autoCapitalize="characters"
            keyboardType="default"
            textAlign="center"
            className={`w-[50px] h-[50px] rounded-lg text-white text-lg
              ${
                isFocused
                  ? "border-[#0075FF] bg-[#0075FF10]"
                  : "border-[#3E435A] bg-[#1F222A]"
              }
              border`}
          />
        );
      })}
    </View>
  );
}
