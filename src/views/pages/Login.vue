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
          class="py-3 px-5"
          icon="mdi-mail"
          max-width="400"
          title="Форма регистрации"
          width="100%"
        >
          <v-form
            :data-vv-scope="scope"
            @submit.prevent="validateForm()"
            color="white"
          >

            <v-text-field
              color="secondary"
              label="Электронная почта*"
              prepend-icon="mdi-email"
              v-model="email"
              :error-messages="errors.collect(`${scope}.email`)"
              v-validate="'required|email'"
              data-vv-name="email"
            />

            <v-text-field
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append.prevent="show = !show"
              color="secondary"
              label="Пароль*"
              prepend-icon="mdi-account-key"
              v-model="password"
              :error-messages="errors.collect(`${scope}.password`)"
              v-validate="'required'"
              data-vv-name="password"
            />

            <div class="body-2 py-2 font-weight-light">
              * Обязательные поля
            </div>

            <v-card-actions class="pa-0 py-3">
              <v-spacer/>
              <v-btn
                color="success"
                default
                type="submit"
                :loading="loading"
              >
                Войти
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-form>
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
      email: '',
      password: '',
      show: false,
      scope: 'login-form',
      loading: false,
    }),
    methods: {
      ...mapActions('user', ['login']),
      validateForm () {
        this.loading = true
        this.$validator.validateAll(this.scope)
          .then((result) => {
            return new Promise((resolve, reject) => {
              return result ? resolve(result) : reject(result)
            })
          })
          .then(() => {
            this.login({
              email: this.email,
              password: this.password,
            })
              .then(data => this.$router.push('/'))
          })
        this.loading = false
      },
    },
  }
</script>
