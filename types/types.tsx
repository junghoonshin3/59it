export type GroupRequest = {
  host_id: string;
  name: string;
  address: string;
  display_name?: string;
  latitude: number;
  longitude: number;
  meeting_date: string; // e.g., "2025-06-01"
  meeting_time: string; // e.g., "18:00:00"
};

export interface GroupResponse {
  id: string;
  name: string;
  address: string;
  host_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  expires_at: string;
  invite_code: string;
  display_name: string;
  meeting_date: string;
  meeting_time: string;
  group_image_url: string | undefined;
}

// 최종 결과 배열 타입
export interface Group {
  group: GroupResponse;
}

export interface GroupMember {
  member: UserProfile;
  is_sharing_location: boolean;
}

export type GroupWithSharing = GroupResponse & {
  is_sharing_location: boolean;
};

export type GroupMemberWithLocation = {
  profile: UserProfile; // 사용자 정보
  is_sharing_location: boolean;
  location?: {
    latitude: number;
    longitude: number;
    updated_at: string;
  };
};
export interface UserProfile {
  id: string;
  nickname: string;
  profile_image?: string;
  is_blocked: boolean;
  role: string;
  create_at: string;
}

export type MemberLocation = {
  user_id: string;
  group_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
};

type DisplayName = {
  text: string;
  languageCode: string;
};

type Location = {
  latitude: number;
  longitude: number;
};

export type Place = {
  place_id: string;
  formattedAddress: string;
  location: Location;
  displayName: DisplayName;
};

export type SharingGroup = {
  group_id: string;
  user_id: string;
};
