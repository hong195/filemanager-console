import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import locale from './locale'
import alert from '@/store/alert_message'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    drawer: null,
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_SCRIM (state, payload) {
      state.barColor = payload
    },
    removePreloader () {
      document.querySelector('body').removeAttribute('class')
    },
  },
  modules: {
    user: user,
    locale: locale,
    alert: alert,
  },
})
