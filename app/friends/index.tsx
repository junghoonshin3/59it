import { View, Text, Image, Keyboard } from "react-native";
import React, { forwardRef, useRef, useState } from "react";
import Topbar from "@/components/topbar";
import { useRouter } from "expo-router";
import FormField from "@/components/formfield";
import { usePlaceStore } from "@/store/usePlaceStore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import PlaceItem from "@/components/PlaceItem";
import SearchBar from "@/components/searchBar";

export default function Firends() {
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
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSearch = async () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.expand(); // 바텀시트 열기
  };

  const onSearch = async () => {
    await searchPlaces();
  };

  const onEndReached = async () => {
    if (loading) return;
    await searchPlaces(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ width: "100%", height: "100%", paddingHorizontal: 32 }}>
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
          label="모일일자"
          placeholder="모임일자 선택하세요."
          icon={require("../../assets/images/search_places.png")}
          readOnly={true}
          error=""
          value={""}
          // onPress={handleSearch}
        />
        <BottomSheet
          backgroundStyle={{
            flex: 1,
            backgroundColor: "#181A20",
            borderTopEndRadius: 32,
            borderTopStartRadius: 32,
          }}
          handleIndicatorStyle={{
            marginTop: 10,
            width: 50,
            height: 5,
            backgroundColor: "#626877",
          }}
          ref={bottomSheetRef}
          snapPoints={["100%"]}
          enablePanDownToClose={true}
          index={-1}
        >
          <BottomSheetView className="ps-[32px] pe-[32px] flex-1">
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
                    bottomSheetRef.current?.close();
                  }}
                />
              )}
              ItemSeparatorComponent={() => (
                <View className="w-full h-[1px] bg-white"></View>
              )}
              onEndReached={onEndReached}
            />
          </BottomSheetView>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
}
