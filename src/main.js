import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import defaultImage from 'common/image/default.png'
import 'common/stylus/index.styl'

FastClick.attach(document.body)
Vue.use(VueLazyload, {
  loading: defaultImage,
})
Vue.use(store)
/* eslint-disable no-new */
import VConsole from 'vconsole';
/* eslint-disable no-unused-vars */
new VConsole();
console.log("test")
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
