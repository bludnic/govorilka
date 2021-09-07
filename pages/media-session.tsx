import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import { MediaSession } from 'components/MediaSession';
import { NoSsr } from '@material-ui/core';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'MediaSessionPage' },
);

type Props = {};

const MediaSessionPage: NextPage<Props> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <NoSsr>
                <MediaSession />
            </NoSsr>
        </div>
    );
};

export default MediaSessionPage;
