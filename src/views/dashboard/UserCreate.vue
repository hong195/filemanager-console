<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <base-material-snackbar
      v-model="snackbar"
      type="success"
      :timeout="5000"
      :dismissible="false"
      v-bind="{
        top: true,
        right: true
      }"
    >
      {{ message }}
    </base-material-snackbar>
    <v-row justify="center">
      <v-col
        cols="12"
        md="12"
        class="mt-10"
      >
        <base-material-card icon="mdi-account-outline">
          <template v-slot:after-heading>
            <div
              v-if="isUpdate"
              class="font-weight-light card-title mt-2"
            >
              Редактирование пользователя
            </div>
            <div
              v-else
              class="font-weight-light card-title mt-2"
            >
              Создание пользователя
            </div>
          </template>

          <v-container class="py-0">
            <base-form
              :ref="scope"
              :form-fields="formFields"
              :scope="scope"
              :current-item="currentItem"
              :form-request-type="requestType"
              @post-form-request="addUser"
              @put-form-request="updateUser"
            >
              <template v-slot:actions>
                <v-card-actions>
                  <v-btn
                    :loading="preloader"
                    color="success"
                    default
                    type="submit"
                    x-large
                  >
                    {{ isUpdate ? 'Обновить' : 'Добавить' }}
                  </v-btn>
                </v-card-actions>
              </template>
            </base-form>
          </v-container>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'UserCreate',
    data: () => ({
      requestType: 'post',
      scope: 'userForm',
      currentItem: {},
      formFields: [
        {
          name: 'name',
          value: '',
          text: 'ФИО',
          type: 'text',
          rule: 'required',
        },
        {
          name: 'email',
          value: '',
          text: 'Электронная почта',
          type: 'text',
          multiple: false,
          rule: 'required|email',
        },
        {
          name: 'password',
          value: '',
          text: 'Пароль',
          type: 'text',
          multiple: false,
          rule: 'required',
        },
        {
          name: 'role',
          value: '',
          text: 'Роль',
          type: 'select',
          options: [],
        }],
      preloader: false,
      snackbar: false,
      message: '',
    }),
    computed: {
      isUpdate () {
        return this.$route.params.id && parseInt(this.$route.params.id)
      },
    },
    watch: {
      currentItem () {
        if (this.isUpdate) {
          this.$refs[this.scope].restAll()
        }
      },
    },
    created () {
      this.fetchRoles()
      if (this.isUpdate) {
        this.fetchUser(this.$route.params.id)
        this.formFields.find((el) => el.name === 'password').rule = ''
        this.requestType = 'put'
      }
    },
    methods: {
      addUser (data) {
        this.$http.post('user', data)
          .then(({ data }) => {
            this.$router.push({ name: 'users' })
          })
          .catch((error) => {
            console.error(error)
          })
      },
      updateUser (data) {
        this.preloader = true
        this.$http.put(`user/${this.$route.params.id}`, data)
          .then(({ data }) => {
            this.message = data.message
            this.snackbar = true
            this.preloader = false
          })
          .catch((error) => {
            this.preloader = false
            console.error(error)
          })
      },
      fetchRoles () {
        this.$http.get('roles')
          .then(({ data }) => {
            const roles = this.formFields.find((el) => el.type === 'select')
            data.data.forEach(role => {
              roles.options.push({
                value: role.id,
                text: role.name,
              })
            })
          })
      },
      fetchUser (userId) {
        this.$http.get(`user/${userId}`)
          .then(({ data }) => {
            this.currentItem = data.data
          })
          .catch(error => {
            console.error(error)
          })
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
