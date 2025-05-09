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
 * Helper method to get usage stats for a specific time period
 * @param days Number of days to look back
 * @returns Promise<UsageStats[]> - Array of usage stats objects
 */
export async function getUsageStatsForLastDays(days: number) {
	const endTime = Date.now()
	const startTime = endTime - days * 24 * 60 * 60 * 1000 // days to milliseconds
	return await ExpoAndroidUsagestats.getUsageStats(startTime, endTime)
}

/**
 * Helper method to get usage stats for today
 * @returns Promise<UsageStats[]> - Array of usage stats objects
 */
export async function getTodayUsageStats() {
	const endTime = Date.now()
	const startTime = new Date().setHours(0, 0, 0, 0) // Start of today
	return await ExpoAndroidUsagestats.getUsageStats(startTime, endTime)
}

/**
 * Helper method to get usage stats for this week
 * @returns Promise<UsageStats[]> - Array of usage stats objects
 */
export async function getThisWeekUsageStats() {
	const endTime = Date.now()
	const now = new Date()
	const dayOfWeek = now.getDay()
	const startOfWeek = new Date(now)
	startOfWeek.setDate(now.getDate() - dayOfWeek)
	startOfWeek.setHours(0, 0, 0, 0)
	return await ExpoAndroidUsagestats.getUsageStats(
		startOfWeek.getTime(),
		endTime
	)
}

/**
 * Helper method to get usage events for a specific time period
 * @param days Number of days to look back
 * @returns Promise<UsageEvent[]> - Array of usage event objects
 */
export async function getUsageEventsForLastDays(days: number) {
	const endTime = Date.now()
	const startTime = endTime - days * 24 * 60 * 60 * 1000 // days to milliseconds
	return await ExpoAndroidUsagestats.getUsageEvents(startTime, endTime)
}

/**
 * Helper method to get monthly usage stats
 * @param months Number of months to look back
 * @returns Promise<UsageStats[]> - Array of usage stats objects
 */
export async function getMonthlyUsageStats(months: number = 1) {
	const endTime = Date.now()
	const startTime = endTime - months * 30 * 24 * 60 * 60 * 1000 // approximate months to milliseconds
	return await ExpoAndroidUsagestats.getAggregatedUsageStats(
		startTime,
		endTime,
		UsageStatsIntervalType.INTERVAL_MONTHLY
	)
}

export default ExpoAndroidUsagestats
