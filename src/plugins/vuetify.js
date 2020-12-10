import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ru from 'vuetify/lib/locale/ru'
import uz from '@/locales/vuetify/uz'
import VueI18n from '@/i18n'
Vue.use(Vuetify)

const theme = {
  primary: '#E91E63',
  secondary: '#9C27b0',
  accent: '#9C27b0',
  info: '#00CAE3',
}

export default new Vuetify({
  lang: {
    t: (key, ...params) => VueI18n.t(key, params),
    locales: { ru, uz },
    current: localStorage.getItem('locale') || process.env.VUE_APP_I18N_LOCALE,
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})
