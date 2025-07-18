import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { GroupItem } from "./GroupItem";
import { Group } from "@/api/groups/types";

type GroupListContentProps = {
  groups: Group[];
  loading: boolean;
  onClickGroup: (item: Group) => void;
  addGroup: () => void;
  selectedGroupId: string | null;
  isCurrentlySharing: boolean;
};

// 로딩 스켈레톤 컴포넌트
const Skeleton = () => (
  <View className="flex-col items-center animate-pulse">
    <View className="w-[68px] h-[68px] bg-gray-600 rounded-full mb-2">
      {/* 내부 애니메이션 효과 */}
      <View className="w-full h-full bg-gray-500 rounded-full opacity-50" />
    </View>
    <View className="w-[50px] h-[12px] bg-gray-600 rounded mt-4" />
  </View>
);

export default function GroupListContent({
  groups,
  loading = false,
  onClickGroup,
  addGroup,
  selectedGroupId,
  isCurrentlySharing,
}: GroupListContentProps) {
  const renderGroup = useCallback(
    ({ item }: { item: Group }) => {
      const isSelected = item.id === selectedGroupId;
      const isDisabled = loading || (isCurrentlySharing && !isSelected);

      return (
        <GroupItem
          disabled={isDisabled}
          groupName={item.name}
          group_image_url={item.group_image_url}
          onPress={() => {
            onClickGroup(item);
          }}
          isSelected={isSelected}
        />
      );
    },
    [selectedGroupId, loading, onClickGroup, isCurrentlySharing]
  );

  const renderSkeleton = useCallback(
    ({ item }: { item: number }) => <Skeleton />,
    []
  );

  return (
    <View>
      <View className="flex-row items-center justify-center px-[32px]">
        <Text className="text-white text-[20px] font-semibold ">
          나의 모임들
        </Text>
        <View className="flex-1" />
        <TouchableOpacity onPress={addGroup} disabled={loading}>
          <Image
            source={require("@/assets/images/add_group.png")}
            className={`w-5 h-5 ${loading ? "opacity-50" : ""}`}
          />
        </TouchableOpacity>
      </View>
      <View className="h-[5px]" />

      {/* 로딩 상태 처리 */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={renderSkeleton}
          horizontal
          contentContainerClassName="pt-[20px] pb-[20px] px-[32px]"
          ItemSeparatorComponent={() => <View className="w-[12px]" />}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `skeleton-${index}`}
        />
      ) : (
        <FlatList
          data={groups}
          ListEmptyComponent={() => {
            return (
              <View className="flex-1 items-center justify-center h-[120px]">
                <Text className="text-white text-[16px] font-semibold">
                  참여한 모임이 없습니다.
                </Text>
              </View>
            );
          }}
          renderItem={renderGroup}
          horizontal
          contentContainerClassName="pt-[20px] pb-[20px] px-[32px]"
          ItemSeparatorComponent={() => <View className="w-[12px]" />}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}
