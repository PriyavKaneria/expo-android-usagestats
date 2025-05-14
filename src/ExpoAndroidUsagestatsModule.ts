import { requireNativeModule } from "expo-modules-core"
import {
	ExpoAndroidUsagestatsInterface,
	UsageStatsIntervalType,
} from "./ExpoAndroidUsagestats.types"

/**
 * Native module for accessing Android UsageStats API
 */
const ExpoAndroidUsagestats: ExpoAndroidUsagestatsInterface =
	requireNativeModule("ExpoAndroidUsagestats")

/**
 * Helper method to check if the app has permission to access usage stats
 * @returns Promise<boolean> - true if permission is granted, false otherwise
 */
export async function hasUsageStatsPermission() {
	return await ExpoAndroidUsagestats.hasUsageStatsPermission()
}

/**
 * Helper method to open system settings to request usage stats permission
 * @returns Promise<null>
 */
export async function requestUsageStatsPermission() {
	return await ExpoAndroidUsagestats.requestUsageStatsPermission()
}

/**
 * Helper method to get all installed apps
 * @returns Promise<AppInfo[]> - Array of app info objects
 */
export async function getInstalledApps() {
	const installedApps = await ExpoAndroidUsagestats.getInstalledApps()
	const appInfos = []
	for (const app of installedApps) {
		const appInfo = await ExpoAndroidUsagestats.getAppInfo(app)
		appInfos.push(appInfo)
	}
	return appInfos
}

/**
 * Helper method to get usage stats for a specific time period
 * @param startDate Start date in milliseconds
 * @param endDate End date in milliseconds
 * @returns Promise<UsageStats[]> - Array of usage stats objects
 */
export async function getUsageStats(startDate: number, endDate: number) {
	return await ExpoAndroidUsagestats.getUsageStats(startDate, endDate)
}

/**
 * Helper method to get usage events for a specific time period
 * @param startDate Start date in milliseconds
 * @param endDate End date in milliseconds
 * @returns Promise<UsageEvent[]> - Array of usage stats objects
 */
export async function getUsageEvents(startDate: number, endDate: number) {
	return await ExpoAndroidUsagestats.getUsageEvents(startDate, endDate)
}

/**
 * Helper method to get aggregated usage stats for a specific time period and interval
 * @param startDate Start date in milliseconds
 * @param endDate End date in milliseconds
 * @param interval Interval type (e.g., daily, weekly, monthly)
 * @returns Promise<UsageStats[]> - Array of aggregated usage stats objects
 */
export async function getAggregatedUsageStats(
	startDate: number,
	endDate: number,
	interval: UsageStatsIntervalType
) {
	return await ExpoAndroidUsagestats.getAggregatedUsageStats(
		startDate,
		endDate,
		interval
	)
}

export default ExpoAndroidUsagestats
