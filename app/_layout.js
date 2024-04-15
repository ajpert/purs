import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
export default function Layout() {
  
  return <Stack 
  screenOptions={{
headerShown: false
}}
/>;
}
