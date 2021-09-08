import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

import { RootState } from 'store';
import { userLogout, UserState } from 'store/user';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `Avatar` component. */
        avatar: {},
        /* Styles applied to the container `div` element. */
        container: {
            display: 'flex',
            alignItems: 'center',
        },
        email: {
            marginLeft: theme.spacing(2),
        },
        spacer: {
            flexGrow: 1,
        },
    }),
    { name: 'ProfileCard' },
);

type ProfileCardProps = {
    className?: string;
};

export const ProfileCard: FC<ProfileCardProps> = (props) => {
    const { className } = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { user } = useSelector<RootState, UserState>(
        (rootState) => rootState.user,
    );

    const handleLogout = () => {
        dispatch(userLogout());
    };

    if (!user) {
        return null;
    }

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.container}>
                <Avatar className={classes.avatar}>VV</Avatar>

                <Typography className={classes.email}>{user.email}</Typography>

                <div className={classes.spacer} />

                <Button onClick={handleLogout}>{t('signOut')}</Button>
            </div>
        </div>
    );
};
