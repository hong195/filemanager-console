<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="text-uppercase font-weight-regular display-2">
          <span class="logo-normal">Центр Знаний</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <div v-if="currentUser">
      <v-divider
        v-if="currentUser"
        class="mb-1"
      />
      <v-list
        dense
        nav
      >
        <base-item-group :item="profile" />
      </v-list>
      <v-divider
        v-if="currentUser"
        class="mb-2"
      />
    </div>

    <v-list
      expand
      nav
    >
      <template v-for="(item, i) in computedItems">
        <base-item-group
          v-if="item.children"
          :key="`group-${i}`"
          :item="item"
          @logout="onLogout"
        >
          <!--  -->
        </base-item-group>

        <base-item
          v-else
          :key="`item-${i}`"
          :item="item"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  // Utilities
  import { mapGetters, mapState, mapActions } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      items: [],
    }),

    computed: {
      ...mapState(['barColor', 'barImage']),
      ...mapState('user', ['isAdmin']),
      ...mapGetters('user', ['currentUser']),
      drawer: {
        get () {
          return this.$store.state.drawer
        },
        set (val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems () {
        return this.setItems().map(this.mapItem)
      },
      profile () {
        return {
          avatar: require('@/assets/logo.jpg'),
          group: '',
          title: this.currentUser.name,
          children: [
            {
              to: undefined,
              name: 'logout',
              title: 'Выйти',
              callback: () => {
                this.logOut()
                this.$router.push({ name: 'login' })
              },
            },
          ],
        }
      },
    },

    watch: {
      '$vuetify.breakpoint.smAndDown' (val) {
        this.$emit('update:expandOnHover', !val)
      },
    },

    methods: {
      ...mapActions('user', ['logOut']),
      setItems () {
        return [
          {
            icon: 'mdi-view-dashboard',
            title: 'Записи',
            to: '/posts/list',
          },
          {
            group: '',
            icon: 'mdi-application',
            title: 'Добавление записи',
            to: '/posts/create',
            guarded: true,
          },
          {
            group: 'category',
            icon: 'mdi-view-comfy',
            title: 'Категории',
            to: '/categories/list',
          },
          {
            group: '/users',
            icon: 'mdi-account-multiple',
            title: 'Пользователи',
            to: '/users/list',
            guarded: true,
          },
          {
            icon: 'mdi-account-multiple-plus',
            title: 'Добавить пользователя',
            to: '/users/create',
            guarded: true,
          },
        ].filter(item => {
          if (!this.isAdmin) {
            return !item.guarded
          }
          return item
        })
      },
      mapItem (item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },
    },
  }
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
      margin-right: 24px
      margin-left: 12px !important

      +rtl()
      margin-left: 24px
      margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
      padding-left: 8px

      +rtl()
      padding-right: 8px

    .v-list-group__header
      +ltr()
      padding-right: 0

      +rtl()
      padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
        margin-right: 8px

        +rtl()
        margin-left: 8px
</style>
