<template>
  <validation-provider
    v-slot="{ errors }"
    tag="div"
    :rules="validationRule"
    :name="label"
  >
    <v-file-input v-model="innerValue" />
  </validation-provider>
</template>

<script>
  import FieldMixin from '@/components/Form/Mixins/FieldMixin'

  export default {
    name: 'FileField',
    mixins: [FieldMixin],
    data: () => ({
      files: [],
    }),
    watch: {
      innerValue (newVal) {
        this.$emit('input', {
          name: this.name,
          value: newVal,
        })
      },
    },
    methods: {
    },
  }
</script>
