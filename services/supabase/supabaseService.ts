import { createClient, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupMember, GroupResponse } from "@/api/groups/types";
import { LocationObject } from "expo-location";

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
    .upsert<Profile>([
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

// export const createGroup = async (
//   req: GroupRequest
// ): Promise<GroupResponse | null> => {
//   const { data, error } = await supabase.functions.invoke<GroupResponse>(
//     "create_invite_code",
//     {
//       body: req,
//     }
//   );
//   console.log("createGroup data", data?.invite_code);
//   if (error) {
//     console.error("그룹 생성 오류:", error.message);
//     return null;
//   }

//   return data;
// };

// export const updateGroup = async (
//   group_id: string,
//   group_image_url: string
// ): Promise<boolean> => {
//   const { error } = await supabase
//     .from("groups")
//     .update({ group_image_url: group_image_url })
//     .eq("id", group_id);
//   if (error) {
//     console.error("URL 업데이트 실패", error.message);
//     return false;
//   }
//   return true;
// };

// export const getMyGroups = async (user_id: string): Promise<Group[] | null> => {
//   const { data, error } = await supabase
//     .from("group_members")
//     .select(
//       `
//       group:groups (
//         *)
//     `
//     )
//     .eq("user_id", user_id);

//   if (error) {
//     console.error("내가 참여한 그룹 가져오기 실패:", error);
//     return null;
//   }
//   if (!data) return [];
//   return data as unknown as Group[];
// };

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

// export const getGroupMembers = async (
//   groupId: string,
//   userId: string
// ): Promise<GroupMember[]> => {
//   const { data, error } = await supabase
//     .from("group_members")
//     .select("member:profiles(*), is_sharing_location") // profiles 테이블 조인
//     .eq("group_id", groupId);
//   if (error) {
//     console.error("그룹 멤버 조회 실패:", error);
//     return [];
//   }
//   return data as unknown as GroupMember[];
// };

// export const joinGroup = async (groupId: string, userId: string) => {
//   // 이미 참여했는지 확인
//   const { data: existing, error: checkError } = await supabase
//     .from("group_members")
//     .select("*")
//     .eq("group_id", groupId)
//     .eq("user_id", userId)
//     .maybeSingle();

//   if (checkError) {
//     console.error("참여 여부 확인 실패:", checkError);
//     return;
//   }

//   if (existing) {
//     console.log("이미 그룹에 참여 중입니다.");
//     return;
//   }

//   // 참여 등록
//   const { error: insertError } = await supabase
//     .from("group_members")
//     .insert([{ group_id: groupId, user_id: userId }]);

//   if (insertError) {
//     console.error("그룹 참여 실패:", insertError);
//   } else {
//     console.log("그룹 참여 성공!");
//   }
// };

export const insertOrUpdateLocation = async ({
  user_id,
  group_id,
  latitude,
  longitude,
  updated_at,
}: {
  user_id: string;
  group_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}) => {
  const { data, error } = await supabase
    .from("group_member_locations")
    .upsert([
      {
        user_id,
        group_id,
        latitude,
        longitude,
        updated_at,
      },
    ])
    .eq("user_id", user_id)
    .eq("group_id", group_id);

  return { data, error };
};

// /**
//  * 위치 공유 상태를 업데이트합니다.
//  *
//  * @param groupId - 그룹 ID
//  * @param userId - 사용자 ID
//  * @param isSharing - true면 위치 공유 시작, false면 중단
//  * @returns 성공 여부 및 에러 정보
//  */
// export async function updateLocationSharingStatus(
//   groupId: string,
//   userId: string,
//   isSharing: boolean,
//   location?: LocationObject
// ): Promise<{ success: boolean; error?: string }> {
//   const { error } = await supabase
//     .from("group_members")
//     .update({ is_sharing_location: isSharing })
//     .eq("group_id", groupId)
//     .eq("user_id", userId);

//   if (error) {
//     console.error("위치 공유 상태 업데이트 실패:", error.message);
//     return { success: false, error: error.message };
//   }

//   return { success: true };
// }

// export const getGroupMemberDetails = async (
//   groupId: string
// ): Promise<GroupMemberWithLocation[]> => {
//   const { data, error } = await supabase
//     .from("group_members")
//     .select(
//       `
//     profile:profiles (
//       id,
//       nickname,
//       profile_image,
//       is_blocked,
//       role,
//       created_at
//     ),
//     is_sharing_location,
//     location:group_member_locations (
//       latitude,
//       longitude,
//       updated_at
//     )
//   `
//     )
//     .eq("group_id", groupId);

//   if (error) {
//     console.error("그룹 멤버 + 위치 정보 가져오기 실패:", error.message);
//     return [];
//   }

//   return (
//     data?.map(
//       (item) =>
//         ({
//           profile: Array.isArray(item.profile)
//             ? item.profile[0]
//             : (item.profile as UserProfile),
//           is_sharing_location: item.is_sharing_location,
//           location: Array.isArray(item.location)
//             ? item.location[0]
//             : item.location ?? null,
//         } as GroupMemberWithLocation)
//     ) ?? []
//   );
// };

export const deleteGroup = async (groupId: string) => {
  const { data, error } = await supabase.functions.invoke("delete-group", {
    body: {
      group_id: groupId,
    },
  });
  if (error) {
    return error;
  }
  return data;
};

export const leaveGroup = async (groupId: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("leave-group", {
    body: {
      group_id: groupId,
      user_id: userId,
    },
  });
  if (error) {
    return error;
  }
  return data;
};
