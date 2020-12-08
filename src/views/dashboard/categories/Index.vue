<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      :heading="$t('admin_panel.categories.list')"
      :sub-title="$t('admin_panel.categories.list')"
    />

    <base-material-card
      class="px-5 py-3"
      color="indigo"
      icon="mdi-vuetify"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          {{ $t('admin_panel.categories.list') }}
        </div>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        :label="$t('admin_panel.search')"
        single-line
        style="max-width: 250px"
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
        <template v-slot:top>
          <v-btn
            v-if="isAdmin"
            color="primary"
            dark
            class="mb-2 mt-3"
            @click="addCategory"
          >
            {{ $t('admin_panel.add') }}
          </v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
          <div v-if="isAdmin">
            <v-icon
              small
              class="mr-2"
              @click="edit(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Category',
    data: () => ({
      options: [],
      dialog: false,
      scope: 'category-form',
      requestType: 'post',
      currentItemId: '',
      items: [],
      search: undefined,
      loading: false,
    }),
    computed: {
      ...mapState('user', ['isAdmin']),
      headers () {
        return [
          { text: this.$t('admin_panel.identifier'), value: 'id' },
          { text: this.$t('admin_panel.categories.name'), value: 'name' },
          { text: this.$t('admin_panel.categories.count'), value: 'count', class: 'count' },
          { text: this.$t('admin_panel.creation_date'), value: 'created_at', class: 'date' },
          { sortable: false, text: this.$t('admin_panel.actions'), value: 'actions', class: 'actions', guarded: true },
        ].filter(header => {
          if (this.isAdmin) {
            return header
          }
          return !header.guarded
        })
      },
    },
    created () {
      this.fetchCategories()
    },
    methods: {
      addCategory () {
        this.$router.push({
          name: 'category_create',
        })
      },
      fetchCategories () {
        this.loading = true
        this.$http
          .get('categories')
          .then(({ data }) => {
            this.items = data.data
            this.loading = false
          })
          .catch(error => {
            console.error(error)
            this.loading = false
          })
      },
      deleteItem (item) {
        this.$http
          .delete(`categories/${item.id}`)
          .then(() => {
            this.items.splice(
              this.items.findIndex(({ id }) => id === item.id),
              1,
            )
          })
          .catch(error => {
            console.error(error)
          })
      },
      edit (item) {
        this.$router.push({
          name: 'category_edit',
          params: { id: item.id },
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
