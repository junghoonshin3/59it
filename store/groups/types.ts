import { GroupMember } from "@/api/groups/types";

export interface Group {
  groupNm: string;
  placeNm: string;
  address: string;
  hour: string;
  time: string;
}

// 위치 정보가 포함된 그룹 멤버 타입
export type GroupMemberWithLocation = GroupMember & {
  latitude?: number;
  longitude?: number;
};

export type Place = {
  place_id: string;
  formattedAddress: string;
  location: Location;
  displayName: DisplayName;
};

type DisplayName = {
  text: string;
  languageCode: string;
};
