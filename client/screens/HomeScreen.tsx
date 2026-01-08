import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  useColorScheme,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Spacing, BorderRadius, Brand, Colors } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type Language = {
  code: string;
  flag: string;
  name: string;
  nativeName: string;
};

const LANGUAGES: Language[] = [
  { code: "ko", flag: "🇰🇷", name: "Korean", nativeName: "한국어" },
  { code: "en", flag: "🇺🇸", name: "English", nativeName: "English" },
  { code: "fr", flag: "🇫🇷", name: "French", nativeName: "Français" },
  { code: "zh", flag: "🇨🇳", name: "Chinese", nativeName: "中文" },
  { code: "ja", flag: "🇯🇵", name: "Japanese", nativeName: "日本語" },
  { code: "es", flag: "🇪🇸", name: "Spanish", nativeName: "Español" },
  { code: "de", flag: "🇩🇪", name: "German", nativeName: "Deutsch" },
];

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getAgeGroup(age: number): string {
  if (age < 20) return "10대";
  if (age < 30) return "20대";
  if (age < 40) return "30대";
  if (age < 50) return "40대";
  if (age < 60) return "50대";
  return "60대+";
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);

  const age = useMemo(() => (birthDate ? calculateAge(birthDate) : null), [birthDate]);
  const ageGroup = useMemo(() => (age !== null ? getAgeGroup(age) : null), [age]);
  const isAdult = age !== null && age >= 18;

  const handleDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setBirthDate(date);
      const calculatedAge = calculateAge(date);
      if (calculatedAge < 18) {
        setAgeError("만 18세 이상만 가입 가능합니다");
      } else {
        setAgeError(null);
      }
    }
  };

  const handleSocialLogin = (provider: "kakao" | "google") => {
    if (!isAdult) {
      setAgeError("생년월일을 먼저 입력해주세요 (만 18세 이상)");
      return;
    }
    navigation.navigate("TripPlanner");
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 10);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section - 1/3 */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={Brand.gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Feather name="navigation" size={48} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.brandName, { color: theme.text }]}>VibeTrip</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            AI 맞춤 여행 플래너
          </Text>
        </View>

        {/* Login Section - 2/3 */}
        <View style={styles.loginSection}>
          {/* Language Selector */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            언어 선택
          </Text>
          <Pressable
            style={[styles.selectorButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.flagText}>{selectedLanguage.flag}</Text>
            <Text style={[styles.selectorText, { color: theme.text }]}>
              {selectedLanguage.nativeName}
            </Text>
            <Feather name="chevron-down" size={20} color={theme.textTertiary} />
          </Pressable>

          {/* Birth Date Picker */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: Spacing.xl }]}>
            생년월일
          </Text>
          <Pressable
            style={[
              styles.selectorButton,
              { backgroundColor: theme.backgroundDefault, borderColor: ageError ? "#EF4444" : theme.border },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather name="calendar" size={20} color={Brand.primary} />
            <Text style={[styles.selectorText, { color: birthDate ? theme.text : theme.textTertiary }]}>
              {birthDate ? formatDate(birthDate) : "생년월일을 선택하세요"}
            </Text>
            {age !== null && isAdult && (
              <View style={styles.ageBadge}>
                <Text style={styles.ageBadgeText}>{ageGroup}</Text>
              </View>
            )}
          </Pressable>
          {ageError ? (
            <Text style={styles.errorText}>{ageError}</Text>
          ) : null}

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            {/* Kakao Button */}
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                styles.kakaoButton,
                pressed && styles.buttonPressed,
                !isAdult && styles.buttonDisabled,
              ]}
              onPress={() => handleSocialLogin("kakao")}
              disabled={!isAdult}
            >
              <View style={styles.kakaoIcon}>
                <Text style={styles.kakaoIconText}>K</Text>
              </View>
              <Text style={styles.kakaoButtonText}>카카오로 시작하기</Text>
            </Pressable>

            {/* Google Button */}
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                styles.googleButton,
                { borderColor: theme.border },
                pressed && styles.buttonPressed,
                !isAdult && styles.buttonDisabled,
              ]}
              onPress={() => handleSocialLogin("google")}
              disabled={!isAdult}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={[styles.googleButtonText, { color: theme.text }]}>
                Google로 시작하기
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
            로그인 시 이용약관 및 개인정보처리방침에 동의합니다
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>언어 선택</Text>
              <Pressable onPress={() => setShowLanguageModal(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    selectedLanguage.code === lang.code && styles.languageItemSelected,
                    { borderColor: theme.border },
                  ]}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={styles.flagText}>{lang.flag}</Text>
                  <View style={styles.languageTextContainer}>
                    <Text style={[styles.languageName, { color: theme.text }]}>
                      {lang.nativeName}
                    </Text>
                    <Text style={[styles.languageSubname, { color: theme.textTertiary }]}>
                      {lang.name}
                    </Text>
                  </View>
                  {selectedLanguage.code === lang.code && (
                    <Feather name="check" size={20} color={Brand.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <Pressable
            style={styles.datePickerOverlay}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={[styles.datePickerContainer, { backgroundColor: theme.backgroundDefault }]}>
              <View style={styles.datePickerHeader}>
                <Text style={[styles.datePickerTitle, { color: theme.text }]}>
                  생년월일 선택
                </Text>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Text style={{ color: Brand.primary, fontWeight: "600" }}>완료</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={birthDate || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={maxDate}
                minimumDate={minDate}
                style={styles.datePicker}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  logoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    marginBottom: Spacing["2xl"],
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
  },
  loginSection: {
    flex: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  flagText: {
    fontSize: 24,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  ageBadge: {
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  ageBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  socialButtons: {
    marginTop: Spacing["2xl"],
    gap: Spacing.md,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  kakaoIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  kakaoIconText: {
    color: "#FEE500",
    fontSize: 14,
    fontWeight: "800",
  },
  kakaoButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
  },
  googleIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["3xl"],
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  languageList: {
    paddingHorizontal: Spacing.xl,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  languageItemSelected: {
    backgroundColor: "rgba(66, 133, 244, 0.08)",
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
  },
  languageSubname: {
    fontSize: 13,
    marginTop: 2,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: "90%",
    maxWidth: 360,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  datePicker: {
    height: 200,
  },
});
