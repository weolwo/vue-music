import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import defaultImage from './common/js/config'
import 'common/stylus/index.styl'

FastClick.attach(document.body)
Vue.use(VueLazyload, {
  loading: defaultImage,
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
