// Shared types - re-export all domain types

export type { Machine } from './machines';

export type {
  ScanState,
  OnboardStep,
  ConnectionState,
  ScanErrorType,
  ScanError,
  StatusCode,
  GATTClientEvents,
} from './bluetooth';

export { STATUS_CODES } from './bluetooth';
