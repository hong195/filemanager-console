<script>
  export default {
    name: 'ValidatorMixin',
    data: () => ({
      formPreloader: false,
      text: '',
    }),
    methods: {
      validateForm (scope) {
        this.formPreloader = true
        return this.$validator.validateAll(scope)
          .then((result) => {
            return new Promise((resolve, reject) => {
              return result ? resolve(result) : reject(result)
            })
          })
          .catch(() => {
            this.formPreloader = false
          })
      },
    },
  }
</script>

<style scoped>

</style>
