import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { AppBar, AppBarProps } from 'components/AppBar';
import { BottomNavigation } from 'components/BottomNavigation';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element in which the children prop is placed. */
        container: {
            // The <BottomNavigation /> must not overlap the contents of the container
            paddingBottom: 56, // BottomNavigation height
        },
        /* Styles applied to the `BottomNavigation` component. */
        BottomNavigation: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
        },
    }),
    { name: 'NavigationLayout' },
);

export type NavigationLayoutProps = {
    AppBarComponent?: FC<AppBarProps>;
    AppBarProps?: AppBarProps;
    children: ReactNode;
    className?: string;
};

export const NavigationLayout: FC<NavigationLayoutProps> = (props) => {
    const {
        AppBarComponent = AppBar,
        AppBarProps,
        children,
        className,
    } = props;
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <AppBarComponent {...AppBarProps} />

            <div className={classes.container}>{children}</div>

            <BottomNavigation className={classes.BottomNavigation} />
        </div>
    );
};
