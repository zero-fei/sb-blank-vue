import Vue from 'vue';
import App from './App';
import router from './route/router';
import store from './store';

import { Button } from 'ant-design-vue';

Vue.component(Button.name, Button)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
