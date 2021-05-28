import React, { FC } from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the title `Typography` component. */
        title: {
            flexGrow: 1,
            textAlign: 'center',
        },
    }),
    { name: 'AppBar' },
);

export type AppBarProps = {
    title?: string;
    className?: string;
};

export const AppBar: FC<AppBarProps> = (props) => {
    const { className, title } = props;
    const classes = useStyles();

    return (
        <MuiAppBar className={clsx(classes.root, className)} position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
            </Toolbar>
        </MuiAppBar>
    );
};
