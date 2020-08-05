<template>
  <v-container
    id="register"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          class="py-3 px-5"
          color="success"
          icon="mdi-mail"
          title="Форма регистрации"
        >
          <v-form
            :data-vv-scope="scope"
            color="white"
            @submit.prevent="validateForm()"
          >
            <v-text-field
              v-model="username"
              v-validate="'required|min:5'"
              :error-messages="errors.collect(`${scope}.name`)"
              color="secondary"
              data-vv-name="name"
              label="Имя и Фамилия*"
              prepend-icon="mdi-face"
              type="text"
            />

            <v-text-field
              v-model="email"
              v-validate="'required|email'"
              color="secondary"
              label="Электронная почта*"
              prepend-icon="mdi-email"
              :error-messages="errors.collect(`${scope}.email`)"
              data-vv-name="email"
            />

            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              v-validate="'required|min:5'"
              color="secondary"
              label="Пароль*"
              prepend-icon="mdi-account-key"
              :error-messages="errors.collect(`${scope}.password`)"
              data-vv-name="password"
              @click:append.prevent="show = !show"
            />

            <div class="body-2 py-2 font-weight-light">
              * Обязательные поля
            </div>

            <v-card-actions class="pa-0">
              <v-spacer />
              <v-btn
                color="success"
                default
                type="submit"
                :loading="loading"
              >
                Зарегистрироваться
              </v-btn>

              <v-spacer />
            </v-card-actions>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    username: 'PagesRegister',
    data: () => ({
      show: '',
      scope: 'register-form',
      username: '',
      email: '',
      password: '',
      loading: false,
    }),
    methods: {
      ...mapActions('user', ['register']),
      validateForm () {
        this.$validator.validateAll(this.scope)
          .then((result) => {
            return new Promise((resolve, reject) => {
              return result ? resolve(result) : reject(result)
            })
          })
          .then(() => {
            this.register({
              name: this.username,
              email: this.email,
              password: this.password,
            })
              .then(() => this.$router.push('/'))
          })
      },
    },
  }
</script>

<style lang="sass">
  #register
    .v-list-item__subtitle
      -webkic-line-clamp: initial
      -webkit-box-orient: initial
</style>
