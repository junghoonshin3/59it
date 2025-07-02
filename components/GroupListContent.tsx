import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { GroupItem } from "./GroupItem";
import { Group } from "@/api/groups/types";

type GroupListContentProps = {
  groups: Group[];
  loading: boolean;
  onClickGroupItem: (item: Group) => void;
  addGroup: () => void;
  selectedGroupId: string | undefined;
};

// 로딩 스켈레톤 컴포넌트
const GroupItemSkeleton = () => (
  <View className="w-[80px] h-[80px] bg-gray-600 rounded-full animate-pulse" />
);

// 로딩 상태 컴포넌트
const LoadingContent = () => (
  <FlatList
    data={[1, 2, 3, 4]} // 스켈레톤 4개 표시
    renderItem={() => <GroupItemSkeleton />}
    horizontal
    contentContainerClassName="pt-[20px] pb-[20px] px-[32px]"
    ItemSeparatorComponent={() => <View className="w-[12px]" />}
    showsHorizontalScrollIndicator={false}
  />
);

export default function GroupListContent({
  groups,
  loading = false,
  onClickGroupItem,
  addGroup,
  selectedGroupId,
}: GroupListContentProps) {
  const renderGroup = useCallback(
    ({ item }: { item: Group }) => {
      const isSelected = item.id === selectedGroupId;
      return (
        <GroupItem
          groupName={item.name}
          group_image_url={item.group_image_url}
          onPress={() => {
            onClickGroupItem(item);
          }}
          isSelected={isSelected}
        />
      );
    },
    [onClickGroupItem, selectedGroupId]
  );

  return (
    <View>
      <View className="flex-row items-center justify-between px-[32px]">
        <Text className="text-white text-[20px] font-semibold">
          나의 모임들
        </Text>
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
        <LoadingContent />
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
        />
      )}
    </View>
  );
}

// 더 고급 로딩 상태 (shimmer 효과가 있는 버전)
export function GroupListContentAdvanced({
  groups,
  loading = false,
  onClickGroupItem,
  addGroup,
  selectedGroupId,
}: GroupListContentProps) {
  const renderGroup = useCallback(
    ({ item }: { item: Group }) => {
      const isSelected = item.id === selectedGroupId;
      return (
        <GroupItem
          groupName={item.display_name}
          group_image_url={item.group_image_url}
          onPress={() => {
            onClickGroupItem(item);
          }}
          isSelected={isSelected}
        />
      );
    },
    [onClickGroupItem, selectedGroupId]
  );

  // 더 정교한 스켈레톤
  const AdvancedSkeleton = () => (
    <View className="flex-col items-center">
      <View className="w-[80px] h-[80px] bg-gray-600 rounded-lg mb-2">
        {/* 내부 애니메이션 효과 */}
        <View className="w-full h-full bg-gray-500 rounded-lg opacity-50" />
      </View>
      <View className="w-[60px] h-[12px] bg-gray-600 rounded" />
    </View>
  );

  return (
    <View>
      <View className="flex-row items-center justify-between px-[32px]">
        <View className="flex-row items-center">
          <Text className="text-white text-[20px] font-semibold">
            나의 모임들
          </Text>
          {loading && (
            <ActivityIndicator size="small" color="#ffffff" className="ml-2" />
          )}
        </View>
        <TouchableOpacity onPress={addGroup} disabled={loading}>
          <Image
            source={require("@/assets/images/add_group.png")}
            className={`w-5 h-5 ${loading ? "opacity-50" : ""}`}
          />
        </TouchableOpacity>
      </View>
      <View className="h-[5px]" />

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={() => <AdvancedSkeleton />}
          horizontal
          contentContainerClassName="pt-[20px] pb-[20px] px-[32px]"
          ItemSeparatorComponent={() => <View className="w-[12px]" />}
          showsHorizontalScrollIndicator={false}
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
                <TouchableOpacity
                  onPress={addGroup}
                  className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
                >
                  <Text className="text-white text-[14px]">첫 모임 만들기</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          renderItem={renderGroup}
          horizontal
          contentContainerClassName="pt-[20px] pb-[20px] px-[32px]"
          ItemSeparatorComponent={() => <View className="w-[12px]" />}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// 사용 예시
/*
const ParentComponent = () => {
  const { data: groups, isLoading } = useMyGroups(userId);
  
  return (
    <GroupListContent
      groups={groups || []}
      loading={isLoading}
      onClickGroupItem={handleGroupClick}
      addGroup={handleAddGroup}
      selectedGroupId={selectedId}
    />
  );
};
*/
