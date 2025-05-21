import React, { useRef, useState } from "react";
import { View, TextInput, Keyboard } from "react-native";

const CODE_LENGTH = 6;

type InviteCodeInputProps = {
  onCodeFilled?: (code: string) => void;
  className?: string;
};

export default function InviteCodeInput({
  onCodeFilled,
  className,
}: InviteCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(-1);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1).toUpperCase();
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    console.log("newCode", newCode);

    if (newCode.length === CODE_LENGTH && !newCode.includes("")) {
      onCodeFilled?.(newCode.join(""));
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
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
            value={code[idx]}
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
