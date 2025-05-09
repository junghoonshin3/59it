import { TASK_NAME } from "@/constants/taskName";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

// TaskManager.defineTask(TASK_NAME.locationTask, async ({ data, error }) => {
//   if (error) {
//     console.error(`Location collection error: ${error.message}`);
//     return;
//   }
//   const lastLocation = (data as { locations: Location.LocationObject[] })
//     .locations[0];
//   console.log("위치 데이터:", lastLocation);
// });

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

export async function watchPositionAsync() {}

/**
 * Starts background location updates if not already started.
 */
export async function startLocationUpdatesAsync() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    TASK_NAME.locationTask
  );

  if (hasStarted) {
    console.log("Background location already started.");
    // await Location.stopLocationUpdatesAsync(TASK_NAME.locationTask);
    return;
  }
  console.log("Background location updates started.");

  await Location.startLocationUpdatesAsync(TASK_NAME.locationTask, {
    accuracy: Location.Accuracy.Highest,
    timeInterval: 1000,
    distanceInterval: 1,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Using your location",
      notificationBody:
        "To turn off, go back to the app and switch something off.",
    },
  });
}

/**
 * Stops background location updates if running.
 */
export async function stopLocationUpdatesAsync() {
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

export async function getCurrentPositionAsync() {
  try {
    const position = await Location.getCurrentPositionAsync();

    if (!position) {
      console.warn("No Current position available.");
      return null;
    }

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error("Failed to get Current position:", error);
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
