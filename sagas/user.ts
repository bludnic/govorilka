import Router from 'next/router';
import firebase from 'firebase/app';
import { AxiosResponse } from 'axios';
import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { eventChannel, SagaIterator } from 'redux-saga';

import {
    FIREBASE_INIT,
    FIREBASE_SIGN_IN_SUCCESS,
    FirebaseSignInSuccessAction,
    USER_FETCH_REQUESTED,
    USER_LOGOUT,
    UserDto,
} from 'store/user/types';
import {
    firebaseSignOutSuccess,
    userError,
    userFetch,
    userSuccess,
} from 'store/user/actions';
import { api } from 'api';

function* fetchUser(): SagaIterator {
    try {
        const { data }: AxiosResponse<UserDto> = yield call([api, 'getUser']);

        if (data) {
            yield put(userSuccess(data));
        }
    } catch (err) {
        yield put(userError(err));
    }
}

function* firebaseInitWorker() {
    // Firebase doesn't work on server-side
    if (!process.browser) return;

    const tokenChangedChannel = eventChannel((emitter) => {
        const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
            emitter({ user });
        });

        return () => cancelAuthListener();
    });

    try {
        while (true) {
            const { user }: { user: firebase.User | null } = yield take(
                tokenChangedChannel,
            );

            if (user) {
                yield put(userFetch());
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function* signOut() {
    try {
        yield call([firebase.auth(), 'signOut']);
        yield put(firebaseSignOutSuccess());

        // Prevent circular redirects
        //
        // После деплоя в firebase, в конце URL добавляется лишний слеш,
        // и "/auth" !== "/auth/". Получаем снова вечный редирект.
        if (
            window.location.pathname !== '/user/auth' &&
            window.location.pathname !== '/user/auth/'
        ) {
            Router.push('/user/auth');
        }
    } catch (err) {
        console.error(err);
    }
}

function* firebaseSignInSuccess(action: FirebaseSignInSuccessAction) {
    try {
        yield put(userFetch());

        Router.push('/user/profile');
    } catch (err) {
        console.log(err);
    }
}

export function* watchUser(): SagaIterator {
    yield all([
        takeLatest(USER_FETCH_REQUESTED, fetchUser),
        takeLatest(USER_LOGOUT, signOut),
        takeLatest(FIREBASE_INIT, firebaseInitWorker),
        takeLatest(FIREBASE_SIGN_IN_SUCCESS, firebaseSignInSuccess),
    ]);
}
