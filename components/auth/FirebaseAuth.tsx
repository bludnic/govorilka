import { makeStyles } from '@material-ui/core/styles';
import 'firebase/auth';
import React, { FC, useEffect, useMemo, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import { useDispatch } from 'react-redux';

import { firebaseSignInSuccess } from 'store/user/actions';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        StyledFirebaseAuth: {},
    }),
    { name: 'FirebaseAuth' },
);

export const FirebaseAuth: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const firebaseAuthConfig: firebaseui.auth.Config = useMemo(
        () => ({
            // Сломай мозг. Если присвоить 'popup' ссылка на авторизацию
            // по E-mail приведет снова на страницу авторизации.
            // https://github.com/firebase/firebaseui-web-react/issues/88
            signInFlow: 'redirect',
            // Auth providers
            // https://github.com/firebase/firebaseui-web#configure-oauth-providers
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    signInMethod:
                        firebase.auth.EmailAuthProvider
                            .EMAIL_LINK_SIGN_IN_METHOD,
                    requireDisplayName: false,
                },
            ],
            signInSuccessUrl: '/',
            credentialHelper: 'none',
            callbacks: {
                signInSuccessWithAuthResult: ({ user }) => {
                    dispatch(firebaseSignInSuccess(user));

                    // Не делать редирект. Сага сама выполнит
                    return false;
                },
            },
        }),
        [],
    );

    // Do not SSR FirebaseUI, because it is not supported.
    // https://github.com/firebase/firebaseui-web/issues/213
    const [renderAuth, setRenderAuth] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRenderAuth(true);
        }
    }, []);

    return (
        <div>
            {renderAuth ? (
                <StyledFirebaseAuth
                    className={classes.StyledFirebaseAuth}
                    uiConfig={firebaseAuthConfig}
                    firebaseAuth={firebase.auth()}
                />
            ) : null}
        </div>
    );
};
