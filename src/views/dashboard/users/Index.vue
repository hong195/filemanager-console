<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      heading="Список Пользователей"
    />

    <base-material-card
      class="px-5 py-3"
      color="indigo"
      icon="mdi-vuetify"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Пользователи
        </div>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        label="Поиск"
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
        loading-text="Загрузка..."
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
      headers: [
        { text: 'Идентификатор', value: 'id' },
        { text: 'Имя', value: 'name' },
        { text: 'Электронная почта', value: 'email', class: 'email' },
        { text: 'Дата регистрации', value: 'created_at', class: 'created_at' },
        { sortable: false, text: 'Действия', value: 'actions', class: 'actions' },
      ],
      items: [],
      search: undefined,
      loading: false,
    }),
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
          name: 'user_update',
          params: { id: user.id },
        })
      },
      deleteItem (item) {
        this.$http.delete(`users/${item.id}`)
          .then((data) => {
            this.items.splice(this.items.findIndex(({ id }) => id === item.id), 1)
          })
      },
      downloadItem (item) {
        const popout = window.open(`${process.env.VUE_APP_API_ROOT_URL}/storage/${item.source}`)
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
