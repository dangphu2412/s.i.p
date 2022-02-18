import d from 'dayjs';

export class DateUtils {
    public static diff(date1: Date, date2: Date): string {
        const d1 = d(date1);
        const d2 = d(date2);
        let diff = d1.diff(d2, 'month');
        if (diff !== 0) {
            return `${diff} month${diff > 1 ? 's' : ''} ago`;
        }
        diff = d1.diff(d2, 'day');
        if (diff !== 0) {
            return `${diff} day${diff > 1 ? 's' : ''} ago`;
        }
        diff = d1.diff(d2, 'hour');
        if (diff !== 0) {
            return `${diff} hour${diff > 1 ? 's' : ''} ago`;
        }
        diff = d1.diff(d2, 'minute');

        return diff === 0 ? 'a few seconds ago' : `${diff} minute${diff > 1 ? 's' : ''} ago`;
    }
}
