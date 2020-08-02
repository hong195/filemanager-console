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
      <base-material-card
        class="px-5 py-3"
        color="success"
        inline
        title="Добавление новой записи"
      >
        <v-col
          v-for="(formField, index) in formFields"
          :key="index"
          cols="12"
        >
          <v-subheader
            v-if="formField.title"
            class="display-1 mt-1"
          >
            {{ formField.title }}
          </v-subheader>
          <v-text-field
            v-if="formField.type === 'text'"
            v-model="formField.value"
            v-validate="formField.rule"
            :label="formField.title"
            :error-messages="errors.collect(`${scope}.${formField.name}`)"
            :data-vv-name="formField.name"
            class="ml-4"
            outlined
          />
          <v-select
            v-else-if="formField.type === 'select'"
            v-model="formField.value"
            v-validate="formField.rule"
            :items="formField.options"
            :label="formField.title"
            color="secondary"
            item-color="secondary"
            :error-messages="errors.collect(`${scope}.${formField.name}`)"
            :data-vv-name="formField.name"
            class="ml-5"
          />
          <v-textarea
            v-else-if="formField.type === 'textarea'"
            v-model="formField.value"
            v-validate="formField.rule"
            :label="formField.title"
            :error-messages="errors.collect(`${scope}.${formField.name}`)"
            :data-vv-name="formField.name"
            class="ml-4"
            outlined
          />
          <v-file-input
            v-else-if="formField.type === 'file'"
            v-model="formField.value"
            v-validate="formField.rule"
            :display-size="1000"
            class="ml-4"
            color="deep-purple accent-4"
            :error-messages="errors.collect(`${scope}.${formField.name}`)"
            :data-vv-name="formField.name"
            outlined
            placeholder="Выбирите файл для загрузки"
            prepend-icon="mdi-paperclip"
          />
        </v-col>
        <v-card-actions
          class="pa-0 py-3"
          align="center"
        >
          <v-btn
            :loading="formPreloader"
            color="success"
            default
            type="submit"
            x-large
          >
            Добавить
          </v-btn>
        </v-card-actions>
        <base-material-alert
          v-show="message"
          dismissible
          color="success"
          align="center"
        >
          {{ message }}
        </base-material-alert>
      </base-material-card>
    </v-form>
  </v-container>
</template>

<script>
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
          title: 'Заголовок',
          type: 'text',
          rule: 'required',
        },
        {
          name: 'category_id',
          value: [],
          options: [],
          title: 'Категория',
          type: 'select',
          multiple: false,
          rule: 'required',
        },
        {
          name: 'description',
          value: '',
          title: 'Краткое описание',
          type: 'textarea',
          rule: '',
        },
        {
          name: 'attachment',
          value: [],
          title: 'Файл',
          type: 'file',
          multiple: false,
          rule: 'required',
        },
      ],
      items: [],
      loading: false,
    }),
    created () {
      this.$http.get('category')
        .then(({ data }) => {
          data.data.forEach((el) => {
            this.items.push({
              text: el.name,
              value: el.id,
            })
          })
        })
        .then(() => {
          const item = this.formFields.find((el) => {
            return el.name === 'category_id'
          })
          item.options = this.items
        })
    },
    methods: {
      addPost () {
        this.validateForm(this.scope)
          .then(() => {
            return this.$http.post('post', this.getFormValues())
          })
          .then(({ data }) => {
            this.message = data.message
            this.$refs.postForm.reset()
            this.$validator.reset()
            this.formPreloader = false
          })
      },
      getFormValues () {
        const fd = new FormData()
        this.formFields.forEach((el) => {
          fd.append('user_id', 9)
          fd.append(el.name, el.value)
        })
        return fd
      },
    },
  }
</script>
