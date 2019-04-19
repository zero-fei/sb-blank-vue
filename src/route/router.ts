import Vue from 'vue';
import VueRouter from 'vue-router';
import { routerConfig } from '../config/route.config'


Vue.use(VueRouter);

const router = new VueRouter( {
    routes: routerConfig
});

export default router;
