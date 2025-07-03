export type GroupRequest = {
  host_id: string;
  name: string;
  address: string;
  display_name?: string;
  latitude: number;
  longitude: number;
  meeting_date: string; // e.g., "2025-06-01"
  meeting_time: string; // e.g., "18:00:00"
  image_base64?: string;
  image_filename?: string;
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

export interface Group {
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

export interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
  id: string;
  nickname: string;
  profile_image: string;
  is_blocked: string;
  role: string;
  create_at: string;
}

export interface GroupMemberLocationRequest {
  group_id: string;
  user_id: string;
  latitude?: number;
  longitude?: number;
  updated_at?: string;
  is_sharing: boolean;
}
