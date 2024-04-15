import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-url-polyfill/auto";
import Auth from "../components/Auth.jsx";
import OTPVerify from "../components/OTPVerify.jsx";
import { supabase } from "../lib/supabase.js";
import { Redirect } from "expo-router";

import { useAuth } from "../hooks/useAuth.js";
import { AuthProvider } from "../context/AuthContext.js";

export default function App() {
  const [session, setSession] = useState(null);
  const [phone, setPhone] = useState("");
  const [sentCode, setSentCode] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      // Handle the fetched data and error here
      console.log(userData)
      console.log(userError)
    };

    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session && session.user) {
    console.log("WE IN HERE")
    return <Redirect href={'ChoiceScreen'} />;
  }
  return (
    <View>
      {sentCode ? (
        <OTPVerify phone={phone} />
      ) : (
        <Auth phone={phone} setPhone={setPhone} setSentCode={setSentCode} />
      )}
      {session && session.user && (
        <Text style={styles.header}>Yay! You're authenticated!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subheader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});