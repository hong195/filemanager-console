<script>
  import Index from '@/views/dashboard/posts/Index'
  export default {
    name: 'UnapprovedPosts',
    extends: Index,
    data: () => ({
      fetchUrl: 'posts?status=pending',
    }),
    computed: {
      actions () {
        return [
          {
            icon: 'mdi-check-outline',
            handler: this.approve,
            permission: 'can_publish',
          },
          {
            icon: 'mdi-eye',
            handler: this.view,
          },
          {
            icon: 'mdi-arrow-collapse-down',
            handler: this.downloadFile,
          },
          {
            icon: 'mdi-pencil',
            handler: this.edit,
            permission: 'edit_post',
          },
          {
            icon: 'mdi-delete',
            handler: this.deleteItem,
            permission: 'delete_post',
          },
        ]
      },
    },
    methods: {
      approve (item) {
        this.$http.put(`approve-post/${item.id}`)
          .then(() => {
            this.$refs['data-table'].fetchPosts()
          })
          .catch((error) => {
            console.error(error)
          })
      },
    },
  }
</script>
