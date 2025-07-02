import { View, Keyboard, Text, TouchableOpacity } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import FormField from "@/components/formfield";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import PlaceItem from "@/components/PlaceItem";
import SearchBar from "@/components/SearchBar";
import ConfirmButton from "@/components/confirmbutton";
import { CalendarList } from "react-native-calendars";
import DatePicker from "react-native-date-picker";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { Place } from "@/types/types";
import { fetchPlaceSuggestions } from "@/api/googlePlaces";
import CustomBottomSheet from "@/components/CustomBottomSheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { GroupRequest } from "@/api/groups/types";
import { useUserProfile } from "@/api/auth/hooks/useAuth";
import { useCreateGroupStore } from "@/store/groups/useGroupStore";
import { useCreateMyGroup } from "@/api/groups/hooks/useGroups";
import { pickImage } from "@/utils/pickImage";
import { ImagePickerAsset } from "expo-image-picker";

export default function CreateGroup() {
  const router = useRouter();
  const placeRef = useRef<BottomSheetMethods>(null);
  const calendarRef = useRef<BottomSheetMethods>(null);
  const timeRef = useRef<BottomSheetMethods>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [searchPlaces, setSearchPlaces] = useState<Place[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: user } = useUserProfile();
  const creatMyGroupMutation = useCreateMyGroup();
  const {
    groupNm,
    selectedPlace,
    selectedDateTime,
    setGroupNm,
    setSelectedPlace,
    setSelectedDate,
    setSelectedTime,
    clearAll,
  } = useCreateGroupStore();
  const [imageAsset, setImageAsset] = useState<ImagePickerAsset | undefined>();

  const handlePickedImage = async () => {
    const image = await pickImage();
    if (!image || !image?.base64 || !image?.fileName) return;
    setImageAsset(image);
  };

  const handleSearch = () => {
    placeRef.current?.expand();
  };

  const handleCalendar = () => {
    calendarRef.current?.expand();
  };

  const handleTime = () => {
    timeRef.current?.expand();
  };

  // onSearch 함수
  const onSearch = async (
    nextPageToken: string | null,
    isNewSearch = false
  ) => {
    const res = await fetchPlaceSuggestions(
      {
        textQuery: searchText,
        languageCode: "ko",
        regionCode: "kr",
        pageToken: nextPageToken ?? undefined,
      },
      {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY!,
        contentType: "application/json",
        fieldMask:
          "places.displayName,places.formattedAddress,places.location,nextPageToken",
      }
    );
    const newPlaces = res.data.places || [];
    const nextToken = res.data.nextPageToken ?? null;

    setSearchPlaces((prev) =>
      isNewSearch ? newPlaces : [...prev, ...newPlaces]
    );
    setNextPageToken(nextToken);
    Keyboard.dismiss();
  };

  // validation 로직 추가
  const isValid = useMemo(() => {
    return groupNm.trim() !== "" && selectedPlace !== null;
  }, [groupNm, selectedPlace]);

  const onEndReached = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await onSearch(nextPageToken, false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSelectTime = (date: Date) => {
    const time = dayjs(date);
    setSelectedTime(time);
  };

  const handleCreateGroup = async () => {
    if (!isValid) return;
    const groupReq: GroupRequest = {
      name: groupNm,
      host_id: user?.id ?? "",
      display_name: selectedPlace?.displayName.text ?? "",
      address: selectedPlace?.formattedAddress ?? "",
      longitude: selectedPlace?.location.longitude ?? 0,
      latitude: selectedPlace?.location.latitude ?? 0,
      meeting_date: selectedDateTime.format("YYYY-MM-DD"),
      meeting_time: selectedDateTime.format("hh:mm:ss"),
      image_base64: imageAsset?.base64 ?? undefined,
      image_filename: imageAsset?.fileName ?? undefined,
    };

    const group = await creatMyGroupMutation.mutateAsync(groupReq);

    router.dismissTo({
      pathname: "/groups/create/code",
      params: {
        inviteCode: group.invite_code,
        groupName: group.name,
      },
    });
    clearAll();
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
          image={require("@/assets/images/back_button.png")}
        />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

          <FormField
            className="mt-[20px]"
            label="모임사진(선택)"
            placeholder="모임을 대표하는 사진을 설정해보세요."
            icon={require("@/assets/images/group_image.png")}
            readOnly={true}
            error=""
            value={imageAsset?.fileName ?? ""}
            onPress={handlePickedImage}
          />
        </ScrollView>
        <ConfirmButton
          className={`bg-[#0075FF] h-[60px] rounded-[16px] items-center justify-center mt-[10px] mb-[10px] ${
            !isValid ? "opacity-50" : ""
          }`}
          title="생성하기"
          disabled={creatMyGroupMutation.isPending || !isValid}
          loading={creatMyGroupMutation.isPending}
          indicatorColor="#ffffff"
          onPress={handleCreateGroup}
        />

        <CustomBottomSheet
          index={-1}
          ref={placeRef}
          snapPoints={["100%"]}
          enablePanDownToClose
          enableContentPanningGesture={false}
          backgroundStyle={{ backgroundColor: "#181A20" }}
        >
          <BottomSheetView className="w-full h-full">
            <SearchBar
              className="w-full h-[80px] px-[10px]"
              placeholder="모임장소를 검색해주세요."
              value={searchText}
              icon={require("@/assets/images/search_places.png")}
              onChangeText={(text) => setSearchText(text)}
              onSearch={() => {
                setSearchPlaces([]);
                setNextPageToken(null);
                onSearch(null, true); // 새 검색 시작
                Keyboard.dismiss();
              }}
            />
            <FlatList
              className="flex-1"
              scrollEnabled
              keyExtractor={(item, index) => index.toString()}
              contentContainerClassName={"px-[10px]"}
              data={searchPlaces}
              renderItem={({ item }) => (
                <PlaceItem
                  place={item}
                  onPress={() => {
                    setSelectedPlace(item);
                    placeRef.current?.close();
                  }}
                />
              )}
              onEndReachedThreshold={0.7}
              onEndReached={onEndReached}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center mt-[40px]">
                  <Text className="text-gray-400 text-sm">
                    검색 결과가 없습니다.
                  </Text>
                </View>
              }
              ListFooterComponent={
                isLoadingMore ? (
                  <View className="py-[20px] items-center">
                    <Text className="text-white">불러오는 중...</Text>
                  </View>
                ) : null
              }
            />
          </BottomSheetView>
        </CustomBottomSheet>

        {/* 달력 바텀시트 */}
        <CustomBottomSheet
          ref={calendarRef}
          index={-1}
          enableDynamicSizing
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
        >
          <BottomSheetView>
            <CalendarList
              horizontal
              pagingEnabled
              monthFormat="yyyy년 MM월"
              theme={{
                calendarBackground: "#181A20",
                monthTextColor: "#ffffff",
                textDayFontFamily: "NotoSansKR-Regular",
                textMonthFontFamily: "NotoSansKR-Bold",
              }}
              dayComponent={({ date, state }) => {
                if (!date) return;
                const todayStr = dayjs().format("YYYY-MM-DD");
                const isToday = date.dateString === todayStr;
                const isSelected =
                  selectedDateTime.format("YYYY-MM-DD") === date?.dateString;
                const dayOfWeek = dayjs(date?.dateString).day(); // 0: 일, 6: 토

                const getTextColor = () => {
                  if (isSelected) return "#ffffff";
                  if (isToday) return "#00C2FF"; // 오늘이면 청록색
                  if (dayOfWeek === 0) return "#FF4D4F"; // 일요일
                  if (dayOfWeek === 6) return "#4D8DFF"; // 토요일
                  return "#ffffff"; // 기본
                };

                return (
                  <TouchableOpacity
                    onPress={() => {
                      const selectedDate = dayjs(date.dateString, "YYYY-MM-DD");
                      setSelectedDate(selectedDate);
                    }}
                    activeOpacity={0.7}
                    style={{
                      aspectRatio: 1,
                      backgroundColor: isSelected ? "#0075FF" : "transparent",
                      borderRadius: 999,
                      padding: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: getTextColor(),
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {date.day}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </BottomSheetView>
        </CustomBottomSheet>

        {/* 시간 바텀시트 */}
        <CustomBottomSheet
          ref={timeRef}
          index={-1}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
        >
          <BottomSheetView className="justify-center items-center">
            <DatePicker
              style={{ flex: 1 }}
              dividerColor="#FFFFFF"
              theme="dark"
              date={selectedDateTime.toDate()}
              mode="time"
              onDateChange={handleSelectTime}
            />
          </BottomSheetView>
        </CustomBottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
}
