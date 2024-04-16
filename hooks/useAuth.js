import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Add state for user profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      setSession(sessionData.session);
      if (sessionData) {
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .single();

        if (userError) {
          setError(userError);
        } else {
          setUser(sessionData.user);
          setProfile(userData);
        }
      }
      setLoading(false);
    };

    fetchData();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: session }) => {
      setSession(session);
    });
  }, []);

  return { session, user, profile, loading, error };
};

export default useAuth;
