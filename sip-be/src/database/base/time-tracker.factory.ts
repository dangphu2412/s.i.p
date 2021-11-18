import { TimeTracker as DefaultTimeTracker } from './time-tracker.entity';
import { TrashTracker } from './trash-tracker.entity';
import { UpdateTracker } from './update-tracker.entity';

export enum TIME_TYPE {
  UPDATE_TRACKER,
  TRASH_TRACKER,
}

export function TimeTracker<T extends TIME_TYPE>(type?: T) {
  if (!type) {
    return DefaultTimeTracker;
  }

  if (type === TIME_TYPE.TRASH_TRACKER) {
    return TrashTracker;
  }

  if (type === TIME_TYPE.UPDATE_TRACKER) {
    return UpdateTracker;
  }
}
