import { Reducer } from 'redux';

import {
    USER_FETCH_FAILED,
    USER_FETCH_REQUESTED,
    USER_FETCH_SUCCEEDED,
    USER_LOGOUT,
    USER_RESET_STATE,
    UserActionTypes,
    UserState,
    UserStatus,
} from './types';

const initialState: UserState = {
    user: null,
    status: UserStatus.Idle,
    error: null,
};

export const userReducer: Reducer<UserState, UserActionTypes> = (
    state = initialState,
    action,
): UserState => {
    switch (action.type) {
        case USER_FETCH_REQUESTED: {
            return {
                ...state,
                status: UserStatus.Fetching,
                error: null,
            };
        }
        case USER_FETCH_SUCCEEDED: {
            const user = action.payload;

            return {
                ...state,
                user,
                status: UserStatus.Success,
            };
        }
        case USER_FETCH_FAILED: {
            return {
                ...state,
                user: null,
                status: UserStatus.Error,
                error: action.payload,
            };
        }
        case USER_RESET_STATE: {
            return {
                ...initialState,
            };
        }
        case USER_LOGOUT: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};
