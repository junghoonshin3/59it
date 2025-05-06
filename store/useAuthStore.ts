import { create } from "zustand";
import { supabase } from "@/services/supabaseService";
import { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  initAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),

  initAuth: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const { data: userData } = await supabase.auth.getUser();

    set({
      session: sessionData?.session ?? null,
      user: userData?.user ?? null,
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
