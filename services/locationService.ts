import { TASK_NAME } from "@/constants/taskName";
import * as Location from "expo-location";

/**
 * Requests foreground and background location permissions.
 * @returns Permission statuses for foreground and background.
 */
export async function requestLocationPermissionsAsync() {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== Location.PermissionStatus.GRANTED) {
    console.warn("Foreground location permission denied.");
    return {
      foregroundStatus: foreground.status,
      backgroundStatus: null,
      canAskAgain: foreground.canAskAgain,
    };
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== Location.PermissionStatus.GRANTED) {
    console.warn("Background location permission denied.");
    return {
      foregroundStatus: foreground.status,
      backgroundStatus: background.status,
      canAskAgain: background.canAskAgain,
    };
  }

  return {
    foregroundStatus: foreground.status,
    backgroundStatus: background.status,
    canAskAgain: true, // 둘 다 허용된 경우엔 true로 간주
  };
}

/**
 * Starts background location updates if not already started.
 */
export async function startLocationUpdatesAsync() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    TASK_NAME.locationTask
  );

  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(TASK_NAME.locationTask);
    return;
  }

  await Location.startLocationUpdatesAsync(TASK_NAME.locationTask, {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 60 * 1000, // 1 minute
    distanceInterval: 100, // 100 meters
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Tracking Location",
      notificationBody: "App is collecting location in background",
    },
    pausesUpdatesAutomatically: false,
  });
  console.log("Background location updates started.");
}

/**
 * Stops background location updates if running.
 */
export async function stopLocationUpdatesAsync() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    TASK_NAME.locationTask
  );

  if (!hasStarted) {
    console.log("Background updates not running.");
    return;
  }

  await Location.stopLocationUpdatesAsync(TASK_NAME.locationTask);
  console.log("Background location updates stopped.");
}

export async function getLastKnownPositionAsync() {
  try {
    const position = await Location.getLastKnownPositionAsync();

    if (!position) {
      console.warn("No last known position available.");
      return null;
    }

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error("Failed to get last known position:", error);
    return null;
  }
}

export async function hasLocationPermissions() {
  const foregroundStatus = await Location.getForegroundPermissionsAsync();
  const backgroundStatus = await Location.getBackgroundPermissionsAsync();

  return {
    isForgroundPermission: foregroundStatus.granted,
    isBackgroundPermission: backgroundStatus.granted,
  };
}
