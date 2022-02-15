import { Constructor } from 'global';
import { BaseTracker } from './base-tracker';
import { TimeTracker } from './time-tracker';
import { TrashTracker } from './trash-tracker';

export enum TimeType {
  Trash,
  Time,
}

export function TimeEntityGenerator(
  type: TimeType.Trash,
): Constructor<TrashTracker>;

export function TimeEntityGenerator(
  type: TimeType.Time,
): Constructor<TimeTracker>;

export function TimeEntityGenerator(): Constructor<BaseTracker>;

// Still not figure way to fix type
export function TimeEntityGenerator(type?: TimeType) {
  if (!type) return BaseTracker;

  if (type === TimeType.Time) return TimeTracker;
  if (type === TimeType.Trash) return TrashTracker;
  throw new Error(
    `Type must be one of TimeType keys: ${Object.keys(TimeType).toString()}`,
  );
}
