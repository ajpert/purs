import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-url-polyfill/auto";
import Auth from "../components/Auth.jsx";
import OTPVerify from "../components/OTPVerify.jsx";
import { supabase } from "../lib/supabase.js";

export default function App() {
  const [session, setSession] = useState(null);
  const [phone, setPhone] = useState("");
  const [sentCode, setSentCode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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
