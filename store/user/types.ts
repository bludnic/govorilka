import firebase from 'firebase/app';

export type UserDto = {
    email: string;
};

export type UserState = {
    user: UserDto | null;
    status: UserStatus;
    error: Error | null;
};

export enum UserStatus {
    Idle = 'idle',
    Fetching = 'fetching',
    Success = 'success',
    Error = 'error',
}

export type UserStatuses =
    | typeof USER_FETCH_REQUESTED
    | typeof USER_FETCH_SUCCEEDED
    | typeof USER_FETCH_FAILED;

export const USER_FETCH_REQUESTED = 'user/FETCH_REQUESTED';
export const USER_FETCH_SUCCEEDED = 'user/FETCH_SUCCEEDED';
export const USER_FETCH_FAILED = 'user/FETCH_FAILED';
export const USER_RESET_STATE = 'user/RESET_STATE';
export const USER_LOGOUT = 'user/USER_LOGOUT';
export const FIREBASE_INIT = 'user/FIREBASE_INIT';
export const FIREBASE_SIGN_IN_SUCCESS = 'user/FIREBASE_SIGN_IN_SUCCESS';
export const FIREBASE_SIGN_OUT_SUCCESS = 'user/FIREBASE_SIGN_OUT_SUCCESS';

export type UserFetchAction = {
    type: typeof USER_FETCH_REQUESTED;
};

type UserSuccessAction = {
    type: typeof USER_FETCH_SUCCEEDED;
    payload: UserDto;
};

type UserErrorAction = {
    type: typeof USER_FETCH_FAILED;
    payload: Error;
};

type UserResetStateAction = {
    type: typeof USER_RESET_STATE;
};

export type UserLogoutAction = {
    type: typeof USER_LOGOUT;
};

export type FirebaseInitAction = {
    type: typeof FIREBASE_INIT;
};

export type FirebaseSignInSuccessAction = {
    type: typeof FIREBASE_SIGN_IN_SUCCESS;
    payload: firebase.User;
};

export type FirebaseSignOutSuccessAction = {
    type: typeof FIREBASE_SIGN_OUT_SUCCESS;
};

export type UserActionTypes =
    | UserFetchAction
    | UserSuccessAction
    | UserErrorAction
    | UserResetStateAction
    | UserLogoutAction
    | FirebaseInitAction
    | FirebaseSignInSuccessAction
    | FirebaseSignOutSuccessAction;
