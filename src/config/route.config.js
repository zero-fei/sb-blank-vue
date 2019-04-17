import Home from '../modules/home/home';

export const routerConfig = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home }
]