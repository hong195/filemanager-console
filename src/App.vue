<template>
  <router-view />
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'App',
    created () {
      this.me()
    },
    methods: {
      ...mapActions('user', ['me']),
    },
  }
</script>
