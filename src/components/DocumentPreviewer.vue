<template>
  <vue-doc-preview
    id="vdp"
    :type="type"
    :value="''"
    :url="url"
    :height="90"
    language="javascript"
  />
</template>

<script>
  import VueDocPreview from 'vue-doc-preview'
  export default {
    name: 'DocumentPreviewer',
    components: {
      VueDocPreview,
    },
    props: {
      url: {
        required: true,
        type: String,
      },
      type: {
        type: String,
        default: 'office',
        validator: (value) => {
          return ['office', 'text', 'code'].includes(value)
        },
      },
      height: {
        type: Number,
        default: 100,
      },
    },
  }
</script>

<style scoped>

</style>
