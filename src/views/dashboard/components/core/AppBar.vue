<template>
  <v-app-bar
    absolute
    app
    color="transparent"
    flat
    height="75"
    style="width: auto;"
  >
    <v-btn
      fab
      small
      @click="$vuetify.breakpoint.smAndDown ? setDrawer(!drawer) : $emit('input', !value)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down"
      v-text="$route.meta.title"
    />

    <v-spacer />
    <lang-switcher />
  </v-app-bar>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import LangSwitcher from '@/components/LanguageSwitcher.'

  export default {
    name: 'DashboardCoreAppBar',
    components: { LangSwitcher },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      profile: [
        { title: 'Profile' },
        { title: 'Settings' },
        { divider: true },
        { title: 'Log out' },
      ],
    }),
    computed: {
      ...mapState(['drawer']),
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
    },
  }
</script>
