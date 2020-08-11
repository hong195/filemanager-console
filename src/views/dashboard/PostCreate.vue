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
          title="Добавление новой записи"
        >
          <base-form
            ref="postForm"
            :form-fields="formFields"
            :scope="scope"
            :form-request-type="'post'"
            @post-form-request="addPost"
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
                  Добавить
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
        right: true
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
    name: 'PostCreate',
    mixins: [ValidatorMixin],
    data: () => ({
      scope: 'post-form',
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
          value: [],
          options: [],
          text: 'Категория',
          type: 'select',
          multiple: false,
          rule: 'required',
        },
        {
          name: 'description',
          value: '',
          text: 'Краткое описание',
          type: 'textarea',
          rule: 'required',
        },
        {
          name: 'attachment',
          value: [],
          text: 'Файл',
          type: 'file',
          multiple: false,
          rule: 'required|mimes:docx,pptx,doc,/mp4',
        },
      ],
      items: [],
      loading: false,
      snackbar: false,
    }),
    computed: {
      ...mapGetters('user', ['currentUser']),
    },
    methods: {
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
          })
      },
      getFormValues () {
        const fd = new FormData()
        this.formFields.forEach((el) => {
          fd.append('user_id', this.currentUser.id)
          fd.append(el.name, el.value)
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
