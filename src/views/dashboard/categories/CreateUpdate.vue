<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <default-form
      base-url="categories"
      next-route-name="categories_list"
    />
  </v-container>
</template>

<script>
  import DefaultForm from '@/components/Form/DefaultForm'

  export default {
    name: 'CreateUpdate',
    components: { DefaultForm },
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
