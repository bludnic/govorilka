import React, { AudioHTMLAttributes, FC, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
        audio: {
            width: '100%',
        },
    }),
    { name: 'Player' },
);

type Props = {
    audioContent: string; // data:audio/mpeg;base64
    audioProps?: AudioHTMLAttributes<HTMLAudioElement>;
    onAudioEnd?: () => void;
};

export const Player: FC<Props> = (props) => {
    const { audioContent, audioProps, onAudioEnd } = props;
    const classes = useStyles();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const { current: audio } = audioRef;

        if (audio) {
            console.log('load and play', audioContent);
            audio.load();
            audio.play();
        }
    }, [audioContent]);

    return (
        <div className={classes.root}>
            <audio
                ref={audioRef}
                controls={true}
                {...audioProps}
                className={classes.audio}
                onEnded={onAudioEnd}
            >
                {audioContent && (
                    <source src={`data:audio/mpeg;base64,${audioContent}`} />
                )}
            </audio>
        </div>
    );
};
