import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_INDEX_KEY = "LAST_WORD_INDEX";

// Expo SDK–compliant notification handler
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleHourlyNotification(word: string) {
  // prevent duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Word of the Day",
      body: `Today's word: ${word}`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3600,
      repeats: true,
    },
  });
}

export async function cancelNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getLastIndex() {
  const value = await AsyncStorage.getItem(LAST_INDEX_KEY);
  return value ? Number(value) : null;
}

export async function setLastIndex(index: number) {
  await AsyncStorage.setItem(LAST_INDEX_KEY, index.toString());
}
