import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  Alert,
} from "react-native";
import { useEffect } from "react";
import words from "../data/words.json";
import {
  requestPermission,
  scheduleHourlyNotification,
  cancelNotifications,
  getLastIndex,
  setLastIndex,
} from "../../notifications";

/**
 * Calculate today's word index (midnight-safe)
 */
function getTodayIndex(wordsLength: number) {
  const startDate = new Date("2026-01-01");

  const now = new Date();

  // Normalize to local midnight
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startMidnight = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const daysSinceStart = Math.floor(
    (todayMidnight.getTime() - startMidnight.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return daysSinceStart % wordsLength;
}

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // 🔑 Word index + word
  const index = getTodayIndex(words.length);
  const word = words[index];

  /**
   * 🔔 Sync notifications when index (day) changes
   */
  useEffect(() => {
    async function updateIndexAndNotifications() {
      const lastIndex = await getLastIndex();

      if (lastIndex !== index) {
        await scheduleHourlyNotification(word.word);
        await setLastIndex(index);
      }
    }

    updateIndexAndNotifications();
  }, [index]);

  async function enableReminders() {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Permission required",
        "Please enable notifications in system settings."
      );
      return;
    }

    await scheduleHourlyNotification(word.word);
    await setLastIndex(index);
    Alert.alert("Enabled", "Hourly reminders are now on.");
  }

  async function disableReminders() {
    await cancelNotifications();
    Alert.alert("Disabled", "Hourly reminders are off.");
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0f0f0f" : "#ffffff" },
      ]}
    >
      <Text style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}>
        Word of the Day
      </Text>

      <Text style={[styles.word, { color: isDark ? "#f5f5f5" : "#111111" }]}>
        {word.word}
      </Text>

      <Text style={[styles.label, { color: isDark ? "#bbbbbb" : "#444444" }]}>
        Definition
      </Text>
      <Text style={{ color: isDark ? "#dddddd" : "#222222" }}>
        {word.definition}
      </Text>

      <Text style={[styles.label, { color: isDark ? "#bbbbbb" : "#444444" }]}>
        Example
      </Text>
      <Text style={{ color: isDark ? "#dddddd" : "#222222" }}>
        "{word.example}"
      </Text>

      <Pressable style={styles.primaryButton} onPress={enableReminders}>
        <Text style={styles.buttonText}>Enable Hourly Reminders</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={disableReminders}>
        <Text style={styles.buttonText}>Disable Reminders</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  word: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    marginTop: 20,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 30,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
  },
  secondaryButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
  },
});
