import { View, Keyboard, Text, TouchableOpacity } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import FormField from "@/components/formfield";
import { usePlaceStore } from "@/store/usePlaceStore";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import PlaceItem from "@/components/PlaceItem";
import SearchBar from "@/components/searchBar";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import ConfirmButton from "@/components/confirmbutton";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import DatePicker from "react-native-date-picker";
import dayjs from "dayjs";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";
dayjs.locale("ko");

export default function Friends() {
  const router = useRouter();
  const [groupNm, setGroupNm] = useState("");
  const {
    searchPlaces,
    setQuery,
    query,
    places,
    loading,
    selectedPlace,
    setSelectedPlace,
  } = usePlaceStore();

  const placeBottomSheetRef = useRef<BottomSheet>(null);
  const calendarBottomSheetRef = useRef<BottomSheet>(null);
  const timeBottomSheetRef = useRef<BottomSheet>(null);

  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

  const selectedDateTimeDate = useMemo(
    () => selectedDateTime.toDate(),
    [selectedDateTime]
  );

  const handleSearch = () => {
    Keyboard.dismiss();
    placeBottomSheetRef.current?.expand();
  };

  const handleCalendar = () => {
    Keyboard.dismiss();
    calendarBottomSheetRef.current?.expand();
  };

  const handleTime = () => {
    Keyboard.dismiss();
    timeBottomSheetRef.current?.expand();
  };

  const onSearch = async () => {
    await searchPlaces();
  };

  const onEndReached = async () => {
    if (loading) return;
    await searchPlaces(true);
  };

  const handleSelectDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    setSelectedDateTime((prev) =>
      prev
        .set("year", year)
        .set("month", month - 1)
        .set("date", day)
    );
  };

  const handleSelectTime = (date: Date) => {
    const time = dayjs(date);
    setSelectedDateTime((prev) =>
      prev.set("hour", time.hour()).set("minute", time.minute())
    );
  };

  const DayComponent = ({ date, state }: any) => {
    const isSelected =
      selectedDateTime.format("YYYY-MM-DD") === date.dateString;
    const dayOfWeek = new Date(date.dateString).getDay();
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;
    const isToday = date.dateString === dayjs().format("YYYY-MM-DD");

    const textColor = isSelected
      ? "#FFFFFF"
      : isSunday
      ? "#FF4D4D"
      : isSaturday
      ? "#4D79FF"
      : isToday
      ? "#0075FF"
      : "#FFFFFF";

    return (
      <TouchableOpacity
        onPress={() => {
          handleSelectDate(date.dateString);
          calendarBottomSheetRef.current?.close();
        }}
        disabled={state === "disabled"}
        style={{
          flex: 1,
          backgroundColor: isSelected ? "#0075FF" : "transparent",
          borderRadius: 20,
          padding: 10,
          aspectRatio: 1,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontFamily: "NotoSansKR-Medium",
            textAlign: "center",
          }}
        >
          {date.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback
      className="w-full h-full"
      onPress={Keyboard.dismiss}
    >
      <View className="px-[32px] w-full h-full">
        <Topbar
          title="모임 생성"
          onPress={router.back}
          image={require("../../assets/images/back_button.png")}
        />
        <FormField
          className="mt-[20px]"
          label="모임명"
          placeholder="모임명을 입력하세요."
          icon={require("../../assets/images/groups_create.png")}
          readOnly={false}
          error=""
          value={groupNm}
          onChangeText={setGroupNm}
        />

        <FormField
          className="mt-[20px]"
          label="모임장소"
          placeholder="모임장소를 검색하세요."
          icon={require("../../assets/images/search_places.png")}
          readOnly={true}
          error=""
          value={`${selectedPlace?.displayName?.text ?? ""}`}
          onPress={handleSearch}
        />

        <FormField
          className="mt-[20px]"
          label="모임날짜"
          placeholder="모임날짜를 선택하세요."
          icon={require("../../assets/images/month_calendar.png")}
          readOnly={true}
          error=""
          value={selectedDateTime.format("YYYY-MM-DD")}
          onPress={handleCalendar}
        />

        <FormField
          className="mt-[20px]"
          label="모임시간"
          placeholder="모임시간을 선택하세요."
          icon={require("../../assets/images/access_time.png")}
          readOnly={true}
          error=""
          value={selectedDateTime.format("A HH:mm")}
          onPress={handleTime}
        />

        <View className="flex-1" />
        <ConfirmButton
          className="bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px]"
          title="가입하기"
          onPress={() => router.replace("/maps")}
        />

        {/* 장소 바텀시트 */}
        <CustomBottomSheet
          ref={placeBottomSheetRef}
          snapPoints={["100%"]}
          enablePanDownToClose={true}
          index={-1}
          contentContainerClassName="ps-[32px] pe-[32px] flex-1"
        >
          <SearchBar
            className="w-full h-[80px]"
            placeholder="모임장소를 검색해주세요."
            value={query}
            icon={require("../../assets/images/search_places.png")}
            onChangeText={setQuery}
            onSearch={onSearch}
          />
          <FlatList
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="pt-[20px] pb-[20px]"
            data={places}
            renderItem={({ item }) => (
              <PlaceItem
                place={item}
                onPress={() => {
                  setSelectedPlace(item);
                  placeBottomSheetRef.current?.close();
                }}
              />
            )}
            ItemSeparatorComponent={() => (
              <View className="w-full h-[1px] bg-white"></View>
            )}
            onEndReached={onEndReached}
          />
        </CustomBottomSheet>

        {/* 달력 바텀시트 */}
        <CustomBottomSheet
          ref={calendarBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          contentContainerClassName="flex-1"
        >
          <CalendarList
            dayComponent={DayComponent}
            monthFormat="yyyy년 MM월"
            pastScrollRange={0}
            futureScrollRange={12}
            current={dayjs().format("YYYY-MM-DD")}
            // onDayPress={(day) => {
            //   handleSelectDate(day.dateString);
            //   console.log("onDayPress");
            //   calendarBottomSheetRef.current?.close();
            // }}
            markedDates={{
              [selectedDateTime.format("YYYY-MM-DD")]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "#0075FF",
              },
            }}
            theme={{
              textDayStyle: {
                flex: 1,
              },
              dayTextColor: "#FFFFFF",
              calendarBackground: "#181A20",
              monthTextColor: "#FFFFFF",
              textDayFontFamily: "NotoSansKR-Medium",
              textMonthFontFamily: "NotoSansKR-Medium",
            }}
          />
        </CustomBottomSheet>

        {/* 시간 바텀시트 */}
        <CustomBottomSheet
          ref={timeBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          contentContainerClassName="flex-1 justify-center items-center"
        >
          <DatePicker
            style={{ flex: 1 }}
            dividerColor="#FFFFFF"
            theme="dark"
            date={selectedDateTimeDate}
            mode="time"
            onDateChange={(date) => {
              console.log("onDateChange", date);
              handleSelectTime(date);
            }}
          />
        </CustomBottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
}
