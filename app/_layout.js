import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { RoleProvider } from "../context/RoleContext";
import "../globals.css";

export default function Layout() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </RoleProvider>
    </AuthProvider>
  );
}
