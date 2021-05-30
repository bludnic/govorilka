import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import {
    PlayerProgressBar,
    playerProgressBarHeight,
} from './PlayerProgressBar';
import { FlexSpacer } from 'components/FlexSpacer';
import { secondsToDuration } from 'util/datetime';

export const playerBarHeight = 64;

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {
            height: playerBarHeight,
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
        },
        /* Styles applied to the container `div` element. */
        container: {
            height: 'inherit',
            display: 'flex',
        },
        /* Styles applied to the `PlayerProgressBar` component. */
        PlayerProgressBar: {
            position: 'absolute',
            top: -playerProgressBarHeight / 2,
        },
        /* Styles applied to the left controls `div` element. */
        leftControls: {
            display: 'flex',
            alignItems: 'center',
        },
        /* Styles applied to the right controls `div` element. */
        rightControls: {
            display: 'flex',
            alignItems: 'center',
            marginRight: 12,
        },
    }),
    { name: 'PlayerBar' },
);

type PlayerBarProps = {
    className?: string;
    audioContent: string;
    onSkipPrevious?: () => void;
    onSkipNext?: () => void;
    onAudioEnded?: () => void;
};

/**
 * Cross-browser audio basics
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics
 */
export const PlayerBar: FC<PlayerBarProps> = (props) => {
    const {
        className,
        audioContent,
        onSkipNext,
        onSkipPrevious,
        onAudioEnded,
    } = props;
    const classes = useStyles();

    const audio = useMemo(() => {
        return new Audio();
    }, []);
    useEffect(() => {
        audio.src = `data:audio/mpeg;base64,${audioContent}`;
    }, [audioContent]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

    const [currentTime, setCurrentTime] = useState(0);
    const handleCurrentTimeChange = (newCurrentTime: number) => {
        audio.currentTime = newCurrentTime;
    };

    const handlePlay = () => {
        audio.play();
    };

    const handlePause = () => {
        audio.pause();
    };

    const handleSkipPrevious = () => {
        if (onSkipPrevious) {
            onSkipPrevious();
        }
    };

    const handleSkipNext = () => {
        if (onSkipNext) {
            onSkipNext();
        }
    };

    // stop playing audio when leaving page
    useEffect(() => {
        return () => {
            audio.pause();
        };
    }, []);

    /**
     * Media loading events.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics#media_loading_events
     */

    /**
     * Event "loadstart"
     *
     * The `loadstart` event tells us that load process has started
     * and the browser is connecting to the media.
     */
    const onLoadStart = useCallback(() => {
        console.log('onLoadStart');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('loadstart', onLoadStart);

        return () => {
            audio.removeEventListener('loadstart', onLoadStart);
        };
    }, [onLoadStart]);

    /**
     * Event "durationchange"
     *
     * If you just want to know as soon as the duration of your media
     * is established, this is the event for you. This can be useful
     * because the initial value for duration is `NaN` (Not a Number),
     * which you probably don't want to display to your users.
     */
    const onDurationChange = useCallback(() => {
        console.log('onDurationChange');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('durationchange', onDurationChange);

        return () => {
            audio.removeEventListener('durationchange', onDurationChange);
        };
    }, [onDurationChange]);

    /**
     * Event "loadedmetadata"
     *
     * Metadata can consist of more than just duration — if you want to
     * wait for all the metadata to download before doing something,
     * you can detect the `loadedmetadata` event.
     */
    const onLoadedMetadata = useCallback(() => {
        console.log('onLoadedMetadata');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [onLoadedMetadata]);

    /**
     * Event "loadeddata"
     *
     * The `loadeddata` event is fired when the first bit of media
     * arrives. The playhead is in position but not quite ready to
     * play.
     */
    const onLoadedData = useCallback(() => {
        console.log('onLoadedData');
        setDuration(audio.duration);
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('loadeddata', onLoadedData);

        return () => {
            audio.removeEventListener('loadeddata', onLoadedData);
        };
    }, [onLoadedData]);

    /**
     * Event "progress"
     *
     * The `progress` event indicates that the download of media is
     * still in progress. It is good practice to display some kind
     * of 'loader' at this point.
     */
    const onProgress = useCallback(() => {
        console.log('onProgress');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('progress', onProgress);

        return () => {
            audio.removeEventListener('progress', onProgress);
        };
    }, [onProgress]);

    /**
     * Event "canplay"
     *
     * `canplay` is a useful event to detect should you want to
     * determine whether the media is ready to play. You could,
     * for example, disable custom controls until this event occurs.
     */
    const onCanPlay = useCallback(() => {
        console.log('onCanPlay');

        audio.play();
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('canplay', onCanPlay);

        return () => {
            audio.removeEventListener('canplay', onCanPlay);
        };
    }, [onCanPlay]);

    /**
     * Event "canplaythrough"
     *
     * `canplaythrough` is similar to canplay but it lets you know that
     * the media is ready to be played all the way through (that is to
     * say that the file has completely downloaded, or it is estimated
     * that it will download in time so that buffering stops do not occur).
     */
    const onCanPlayThrough = useCallback(() => {
        console.log('onCanPlayThrough');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('canplaythrough', onCanPlayThrough);

        return () => {
            audio.removeEventListener('canplaythrough', onCanPlayThrough);
        };
    }, [onCanPlayThrough]);

    /**
     * Media Playing Events
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics#media_playing_events
     */

    /**
     * Event "timeupdate"
     *
     * The `timeupdate` event is triggered every time the `currentTime`
     * property changes. In practice, this occurs every 250 milliseconds.
     * This event can be used to trigger the displaying of playback progress.
     */
    const onTimeUpdate = useCallback(() => {
        console.log('onTimeUpdate', audio.currentTime);
        setCurrentTime(audio.currentTime);
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [onTimeUpdate]);

    /**
     * Event "playing"
     *
     * The playing event is initiated when playback is ready to start
     * after having being paused due to lack of media data.
     */
    const onPlaying = useCallback(() => {
        console.log('onPlaying');

        setIsPlaying(true);
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('playing', onPlaying);

        return () => {
            audio.removeEventListener('playing', onPlaying);
        };
    }, [onPlaying]);

    /**
     * Event "waiting"
     *
     * The `waiting` event is triggered when playback has stopped due to
     * lack of media data, although it is expected to resume once data
     * becomes available.
     */
    const onWaiting = useCallback(() => {
        console.log('onWaiting');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('waiting', onWaiting);

        return () => {
            audio.removeEventListener('waiting', onWaiting);
        };
    }, [onWaiting]);

    /**
     * Event "play"
     *
     * The `play` event is initiated after the `play()` method is returned
     * or when the autoplay attribute has caused playback to begin.
     * This is when the state of the media switches from paused to playing.
     */
    const onPlay = useCallback(() => {
        console.log('onPlay');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('play', onPlay);

        return () => {
            audio.removeEventListener('play', onPlay);
        };
    }, [onPlay]);

    /**
     * Event "pause"
     *
     * The `pause` event is triggered after the `pause()` method is returned.
     * This is when the states switch from playing to paused.
     */
    const onPause = useCallback(() => {
        console.log('onPause');
        setIsPlaying(false);
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('pause', onPause);
        };
    }, [onPause]);

    /**
     * Event "ended"
     *
     * The `ended` event is initiated when the end of the media is reached.
     */
    const onEnded = useCallback(() => {
        console.log('onEnded');
        if (onAudioEnded) {
            onAudioEnded();
        }

        setIsPlaying(false); // reset pause button
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [onEnded]);

    /**
     * Event "volumechange"
     *
     * The volumechange event signifies that the volume has changed;
     * that includes being muted.
     */
    const onVolumeChange = useCallback(() => {
        console.log('onVolumeChange');
    }, [audio]);
    useEffect(() => {
        audio.addEventListener('volumechange', onVolumeChange);

        return () => {
            audio.removeEventListener('volumechange', onVolumeChange);
        };
    }, [onVolumeChange]);

    return (
        <div className={clsx(classes.root, className)}>
            <PlayerProgressBar
                className={classes.PlayerProgressBar}
                currentTime={currentTime}
                onCurrentTimeChange={handleCurrentTimeChange}
                duration={duration}
            />

            <div className={classes.container}>
                <div className={classes.leftControls}>
                    {onSkipPrevious ? (
                        <IconButton onClick={handleSkipPrevious}>
                            <SkipPreviousIcon />
                        </IconButton>
                    ) : null}

                    {isPlaying ? (
                        <IconButton onClick={handlePause}>
                            <PauseIcon fontSize="large" />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handlePlay}>
                            <PlayArrowIcon fontSize="large" />
                        </IconButton>
                    )}

                    {onSkipNext ? (
                        <IconButton onClick={handleSkipNext}>
                            <SkipNextIcon />
                        </IconButton>
                    ) : null}
                </div>

                <FlexSpacer />

                <div className={classes.rightControls}>
                    <Typography>
                        {secondsToDuration(currentTime)} /{' '}
                        {secondsToDuration(duration)}
                    </Typography>
                </div>
            </div>
        </div>
    );
};
