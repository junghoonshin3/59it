import { supabase } from "@/services/supabase/supabaseService";
import { Group, GroupMember, GroupRequest, GroupResponse } from "./types";
import { decode } from "base64-arraybuffer";
import { UserProfile } from "../auth/types";

export const getMyGroups = async (user_id: string): Promise<Group[]> => {
  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      group_id,
      user_id,
      joined_at,
      groups!inner (
        id,
        host_id,
        name,
        address,
        display_name,
        latitude,
        longitude,
        meeting_date,
        meeting_time,
        invite_code,
        created_at,
        expires_at,
        group_image_url
      )
    `
    )
    .eq("user_id", user_id)
    .order("joined_at", { ascending: false });
  if (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }

  // 조인된 그룹 정보만 추출
  return data?.map((member: any) => member.groups) || [];
};

export const createMyGroup = async (groupReq: GroupRequest) => {
  try {
    const { data, error } = await supabase.functions.invoke("create-group", {
      body: groupReq,
    });

    if (error) {
      console.error("Edge Function error:", JSON.stringify(error));
      throw error;
    }

    return data as GroupResponse;
  } catch (error) {
    console.error("Failed to create group:", error);
    throw error;
  }
};

// 생성한 그룹 업데이트
export const updateMyGroup = async (myGroup: GroupResponse) => {
  const { data, error } = await supabase.from("groups").upsert(myGroup);
  if (error) throw error;
  return data;
};

//  Storage에 업로드
export const uploadGroupImage = async (image: {
  groupId: string;
  image_name: string;
  base64: string;
}): Promise<string> => {
  const realPath = `${image.groupId}/${image.image_name}`;
  const { error } = await supabase.storage
    .from("group-images") // 버킷 이름
    .upload(realPath, decode(image.base64), {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("이미지 업로드 실패:", error.message);
    throw error;
  }

  const { data } = supabase.storage.from("group-images").getPublicUrl(realPath);
  return data.publicUrl;
};

export const joinGroup = async (joinReq: {
  inviteCode: string;
  userId: string;
}) => {
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("invite_code", joinReq.inviteCode)
    .single<GroupResponse>();
  if (groupError) {
    throw groupError;
  }
  const { data: join, error: joinError } = await supabase
    .from("group_members")
    .insert({
      group_id: group?.id,
      user_id: joinReq.userId,
    });
  if (joinError) {
    throw joinError;
  }
};

export const getGroupMembers = async (
  groupId: string
): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from("group_members")
    .select(
      `
      profiles!inner (
        id,
        nickname,
        profile_image,
        is_blocked,
        role,
        created_at
      )
    `
    ) // profiles 테이블 조인
    .eq("group_id", groupId);
  if (error) {
    console.error("그룹 멤버 조회 실패:", error);
    throw error;
  }
  return data?.map((m: any) => m.profiles) || [];
};
