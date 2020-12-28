<template>
  <base-material-card
    color="success"
    icon="mdi-account"
    :title="`${isUpdate ? titleUpdate : titleCreate} `"
    class="px-5 py-3 mb-10"
    style="margin-top: 30px;"
  >
    <form-base
      v-model="formValue"
      :schema="schema"
      :scope="'check-create'"
      :method="method"
      :on-submit="createOrUpdate"
      :on-update="createOrUpdate"
      :loading="loading"
    />
  </base-material-card>
</template>
<script>
  import FormBase from './FormBase'
  import { serialize } from 'object-to-formdata'

  export default {
    name: 'DefaultForm',
    components: {
      FormBase,
    },
    props: {
      baseUrl: {
        type: String,
        default: '',
      },
      titleCreate: {
        type: String,
        default: '',
      },
      titleUpdate: {
        type: String,
        default: '',
      },
      nextRouteName: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      formValue: null,
      schema: [],
      loading: false,
    }),
    computed: {
      isUpdate () {
        return !!this.$route.params.id
      },
      method () {
        return this.isUpdate ? 'put' : 'post'
      },
      id () {
        return this.$route.params.id
      },
      formUrl () {
        return this.isUpdate ? `${this.baseUrl}/${this.id}/edit` : `${this.baseUrl}/create`
      },
      endPointUrl () {
        return this.isUpdate ? `${this.baseUrl}/${this.id}` : this.baseUrl
      },
    },
    created () {
      this.fetchForm()
    },
    methods: {
      actionMethod (funcName, item) {
        this[funcName](item)
      },
      fetchForm () {
        this.axios.get(this.formUrl)
          .then(({ data }) => {
            this.schema = data.form
          })
      },
      createOrUpdate ({ resolve }) {
        this.loading = true
        this.formValue._method = this.method
        const formValues = serialize(this.formValue)
        this.axios.request({
          method: 'post',
          url: this.endPointUrl,
          data: formValues,
        })
          .then(({ data }) => {
            this.loading = false
            this.$store.commit('successMessage', data.message)

            if (this.nextRouteName) {
              this.$router.push({ name: this.nextRouteName })
            }
          })
          .catch((error) => {
            this.loading = false
            const { response } = error
            if (typeof response.data === 'object') {
              let msg = ''
              Object.keys(response.data).map(function (key, index) {
                msg += response.data[key] + '\n'
              })
              this.$store.commit('errorMessage', msg)
            } else { this.$store.commit('errorMessage', response.data.message) }
          })
      },
    },
  }
</script>
