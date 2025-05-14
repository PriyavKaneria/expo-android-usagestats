package expo.modules.androidusagestats

import android.app.usage.UsageEvents
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.os.Build
import android.provider.Settings
import android.util.Log
import android.util.Base64
import android.graphics.drawable.BitmapDrawable
import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import android.content.pm.ApplicationInfo
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.exception.CodedException
import java.lang.Exception
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.*
import java.io.ByteArrayOutputStream

class ExpoAndroidUsagestatsModule : Module() {
  private val context
    get() = requireNotNull(appContext.reactContext) {
      "React Application Context is null"
    }
  
  override fun definition() = ModuleDefinition {
    Name("ExpoAndroidUsagestats")

    AsyncFunction("hasUsageStatsPermission") { promise: Promise ->
      try {
        promise.resolve(hasUsageStatsPermission())
      } catch (e: Exception) {
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }

    AsyncFunction("requestUsageStatsPermission") { promise: Promise ->
      try {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }

    AsyncFunction("getInstalledApps") { promise: Promise ->
      try {
        // searching main activities labeled to be launchers of the apps
        val pm = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null)
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER)

        val resolvedInfos = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            pm.queryIntentActivities(
                mainIntent,
                PackageManager.ResolveInfoFlags.of(0L)
            )
        } else {
            pm.queryIntentActivities(mainIntent, 0)
        }
        promise.resolve(resolvedInfos.map { it.activityInfo.packageName })
      } catch (e: Exception) {
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }

    AsyncFunction("getAppInfo") { packageName: String, promise: Promise ->
      try {
        val appInfo = context.packageManager.getApplicationInfo(packageName, 0)
        // val icon = appInfo.getIconResoir(context.packageManager)
        promise.resolve(mapOf(
          "packageName" to appInfo.packageName,
          "appName" to appInfo.loadLabel(context.packageManager).toString(),
          "icon" to "",
          "category" to ApplicationInfo.getCategoryTitle(context, appInfo.category)
        ))
      } catch (e: Exception) {
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }

    AsyncFunction("getUsageStats") { startTime: Long, endTime: Long, promise: Promise ->
      try {
        if (!hasUsageStatsPermission()) {
          promise.reject(CodedException("PERMISSION_DENIED"))
          return@AsyncFunction
        }

        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val usageStats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)
        
        val result = usageStats.map {
          mapUsageStats(it)
        }
        
        promise.resolve(result)
      } catch (e: Exception) {
        Log.e("ExpoAndroidUsagestats", "Error getting usage stats", e)
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }

    AsyncFunction("getUsageEvents") { startTime: Long, endTime: Long, promise: Promise ->
      try {
        if (!hasUsageStatsPermission()) {
          promise.reject(CodedException("PERMISSION_DENIED"))
          return@AsyncFunction
        }

        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
        
        val result = mutableListOf<Map<String, Any?>>()
        val event = UsageEvents.Event()
        
        while (usageEvents.hasNextEvent()) {
          usageEvents.getNextEvent(event)
          result.add(mapUsageEvent(event))
        }
        
        promise.resolve(result)
      } catch (e: Exception) {
        Log.e("ExpoAndroidUsagestats", "Error getting usage events", e)
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }

    AsyncFunction("getAggregatedUsageStats") { startTime: Long, endTime: Long, intervalType: Int, promise: Promise ->
      try {
        if (!hasUsageStatsPermission()) {
          promise.reject(CodedException("PERMISSION_DENIED"))
          return@AsyncFunction
        }

        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val usageStats = usageStatsManager.queryUsageStats(intervalType, startTime, endTime)
        
        val result = usageStats.map {
          mapUsageStats(it)
        }
        
        promise.resolve(result)
      } catch (e: Exception) {
        Log.e("ExpoAndroidUsagestats", "Error getting aggregated usage stats", e)
        promise.reject(CodedException("OPERATION_FAILED", "Details about the failure", e))
      }
    }
  }

  private fun hasUsageStatsPermission(): Boolean {
    val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    val time = System.currentTimeMillis()
    val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 60, time)
    return stats.isNotEmpty()
  }

  private fun encodeIcon(icon: Drawable): String {
    var appIcon64: String? = null
    if (icon == null) {
      return ""
    }
    val outputStream = ByteArrayOutputStream() 

    val bitDw = (icon as BitmapDrawable)
    val bitmap = bitDw.bitmap 
    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream)
    val bitmapByte = outputStream.toByteArray()

    appIcon64 = Base64.encodeToString(bitmapByte, Base64.DEFAULT)

    return appIcon64
  }


