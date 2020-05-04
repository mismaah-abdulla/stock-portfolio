import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import Croppa from 'vue-croppa';

Vue.config.productionTip = false
Vue.use(Croppa);

new Vue({
  vuetify,
  router,
  store,
  Croppa,
  render: h => h(App)
}).$mount('#app')