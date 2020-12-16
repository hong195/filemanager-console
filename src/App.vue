<template>
  <v-app :key="$i18n.locale">
    <router-view />
    <base-snackbar-message />
  </v-app>
</template>

<script>
  export default {
    name: 'App',
  }
</script>
