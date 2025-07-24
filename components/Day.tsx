import React from "react";
import { Text, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { DateData, DayState } from "react-native-calendars/src/types";

interface DayProps {
  date: (string & DateData) | undefined;
  state: DayState | undefined;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onClose: () => void;
}

export default function Day({
  date,
  state,
  selectedDate,
  onSelectDate,
  onClose,
}: DayProps) {
  const isSelected = selectedDate === date!!.dateString;
  const dayOfWeek = new Date(date!!.dateString).getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isToday = date!!.dateString === dayjs().format("YYYY-MM-DD");

  const textColor = isSelected
    ? "#FFFFFF"
    : isSunday
    ? "#FF4D4D"
    : isSaturday
    ? "#4D79FF"
    : isToday
    ? "#00C2FF"
    : "#FFFFFF";

  const backgroundColor = isSelected
    ? "#0075FF"
    : isToday
    ? "#1F2B3A"
    : "transparent";

  return (
    <TouchableOpacity
      onPress={() => {
        onSelectDate(date!!.dateString);
        onClose();
      }}
      disabled={state === "disabled"}
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        borderRadius: 20,
        padding: 10,
        aspectRatio: 1,
      }}
    >
      <Text
        style={{
          color: textColor,
          textAlign: "center",
        }}
      >
        {date!!.day}
      </Text>
    </TouchableOpacity>
  );
}
