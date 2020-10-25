<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <v-form
      ref="postForm"
      :data-vv-scope="scope"
      class="pt-12"
      @submit.prevent="addPost()"
    >
      <v-col>
        <base-material-card
          class="px-5 py-3"
          color="success"
          inline
          :title="
            $route.query.edit
              ? 'Редактировать запись'
              : 'Добавление новой записи'
          "
        >
          <base-form
            ref="postForm"
            :form-fields="formFields"
            :scope="scope"
            :form-request-type="method"
            @post-form-request="addPost"
            @put-form-request="updatePost"
          >
            <template v-slot:actions>
              <v-card-actions>
                <v-btn
                  :loading="loading"
                  color="success"
                  default
                  type="submit"
                  x-large
                >
                  {{ method === 'put' ? 'Обновить' : 'Добавить' }}
                </v-btn>
              </v-card-actions>
            </template>
          </base-form>
        </base-material-card>
      </v-col>
    </v-form>
    <base-material-snackbar
      v-model="snackbar"
      color="success"
      type="success"
      dismissible
      v-bind="{
        top: true,
        right: true,
      }"
    >
      Запись успешно добавлена
    </base-material-snackbar>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ValidatorMixin from '@/mixins/ValidatorMixin'

  export default {
    mixins: [ValidatorMixin],
    data: () => ({
      scope: 'post-form',
      method: 'post',
      message: '',
      formFields: [
        {
          name: 'name',
          value: '',
          text: 'Заголовок',
          type: 'text',
          rule: 'required',
        },
        {
          name: 'category_id',
          value: null,
          options: [],
          text: 'Категория',
          disableBranchNodes: true,
          type: 'tree',
          multiple: false,
          rule: 'required',
        },
        {
          name: 'excerpt',
          value: '',
          text: 'Краткое описание',
          type: 'textarea',
          rule: 'required',
        },
        {
          name: 'full_description',
          value: '',
          text: 'Полное описание',
          type: 'textarea',
          rule: 'required',
        },
        {
          name: 'attachment',
          value: [],
          text: 'Файл',
          type: 'file',
          multiple: false,
          rule: 'required',
        },
      ],
      items: [],
      loading: false,
      snackbar: false,
      dialog: false,
      className: 'hidden',
    }),
    computed: {
      ...mapGetters('user', ['currentUser']),
    },
    created () {
      this.loadOptions()
    },
    mounted () {
      if (this.$route.query.edit) {
        this.formFields = this.formFields.filter(
          item => item.name !== 'attachment',
        )
        this.$http.get('post/' + this.$route.query.id).then(({ data }) => {
          const post = data.data
          this.method = 'put'
          this.formFields.forEach(item => {
            item.value = post[item.name]
          })
        })
      }
    },
    methods: {
      loadOptions () {
        this.$http
          .get('category?with_children=1')
          .then(({ data }) => {
            data.data.forEach(el => {
              this.items.push({
                id: el.id,
                label: el.name,
                children: el.children || '',
              })
            })
          })
          .then(() => {
            const item = this.formFields.find(el => {
              return el.name === 'category_id'
            })
            this.items.forEach(el => {
              if (el.children) {
                el.children = el.children.map(el2 => ({
                  id: el2.id,
                  label: el2.name,
                }))
              }
            })
            item.options = this.items
          })
      },
      addPost () {
        this.loading = true
        this.validateForm(this.scope)
          .then(() => {
            return this.$http.post('post', this.getFormValues())
          })
          .then(({ data }) => {
            this.message = data.message
            this.$refs.postForm.reset()
            this.$validator.reset()
            this.loading = false
            this.snackbar = true
          })
          .then(() => {
            setTimeout(() => {
              this.$router.push('/posts')
            }, 1500)
          }).catch(() => {
            this.loading = false
          })
      },
      updatePost () {
        this.loading = true
        this.validateForm(this.scope)
          .then(() => {
            return this.$http.put(
              'post/' + this.$route.query.id,
              this.getFormValuesUpdate(),
            )
          })
          .then(({ data }) => {
            this.message = data.message
            this.$refs.postForm.reset()
            this.$validator.reset()
            this.loading = false
            this.snackbar = true
          })
          .then(() => {
            setTimeout(() => {
              this.$router.push('/posts')
            }, 1500)
          })
      },
      getFormValues () {
        const fd = new FormData()
        fd.append('user_id', this.currentUser.id)
        this.formFields.forEach(el => {
          fd.append(el.name, el.value)
        })
        return fd
      },
      getFormValuesUpdate () {
        const fd = {}
        fd.user_id = this.currentUser.id
        this.formFields.forEach(el => {
          fd[el.name] = el.value
        })
        return fd
      },
    },
  }
</script>
<style  lang="scss">
.v-snack__content {
  .v-alert {
    width: 100%;
    .v-btn {
      i {
        margin-top: 12px;
      }
    }
  }
}
</style>
