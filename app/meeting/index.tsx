import { View, Keyboard } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import FormField from "@/components/formfield";
import { Place, usePlaceStore } from "@/store/usePlaceStore";
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
import "dayjs/locale/ko";
import Day from "@/components/Day";
import { useAuthStore } from "@/store/useAuthStore";
import { createGroup } from "@/services/supabase/supabaseService";
import { GroupRequest } from "@/types/types";

export default function Meeting() {
  const router = useRouter();
  const {
    searchPlaces,
    places,
    loading,
    searchQuery,
    setSearchQuery,
    // selectedPlace,
    // setSelectedPlace,
  } = usePlaceStore();
  const { user } = useAuthStore();
  const [groupNm, setGroupNm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const placeBottomSheetRef = useRef<BottomSheet>(null);
  const calendarBottomSheetRef = useRef<BottomSheet>(null);
  const timeBottomSheetRef = useRef<BottomSheet>(null);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

  const selectedDateTimeDate = useMemo(
    () => selectedDateTime,
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
  const handleCreateGroup = async () => {
    let req: GroupRequest = {
      host_id: user?.id ?? "",
      name: groupNm,
      address: selectedPlace?.formattedAddress ?? "",
      display_name: selectedPlace?.displayName?.text ?? "",
      latitude: selectedPlace?.location.latitude ?? 0,
      longitude: selectedPlace?.location.longitude ?? 0,
      meeting_date: selectedDateTime.format("YYYY-MM-DD"),
      meeting_time: selectedDateTime.format("HH:mm:00"),
    };

    const data = await createGroup(req);

    if (data) {
      router.push(
        `/invite/InviteCode?invite_code=${data.invite_code}&group_id=${data.id}`
      );
    }
  };

  const isValid =
    groupNm.trim() !== "" &&
    selectedPlace !== null &&
    selectedDateTime.isValid();

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
          error="모임명을 입력해주세요."
          value={groupNm}
          onChangeText={setGroupNm}
        />

        <FormField
          className="mt-[20px]"
          label="모임장소"
          placeholder="모임장소를 검색하세요."
          icon={require("../../assets/images/search_places.png")}
          readOnly={true}
          error="모임장소를 선택해주세요."
          value={`${selectedPlace?.displayName?.text ?? ""}`}
          onPress={handleSearch}
        />

        <FormField
          className="mt-[20px]"
          label="모임날짜"
          placeholder="모임날짜를 선택하세요."
          icon={require("../../assets/images/month_calendar.png")}
          readOnly={true}
          error="모임날짜를 선택해주세요."
          value={selectedDateTime.format("YYYY-MM-DD")}
          onPress={handleCalendar}
        />

        <FormField
          className="mt-[20px]"
          label="모임시간"
          placeholder="모임시간을 선택하세요."
          icon={require("../../assets/images/access_time.png")}
          readOnly={true}
          error="모임시간을 선택해주세요."
          value={selectedDateTime.format("A hh:mm")}
          onPress={handleTime}
        />

        <View className="flex-1" />
        <ConfirmButton
          className={`bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px] ${
            !isValid ? "opacity-50" : ""
          }`}
          title="생성하기"
          onPress={handleCreateGroup}
          disabled={!isValid}
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
            value={searchQuery}
            icon={require("../../assets/images/search_places.png")}
            onChangeText={setSearchQuery}
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
            dayComponent={({ date, state }) => (
              <Day
                date={date}
                state={state}
                selectedDate={selectedDateTime.format("YYYY-MM-DD")}
                onSelectDate={handleSelectDate}
                onClose={() => calendarBottomSheetRef.current?.close()}
              />
            )}
            monthFormat="yyyy년 MM월"
            pastScrollRange={0}
            futureScrollRange={12}
            current={dayjs().format("YYYY-MM-DD")}
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
            date={selectedDateTimeDate.toDate()}
            mode="time"
            onDateChange={handleSelectTime}
          />
        </CustomBottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
}
