<template>
  <pages-core-view />
</template>

<script>
  export default {
    name: 'PagesIndex',

    components: {
      PagesCoreView: () => import('./components/core/View'),
    },

    created () {
      this.$vuetify.theme.dark = this.$route.name !== 'login'
    },

    beforeDestroy () {
      this.$vuetify.theme.dark = false
    },
  }
</script>
