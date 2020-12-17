<template>
  <v-container
    id="login"
    class="fill-height"
    tag="section"
  >
    <v-row
      justify="center"
      align="center"
    >
      <!--      Todo refactor into form base-->
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
          <v-form
            ref="form"
            class="px-3"
            lazy-validation
            @submit.prevent="auth"
          >
            <v-text-field
              id="email"
              v-model="email"
              :rules="emailRules"
              :label="$t('admin_panel.users.email')"
            />
            <v-text-field
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRules"
              :label="$t('admin_panel.users.password')"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="() => (showPassword = !showPassword)"
            />
            <v-checkbox
              v-model="rememberMe"
              :label="$t('admin_panel.users.remember_me')"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="loading"
                color="success"
                default
                type="submit"
                x-large
              >
                {{ $t('admin_panel.login') }}
              </v-btn>
              <v-spacer />
            </v-card-actions>
            <base-material-alert
              v-show="error"
              align="center"
              :color="color"
            >
              {{ message }}
            </base-material-alert>
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

    data () {
      return {
        email: this.$cookies.get('email'),
        password: this.$cookies.get('password'),
        showPassword: false,
        rememberMe: false,
        scope: 'login-form',
        loading: false,
        message: '',
        error: false,
      }
    },
    computed: {
      color () {
        return this.error ? 'error' : 'success'
      },
      emailRules () {
        return [
          v => !!v || this.$t('admin_panel.validation.email.required'),
          v =>
            /.+@.+\..+/.test(v || 'name@mail.uz') ||
            this.$t('admin_panel.validation.email.valid'),
        ]
      },
      passwordRules () {
        return [v => !!v || this.$t('admin_panel.validation.password.required')]
      },
    },
    methods: {
      ...mapActions('user', ['login']),
      auth () {
        this.error = false
        const data = {
          email: this.email,
          password: this.password,
        }
        this.$cookies.set('rememberMe', this.rememberMe)
        if (this.rememberMe) {
          this.$cookies.set('email', data.email)
          this.$cookies.set('password', data.password)
        } else {
          this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
        }
        if (this.$refs.form.validate()) {
          this.loading = true

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
        }
      },
    },
  }
</script>
