import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Group } from "@/types/types";
import { GroupItem } from "./GroupItem";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";

type GroupListContentProps = {
  groups: Group[] | null;
  onClickGroupItem: (item: Group) => void;
  addGroup: () => void;
  selectedGroupId: string | undefined;
};

export default function GroupListContent({
  groups,
  onClickGroupItem,
  addGroup,
  selectedGroupId,
}: GroupListContentProps) {
  const renderGroup = useCallback(
    ({ item }: { item: Group }) => {
      const isSelected = item.group.id === selectedGroupId;
      return (
        <GroupItem
          groupName={item.group.name}
          group_image_url={item.group.group_image_url}
          onPress={() => {
            onClickGroupItem(item);
          }}
          isSelected={isSelected}
        />
      );
    },
    [onClickGroupItem]
  );
  return (
    <View>
      <View className="flex-row items-center justify-between px-[32px]">
        <Text className="text-white text-[20px] font-semibold">
          나의 모임들
        </Text>
        <TouchableOpacity onPress={addGroup}>
          <Image
            source={require("@/assets/images/add_group.png")}
            className="w-5 h-5"
          />
        </TouchableOpacity>
      </View>
      <View className="h-[5px]" />
      <FlatList
        data={groups}
        ListEmptyComponent={() => {
          return (
            <View className="flex-1 items-center justify-center">
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
      />
    </View>
  );
}
