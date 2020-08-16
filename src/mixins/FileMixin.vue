<script>
  export default {
    name: 'FileMixin',
    data: () => ({
      docTypes: ['docx', 'xlsx', 'pptx', 'ppt', 'doc'],
      videoTypes: ['mp4', 'flv'],
    }),
    methods: {
      defineExtension (filename) {
        if (!filename) {
          return
        }
        return filename.toLowerCase().split('.').pop()
      },
      isDocumentType (filename) {
        return this.docTypes.includes(this.defineExtension((filename)))
      },
      isVideoType (filename) {
        return this.videoTypes.includes(this.defineExtension(filename))
      },
      downloadFile (file_id) {
        window.open(`${process.env.VUE_APP_API_ROOT_URL}/download/${file_id}`)
      },
    },
  }
</script>
