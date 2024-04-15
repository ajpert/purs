import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const initialState = {session: null, currentUserId: null};

export const AuthContext = createContext(initialState);

export function AuthProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [state, setState] = useState(initialState);

  useEffect(() => {
  
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setState({ session: session, currentUserId: session.user.id });
        console.log(session.user.id);
      }
    };
  
    getInitialSession();
  
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setState({ session: session, currentUserId: session.user.id });
      }
    });
  

  }, []);

  

  const signOut = async () => {
    await supabase.auth.signOut();
  };



  return <AuthContext.Provider value={{state}}>{children}</AuthContext.Provider>;
}