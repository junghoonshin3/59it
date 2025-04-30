import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const signInWithKakao = async (
  credentials: SignInWithOAuthCredentials
) => {
  const { data, error } = await supabase.auth.signInWithOAuth(credentials);
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
