import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {
            flexGrow: 1,
        },
    }),
    { name: 'FlexSpacer' },
);

type Props = {};

export const FlexSpacer: FC<Props> = (props) => {
    const classes = useStyles();

    return <div className={classes.root} />;
};
