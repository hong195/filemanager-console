<template>
  <v-container
    class="error-page fill-height"
    tag="section"
  >
    <v-row
      class="text-center"
      justify="center"
    >
      <v-col cols="auto">
        <h1
          class="title font-weight-black"
          style="font-size: 50px !important;"
        >
          404
        </h1>

        <div class="display-3 mb-5 mt-10">
          {{ $t('admin_panel.404') }}
        </div>

        <v-btn
          depressed
          to="posts/list"
        >
          {{ $t('admin_panel.to_home_page') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PagesError',
    data () {
      return {
        attachment: '',
      }
    },
  }
</script>

<style lang="sass">
  .error-page
    h1
      font-size: 12rem
</style>
