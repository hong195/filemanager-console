<script>
  export default {
    name: 'CrudMixin',
    data: () => ({
      items: [],
    }),
    methods: {
      deleteItem (item) {
        this.$http.delete(`category/${item.id}`)
          .then(() => {
            this.items.splice(this.items.findIndex(({ id }) => id === item.id), 1)
          })
      },
    },
  }
</script>
