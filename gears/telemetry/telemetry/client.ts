export { createTelemetry } from './src/client';
export type { TelemetryService, TelemetryLogEvent } from './src/client';
export { telemetryElementHookKey } from './src/client';
export type {
  TelemetryElementHook,
  TelemetryElementHookAttribution,
  TelemetryElementHookResult,
} from './src/client';
export { telemetryLocalePlugin } from './src/plugins/locale';
export type { LocaleSource } from './src/plugins/locale';
export type {
  TelemetryEventRecord,
  TelemetryLogEventParams,
  TelemetryData,
} from './src/utils/eventTypes';
export type { TelemetryConfig } from './src/utils/types';
