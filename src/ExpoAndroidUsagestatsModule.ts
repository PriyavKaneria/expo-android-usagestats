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
