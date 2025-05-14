# expo-android-usagestats

`expo-android-usagestats` is an Expo module that provides access to Android's UsageStats API. This module allows you to retrieve app usage statistics, usage events, and aggregated usage data for a specified time range. It is particularly useful for building apps that need to analyze user behavior or monitor app usage patterns.

## Features

- Request and check for the necessary permissions to access usage stats.
- Retrieve app usage statistics for a specific time range.
- Fetch usage events such as app launches, configuration changes, and more.
- Get aggregated usage statistics based on daily, weekly, monthly, or yearly intervals.

---

## Installation

### Managed Expo Projects

For managed Expo projects, follow the installation instructions in the [Expo Modules documentation](https://docs.expo.dev/modules/overview/).

### Bare React Native Projects

For bare React Native projects, ensure you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before proceeding.

1. Add the package to your dependencies:

   ```bash
   npm install expo-android-usagestats
   ```

2. Configure Android permissions in your `AndroidManifest.xml`:

   ```xml
   <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />
   ```

3. Rebuild your app:

   ```bash
   npx expo prebuild
   ```

---

## API Documentation

### `hasUsageStatsPermission()`

Checks if the app has permission to access usage stats.

```ts
async function hasUsageStatsPermission(): Promise<boolean>
```

**Returns**: A promise that resolves to `true` if permission is granted, otherwise `false`.

---

### `requestUsageStatsPermission()`

Opens the system settings to request usage stats permission.

```ts
async function requestUsageStatsPermission(): Promise<null>
```

**Returns**: A promise that resolves to `null` after the settings screen is opened.

---

### `getInstalledApps()`

Retrieves a list of all installed apps.

```ts
async function getInstalledApps(): Promise<AppInfo[]>
```

**Returns**: A promise that resolves to an array of `AppInfo` objects.

---

### `getUsageStats(startTime: number, endTime: number)`

Retrieves usage statistics for all apps within a specified time range.

```ts
async function getUsageStats(startTime: number, endTime: number): Promise<UsageStats[]>
```

**Parameters**:
- `startTime`: The beginning of the range in milliseconds.
- `endTime`: The end of the range in milliseconds.

**Returns**: A promise that resolves to an array of `UsageStats` objects.

---

### `getUsageEvents(startTime: number, endTime: number)`

Fetches usage events within a specified time range.

```ts
async function getUsageEvents(startTime: number, endTime: number): Promise<UsageEvent[]>
```

**Parameters**:
- `startTime`: The beginning of the range in milliseconds.
- `endTime`: The end of the range in milliseconds.

**Returns**: A promise that resolves to an array of `UsageEvent` objects.

---

### `getAggregatedUsageStats(startTime: number, endTime: number, interval: UsageStatsIntervalType)`

Retrieves aggregated usage statistics for a specific time range and interval.

```ts
async function getAggregatedUsageStats(
  startTime: number,
  endTime: number,
  interval: UsageStatsIntervalType
): Promise<UsageStats[]>
```

**Parameters**:
- `startTime`: The beginning of the range in milliseconds.
- `endTime`: The end of the range in milliseconds.
- `interval`: The interval type (`INTERVAL_DAILY`, `INTERVAL_WEEKLY`, `INTERVAL_MONTHLY`, `INTERVAL_YEARLY`).

**Returns**: A promise that resolves to an array of aggregated `UsageStats` objects.

---

## Types

### `AppInfo`

Represents information about an installed app.

```ts
interface AppInfo {
  packageName: string
  appName: string
  icon: string
  category: string
}
```

---

### `UsageStats`

Represents app usage statistics.

```ts
interface UsageStats {
  packageName: string
  firstTimeStamp: number
  lastTimeStamp: number
  lastTimeUsed: number
  totalTimeInForeground: number
  totalTimeVisible?: number
  lastTimeForegroundServiceUsed?: number
  totalTimeForegroundServiceUsed?: number
  describeContents: number
}
```

---

### `UsageEvent`

Represents a usage event.

```ts
interface UsageEvent {
  packageName: string
  className?: string
  timeStamp: number
  eventType: number
  eventTypeName: string
  configuration?: string
  shortcutId?: string
}
```

---

### `UsageStatsIntervalType`

Defines interval types for aggregated usage stats.

```ts
enum UsageStatsIntervalType {
  INTERVAL_DAILY = 0,
  INTERVAL_WEEKLY = 1,
  INTERVAL_MONTHLY = 2,
  INTERVAL_YEARLY = 3,
  INTERVAL_BEST = 4
}
```

---

## Example Usage

```tsx
import React, { useEffect } from "react"
import ExpoAndroidUsagestats, {
  getUsageStats,
  getAggregatedUsageStats,
  UsageStatsIntervalType,
} from "expo-android-usagestats"

export default function App() {
  useEffect(() => {
    (async () => {
      const hasPermission = await ExpoAndroidUsagestats.hasUsageStatsPermission()
      if (!hasPermission) {
        await ExpoAndroidUsagestats.requestUsageStatsPermission()
      } else {
        const now = Date.now()
        const yesterday = now - 24 * 60 * 60 * 1000

        const usageStats = await getUsageStats(yesterday, now)
        console.log("Usage Stats:", usageStats)

        const aggregatedStats = await getAggregatedUsageStats(
          yesterday,
          now,
          UsageStatsIntervalType.INTERVAL_DAILY
        )
        console.log("Aggregated Stats:", aggregatedStats)
      }
    })()
  }, [])

  return null
}
```

---

## References

- [Android UsageStatsManager API](https://developer.android.com/reference/android/app/usage/UsageStatsManager)
- [Expo Modules Documentation](https://docs.expo.dev/modules/overview/)

---

## Contributing

Contributions are welcome! Please refer to the [contributing guide](https://github.com/PriyavKaneria/expo-android-usagestats#contributing) for more details.

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/PriyavKaneria/expo-android-usagestats/blob/main/LICENSE) file for details.