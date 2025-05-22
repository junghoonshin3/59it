import { createClient, Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupRequest, GroupResponse } from "@/types/types";

export type Profile = {
  id: string;
  nickname: string;
  profile_image?: string;
  is_blocked?: boolean;
  role?: Role;
  created_at?: string;
};

type Role = "user" | "admin";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      storageKey: "supabase.auth.token",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const getProfile = async (): Promise<Profile | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !data) return null;

  return data as Profile;
};

export const registerProfile = async (user: User) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert<Profile>([
      {
        id: user.id,
        nickname: user.user_metadata.name,
        profile_image: user.user_metadata.picture,
        is_blocked: false,
        role: "user",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("프로필 저장 오류:", error.message);
    return null;
  }

  return data;
};

export const createGroup = async (
  req: GroupRequest
): Promise<GroupResponse | null> => {
  const { data, error } = await supabase.functions.invoke<GroupResponse>(
    "create_invite_code",
    {
      body: req,
    }
  );
  console.log("createGroup data", data?.invite_code);
  if (error) {
    console.error("그룹 생성 오류:", error.message);
    return null;
  }

  return data;
};

export const updateGroup = async (
  group_id: string,
  group_image_url: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("groups")
    .update({ group_image_url: group_image_url })
    .eq("id", group_id);
  if (error) {
    console.error("URL 업데이트 실패", error.message);
    return false;
  }
  return true;
};

export const getMyGroups = async (
  user_id: string
): Promise<GroupResponse[] | []> => {
  const { data, error } = await supabase
    .from("group_members")
    .select("group:groups(*)") // groups 테이블 전체를 조인해서 가져옴
    .eq("user_id", user_id);

  if (error) {
    console.error("내가 참여한 그룹 가져오기 실패:", error);
  }
  const groups: any[] | [] = data?.map((item) => item.group) ?? [];
  return groups as GroupResponse[];
};
