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

export type GroupResponse = {
  id: string;
  host_id: string;
  name: string;
  address: string;
  display_name?: string;
  latitude: number;
  longitude: number;
  meeting_date: string; // e.g., "2025-06-01"
  meeting_time: string; // e.g., "18:00:00"
  invite_code: string;
  created_at: string;
  expires_at: string;
  group_image_url?: string;
};
