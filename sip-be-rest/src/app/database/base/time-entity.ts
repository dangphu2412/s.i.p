import { BaseTracker } from './base-tracker';
import { TimeTracker } from './time-tracker';
import { TrashTracker } from './trash-tracker';

export enum TimeType {
  TrashTracker,
  TimeTracker,
}

export interface TimeGenerator {
  (): BaseTracker;
  (type: TimeType): TrashTracker | TimeTracker;
}

// Still not figure way to fix type
export const TimeEntityGenerator = (type?: TimeType) => {
  if (!type) return BaseTracker;

  const typeToClass = {
    [TimeType.TrashTracker]: TrashTracker,
    [TimeType.TimeTracker]: TimeTracker,
  };

  return typeToClass[type];
};
