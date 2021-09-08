import firebase from 'firebase/app';

import {
    USER_FETCH_REQUESTED,
    USER_FETCH_SUCCEEDED,
    USER_FETCH_FAILED,
    USER_RESET_STATE,
    UserActionTypes,
    UserDto,
    USER_LOGOUT,
    FIREBASE_INIT,
    FIREBASE_SIGN_OUT_SUCCESS,
    FIREBASE_SIGN_IN_SUCCESS,
} from './types';

export const userFetch = (): UserActionTypes => ({
    type: USER_FETCH_REQUESTED,
});

export const userSuccess = (data: UserDto): UserActionTypes => ({
    type: USER_FETCH_SUCCEEDED,
    payload: data,
});

export const userError = (error: Error): UserActionTypes => ({
    type: USER_FETCH_FAILED,
    payload: error,
});

export const userResetState = (): UserActionTypes => ({
    type: USER_RESET_STATE,
});

export const userLogout = (): UserActionTypes => ({
    type: USER_LOGOUT,
});

export const firebaseInit = (): UserActionTypes => ({
    type: FIREBASE_INIT,
});

export const firebaseSignInSuccess = (
    user: firebase.User,
): UserActionTypes => ({
    type: FIREBASE_SIGN_IN_SUCCESS,
    payload: user,
});

export const firebaseSignOutSuccess = (): UserActionTypes => ({
    type: FIREBASE_SIGN_OUT_SUCCESS,
});
