import Home from '../modules/home/Home';
import Login from '../modules/login/Login';
import { userLayout } from '../layouts';

export const routerConfig = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/user',
        component: userLayout,
        children: [
            {
                path: '/login',
                component: Login,
            }
        ]
    },
    {
        path: '/home',
        component: Home
    }
];