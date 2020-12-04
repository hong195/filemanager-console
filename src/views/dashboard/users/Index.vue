<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      :heading="$t('admin_panel.users.list')"
    />

    <base-material-card
      class="px-5 py-3"
      color="indigo"
      icon="mdi-vuetify"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          {{ $t('admin_panel.users.plural') }}
        </div>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        :label="$t('admin_panel.search')"
        single-line
        style="max-width: 250px;"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="items"
        :search.sync="search"
        locale="ru"
        :loading="loading"
        :loading-text="$t('admin_panel.loading')"
        :calculate-widths="true"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  export default {
    name: 'Users',
    data: () => ({
      items: [],
      search: undefined,
      loading: false,
    }),
    computed: {
      headers () {
        return [
          { text: this.$t('admin_panel.identifier'), value: 'id' },
          { text: this.$t('admin_panel.users.name'), value: 'name' },
          { text: this.$t('admin_panel.users.email'), value: 'email', class: 'email' },
          { text: this.$t('admin_panel.registration_date'), value: 'created_at', class: 'created_at' },
          { sortable: false, text: this.$t('admin_panel.actions'), value: 'actions', class: 'actions' },
        ]
      },
    },
    created () {
      this.loading = true
      this.$http.get('users')
        .then(({ data }) => {
          this.items = data.data
        })
        .catch(error => console.error(error))
      this.loading = false
    },
    methods: {
      editItem (user) {
        this.$router.push({
          name: 'user_edit',
          params: { id: user.id },
        })
      },
      deleteItem (item) {
        this.$http.delete(`users/${item.id}`)
          .then((data) => {
            this.items.splice(this.items.findIndex(({ id }) => id === item.id), 1)
          })
      },
    },
  }
</script>
<style lang="scss">
th.actions {
  min-width: 110px;
}
th.created_at {
  min-width: 150px;
}
th.file_size {
  min-width: 100px;
}
</style>
