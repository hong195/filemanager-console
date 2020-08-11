import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/base'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

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
