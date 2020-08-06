<template>
  <router-view />
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'App',
    created () {
      setTimeout(() => {
        this.checkUser()
      }, 3599)
    },
    methods: {
      ...mapActions('user', ['checkUser']),
    },
  }
</script>
