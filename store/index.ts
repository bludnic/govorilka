import createSagaMiddleware, { Task } from 'redux-saga';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper, Context } from 'next-redux-wrapper';

import rootSaga from 'sagas';
import { UserActionTypes, userReducer, UserState } from './user';

export type RootState = {
    user: UserState;
};
export type RootActionTypes = UserActionTypes;

export const rootReducer = combineReducers({
    user: userReducer,
});

export interface SagaStore extends Store<RootState> {
    sagaTask: Task;
}

const makeStore = (context: Context) => {
    // 1: Create the middleware
    const sagaMiddleware = createSagaMiddleware();

    // 2: Add an extra parameter for applying middleware:
    const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(sagaMiddleware)),
    );

    // 3: Run your sagas on server
    (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

    // 4: now return the store:
    return store;
};

// export an assembled wrapper
export const wrapper = createWrapper<Store<RootState, RootActionTypes>>(
    makeStore,
    {
        debug: process.env.NODE_ENV === 'development',
    },
);
