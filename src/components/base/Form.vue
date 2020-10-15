<template>
  <v-form
    :data-vv-scope="scope"
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

      <div v-if="formField.type === 'text'">
        <slot name="text">
          <v-text-field
            v-model="formField.value"
            v-validate="formField.rule"
            :data-vv-name="formField.text"
            :error-messages="errors.collect(`${scope}.${formField.text}`)"
            :label="formField.text"
          />
        </slot>
      </div>
      <div v-else-if="formField.type === 'select'">
        <slot
          name="select"
          :formField="{formField}"
        >
          <v-select
            v-model="formField.value"
            v-validate="formField.rule"
            :data-vv-name="formField.text"
            :error-messages="errors.collect(`${scope}.${formField.text}`)"
            :items="formField.options"
            :label="formField.text"
            color="primary"
            item-color="primary"
          />
        </slot>
      </div>
      <v-textarea
        v-else-if="formField.type === 'textarea'"
        v-model="formField.value"
        v-validate="formField.rule"
        :data-vv-name="formField.text"
        :error-messages="errors.collect(`${scope}.${formField.text}`)"
        :label="formField.text"
      />
      <v-file-input
        v-else-if="formField.type === 'file'"
        v-model="formField.value"
        v-validate="formField.rule"
        :data-vv-name="formField.text"
        :display-size="1000"
        :error-messages="errors.collect(`${scope}.${formField.text}`)"
        color="deep-purple accent-4"
        placeholder="Выберите файл для загрузки"
        prepend-icon="mdi-paperclip"
      />
      <div v-else-if="formField.type === 'tree'">
        <treeselect
          ref="treeSelect"
          v-model="formField.value"
          v-validate="formField.rule"
          :options="formField.options"
          :placeholder="formField.text"
          :disable-branch-nodes="formField.disableBranchNodes"
          no-options-text="Нет доступных значений"
          no-results-text="Нет доступных значений"
          no-children-text="Нет доступных значений"
          :data-vv-name="formField.text"
          :error-messages="errors.collect(`${scope}.${formField.text}`)"
          style="margin-top: 20px;"
        />
        <span style="color: #ff5252 !important; font-size: 12px;">
          {{ errors.first(`${scope}.${formField.text}`) }}
        </span>
      </div>
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
    <slot name="form-message" />
  </v-form>
</template>

<script>
  import ValidatorMixin from '@/mixins/ValidatorMixin'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Form',
    components: {
      Treeselect,
    },
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
      message: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      formPreloader: false,
      items: [],
    }),
    watch: {
      currentItem: {
        handler (data) {
          this.setFieldsValues(data)
        },
        deep: true,
      },
    },
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
          obj[el.name] = el.value || null
        })
        return obj
      },
      setFieldsValues (data) {
        this.formFields.forEach((field) => {
          if (data[field.name]) {
            field.value = data[field.name]
          }
          if (typeof data[field.name] === 'object' && !data[field.name].length) {
            field.value = data[field.name].id
          }
        })
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
        this.formFields.forEach(el => (el.value = null))
      },
      setPreloader (value) {
        this.formPreloader = value
      },
    },
  }
</script>
