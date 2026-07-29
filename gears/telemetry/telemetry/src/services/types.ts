import type { TelemetryLogEventParams, TelemetryUserId } from '../utils/eventTypes';
import type { TelemetryPluginOption } from '../utils/types';

export type TelemetryService = {
  plugin: (...newPlugins: TelemetryPluginOption[]) => TelemetryService;
  start: () => TelemetryService;
  destroy: () => void;
  logEvent: TelemetryLogEvent;
  /** Attach a user id to subsequent events. Call with no argument to clear it. */
  identify: (id?: TelemetryUserId) => TelemetryService;
};

export type TelemetryLogEvent = (...args: TelemetryLogEventParams) => void;
