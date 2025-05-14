/**
 * Interval types for usage stats aggregation
 */
export enum UsageStatsIntervalType {
	INTERVAL_DAILY = 0,
	INTERVAL_WEEKLY = 1,
	INTERVAL_MONTHLY = 2,
	INTERVAL_YEARLY = 3,
	INTERVAL_BEST = 4,
}

/**
 * Event types for usage events
 */
export enum UsageEventType {
	NONE = 0,
	MOVE_TO_FOREGROUND = 1,
	MOVE_TO_BACKGROUND = 2,
	CONFIGURATION_CHANGE = 5,
	USER_INTERACTION = 7,
	SHORTCUT_INVOCATION = 8,
	ACTIVITY_RESUMED = 1, // ACTIVITY_RESUMED (internal constant)
	ACTIVITY_PAUSED = 2, // ACTIVITY_PAUSED (internal constant)
	FOREGROUND_SERVICE_START = 5, // FOREGROUND_SERVICE_START (internal constant)
	FOREGROUND_SERVICE_STOP = 6, // FOREGROUND_SERVICE_STOP (internal constant)
	SCREEN_INTERACTIVE = 7, // SCREEN_INTERACTIVE (internal constant)
	SCREEN_NON_INTERACTIVE = 8, // SCREEN_NON_INTERACTIVE (internal constant)
	KEYGUARD_SHOWN = 9, // KEYGUARD_SHOWN (internal constant)
	KEYGUARD_HIDDEN = 10, // KEYGUARD_HIDDEN (internal constant)
	NOTIFICATION_SEEN = 11, // NOTIFICATION_SEEN (internal constant)
	SLICE_PINNED = 12, // SLICE_PINNED (internal constant)
	SLICE_UNPINNED = 13, // SLICE_UNPINNED (internal constant)
	SYSTEM_INTERACTION = 15, // SYSTEM_INTERACTION (internal constant)
	STANDBY_BUCKET_CHANGED = 16, // STANDBY_BUCKET_CHANGED (internal constant)
	NOTIFICATION_INTERRUPTION = 17, // NOTIFICATION_INTERRUPTION (internal constant)
	DEVICE_SHUTDOWN = 18, // DEVICE_SHUTDOWN (internal constant)
	DEVICE_STARTUP = 19, // DEVICE_STARTUP (internal constant)
	USER_STOPPED = 23, // USER_STOPPED (internal constant)
	USER_STARTED = 24, // USER_STARTED (internal constant)
}

/**
 * App standby bucket types
 */
export enum AppStandbyBucket {
	ACTIVE = 10,
	WORKING_SET = 20,
	FREQUENT = 30,
	RARE = 40,
	RESTRICTED = 45,
	NEVER = 50,
}

/**
 * Interface for UsageStats object
 */
export interface UsageStats {
	packageName: string
	firstTimeStamp: number
	lastTimeStamp: number
	lastTimeUsed: number
	totalTimeInForeground: number
	totalTimeVisible?: number // API 29+ (Android Q)
	lastTimeForegroundServiceUsed?: number // API 29+ (Android Q)
	totalTimeForegroundServiceUsed?: number // API 29+ (Android Q)
	describeContents: number
}

/**
 * Interface for UsageEvent object
 */
export interface UsageEvent {
	packageName: string
	className?: string
	timeStamp: number
	eventType: number
	eventTypeName: string
	configuration?: string // API 26+ (Android O)
	shortcutId?: string // API 28+ (Android P)
}

/**
 * Interface for AppInfo object
 */
export interface AppInfo {
	packageName: string
	appName: string
	icon: string
	category: string
}

export interface ExpoAndroidUsagestatsInterface {
	/**
	 * Check if the app has permission to access usage stats
	 * @returns Promise<boolean> - true if permission is granted, false otherwise
	 */
	hasUsageStatsPermission(): Promise<boolean>

	/**
	 * Open system settings to request usage stats permission
	 * @returns Promise<null>
	 */
	requestUsageStatsPermission(): Promise<null>

	/**
	 * Get all installed apps
	 * @returns Promise<string[]> - Array of package names
	 */
	getInstalledApps(): Promise<string[]>

	/**
	 * Get app info for a specific package name
	 * @param packageName The package name of the app
	 * @returns Promise<AppInfo> - App info object
	 */
	getAppInfo(packageName: string): Promise<AppInfo>

	/**
	 * Get usage stats for all apps within a time range
	 * @param startTime The beginning of the range in milliseconds
	 * @param endTime The end of the range in milliseconds
	 * @returns Promise<UsageStats[]> - Array of usage stats objects
	 */
	getUsageStats(startTime: number, endTime: number): Promise<UsageStats[]>

	/**
	 * Get usage events within a time range
	 * @param startTime The beginning of the range in milliseconds
	 * @param endTime The end of the range in milliseconds
	 * @returns Promise<UsageEvent[]> - Array of usage event objects
	 */
	getUsageEvents(startTime: number, endTime: number): Promise<UsageEvent[]>

	/**
	 * Get aggregated usage stats using a specific interval type
	 * @param startTime The beginning of the range in milliseconds
	 * @param endTime The end of the range in milliseconds
	 * @param intervalType The type of interval (daily, weekly, monthly, yearly)
	 * @returns Promise<UsageStats[]> - Array of usage stats objects
	 */
	getAggregatedUsageStats(
		startTime: number,
		endTime: number,
		intervalType: UsageStatsIntervalType
	): Promise<UsageStats[]>
}
