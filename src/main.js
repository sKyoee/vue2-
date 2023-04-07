import Vue from 'vue'
import App from './App.vue'
// 引入路由器
import router from './router'
// 引入vuex
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 引入VueRouter
import VueRouter from 'vue-router';
import VueLazyload from 'vue-lazyload';

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueLazyload, {
  preLoad: 1.9,
  loading: require('./assets/img/loading.gif'),
  attempt: 3
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router:router
}).$mount('#app')
