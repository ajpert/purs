import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { RoleProvider } from '../context/RoleContext';



export default function Layout() {

  return <AuthProvider>
    <RoleProvider>
    <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </RoleProvider>
  </AuthProvider>;
}
