import 'firebase/auth';
import firebase from 'firebase/app';

import firebaseConfig from 'firebase.config.json';

declare global {
    interface Window {
        fi: firebase.app.App;
    }
}

export function initFirebase() {
    if (!firebase.apps.length) {
        const instance = firebase.initializeApp(firebaseConfig);

        if (process.browser) {
            window.fi = instance; // store instance as a global variable for debugging
        }
    }
}
