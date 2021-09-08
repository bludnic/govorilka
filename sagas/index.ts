import { all } from 'redux-saga/effects';

import { watchUser } from 'sagas/user';

function* rootSaga() {
    yield all([watchUser()]);
}

export default rootSaga;
