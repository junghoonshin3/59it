import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, View } from "react-native";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import MapView, { Region } from "react-native-maps";
import { CustomMarkerView } from "@/components/CustomMarkerView";
import PlaceField from "@/components/PlaceField";
import { UserAvatar } from "@/components/UserAvatar";
import { Group, GroupMember } from "@/types/types";
import ConfirmButton from "./confirmbutton";
import { useAuthStore } from "@/store/useAuthStore";

type Props = {
  selectedGroup: Group | null;
  members: GroupMember[];
  onShareLocationStart: () => void;
  onShareLocationStop: () => void;
};

export default function GroupDetailContent({
  selectedGroup,
  members,
  onShareLocationStart,
  onShareLocationStop,
}: Props) {
  const mapRef = useRef<MapView | null>(null);
  const scrollRef = useRef<BottomSheetFlatListMethods | null>(null);
  const { user } = useAuthStore();
  const me = useMemo(() => {
    if (!user?.id || !members || members.length === 0) return null;
    return members.find((member) => member.member.id === user.id) ?? null;
  }, [user?.id, members]);

  const renderMember = useCallback(
    ({ item }: { item: GroupMember }) => (
      <UserAvatar
        className="w-[68px] h-[68px] rounded-full"
        imageUrl={item.member.profile_image}
      />
    ),
    []
  );

  // 변화 감지 및 이동
  useEffect(() => {
    if (mapRef.current && selectedGroup) {
      const region: Region = {
        latitude: selectedGroup.group.latitude,
        longitude: selectedGroup.group.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 1000); // 1초 동안 부드럽게 이동
      scrollRef.current?.scrollToOffset({ offset: 0 });
    }
  }, [selectedGroup?.group]);

  const headerComponent = useMemo(
    () => (
      <Text className="text-white text-[20px] font-semibold mb-[10px]">
        모임 참여자
      </Text>
    ),
    []
  );

  const footerComponent = selectedGroup ? (
    <View className="gap-[20px]">
      <PlaceField
        className="mt-[20px]"
        label="장소이름"
        value={`${selectedGroup.group.display_name}`}
      />
      <PlaceField label="상세주소" value={`${selectedGroup.group.address}`} />
      <Text className="text-white text-[18px] font-semibold mt-2">
        장소위치
      </Text>
      <MapView
        ref={mapRef}
        style={{ aspectRatio: 1 }}
        liteMode={true}
        initialRegion={{
          latitude: selectedGroup.group.latitude,
          longitude: selectedGroup.group.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        zoomControlEnabled={false}
        zoomTapEnabled={false}
      >
        <CustomMarkerView
          coordinate={{
            latitude: selectedGroup.group.latitude,
            longitude: selectedGroup.group.longitude,
          }}
          imageUrl={selectedGroup.group.group_image_url}
          name={selectedGroup.group.display_name}
        />
      </MapView>
      <ConfirmButton
        onPress={
          me?.is_sharing_location ? onShareLocationStop : onShareLocationStart
        }
        title={me?.is_sharing_location ? "위치공유 중지" : "위치공유 시작"}
      />
    </View>
  ) : null;

  return (
    <BottomSheetFlatList
      ref={scrollRef}
      data={members}
      keyExtractor={(item) => item.member.id}
      nestedScrollEnabled
      contentContainerClassName="px-[32px] pt-[10px] pb-[10px]"
      renderItem={renderMember}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
    />
  );
}
