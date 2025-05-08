import { NativeModule, requireNativeModule } from 'expo';

import { ExpoAndroidUsagestatsModuleEvents } from './ExpoAndroidUsagestats.types';

declare class ExpoAndroidUsagestatsModule extends NativeModule<ExpoAndroidUsagestatsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAndroidUsagestatsModule>('ExpoAndroidUsagestats');
