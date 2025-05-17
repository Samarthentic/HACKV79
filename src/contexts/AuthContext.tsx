
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signUp: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const initialized = useRef(false);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // First, set up auth state listener
        const { data } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event);
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              // Use setTimeout to prevent potential Supabase auth deadlocks
              setTimeout(() => {
                fetchProfile(currentSession.user.id);
              }, 0);
            } else {
              setProfile(null);
            }

            // Show toast notifications after initialization
            if (initialized.current) {
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Signed in successfully",
                  description: "Welcome back!",
                });
              } else if (event === 'SIGNED_OUT') {
                toast({
                  title: "Signed out",
                  description: "You have been signed out.",
                });
              }
            }
          }
        );
        
        subscription = data.subscription;

        // Then get the current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchProfile(currentSession.user.id);
        }
        
        initialized.current = true;
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        // Always set loading to false at the end
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error("Error in signUp:", error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error("Error in signIn:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
