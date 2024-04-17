import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { RoleProvider } from '../context/RoleContext';
import { PaperProvider, Text } from "react-native-paper";


export default function Layout() {

  return <AuthProvider>
    <RoleProvider>
    <PaperProvider>
    <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </PaperProvider>

    </RoleProvider>
  </AuthProvider>;
}
