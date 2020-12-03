<template>
  <validation-provider
    v-slot="{ errors }"
    tag="div"
    :rules="validationRule"
    :name="label"
  >
    <file-pond
      ref="pond"
      name="test"
      class-name="my-pond"
      label-idle="Drop files here..."
      allow-multiple="true"
      :files="files"
      :before-remove-file="update"
      v-bind="attributes"
      @addfilestart="update"
      @init="handleFilePondInit"
    />
  </validation-provider>
</template>

<script>
  import FieldMixin from '@/components/Form/Mixins/FieldMixin'
  import vueFilePond from 'vue-filepond'

  // Import plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js'

  // Import styles
  import 'filepond/dist/filepond.min.css'
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

  // Create FilePond component
  const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

  export default {
    name: 'FileField',
    components: { FilePond },
    mixins: [FieldMixin],
    data: () => ({
      files: [],
    }),
    watch: {
      files (val) {
        console.log(val)
      },
      innerValue (newVal) {
        this.$emit('input', {
          name: this.name,
          value: newVal,
        })
      },
    },
    methods: {
      handleFilePondInit: function () {
        console.log('FilePond has initialized')

        // example of instance method call on pond reference
        this.$refs.pond.getFiles()
      },
      update (file) {
        console.log(file.file)
      },
    },
  }
</script>
