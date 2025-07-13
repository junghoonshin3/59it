import { GroupMember, GroupMemberLocation } from "@/api/groups/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
export type Location = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: Location | null;
  groupMembers: GroupMemberLocation[] | null;
  setLocation: (location: Location) => void;
  setGroupMembers: (members: GroupMemberLocation[] | null) => void;
  updateGroupMemberLocation: (userId: string, location: Location) => void;
  addGroupMember: (member: GroupMemberLocation) => void;
};

export const useLocationStore = create<LocationState>()(
  devtools((set, get) => ({
    location: null,
    groupMembers: null,
    setLocation: (location) => set(() => ({ location })),

    setGroupMembers: (members: GroupMemberLocation[]) =>
      set(() => ({ groupMembers: members })),

    // 특정 멤버의 위치 업데이트
    updateGroupMemberLocation: (userId, location) =>
      set((state) => {
        if (!state.groupMembers) return state;

        const updatedMembers = state.groupMembers.map((member) =>
          member.id === userId
            ? {
                ...member,
                location: location,
              }
            : member
        );

        return { ...state, groupMembers: updatedMembers };
      }),

    // 새로운 멤버 추가 (INSERT 이벤트용)
    addGroupMember: (member) =>
      set((state) => {
        if (!state.groupMembers) return { ...state, groupMembers: [member] };

        // 이미 존재하는 멤버인지 확인
        const existingMemberIndex = state.groupMembers.findIndex(
          (m) => m.user_id === member.user_id
        );

        if (existingMemberIndex !== -1) {
          // 기존 멤버 업데이트
          const updatedMembers = [...state.groupMembers];
          updatedMembers[existingMemberIndex] = member;
          return { ...state, groupMembers: updatedMembers };
        } else {
          // 새로운 멤버 추가
          return { ...state, groupMembers: [...state.groupMembers, member] };
        }
      }),
  }))
);
