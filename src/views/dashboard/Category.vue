<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      heading="Список категорий"
      sub-title="Список категорий"
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
        style="max-width: 250px"
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
                  v-if="isAdmin"
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
                  <template v-slot:actions="{ formPreloader }">
                    <v-card-actions>
                      <v-spacer />

                      <v-btn
                        color="blue darken-1"
                        text
                        type="submit"
                        :loading="formPreloader"
                      >
                        Сохранить
                      </v-btn>
                      <v-btn
                        color="error"
                        text
                        @click="dialog = false"
                      >
                        Закрыть
                      </v-btn>
                    </v-card-actions>
                  </template>
                </base-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <div v-if="isAdmin">
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
      formFields: [
        {
          text: 'Название',
          name: 'name',
          type: 'text',
          value: '',
          rule: 'required',
        },
        {
          text: 'Родительская категория',
          name: 'parent_id',
          type: 'tree',
          value: null,
          rule: '',
          options: [],
          disableBranchNodes: false,
        },
      ],
      items: [],
      search: undefined,
      loading: false,
    }),
    computed: {
      ...mapState('user', ['isAdmin']),
      headers () {
        return [
          { text: 'Идентификатор', value: 'id' },
          { text: 'Наименование', value: 'name' },
          { text: 'Количество записей', value: 'count', class: 'count' },
          { text: 'Дата добавления', value: 'created_at', class: 'date' },
          {
            sortable: false,
            text: 'Действия',
            value: 'actions',
            class: 'actions',
            guarded: true,
          },
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
      this.loadOptions()
    },
    methods: {
      loadOptions () {
        this.$http.get('category?with_children=1').then(({ data }) => {
          const item = this.formFields.find(el => {
            return el.name === 'parent_id'
          })
          item.options = []
          data.data.forEach(el => {
            if (el.children) {
              el.children = el.children.map(el2 => ({
                id: el2.id,
                label: el2.name,
                isDisabled: true,
              }))
            }
            item.options.push({
              id: el.id,
              label: el.name,
              children: el.children || '',
              isDisabled: false,
            })
          })
        })
      },
      fetchCategories () {
        this.loading = true
        this.$http
          .get('category')
          .then(({ data }) => {
            this.items = data.data
            this.loading = false
          })
          .catch(error => {
            console.error(error)
            this.loading = false
          })
      },
      add ($data) {
        this.currentItemId = null
        this.requestType = 'post'
        this.$refs[this.scope].resetAll()

        this.$http
          .post('category', $data)
          .then(({ data }) => {
            this.items.push(data.data)
            this.dialog = false
            this.fetchCategories()
            this.loadOptions()
            this.$refs[this.scope].setPreloader(false)
            this.$refs[this.scope].resetAll()
          })
          .catch(error => {
            this.$refs[this.scope].setPreloader(false)
            console.error(error)
          })
      },
      update ($data) {
        this.$http
          .put(`category/${this.currentItemId}`, $data)
          .then(() => {
            this.fetchCategories()
            this.loadOptions()
            this.dialog = false
            this.$refs[this.scope].resetAll()
            this.requestType = 'post'
          })
          .catch(error => {
            this.$refs[this.scope].setPreloader(false)
            console.error(error)
          })
      },
      deleteItem (item) {
        this.$http
          .delete(`category/${item.id}`)
          .then(() => {
            this.loadOptions()
            this.items.splice(
              this.items.findIndex(({ id }) => id === item.id),
              1,
            )
          })
          .catch(error => {
            console.error(error)
          })
      },
      setItem (item) {
        this.dialog = true
        const cat = this.formFields.find(el => {
          return el.name === 'parent_id'
        })

        cat.options.forEach(el => {
          el.isDisabled = el.id === item.id
          el.children.forEach(el2 => {
            el2.isDisabled = true
          })
        })

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
