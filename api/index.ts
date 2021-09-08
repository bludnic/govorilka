import axios, { AxiosPromise } from 'axios';

import { UserDto } from 'store/user';
import { authHeader } from 'api/authHeader';

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOSTNAME,
});

client.interceptors.request.use(authHeader);

export const api = {
    getUser(): AxiosPromise<UserDto> {
        return client.get('/api/user');
    },
};
