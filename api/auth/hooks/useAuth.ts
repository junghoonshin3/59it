import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserProfile,
  getCurrentSession,
  getCurrentUser,
  getUserProfile,
  isUserProfile,
  signInWithGoogle,
  signInWithKakao,
  signOut,
} from "../auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { login, logout } from "@react-native-seoul/kakao-login";
import { supabase } from "@/services/supabase/supabaseService";

// 현재 세션 조회
export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getCurrentSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// 현재 사용자 조회
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// 구글 로그인
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (!userInfo.data?.idToken) {
        throw new Error("Google ID token not found");
      }
      return await signInWithGoogle(userInfo.data?.idToken);
    },
    onSuccess: async (data) => {
      const isProfile = await isUserProfile(data.user.id);
      if (!isProfile)
        await createUserProfile({
          id: data.user.id,
          nickname: data.user.user_metadata.name,
          profile_image: data.user.user_metadata.picture,
          is_blocked: false,
          role: "user",
        });
      await queryClient.setQueryData(["session"], data.session);
      await queryClient.setQueryData(["user"], data.user);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });
};

// 카카오 로그인
export const useKakaoLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await login();
      return await signInWithKakao(result.idToken);
    },
    onSuccess: async (data) => {
      const isProfile = await isUserProfile(data.user.id);
      if (!isProfile)
        await createUserProfile({
          id: data.user.id,
          nickname: data.user.user_metadata.name,
          profile_image: data.user.user_metadata.picture,
          is_blocked: false,
          role: "user",
        });
      queryClient.setQueryData(["session"], data.session);
      queryClient.setQueryData(["user"], data.user);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Kakao login error:", error);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await signOut();
      // 소셜 로그인 SDK에서도 로그아웃
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // 구글 로그인이 안 되어 있으면 에러 무시
      }

      //카카오 로그아웃
      try {
        await logout();
      } catch (error) {
        // 카카오 로그인이 안 되어 있으면 에러 무시
      }
    },
    onSuccess: () => {
      // 모든 캐시 데이터 삭제
      queryClient.clear();
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
    retry: 1,
    enabled: true, // 항상 실행
  });
};
