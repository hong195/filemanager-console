import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/base'
import './plugins/vee-validate'
import './plugins/font-awesome'
import './plugins/vue-file-agent'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueVideoPlayer from 'vue-video-player'

// require videojs style
import 'video.js/dist/video-js.css'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
Vue.use(VueVideoPlayer)
Vue.config.productionTip = false

function boot () {
  new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: h => h(App),
  }).$mount('#app')
}

// extract user before vue instance created
store.dispatch('user/checkUser')
  .then(() => {
    boot()
  })
  .catch(() => {
    boot()
  })
