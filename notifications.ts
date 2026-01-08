import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage key to track last shown word index
 */
const LAST_INDEX_KEY = "last_word_index";

/**
 * Configure notification behavior (mobile only)
 */
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Request notification permission
 */
export async function requestPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Schedule an hourly repeating notification
 */
export async function scheduleHourlyNotification(word: string) {
  if (Platform.OS === "web") return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger: Notifications.TimeIntervalTriggerInput = {
    seconds: 3600,
    repeats: true,
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Word of the Day",
      body: word,
    },
    trigger,
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelNotifications() {
  if (Platform.OS === "web") return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get the last stored word index
 */
export async function getLastIndex(): Promise<number | null> {
  const value = await AsyncStorage.getItem(LAST_INDEX_KEY);
  return value ? Number(value) : null;
}

/**
 * Store the current word index
 */
export async function setLastIndex(index: number) {
  await AsyncStorage.setItem(LAST_INDEX_KEY, String(index));
}
