import React, { FC } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fade, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {
            backgroundColor: fade(theme.palette.common.white, 0.8),
            zIndex: theme.zIndex.drawer,

            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    }),
    { name: 'LoadingOverlay' },
);

type Props = {
    loading: boolean;
};

export const LoadingOverlay: FC<Props> = (props) => {
    const { loading } = props;
    const classes = useStyles();

    if (!loading) return null;

    return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    );
};
