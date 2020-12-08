<template>
  <router-view :key="$i18n.locale" />
</template>

<script>
  export default {
    name: 'App',
  }
</script>
