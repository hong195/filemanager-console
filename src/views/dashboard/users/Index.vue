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
        v-model="searchParams.query_search"
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        :label="$t('admin_panel.search')"
        single-line
        outlined
        style="max-width: 250px;"
      />

      <v-divider class="mt-3" />

      <data-table
        ref="data-table"
        fetch-url="users"
        :headers="headers"
        :search-options="searchParams"
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
      </data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import DataTable from '../components/DataTable'

  export default {
    name: 'Users',
    components: {
      DataTable,
    },
    data: () => ({
      searchParams: {
        query_search: '',
      },
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
            this.$refs['data-table'].fetchPosts()
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
