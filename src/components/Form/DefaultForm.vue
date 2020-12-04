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
    />
  </base-material-card>
</template>
<script>
  import FormBase from './FormBase'

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
        this.axios[this.method](this.endPointUrl, this.formValue)
          .then(({ data }) => {
            this.$store.commit('successMessage', data.message)

            if (this.nextRouteName) {
              this.$router.push({ name: this.nextRouteName })
            }
          })
          .catch((error) => {
            const { response } = error
            this.$store.commit('errorMessage', response.data.message)
            console.error(error)
          })
        resolve()
      },
    },
  }
</script>
