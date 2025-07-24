import { supabase } from "@/services/supabase/supabaseService";
import { UserProfile, UserProfileRequest } from "./types";

// 구글 로그인
export const signInWithGoogle = async (idToken: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });

  if (error) throw error;
  return data;
};

// 카카오 로그인 (커스텀 프로바이더로 처리)
export const signInWithKakao = async (idToken: string, accessToken: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "kakao",
    token: idToken,
    access_token: accessToken,
  });
  if (error) {
    throw error;
  }
  return data;
};

// 로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 현재 세션 가져오기
export const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw Error("인증된 유저가 아닙니다.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<UserProfile>();

  if(profileError) throw profileError

  return profile;
};

export const createUserProfile = async (user: UserProfile) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert<UserProfile>(user);
  if (error) throw error;
  return data;

};

export const updateUserProfile = async (user: UserProfile) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert<UserProfile>(user);
  if (error) throw error;
  return data;
};

export const isUserProfile = async (userId: string) => {
  const { error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true }) // head: true로 데이터는 가져오지 않고 count만
    .eq("id", userId);
  if (error) throw error;
  return (count ?? 0) > 0;
};

export const getUserProfile = async ({
  user_id,
}: UserProfileRequest): Promise<UserProfile | null> => {
  // profiles 테이블에서 사용자 프로필 조회
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    throw new Error(`프로필 조회 오류: ${error.message}`);
  }

  return data;
};

export const isValidToken = async (token: string, userId: string) : Promise<boolean>=>{
  const {data, error} = await supabase.from("profiles")
    .select("expo_push_token")
    .eq("id", userId)
    .single();

  if(error) throw error
  console.log("registerToken >> ",data.expo_push_token)

  return token === data.expo_push_token
}