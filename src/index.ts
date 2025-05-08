// Reexport the native module. On web, it will be resolved to ExpoAndroidUsagestatsModule.web.ts
// and on native platforms to ExpoAndroidUsagestatsModule.ts
export { default } from './ExpoAndroidUsagestatsModule';
export { default as ExpoAndroidUsagestatsView } from './ExpoAndroidUsagestatsView';
export * from  './ExpoAndroidUsagestats.types';
