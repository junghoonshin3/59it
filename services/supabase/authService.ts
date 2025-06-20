// services/supabase/authService.ts
import { login as kakaoLogin } from "@react-native-seoul/kakao-login";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { supabase } from "./supabaseService";
import { registerProfile } from "./supabaseService";

export async function signInWithKakao() {
  try {
    const token = await kakaoLogin();

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "kakao",
      access_token: token.accessToken,
      token: token.idToken,
    });

    if (error) throw error;
    if (data?.user) await registerProfile(data.user);

    return data.user;
  } catch (err) {
    console.error("Kakao login failed:", err);
    throw err;
  }
}

export async function signInWithGoogle() {
  try {
    const userInfo = await GoogleSignin.signIn();

    if (!userInfo.data?.idToken) {
      throw new Error("No ID token returned from Google Signin");
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: userInfo.data.idToken,
    });

    if (error) throw error;
    if (data?.user) await registerProfile(data.user);

    return data.user;
  } catch (err) {
    console.error("Google login failed:", err);
    throw err;
  }
}

export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
    return false;
  } else {
    console.log("Successfully signed out");
    return true;
  }
};
