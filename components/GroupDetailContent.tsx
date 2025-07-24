import React, { useCallback, useEffect, useRef } from "react";
import { Image, Text, View } from "react-native";
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import MapView from "react-native-maps";
import PlaceField from "@/components/PlaceField";
import { UserAvatar } from "@/components/UserAvatar";
import ConfirmButton from "./confirmbutton";
import { shareGroupInviteCode } from "@/utils/share";
import { FlatList } from "react-native-gesture-handler";
import { Group, GroupMember } from "@/api/groups/types";
import CustomMarker from "./CustomMarker";

type Props = {
  selectedGroup: Group | null;
  members: GroupMember[];
  loading: boolean;
  onShareLocationStart: () => void;
  onShareLocationStop: () => void;
  isCurrentlySharing: boolean;
};

export default function GroupDetailContent({
  selectedGroup,
  members,
  loading = false,
  onShareLocationStart,
  onShareLocationStop,
  isCurrentlySharing = false,
}: Props) {
  const mapRef = useRef<MapView | null>(null);
  const scrollRef = useRef<BottomSheetScrollViewMethods | null>(null);
  useEffect(() => {
    if (mapRef && mapRef.current && selectedGroup && scrollRef) {
      mapRef.current.animateToRegion({
        latitude: selectedGroup.latitude,
        longitude: selectedGroup.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }
  }, [mapRef, selectedGroup, scrollRef]);

  const renderMember = useCallback(
    ({ item }: { item: GroupMember }) => (
      <View key={item.user_id}>
        <UserAvatar
          className="w-[68px] h-[68px] rounded-full"
          imageUrl={item.profile_image}
        />
        {selectedGroup?.host_id === item.user_id ? (
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
      inviteCode: selectedGroup?.invite_code,
      groupName: selectedGroup?.name,
    });
  };

  return (
    selectedGroup && (
      <BottomSheetScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 10 }}
      >
        <Text className="text-white text-[20px] font-semibold mb-[10px]">
          모임 참여자
        </Text>

        <FlatList
          data={members}
          keyExtractor={(item) => item.user_id}
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
            value={selectedGroup.display_name}
          />
          <PlaceField label="상세주소" value={selectedGroup.address} />
          <PlaceField
            label="초대코드"
            value={selectedGroup.invite_code}
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
              latitude: selectedGroup.latitude,
              longitude: selectedGroup.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
          >
            <CustomMarker
              nickName={selectedGroup.display_name}
              profileUrl={selectedGroup.group_image_url}
              location={{
                latitude: selectedGroup.latitude,
                longitude: selectedGroup.longitude,
              }}
            />
          </MapView>

          <ConfirmButton
            indicatorColor="#ffffff"
            loading={loading}
            disabled={loading}
            onPress={
              isCurrentlySharing ? onShareLocationStop : onShareLocationStart
            }
            title={isCurrentlySharing ? "위치공유 중단" : "위치공유 시작"}
          />
        </View>
      </BottomSheetScrollView>
    )
  );
}
