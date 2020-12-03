import Vue from 'vue'
import { ValidationProvider, localize, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import ru from 'vee-validate/dist/locale/ru.json'
import uz from '@/locales/vee-validate/uz.json'

const locale = localStorage.getItem('locale') || process.env.VUE_APP_I18N_LOCALE

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

localize({
  ru: ru,
  uz: uz,
})

localize(locale)

Vue.component('ValidationProvider', ValidationProvider)
