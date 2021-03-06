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
          <span class="logo-normal">{{ $t('admin_panel.title') }}</span>
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
        />

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
  import { mapGetters, mapState, mapActions } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',
    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState(['barColor', 'barImage']),
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
              to: 'posts/unapproved/list',
              name: 'unapproved_posts_list',
              title: this.$t('admin_panel.posts.unapproved_list'),
              permission: 'publish_posts',
              callback: () => {},
            },
            {
              to: 'page/login',
              name: 'logout',
              title: this.$t('admin_panel.logout'),
              callback: () => {
                this.logOut()
              },
            },
          ].filter(el => {
            if (!el.permission) {
              return el
            }
            return this.currentUser.permissions.includes(el.permission)
          }),
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
            group: '/posts',
            icon: 'mdi-view-dashboard',
            title: this.$t('admin_panel.posts.plural'),
            permission: 'view_posts',
            children: [
              {
                icon: 'mdi-application',
                title: this.$t('admin_panel.posts.list'),
                to: 'list',
                permission: 'view_posts',
              },
              {
                icon: 'mdi-application',
                title: this.$t('admin_panel.posts.add'),
                to: 'create',
                permission: 'create_posts',
              },
            ],
          },
          {
            group: '/categories',
            icon: 'mdi-view-comfy',
            title: this.$t('admin_panel.categories.plural'),
            permission: 'view_categories',
            children: [
              {
                icon: 'mdi-application',
                title: this.$t('admin_panel.categories.list'),
                to: 'list',
                permission: 'view_categories',
              },
              {
                icon: 'mdi-application',
                title: this.$t('admin_panel.categories.add'),
                to: 'create',
                permission: 'create_categories',
              },
            ],
          },
          {
            group: '/users',
            icon: 'mdi-account-multiple',
            title: this.$t('admin_panel.users.plural'),
            permission: 'view_users',
            children: [
              {
                icon: 'mdi-account-multiple-plus',
                title: this.$t('admin_panel.users.list'),
                to: 'list',
                permission: 'view_users',
              },
              {
                icon: 'mdi-account-multiple-plus',
                title: this.$t('admin_panel.users.add'),
                to: 'create',
                permission: 'create_users',
              },
            ],
          },
        ]
      },
      mapItem (item) {
        if (!item.permission.length || this.currentUser.permissions.includes(item.permission)) {
          return {
            ...item,
            children: item.children ? item.children.map(this.mapItem) : undefined,
            title: item.title,
          }
        }
        return {}
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
