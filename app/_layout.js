import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import LottieView from "lottie-react-native";
import * as React from "react";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../context/AuthContext";
import { RoleProvider } from "../context/RoleContext";
import "../globals.css";
import { NAV_THEME } from "../lib/constants.js";
import { useColor } from "../lib/useColor.js";

export { ErrorBoundary } from "expo-router";

// SplashScreen.preventAutoHideAsync();
SplashScreen.hideAsync();

const LOTTI_JSON = require("../assets/lottie/splash.json");
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const LIGHT_THEME = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  dark: true,
  colors: NAV_THEME.dark,
};

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColor();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    // Start animation
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // End animation
    setTimeout(() => {
      setColorScheme(colorScheme);
      setIsColorSchemeLoaded(true);
    }, 5000);
  }, []);

  return (
    <>
      {!isColorSchemeLoaded && (
        <AnimatedLottieView
          source={LOTTI_JSON}
          progress={animationProgress.current}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: isDarkColorScheme ? "#000" : "#fff",
          }}
        />
      )}
      {isColorSchemeLoaded && (
        <PaperProvider>
          <AuthProvider>
            <RoleProvider>
              <ThemeProvider
                value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
              >
                <Stack
                  screenOptions={{
                    headerShown: false,
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
      )}
    </>
  );
}
