import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Spacing, BorderRadius, Brand, Colors } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import { isAuthenticated } from "@/lib/auth";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [checking, setChecking] = useState(false);

  const handleStart = async () => {
    setChecking(true);
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        navigation.navigate("TripPlanner");
      } else {
        navigation.navigate("Onboarding");
      }
    } catch {
      navigation.navigate("Onboarding");
    } finally {
      setChecking(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.logoSection}>
        <LinearGradient
          colors={Brand.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <Feather name="navigation" size={56} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.brandName, { color: theme.text }]}>VibeTrip</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          AI 맞춤 여행 플래너
        </Text>
      </View>

      <View style={styles.buttonSection}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.buttonPressed,
            checking && styles.buttonDisabled,
          ]}
          onPress={handleStart}
          disabled={checking}
        >
          <LinearGradient
            colors={Brand.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>
              {checking ? "확인 중..." : "시작하기"}
            </Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  brandName: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 17,
    fontWeight: "500",
  },
  buttonSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  startButton: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  startButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.lg + 2,
    gap: Spacing.sm,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
