import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, Share, Text, View } from "react-native";
import {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import MapView, { Region } from "react-native-maps";
import { CustomMarkerView } from "@/components/CustomMarkerView";
import PlaceField from "@/components/PlaceField";
import { UserAvatar } from "@/components/UserAvatar";
import { Group, GroupMember } from "@/types/types";
import ConfirmButton from "./confirmbutton";
import { useAuthStore } from "@/store/useAuthStore";
import { shareGroupInviteCode } from "@/utils/share";
import { FlatList } from "react-native-gesture-handler";

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
      <View>
        <UserAvatar
          className="w-[68px] h-[68px] rounded-full"
          imageUrl={item.member.profile_image}
        />
        {selectedGroup?.group.host_id === item.member.id ? (
          <Image
            tintColor={"#FFD700"}
            className="absolute top-0 left-0"
            source={require("@/assets/images/crown.png")}
          />
        ) : null}
      </View>
    ),
    [selectedGroup]
  );

  const handleShare = async () => {
    if (!selectedGroup) return;
    await shareGroupInviteCode({
      inviteCode: selectedGroup?.group.invite_code,
      groupName: selectedGroup?.group.name,
    });
  };

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

  return (
    selectedGroup && (
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 10 }}
      >
        <Text className="text-white text-[20px] font-semibold mb-[10px]">
          모임 참여자
        </Text>

        <FlatList
          data={members}
          keyExtractor={(item) => item.member.id}
          renderItem={renderMember}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
          style={{ marginBottom: 20 }}
        />

        {/* 아래는 수직 UI 구성 */}
        <View className="gap-[20px]">
          <PlaceField
            className="mt-[20px]"
            label="장소이름"
            value={selectedGroup.group.display_name}
          />
          <PlaceField label="상세주소" value={selectedGroup.group.address} />
          <PlaceField
            label="초대코드"
            value={selectedGroup.group.invite_code}
            icon={require("@/assets/images/share.png")}
            onShareCode={handleShare}
          />
          <Text className="text-white text-[18px] font-semibold mt-2">
            장소위치
          </Text>

          <MapView
            ref={mapRef}
            style={{ aspectRatio: 1 }}
            liteMode
            initialRegion={{
              latitude: selectedGroup.group.latitude,
              longitude: selectedGroup.group.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
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
              me?.is_sharing_location
                ? onShareLocationStop
                : onShareLocationStart
            }
            title={me?.is_sharing_location ? "위치공유 중지" : "위치공유 시작"}
          />
        </View>
      </BottomSheetScrollView>
    )
  );
}
