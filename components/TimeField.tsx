import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TextInput as RNTextInput,
} from "react-native";

type TimeInputFieldProps = {
  className?: string;
  label: string;
  initalHour: string;
  initalMinute: string;
  error?: string;
  onChangeHour?: (hour: string) => void;
  onChangeMinute?: (minute: string) => void;
  onChangeAmPm?: (ampm: "AM" | "PM") => void;
};

export default function TimeInputField({
  className = "",
  label,
  initalHour,
  initalMinute,
  error,
  onChangeHour,
  onChangeMinute,
  onChangeAmPm,
}: TimeInputFieldProps) {
  const [hour, setHour] = useState(initalHour);
  const [minute, setMinute] = useState(initalMinute);
  const [ampm, setAmPm] = useState<"AM" | "PM">("AM");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const hourRef = useRef<TextInput | null>(null);
  const minuteRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      hourRef.current?.blur();
      minuteRef.current?.blur();
    });

    return () => {
      keyboardHideListener.remove();
    };
  }, []);

  const validateTime = (h: string, m: string) => {
    const hourNum = parseInt(h, 10);
    const minuteNum = parseInt(m, 10);
    if (
      isNaN(hourNum) ||
      hourNum < 1 ||
      hourNum > 12 ||
      isNaN(minuteNum) ||
      minuteNum < 0 ||
      minuteNum > 59
    ) {
      return "시간을 올바르게 입력해주세요.";
    }
    return null;
  };

  const handleHourChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, "");
    setHour(val);
    onChangeHour?.(val);
  };

  const handleMinuteChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, "");
    setMinute(val);
    onChangeMinute?.(val);
  };

  const handleBlur = () => {
    const errorMessage = validateTime(hour, minute);
    setInputError(errorMessage);
    setIsFocused(false);
  };

  const toggleAmPm = (value: "AM" | "PM") => {
    setAmPm(value);
    onChangeAmPm?.(value);
  };

  const borderColor = isFocused ? "#0075FF" : "#252932";

  return (
    <View className={className}>
      <Text className="text-[14px] text-[#92A3B2] leading-[22px] tracking-[-0.5px]">
        {label}
      </Text>

      <View
        className="flex-row items-center rounded-[16px] mt-[5px] px-[20px] h-[60px]"
        style={{
          backgroundColor: isFocused ? "#192436" : "#252932",
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        <BottomSheetTextInput
          ref={hourRef}
          keyboardType="numeric"
          className="w-[45px] text-white text-[16px] text-center"
          placeholder="hh"
          maxLength={2}
          value={hour}
          onChangeText={handleHourChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor="#777C89"
        />

        <Text className="text-white mx-[4px]">:</Text>

        <BottomSheetTextInput
          ref={minuteRef}
          keyboardType="numeric"
          className="w-[45px] text-white text-[16px] text-center"
          placeholder="mm"
          maxLength={2}
          value={minute}
          onChangeText={handleMinuteChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor="#777C89"
        />

        <View className="flex-row ml-auto gap-[4px]">
          <TouchableOpacity
            onPress={() => toggleAmPm("AM")}
            className={`px-[10px] py-[5px] rounded-[8px] ${
              ampm === "AM" ? "bg-[#0075FF]" : "bg-[#3A3F4B]"
            }`}
          >
            <Text className="text-white text-[14px] font-semibold">AM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleAmPm("PM")}
            className={`px-[10px] py-[5px] rounded-[8px] ${
              ampm === "PM" ? "bg-[#0075FF]" : "bg-[#3A3F4B]"
            }`}
          >
            <Text className="text-white text-[14px] font-semibold">PM</Text>
          </TouchableOpacity>
        </View>
      </View>

      {(inputError || error) && (
        <Text className="text-red-500 text-[12px] mt-[4px]">
          {inputError || error}
        </Text>
      )}
    </View>
  );
}
