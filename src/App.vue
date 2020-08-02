<template>
  <router-view />
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'App',
    created () {
      this.checkUser()
    },
    methods: {
      ...mapActions('user', ['checkUser']),
    },
  }
</script>
