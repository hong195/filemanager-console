<template>
  <v-snackbar
    v-model="snackBar"
    :color="$store.getters.color"
    :timeout="5000"
  >
    <base-material-alert
      :dismissible="true"
      :color="$store.getters.color"
      class="ma-0"
      dark
    >
      {{ message }}
    </base-material-alert>
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        text
        v-bind="attrs"
        @click="snackBar = false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
  export default {
    name: 'SnackbarMessage',
    data () {
      return {
        timeoutCallback: null,
        snackBar: false,
      }
    },
    computed: {
      message: {
        get () {
          return this.$store.getters.message
        },
        set (val) {
          this.$store.commit('message', val)
        },
      },
      classes () {
        return {
          // eslint-disable-next-line no-undef
          ...VSnackbar.options.computed.classes.call(this),
          'v-snackbar--material': true,
        }
      },
    },
    watch: {
      message (val) {
        if (val) {
          this.snackBar = true
        }
      },
      snackBar (val) {
        if (!val) {
          this.message = ''
        }
      },
    },
    methods: {
      closeSnackbar () {
        this.snackBar = false
      },
    },
  }
</script>
<style>
.v-snack__content .v-alert .v-btn i {
  display: none;
}
</style>
