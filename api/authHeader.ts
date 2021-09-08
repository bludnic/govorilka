import { AxiosRequestConfig } from 'axios';
import firebase from 'firebase/app';

export async function authHeader(config: AxiosRequestConfig) {
    try {
        if (process.browser) {
            const user = firebase.auth().currentUser;

            if (user) {
                const token = await user.getIdToken();
                config.headers = {
                    ...config.headers,
                    Authorization: token,
                };
            }
        }

        return config;
    } catch (e) {
        return Promise.reject(e);
    }
}
