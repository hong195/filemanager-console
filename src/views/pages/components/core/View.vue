<template>
  <v-main
    id="pages"
    :class="$vuetify.theme.dark ? undefined : 'grey lighten-3'"
  >
    <v-img
      :class="{
        'v-image--sm': this.$vuetify.breakpoint.smAndDown,
        'v-image--md': this.$vuetify.breakpoint.mdAndDown,
      }"
      fixed
      class="img"
      width="100%"
      :src="require(`@/assets/${src || 'bg.jpg'}`)"
      gradient="to top, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)"
      height="100vh"
    >
      <router-view />
    </v-img>
  </v-main>
</template>

<script>
  export default {
    name: 'PagesCoreView',

    data: () => ({
      srcs: {
        '/pages/lock': 'lock.jpg',
        '/pages/login': 'login.jpg',
        '/pages/pricing': 'pricing.jpg',
        '/pages/register': 'register.jpg',
      },
    }),

    computed: {
      src() {
        return this.srcs[this.$route.path]
      },
    },
  }
</script>

<style lang="sass">
#pages
  > .v-content__wrap > .v-image
    padding-top: 64px
    padding-bottom: 88px

    .v-responsive__sizer
      display: none

    .v-image--md
      padding: 188px 0

    .v-image--sm
      padding: 96px 0 188px 0
    .v-image__image--cover
      background-position: top !important
</style>
<style scoped>
.img >>> .v-image__image {
  background-position: top center !important;
}
</style>
