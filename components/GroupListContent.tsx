import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { GroupResponse } from "@/types/types";
import { GroupItem } from "./GroupItem";

type GroupListContentProps = {
  groups: GroupResponse[] | null;
  onClickGroupItem: (item: GroupResponse) => void;
  addGroup: () => void;
};

export default function GroupListContent({
  groups,
  onClickGroupItem,
  addGroup,
}: GroupListContentProps) {
  const renderGroup = useCallback(
    ({ item }: { item: GroupResponse }) => (
      <GroupItem
        groupName={item.name}
        group_image_url={item.group_image_url}
        onPress={() => {
          onClickGroupItem(item);
        }}
      />
    ),
    []
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
