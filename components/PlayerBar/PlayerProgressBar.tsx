import React, { FC } from 'react';
import Slider from '@material-ui/core/Slider';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

export const playerProgressBarHeight = 28;

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'PlayerProgressBar' },
);

type PlayerProgressBarProps = {
    /**
     * The current time in seconds.
     */
    currentTime: number;
    /**
     * Duration of the media in seconds.
     */
    duration: number;
    className?: string;
    onCurrentTimeChange?: (currentTime: number) => void;
};

export const PlayerProgressBar: FC<PlayerProgressBarProps> = (props) => {
    const { className, duration, currentTime, onCurrentTimeChange } = props;
    const classes = useStyles();

    // converts seconds to percent
    const value = duration !== 0 ? (currentTime * 100) / duration : 0;

    const handleChange = (
        event: React.ChangeEvent<{}>,
        newValue: number | number[],
    ) => {
        // converts percent to seconds
        const newTime = (duration * (newValue as number)) / 100;

        if (onCurrentTimeChange) {
            onCurrentTimeChange(newTime);
        }
    };

    return (
        <Slider
            className={clsx(classes.root, className)}
            value={value}
            onChange={handleChange}
        />
    );
};
