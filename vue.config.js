const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue: path.resolve('./node_modules/vue'),
      },
    },
  },
  devServer: {
    disableHostCheck: true,
  },

  transpileDependencies: ['vuetify'],

  pluginOptions: {
    i18n: {
      locale: process.env.VUE_APP_I18N_LOCALE,
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
}
