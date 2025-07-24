export interface UserProfile {
  id: string;
  nickname: string;
  profile_image?: string;
  is_blocked: boolean;
  role: string;
  create_at?: string;
  expo_push_token?:string;
}

export type UserProfileRequest = {
  user_id: string;
};
