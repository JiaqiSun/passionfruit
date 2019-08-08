import Vue from 'vue';
import Welcome from './Welcome.vue';
import router from './router';
import store from './store';

import 'expose-loader?$!jquery';

import Buefy from 'buefy';
import 'bulmaswatch/darkly/bulmaswatch.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(Welcome),
}).$mount('#app');
