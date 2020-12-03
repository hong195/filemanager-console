import i18n from '@/i18n'

export default {
  setLanguages (state, { languages, locale }) {
    state.languages = languages
    i18n.locale = locale
    localStorage.setItem('locale', locale)
  },
  setTranslations (state, translations) {
    i18n.setLocaleMessage(i18n.locale, translations)
  },
}
