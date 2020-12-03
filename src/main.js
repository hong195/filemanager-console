import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/base'
import './plugins/axios'
import './plugins/vee-validate'
import './plugins/font-awesome'
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
    created () {
      store.dispatch('locale/fetchLanguages')
    },
    store,
    router,
    vuetify,
    i18n,
    render: h => h(App),
  }).$mount('#app')
}

store.dispatch('user/fetchUser')
  .then(() => {
    boot()
  })
  .catch(() => {
    boot()
  })
