import { GroupMember, GroupMemberLocation } from "@/api/groups/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Location = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: Location | null;
  // Map을 사용하여 O(1) 접근 성능 확보
  groupMembersMap: Map<string, GroupMemberLocation>;
  // 배열 형태로도 제공 (UI에서 사용하기 편리)
  groupMembers: GroupMemberLocation[];

  // 기본 액션들
  setLocation: (location: Location) => void;
  setGroupMembers: (members: GroupMemberLocation[] | null) => void;

  // 효율적인 CRUD 작업들
  insertGroupMember: (member: GroupMemberLocation) => void;
  updateGroupMemberLocation: (userId: string, location: Location) => void;
  deleteGroupMember: (userId: string) => void;

  // 배치 작업들 (여러 멤버를 한번에 처리)
  batchInsertGroupMembers: (members: GroupMemberLocation[]) => void;
  batchUpdateGroupMembers: (
    updates: { userId: string; location: Location }[]
  ) => void;
  batchDeleteGroupMembers: (userIds: string[]) => void;

  // 유틸리티 함수들
  getGroupMember: (userId: string) => GroupMemberLocation | undefined;
  hasGroupMember: (userId: string) => boolean;
  getGroupMembersArray: () => GroupMemberLocation[];
  clearGroupMembers: () => void;
};

export const useLocationStore = create<LocationState>()(
  devtools((set, get) => ({
    location: null,
    groupMembersMap: new Map(),
    groupMembers: [],

    setLocation: (location) => set(() => ({ location })),

    setGroupMembers: (members) =>
      set(() => {
        if (!members || members.length === 0) {
          return {
            groupMembersMap: new Map(),
            groupMembers: [],
          };
        }

        const newMap = new Map<string, GroupMemberLocation>();
        members.forEach((member) => {
          newMap.set(member.user_id, member);
        });

        return {
          groupMembersMap: newMap,
          groupMembers: [...members],
        };
      }),

    // INSERT: 새로운 멤버 추가
    insertGroupMember: (member) =>
      set((state) => {
        // 이미 존재하는 멤버인지 확인 (O(1))
        if (state.groupMembersMap.has(member.user_id)) {
          console.warn(
            `Member ${member.user_id} already exists. Use updateGroupMemberLocation instead.`
          );
          return state;
        }

        const newMap = new Map(state.groupMembersMap);
        newMap.set(member.user_id, member);

        return {
          groupMembersMap: newMap,
          groupMembers: [...state.groupMembers, member],
        };
      }),

    // UPDATE: 기존 멤버의 위치 업데이트
    updateGroupMemberLocation: (userId, location) =>
      set((state) => {
        const existingMember = state.groupMembersMap.get(userId);
        if (!existingMember) {
          console.warn(
            `Member ${userId} not found. Use insertGroupMember instead.`
          );
          return state;
        }

        const updatedMember = {
          ...existingMember,
          location: location,
          updated_at: new Date().toISOString(), // 업데이트 시간 기록
        };

        const newMap = new Map(state.groupMembersMap);
        newMap.set(userId, updatedMember);

        const newArray = state.groupMembers.map((member) =>
          member.user_id === userId ? updatedMember : member
        );

        return {
          groupMembersMap: newMap,
          groupMembers: newArray,
        };
      }),

    // DELETE: 멤버 삭제
    deleteGroupMember: (userId) =>
      set((state) => {
        if (!state.groupMembersMap.has(userId)) {
          console.warn(`Member ${userId} not found for deletion.`);
          return state;
        }

        const newMap = new Map(state.groupMembersMap);
        newMap.delete(userId);

        const newArray = state.groupMembers.filter(
          (member) => member.user_id !== userId
        );

        return {
          groupMembersMap: newMap,
          groupMembers: newArray,
        };
      }),

    // BATCH INSERT: 여러 멤버를 한번에 추가
    batchInsertGroupMembers: (members) =>
      set((state) => {
        const newMap = new Map(state.groupMembersMap);
        const newMembers: GroupMemberLocation[] = [];

        members.forEach((member) => {
          if (!newMap.has(member.user_id)) {
            newMap.set(member.user_id, member);
            newMembers.push(member);
          }
        });

        if (newMembers.length === 0) {
          return state; // 변경사항이 없으면 상태 유지
        }

        return {
          groupMembersMap: newMap,
          groupMembers: [...state.groupMembers, ...newMembers],
        };
      }),

    // BATCH UPDATE: 여러 멤버의 위치를 한번에 업데이트
    batchUpdateGroupMembers: (updates) =>
      set((state) => {
        const newMap = new Map(state.groupMembersMap);
        const updateMap = new Map<string, Location>();

        // 업데이트할 항목들을 Map으로 변환 (O(1) 접근)
        updates.forEach(({ userId, location }) => {
          updateMap.set(userId, location);
        });

        let hasChanges = false;
        const newArray = state.groupMembers.map((member) => {
          const newLocation = updateMap.get(member.user_id);
          if (newLocation) {
            hasChanges = true;
            const updatedMember = {
              ...member,
              location: newLocation,
              updated_at: new Date().toISOString(),
            };
            newMap.set(member.user_id, updatedMember);
            return updatedMember;
          }
          return member;
        });

        if (!hasChanges) {
          return state; // 변경사항이 없으면 상태 유지
        }

        return {
          groupMembersMap: newMap,
          groupMembers: newArray,
        };
      }),

    // BATCH DELETE: 여러 멤버를 한번에 삭제
    batchDeleteGroupMembers: (userIds) =>
      set((state) => {
        const deleteSet = new Set(userIds);
        const newMap = new Map(state.groupMembersMap);

        // 삭제할 항목들을 Map에서 제거
        userIds.forEach((userId) => {
          newMap.delete(userId);
        });

        const newArray = state.groupMembers.filter(
          (member) => !deleteSet.has(member.user_id)
        );

        return {
          groupMembersMap: newMap,
          groupMembers: newArray,
        };
      }),

    // 유틸리티 함수들
    getGroupMember: (userId) => {
      return get().groupMembersMap.get(userId);
    },

    hasGroupMember: (userId) => {
      return get().groupMembersMap.has(userId);
    },

    getGroupMembersArray: () => {
      return get().groupMembers;
    },

    clearGroupMembers: () =>
      set(() => ({
        groupMembersMap: new Map(),
        groupMembers: [],
      })),
  }))
);
