import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = { session: null, currentUserId: null };

export const AuthContext = createContext(initialState);

export function AuthProvider({ children, initialSession }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // Check if the session is already stored in AsyncStorage
        const storedSession = await AsyncStorage.getItem("session");
        if (storedSession) {
          const session = JSON.parse(storedSession);
          setState({ session, currentUserId: session.user.id });
        } else {
          // If not stored, fetch the session from Supabase
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setState({ session, currentUserId: session.user.id });
            await AsyncStorage.setItem("session", JSON.stringify(session));
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      }
    };

    // If initialSession is provided, use it instead of fetching from Supabase
    if (initialSession) {
      setState({ session: initialSession, currentUserId: initialSession.user.id });
    } else {
      getInitialSession();
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setState({ session, currentUserId: session.user.id });
        AsyncStorage.setItem("session", JSON.stringify(session));
      } else {
        setState(initialState);
        AsyncStorage.removeItem("session");
      }
    });
  }, [initialSession]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState(initialState);
    await AsyncStorage.removeItem("session");
  };

  return <AuthContext.Provider value={{ state, signOut }}>{children}</AuthContext.Provider>;
}