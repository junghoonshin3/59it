import { View, Keyboard, Text, StyleSheet } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import FormField from "@/components/formfield";
import {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import PlaceItem from "@/components/PlaceItem";
import SearchBar from "@/components/searchBar";
import ConfirmButton from "@/components/confirmbutton";
import { CalendarList } from "react-native-calendars";
import DatePicker from "react-native-date-picker";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Day from "@/components/Day";
import { useAuthStore } from "@/store/useAuthStore";
import { createGroup } from "@/services/supabase/supabaseService";
import { GroupRequest, Place } from "@/types/types";
import { fetchPlaceSuggestions } from "@/api/googlePlaces";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateGroup() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [groupNm, setGroupNm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const placeModalRef = useRef<BottomSheetModal>(null);
  const calendarModalRef = useRef<BottomSheetModal>(null);
  const timeModalRef = useRef<BottomSheetModal>(null);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [searchText, setSearchText] = useState<string>("");
  const [searchPlaces, setSearchPlaces] = useState<Place[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const selectedDateTimeDate = useMemo(
    () => selectedDateTime,
    [selectedDateTime]
  );

  const handleSearch = () => {
    placeModalRef.current?.present();
  };

  const handleCalendar = () => {
    calendarModalRef.current?.present();
  };

  const handleTime = () => {
    timeModalRef.current?.present();
  };

  const onSearch = async (nextPageToken: string | null) => {
    const res = await fetchPlaceSuggestions(
      {
        textQuery: searchText,
        languageCode: "ko",
        regionCode: "kr",
        pageToken: nextPageToken ?? undefined,
      },
      {
        apiKey: `${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`,
        contentType: "application/json",
        fieldMask:
          "places.displayName,places.formattedAddress,places.location,nextPageToken",
      }
    );
    const newPlaces = res.data.places || [];
    const nextToken = res.data.nextPageToken ?? null;
    console.log("res.data", res.data);
    setSearchPlaces((prev) => [...prev, ...newPlaces]);
    setNextPageToken(nextToken);
    Keyboard.dismiss();
  };

  const onEndReached = async () => {
    if (!nextPageToken) {
      console.log("nextPageToken", nextPageToken);
      return;
    }
    await onSearch(nextPageToken);
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
        `/groups/create/code?invite_code=${data.invite_code}&group_id=${data.id}`
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
          image={require("@/assets/images/back_button.png")}
        />
        <FormField
          className="mt-[20px]"
          label="모임명"
          placeholder="모임명을 입력하세요."
          icon={require("@/assets/images/groups_create.png")}
          readOnly={false}
          error="모임명을 입력해주세요."
          value={groupNm}
          onChangeText={setGroupNm}
        />

        <FormField
          className="mt-[20px]"
          label="모임장소"
          placeholder="모임장소를 검색하세요."
          icon={require("@/assets/images/search_places.png")}
          readOnly={true}
          error="모임장소를 선택해주세요."
          value={`${selectedPlace?.displayName?.text ?? ""}`}
          onPress={handleSearch}
        />

        <FormField
          className="mt-[20px]"
          label="모임날짜"
          placeholder="모임날짜를 선택하세요."
          icon={require("@/assets/images/month_calendar.png")}
          readOnly={true}
          error="모임날짜를 선택해주세요."
          value={selectedDateTime.format("YYYY-MM-DD")}
          onPress={handleCalendar}
        />

        <FormField
          className="mt-[20px]"
          label="모임시간"
          placeholder="모임시간을 선택하세요."
          icon={require("@/assets/images/access_time.png")}
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
        <BottomSheetModal
          ref={placeModalRef}
          snapPoints={["100%"]}
          style={{
            marginTop: insets.top,
          }}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: "#1C1C1E" }}
          handleIndicatorStyle={style.handleIndicatorStyle}
        >
          <BottomSheetView className="px-[32px] w-full h-full">
            <SearchBar
              className="w-full h-[80px]"
              placeholder="모임장소를 검색해주세요."
              value={searchText}
              icon={require("@/assets/images/search_places.png")}
              onChangeText={(text) => {
                setSearchText(text);
              }}
              onSearch={() => {
                onSearch(nextPageToken);
              }}
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pt-[10px] pb-[10px]"
              data={searchPlaces}
              renderItem={({ item }) => (
                <PlaceItem
                  place={item}
                  onPress={() => {
                    setSelectedPlace(item);
                    placeModalRef.current?.dismiss();
                  }}
                />
              )}
              ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-[16px] font-semibold">
                    검색한 장소가 없습니다.
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => (
                <View className="w-full h-[1px] bg-white" />
              )}
              onEndReached={onEndReached}
            />
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={calendarModalRef}
          snapPoints={["100%"]}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          backgroundStyle={{ backgroundColor: "#1C1C1E" }}
          handleIndicatorStyle={style.handleIndicatorStyle}
        >
          <BottomSheetView className="w-full h-full">
            <CalendarList
              dayComponent={({ date, state }) => (
                <Day
                  date={date}
                  state={state}
                  selectedDate={selectedDateTime.format("YYYY-MM-DD")}
                  onSelectDate={handleSelectDate}
                  onClose={() => calendarModalRef.current?.dismiss()}
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
          </BottomSheetView>
        </BottomSheetModal>
        <BottomSheetModal
          handleIndicatorStyle={style.handleIndicatorStyle}
          ref={timeModalRef}
          enableDynamicSizing
          enablePanDownToClose={true}
          backgroundStyle={{ backgroundColor: "#1C1C1E" }}
        >
          <BottomSheetView className="flex-1 justify-center items-center">
            <DatePicker
              style={{ flex: 1 }}
              dividerColor="#FFFFFF"
              theme="dark"
              date={selectedDateTimeDate.toDate()}
              mode="time"
              onDateChange={handleSelectTime}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const style = StyleSheet.create({
  handleIndicatorStyle: {
    marginTop: 10,
    width: 50,
    height: 5,
    backgroundColor: "#626877",
  },
});
