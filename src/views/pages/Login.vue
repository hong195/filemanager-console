<template>
  <v-container
    id="login"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-slide-y-transition appear>
        <base-material-card
          background-color="#fff"
          color="success"
          max-width="400"
          width="100%"
          icon="mdi-account-check"
          title="Авторизация"
          class="pt-4"
        >
          <base-form
            ref="loginForm"
            color="white"
            :form-fields="formFields"
            :scope="scope"
            :message="message"
            :form-request-type="'post'"
            @post-form-request="auth"
          >
            <template v-slot:actions>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :loading="loading"
                  color="success"
                  default
                  type="submit"
                  x-large
                >
                  Добавить
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </template>
            <template v-slot:form-message>
              <base-material-alert
                v-show="error"
                align="center"
                :color="color"
              >
                {{ message }}
              </base-material-alert>
            </template>
          </base-form>
        </base-material-card>
      </v-slide-y-transition>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'PagesLogin',

    data: () => ({
      formFields: [
        {
          name: 'email',
          value: '',
          text: 'Электронная почта',
          type: 'text',
          rule: 'required|email',
        },
        {
          name: 'password',
          value: '',
          text: 'Пароль',
          type: 'text',
          rule: 'required',
        },
      ],
      scope: 'login-form',
      loading: false,
      message: '',
      error: false,
    }),
    computed: {
      color () {
        return this.error ? 'error' : 'success'
      },
    },
    methods: {
      ...mapActions('user', ['login']),
      auth (data) {
        this.loading = true
        this.error = false
        this.login(data)
          .then(() => {
            this.loading = false
            this.$router.push({ name: 'home' })
          })
          .catch(({ response }) => {
            console.error(response)
            this.message = response.data.message
            this.loading = false
            this.error = true
          })
      },
    },
  }
</script>
