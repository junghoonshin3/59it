export interface UserProfile {
  id: string;
  nickname: string;
  profile_image?: string;
  is_blocked: boolean;
  role: string;
  create_at?: string;
}
