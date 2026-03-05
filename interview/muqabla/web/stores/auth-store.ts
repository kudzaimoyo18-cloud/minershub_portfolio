import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User, CandidateProfile, Employer, Company } from "@/lib/types";

interface AuthState {
  user: User | null;
  candidateProfile: CandidateProfile | null;
  employerProfile: (Employer & { company: Company }) | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  loadUserProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  candidateProfile: null,
  employerProfile: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await get().loadUserProfile(session.user.id);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await get().loadUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          get().reset();
        }
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  setUser: (user) => set({ user }),

  loadUserProfile: async (userId: string) => {
    try {
      set({ isLoading: true });
      const supabase = createClient();

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError || !userData) {
        console.error("Error loading user profile:", userError);
        return;
      }

      set({ user: userData as User });

      if (userData.type === "candidate") {
        const { data: candidateData } = await supabase
          .from("candidates")
          .select("*")
          .eq("id", userId)
          .single();
        if (candidateData) {
          set({ candidateProfile: candidateData as CandidateProfile });
        }
      } else if (userData.type === "employer") {
        const { data: employerData } = await supabase
          .from("employers")
          .select("*, company:companies(*)")
          .eq("id", userId)
          .single();
        if (employerData) {
          set({
            employerProfile: employerData as Employer & { company: Company },
          });
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      get().reset();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  reset: () => {
    set({
      user: null,
      candidateProfile: null,
      employerProfile: null,
      isLoading: false,
    });
  },
}));

export const useUser = () => useAuthStore((s) => s.user);
export const useIsCandidate = () =>
  useAuthStore((s) => s.user?.type === "candidate");
export const useIsEmployer = () =>
  useAuthStore((s) => s.user?.type === "employer");
