export default () => ({
  languages: [
    {
      title: 'Русский',
      short_code: 'ru',
    },
    {
      title: 'Узбекский',
      short_code: 'uz',
    },
  ],
  language: process.env.VUE_APP_I18N_LOCALE,
  translations: null,
})
