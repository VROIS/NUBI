import React from "react";
import { View, StyleSheet, Platform, useColorScheme } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Brand, Colors } from "@/constants/theme";
import TripPlannerScreen from "@/screens/TripPlannerScreen";
import MapScreen from "@/screens/MapScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import AdminScreen from "@/screens/AdminScreen";

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Plan: undefined;
  Admin: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function EmptyPlaceholder() {
  return <View style={{ flex: 1 }} />;
}


export default function MainTabNavigator() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme ?? "light"];

  const getTabBarIcon = (routeName: string, color: string, focused: boolean) => {
    let iconName: keyof typeof Feather.glyphMap;
    
    switch (routeName) {
      case "Home":
        iconName = "edit-3";
        break;
      case "Map":
        iconName = "map";
        break;
      case "Admin":
        iconName = "settings";
        break;
      case "Profile":
        iconName = "user";
        break;
      default:
        iconName = "circle";
    }
    
    return <Feather name={iconName} size={24} color={color} />;
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, focused }) => getTabBarIcon(route.name, color, focused),
          tabBarActiveTintColor: Brand.primary,
          tabBarInactiveTintColor: theme.textTertiary,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Platform.select({
              ios: "transparent",
              android: theme.backgroundDefault,
              web: theme.backgroundDefault,
            }),
            borderTopWidth: 0,
            elevation: 0,
            height: 55,
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                intensity={80}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: isDark ? "dark" : "light",
          headerTintColor: theme.text,
          headerStyle: {
            backgroundColor: Platform.select({
              ios: undefined,
              android: theme.backgroundRoot,
              web: theme.backgroundRoot,
            }),
          },
          headerTitleAlign: "center",
        })}
      >
        <Tab.Screen
          name="Home"
          component={TripPlannerScreen}
          options={{
            tabBarLabel: "일정",
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarLabel: "지도",
            headerTitle: "지도",
          }}
        />
        <Tab.Screen
          name="Plan"
          component={EmptyPlaceholder}
          options={{
            tabBarButton: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
          }}
        />
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarLabel: "설정",
            headerTitle: "관리자",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "프로필",
            headerTitle: "프로필",
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  fabGradient: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
});
