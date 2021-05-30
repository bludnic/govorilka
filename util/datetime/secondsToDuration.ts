import intervalToDuration from 'date-fns/intervalToDuration';

/**
 * Format a duration from seconds.
 *
 * 100 seconds => 01:40
 * @param secondsParam
 */
export function secondsToDuration(secondsParam: number): string {
    const duration = intervalToDuration({
        start: 0,
        end: secondsParam * 1000,
    });

    const minutes = duration.minutes
        ? duration.minutes.toString().padStart(2, '0')
        : '0';
    const seconds = duration.seconds
        ? duration.seconds.toString().padStart(2, '0')
        : '00';

    return [minutes, seconds].filter((v) => !!v).join(':');
}
