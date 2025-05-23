import { createClient, Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupRequest, GroupResponse, UserProfile } from "@/types/types";

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

export const findGroupByInviteCode = async (
  inviteCode: string
): Promise<GroupResponse | null> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("invite_code", inviteCode)
    .single();

  if (error) {
    console.error("그룹 찾기 실패:", error);
    return null;
  }

  return data as GroupResponse;
};

export const joinGroup = async (groupId: string, userId: string) => {
  // 이미 참여했는지 확인
  const { data: existing, error: checkError } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (checkError) {
    console.error("참여 여부 확인 실패:", checkError);
    return;
  }

  if (existing) {
    console.log("이미 그룹에 참여 중입니다.");
    return;
  }

  // 참여 등록
  const { error: insertError } = await supabase
    .from("group_members")
    .insert([{ group_id: groupId, user_id: userId }]);

  if (insertError) {
    console.error("그룹 참여 실패:", insertError);
  } else {
    console.log("그룹 참여 성공!");
  }
};

export const getGroupMembers = async (
  groupId: string
): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from("group_members")
    .select("user:profiles(*)") // profiles 테이블 조인
    .eq("group_id", groupId);

  if (error) {
    console.error("그룹 멤버 조회 실패:", error);
    return [];
  }

  // 조인된 user 정보만 추출
  const users = data?.map((item) => item.user as UserProfile) ?? [];
  return users;
};

export const updateMyLocation = async ({
  user_id,
  group_id,
  latitude,
  longitude,
}: {
  user_id: string;
  group_id: string | null;
  latitude: number;
  longitude: number;
}) => {
  const { error } = await supabase.from("group_member_locations").upsert(
    {
      user_id,
      group_id,
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "group_id,user_id",
    }
  );

  if (error) {
    console.error("Failed to update location:", error.message);
  }
};
