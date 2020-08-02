<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      heading="Медиа файлы"
      sub-title="Список медиа файлов"
    />

    <base-material-card
      class="px-5 py-3"
      color="indigo"
      icon="mdi-vuetify"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Файлы
        </div>
      </template>

      <v-text-field
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        label="Поиск"
        single-line
        style="max-width: 250px;"
        v-model="search"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="items"
        :search.sync="search"
        locale="ru"
        :loading="loading"
        loading-text="Загрузка..."
        :calculate-widths="true"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="downloadItem(item)"
          >
            mdi mdi-arrow-collapse-down
          </v-icon>
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
  import moment from 'moment'
  export default {
    name: 'Posts',
    data: () => ({
      headers: [
        { text: 'Наименование', value: 'name' },
        { text: 'Тип файла', value: 'file_type' },
        { sortable: false, text: 'Описание', value: 'description' },
        { text: 'Размер', value: 'size', class: 'file_size' },
        { text: 'Дата добавления', value: 'date', class: 'created_at' },
        { sortable: false, text: 'Действия', value: 'actions', class: 'actions' },
      ],
      items: [],
      search: undefined,
      loading: false,
    }),
    created () {
      this.loading = true
      this.$http.get('post')
        .then(({ data }) => {
          data.data.forEach((el) => {
            el.attachments.forEach((el2) => {
              this.items.push({
                name: el.name,
                extension: el2.extension,
                description: el.description,
                file_type: el2.extension,
                size: el2.size,
                source: el2.source,
                date: moment(el.created_at).format('YYYY-MM-DD HH:mm'),
              })
            })
          })
        })
        .catch(error => console.error(error))
      this.loading = false
    },
    methods: {
      editItem (item) {
      },
      deleteItem (item) {
      },
      downloadItem (item) {
        // Todo make generate download link
        var popout = window.open(`${process.env.VUE_APP_API_ROOT_URL}/storage/${item.source}`)
        window.setTimeout(() => {
          popout.close()
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
