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
        v-model="searchParams.query_search"
        append-icon="mdi-magnify"
        outlined
        class="ml-auto"
        hide-details
        :label="$t('admin_panel.search')"
        single-line
        style="max-width: 250px"
      />

      <v-row class="mb-4">
        <v-btn
          v-if="isAdmin"
          color="primary"
          @click="addCategory"
        >
          {{ $t('admin_panel.categories.add') }}
        </v-btn>
      </v-row>

      <data-table
        ref="data-table"
        fetch-url="categories"
        :headers="headers"
        :search-options="searchParams"
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
        <template v-slot:item.count="{ item }">
          <td class="text-start">
            {{ item ? item.posts.length : 0 }}
          </td>
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
      </data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'
  import DataTable from '../components/DataTable'

  export default {
    name: 'Category',
    components: {
      DataTable,
    },
    data: () => ({
      options: [],
      dialog: false,
      scope: 'category-form',
      updateCategories: false,
      searchParams: {
        query_search: '',
        with_posts: true,
      },
    }),
    computed: {
      ...mapState('user', ['isAdmin']),
      headers () {
        return [
          { text: this.$t('admin_panel.categories.name'), value: 'name' },
          { text: this.$t('admin_panel.categories.count'), value: 'count', class: 'count', sortable: false },
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
    methods: {
      addCategory () {
        this.$router.push({
          name: 'category_create',
        })
      },
      deleteItem (item) {
        this.$http
          .delete(`categories/${item.id}`)
          .then(() => {
            this.$refs['data-table'].fetchPosts()
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
