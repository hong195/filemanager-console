<template>
  <v-form
    :data-vv-scope="scope"
    class="pt-12"
    @submit.prevent="submit()"
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
        :data-vv-name="formField.text"
        :error-messages="errors.collect(`${scope}.${formField.text}`)"
        :label="formField.text"
        outlined
      />
      <v-select
        v-else-if="formField.type === 'select'"
        v-model="formField.value"
        v-validate="formField.rule"
        :data-vv-name="formField.text"
        :error-messages="errors.collect(`${scope}.${formField.text}`)"
        :items="formField.options"
        :label="formField.text"
        color="secondary"
        item-color="secondary"
      />
      <v-textarea
        v-else-if="formField.type === 'textarea'"
        v-model="formField.value"
        v-validate="formField.rule"
        :data-vv-name="formField.text"
        :error-messages="errors.collect(`${scope}.${formField.text}`)"
        :label="formField.text"
        outlined
      />
      <v-file-input
        v-else-if="formField.type === 'file'"
        v-model="formField.value"
        v-validate="formField.rule"
        :data-vv-name="formField.text"
        :display-size="1000"
        :error-messages="errors.collect(`${scope}.${formField.text}`)"
        color="deep-purple accent-4"
        outlined
        placeholder="Выбирите файл для загрузки"
        prepend-icon="mdi-paperclip"
      />
    </v-col>
    <v-col>
      <slot
        :form-preloader="formPreloader"
        name="actions"
      >
        <v-card-actions
          align="center"
          class="pa-0 py-3 ml-4"
        >
          <v-btn
            :loading="formPreloader"
            color="success"
            default
            x-large
            type="submit"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </slot>
    </v-col>
    <base-material-alert
      v-show="message"
      align="center"
      color="success"
      dismissible
    >
      {{ message }}
    </base-material-alert>
  </v-form>
</template>

<script>
  import ValidatorMixin from '@/mixins/ValidatorMixin'

  export default {
    name: 'Form',
    mixins: [ValidatorMixin],
    props: {
      formFields: {
        type: Array,
        default: () => [],
        validator: (arr) => {
          // Todo validation fields logic
          return true
        },
      },
      formRequestType: {
        type: String,
        required: true,
        validator: (value) => {
          return ['post', 'get', 'put', 'delete'].includes(value.toLowerCase())
        },
      },
      scope: {
        type: String,
        required: true,
      },
      currentItem: {
        type: Object,
        default: () => {},
      },
    },
    data: () => ({
      formPreloader: false,
      items: [],
      message: '',
    }),
    methods: {
      submit () {
        this.validateForm(this.scope)
          .then(() => {
            this.$emit(`${this.formRequestType}-form-request`, this.getFieldsValue())
          })
      },
      getFieldsValue () {
        const obj = {}
        this.formFields.forEach(el => {
          obj[el.name] = el.value
        })
        return obj
      },
      fillForm (item) {
        this.formFields.forEach(el => {
          el.value = item[el.name]
        })
      },
      resetAll () {
        this.resetValidator()
        this.resetFields()
      },
      resetValidator () {
        this.$validator.reset({
          scope: this.scope,
          vmId: this.$validator.id,
        })
      },
      resetFields () {
        this.formFields.forEach(el => (el.value = ''))
      },
      setPreloader (value) {
        this.formPreloader = value
      },
    },
  }
</script>
