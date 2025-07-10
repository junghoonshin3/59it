import { GroupMember } from "@/api/groups/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GroupMemberWithLocation } from "./groups/types";
export type Location = {
  latitude: number;
  longitude: number;
};

type LocationState = {
  location: Location | null;
  groupMembers: GroupMemberWithLocation[] | null;
  setLocation: (location: Location) => void;
  setGroupMember: (members: GroupMemberWithLocation[]) => void;
  updateGroupMemberLocation: (userId: string, location: Location) => void;
  addGroupMember: (member: GroupMemberWithLocation) => void;
};

export const useLocationStore = create<LocationState>()(
  devtools((set, get) => ({
    location: null,
    groupMembers: null,

    setLocation: (location) => set(() => ({ location })),

    setGroupMembers: (members: GroupMemberWithLocation[]) =>
      set(() => ({ groupMembers: members })),

    // 특정 멤버의 위치 업데이트
    updateGroupMemberLocation: (userId, location) =>
      set((state) => {
        if (!state.groupMembers) return state;

        const updatedMembers = state.groupMembers.map((member) =>
          member.id === userId
            ? {
                ...member,
                latitude: location.latitude,
                longitude: location.longitude,
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
          (m) => m.id === member.id
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
