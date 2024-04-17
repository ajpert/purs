import { AuthProvider } from "../context/AuthContext";
import { RoleProvider } from "../context/RoleContext";
import "../globals.css";

// export default function Layout() {
//   return (
//     <AuthProvider>
//       <RoleProvider>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//           }}
//         />
//       </RoleProvider>
//     </AuthProvider>
//   );
// }

import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import * as React from "react";
import { PaperProvider } from "react-native-paper";
import { NAV_THEME } from "../lib/constants.js";
import { useColor } from "../lib/useColor.js";

const LIGHT_THEME = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  dark: true,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColor();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    if (colorScheme) {
      setIsColorSchemeLoaded(true);
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
    }
  }, [colorScheme]);

  return (
    <PaperProvider>
      <AuthProvider>
        <RoleProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <Stack
              screenOptions={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: isDarkColorScheme ? "#000" : "#fff",
                },
                headerTitle: "",
              }}
            />
          </ThemeProvider>
        </RoleProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
