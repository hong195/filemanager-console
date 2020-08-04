<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      heading="Списко категорий"
      sub-title="Списко категорий"
    />

    <base-material-card
      class="px-5 py-3"
      color="indigo"
      icon="mdi-vuetify"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          Категории
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
        <template v-slot:top>
          <v-toolbar
            flat
            color="white"
            class="mt-5"
          >
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Добавить
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Добавить новую Категорию</span>
                </v-card-title>
                <base-form
                  v-if="formFields.length"
                  ref="category-form"
                  :form-fields="formFields"
                  :scope="scope"
                  :form-request-type="requestType"
                  @post-form-request="add"
                  @put-form-request="update"
                >
                  <template v-slot:actions="{formPreloader}">
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="error"
                        text
                        @click="dialog = false"
                      >
                        Закрыть
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        type="submit"
                        :loading="formPreloader"
                      >
                        Сохранить
                      </v-btn>
                    </v-card-actions>
                  </template>
                </base-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="setItem(item)"
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
    name: 'Category',
    data: () => ({
      dialog: false,
      scope: 'category-form',
      requestType: 'post',
      currentItemId: '',
      headers: [
        { text: 'Идентификатор', value: 'id' },
        { text: 'Наименование', value: 'name' },
        { text: 'Количество записей', value: 'count', class: 'count' },
        { text: 'Дата добавления', value: 'date', class: 'created_at' },
        { sortable: false, text: 'Действия', value: 'actions', class: 'actions' },
      ],
      formFields: [
        { text: 'Название', name: 'name', type: 'text', value: '', rule: 'required' },
        { text: 'Слаг', name: 'slug', type: 'text', value: '', rule: 'required' },
      ],
      items: [],
      search: undefined,
      loading: false,
    }),
    created () {
      this.fetch()
    },
    methods: {
      fetch () {
        this.loading = true
        this.$http.get('category')
          .then(({ data }) => {
            this.items = data.data
          })
          .catch(error => console.error(error))
        this.loading = false
      },
      add ($data) {
        this.requestType = 'post'
        this.$refs[this.scope].resetAll()

        this.$http.post('category', $data)
          .then(({ data }) => {
            this.items.push(data.data)
            this.dialog = false
            this.$refs[this.scope].setPreloader(false)
            this.$refs[this.scope].resetAll()
          })
          .catch((error) => {
            this.$refs[this.scope].setPreloader(false)
            console.error(error)
          })
      },
      update ($data) {
        this.$http.put(`category/${this.currentItemId}`, $data)
          .then(() => {
            this.fetch()
            this.dialog = false
            this.$refs[this.scope].resetAll()
          })
          .catch((error) => {
            this.$refs[this.scope].setPreloader(false)
            console.error(error)
          })
      },
      deleteItem (item) {
        this.$http.delete(`category/${item.id}`)
          .then(() => {
            this.items.splice(this.items.findIndex(({ id }) => id === item.id), 1)
          })
          .catch(error => {
            console.error(error)
          })
      },
      setItem (item) {
        this.dialog = true
        setTimeout(() => {
          this.requestType = 'put'
          this.currentItemId = item.id
          this.$refs[this.scope].fillForm(item)
        }, 200)
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
