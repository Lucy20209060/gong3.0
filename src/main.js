// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import $ from 'jquery'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import '../theme/index.css'
import VueLazyload from 'vue-lazyload'
import './assets/font/iconfont.css'
import './assets/css/reset.css'
import store from '@/vuex/store'
import cookieOperate from '@/assets/js/common'
import api from '@/api'
// 挂载cookie相关操作方法
Vue.prototype.$cookie = cookieOperate
Vue.prototype.$api = api

// import toast from 'anchu-message';
// Vue.use(toast);

// import messageBox from './tools/anchu-messageBox';
// Vue.use(messageBox);


import anchuToast from '../static/toast/anchu.min.js';
Vue.use(anchuToast);


Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/images/grey.gif',
  loading: '/static/images/grey.gif',
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend'] 
  // listenEvents: [ 'scroll' ]
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  store:store,
  router,
  template: '<App/>',
  components: { App }
})