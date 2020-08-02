<template>
  <section class="mb-12 text-center">
    <h1
      class="font-weight-light mb-2"
      style="color:#3c4858; font-size:24px"
      v-text="heading"
    />

    <span
      v-if="subtitle"
      class="font-weight-light"
      style="font-size: 16px; color: #3c4858"
    >
      {{ subtitle }}
    </span>
  </section>
</template>

<script>
  export default {
    name: 'VComponent',

    props: {
      heading: {
        type: String,
        default: '',
      },
      link: {
        type: String,
        default: '',
      },
      subtitle: {
        type: String,
        default: '',
      },
    },
  }
</script>
