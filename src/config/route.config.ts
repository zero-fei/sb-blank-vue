import { userLayout } from '../layouts';

export const routerConfig = [
    {
        path: '/',
        redirect: '/user/login'
    },
    {
        path: '/user',
        component: userLayout,
        children: [
            {
                path: '/user/login',
                component: () => import('../modules/login'),
            }
        ]
    },
    {
        path: '/home',
        component:  () => import('../modules/home'),
    }
];