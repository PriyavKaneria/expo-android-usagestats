import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAndroidUsagestatsViewProps } from './ExpoAndroidUsagestats.types';

const NativeView: React.ComponentType<ExpoAndroidUsagestatsViewProps> =
  requireNativeView('ExpoAndroidUsagestats');

export default function ExpoAndroidUsagestatsView(props: ExpoAndroidUsagestatsViewProps) {
  return <NativeView {...props} />;
}
