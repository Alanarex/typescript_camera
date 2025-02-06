import { vibrateForNotification } from '../pages/vibrator';

export const showNotification = (title: string, options?: NotificationOptions, vibrationPattern?: number | number[]) => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
    if (vibrationPattern) {
      vibrateForNotification(vibrationPattern);
    }
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options);
        if (vibrationPattern) {
          vibrateForNotification(vibrationPattern);
        }
      }
    });
  }
};

export const triggerVibration = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  } else {
    console.warn('Vibration API is not supported by this browser.');
  }
};