  private fun mapUsageStats(usageStats: UsageStats): Map<String, Any?> {
    return mapOf(
      "packageName" to usageStats.packageName,
      "firstTimeStamp" to usageStats.firstTimeStamp,
      "lastTimeStamp" to usageStats.lastTimeStamp,
      "lastTimeUsed" to usageStats.lastTimeUsed,
      "totalTimeInForeground" to usageStats.totalTimeInForeground,
      "totalTimeVisible" to if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) usageStats.totalTimeVisible else null,
      "lastTimeForegroundServiceUsed" to if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) usageStats.lastTimeForegroundServiceUsed else null,
      "totalTimeForegroundServiceUsed" to if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) usageStats.totalTimeForegroundServiceUsed else null,
      "describeContents" to usageStats.describeContents()
    )
  }

  private fun mapUsageEvent(event: UsageEvents.Event): Map<String, Any?> {
    return mapOf(
      "packageName" to event.packageName,
      "className" to event.className,
      "timeStamp" to event.timeStamp,
      "eventType" to event.eventType,
      "eventTypeName" to getEventTypeName(event.eventType),
      "configuration" to if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O && event.configuration != null) event.configuration.toString() else null,
      "shortcutId" to if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) event.shortcutId else null
    )
  }

  private fun getEventTypeName(eventType: Int): String {
    return when (eventType) {
      UsageEvents.Event.NONE -> "NONE"
      UsageEvents.Event.MOVE_TO_FOREGROUND -> "MOVE_TO_FOREGROUND"
      UsageEvents.Event.MOVE_TO_BACKGROUND -> "MOVE_TO_BACKGROUND"
      UsageEvents.Event.CONFIGURATION_CHANGE -> "CONFIGURATION_CHANGE"
      UsageEvents.Event.USER_INTERACTION -> "USER_INTERACTION"
      UsageEvents.Event.SHORTCUT_INVOCATION -> "SHORTCUT_INVOCATION"
      1 -> "ACTIVITY_RESUMED" // ACTIVITY_RESUMED = 1 (internal constant)
      2 -> "ACTIVITY_PAUSED" // ACTIVITY_PAUSED = 2 (internal constant) 
      5 -> "FOREGROUND_SERVICE_START" // FOREGROUND_SERVICE_START = 5 (internal constant)
      6 -> "FOREGROUND_SERVICE_STOP" // FOREGROUND_SERVICE_STOP = 6 (internal constant)
      7 -> "SCREEN_INTERACTIVE" // SCREEN_INTERACTIVE = 7 (internal constant)
      8 -> "SCREEN_NON_INTERACTIVE" // SCREEN_NON_INTERACTIVE = 8 (internal constant)
      9 -> "KEYGUARD_SHOWN" // KEYGUARD_SHOWN = 9 (internal constant)
      10 -> "KEYGUARD_HIDDEN" // KEYGUARD_HIDDEN = 10 (internal constant)
      11 -> "NOTIFICATION_SEEN" // NOTIFICATION_SEEN = 11 (internal constant)
      12 -> "SLICE_PINNED" // SLICE_PINNED = 12 (internal constant)
      13 -> "SLICE_UNPINNED" // SLICE_UNPINNED = 13 (internal constant)
      15 -> "SYSTEM_INTERACTION" // SYSTEM_INTERACTION = 15 (internal constant)
      16 -> "STANDBY_BUCKET_CHANGED" // STANDBY_BUCKET_CHANGED = 16 (internal constant)
      17 -> "NOTIFICATION_INTERRUPTION" // NOTIFICATION_INTERRUPTION = 17 (internal constant)
      18 -> "DEVICE_SHUTDOWN" // DEVICE_SHUTDOWN = 18 (internal constant)
      19 -> "DEVICE_STARTUP" // DEVICE_STARTUP = 19 (internal constant)
      23 -> "USER_STOPPED" // USER_STOPPED = 23 (internal constant)
      24 -> "USER_STARTED" // USER_STARTED = 24 (internal constant)
      else -> "UNKNOWN_$eventType"
    }
  }

  private fun getAppStandbyBucketName(bucket: Int): String {
    return when (bucket) {
      UsageStatsManager.STANDBY_BUCKET_ACTIVE -> "ACTIVE"
      UsageStatsManager.STANDBY_BUCKET_WORKING_SET -> "WORKING_SET"
      UsageStatsManager.STANDBY_BUCKET_FREQUENT -> "FREQUENT"
      UsageStatsManager.STANDBY_BUCKET_RARE -> "RARE"
      UsageStatsManager.STANDBY_BUCKET_RESTRICTED -> "RESTRICTED"
      else -> "UNKNOWN_$bucket"
    }
  }
}