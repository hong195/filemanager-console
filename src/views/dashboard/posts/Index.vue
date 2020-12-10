<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      :heading="$t('admin_panel.attachments.list')"
    />
    <base-material-card
      class="px-5 py-3"
      color="indigo"
      icon="mdi-vuetify"
      inline
    >
      <template v-slot:after-heading>
        <div class="display-2 font-weight-light">
          {{ $t('admin_panel.attachments.list') }}
        </div>
      </template>

      <form-base
        v-model="searchFormValues"
        :schema="searchFormFields"
        scope="post-search-form"
        style="margin-left: auto"
        class="post-search-form"
      >
        <template v-slot:actions>
          <div />
        </template>
      </form-base>

      <v-divider class="mt-3" />

      <data-table
        fetch-url="posts"
        :headers="headers"
        :search-options="searchFormValues"
        :should-update="updatePosts"
      >
        <template v-slot:item.actions="{ item }">
          <td>
            <font-awesome-icon
              icon="eye"
              class="mr-2"
              @click.prevent="view(item)"
            />
            <v-icon
              small
              class="mr-2"
              @click="downloadFile(item.attachments[0].id)"
            >
              mdi mdi-arrow-collapse-down
            </v-icon>
            <v-icon
              v-if="isAdmin"
              class="mr-2"
              small
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              v-if="isAdmin"
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </td>
        </template>
        <template v-slot:opened-item="{ headers, item }">
          <td
            class="spnTooltip"
            :colspan="headers.length"
          >
            <h3>{{ $t('admin_panel.posts.short_description') }}</h3>
            <div>{{ item.excerpt }}</div>
            <h3>{{ $t('admin_panel.posts.full_description') }}</h3>
            <div>{{ item.full_description }}</div>
          </td>
        </template>
      </data-table>
    </base-material-card>
    <v-dialog
      v-if="activeItem"
      v-model="dialog"
      :content-class="
        isDocumentType(activeItem.attachments[0].file_name) ? 'full-width' : 'auto-width'
      "
      :width="isDocumentType(activeItem.attachments[0].file_name) ? '100%' : 'auto'"
      :height="isDocumentType(activeItem.attachments[0].file_name) ? '100%' : '350px'"
      @click:outside="onModalClose()"
    >
      <div>
        <v-btn
          small
          fab
          tile
          color="red"
          class="close-btn"
          dark
          @click="onModalClose()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div v-if="isVideoType(activeItem.attachments[0].file_name)">
          <custom-video-player
            ref="player"
            :url="activeItem.attachments[0].url"
          />
        </div>
        <div v-else-if="isDocumentType(activeItem.attachments[0].file_name)">
          <document-previewer :url="activeItem.attachments[0].url" />
        </div>
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
  import DocumentPreviewer from '@/components/DocumentPreviewer'
  import CustomVideoPlayer from '@/components/VideoPlayer'
  import FileMixin from '@/mixins/FileMixin'
  import { mapState } from 'vuex'
  import FormBase from '@/components/Form/FormBase'
  import DataTable from '../components/DataTable'

  export default {
    name: 'Posts',
    components: {
      CustomVideoPlayer,
      DocumentPreviewer,
      FormBase,
      DataTable,
    },
    mixins: [FileMixin],
    data: () => ({
      activeItem: '',
      dialog: false,
      searchFormValues: null,
      searchFormFields: [],
      updatePosts: false,
    }),
    computed: {
      ...mapState('user', ['isAdmin']),
      headers () {
        return [
          { text: this.$t('admin_panel.posts.name'), value: 'name' },
          { text: this.$t('admin_panel.creation_date'), value: 'created_at', class: 'created_at' },
          { sortable: false, text: this.$t('admin_panel.actions'), value: 'actions', class: 'actions' },
          { text: '', value: 'data-table-expand', sortable: false },
        ]
      },
    },
    created () {
      this.$http.post('post-search-form')
        .then(({ data }) => {
          this.searchFormFields = data
        })
    },
    methods: {
      editItem (item) {
        this.$router.push({
          name: 'post_edit',
          params: { id: item.id },
        })
      },
      view (item) {
        this.activeItem = item
        this.dialog = true
      },
      deleteItem (item) {
        this.$http.delete(`posts/${item.id}`)
          .then(() => {
            this.updatePosts = true
          })
          .catch(error => {
            console.error(error)
          })
      },
      onModalClose () {
        this.dialog = false
        if (!this.isVideoType(this.activeItem.file_name)) {
          return
        }
        this.$refs.player.pause()
      },
    },
  }
</script>
<style lang="scss">
.post-search-form {
  .row {
    max-width: 800px;
    margin-left: auto;
  }
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 5px;
}
th.actions {
  min-width: 110px;
}
th.created_at {
  min-width: 150px;
}
th.file_size {
  min-width: 100px;
}
svg {
  cursor: pointer;
}
.full-width {
  width: 100% !important;
  height: 100%;
}
.auto-width {
  width: auto !important;
}
.tooltip {
  outline: none;
}
.tooltip strong {
  line-height: 30px;
}
.tooltip:hover {
  text-decoration: none;
}
.tooltip span {
  z-index: 10;
  display: none;
  padding: 14px 20px;
  margin-top: -30px;
  margin-left: 28px;
  width: 95%;
  line-height: 16px;
  max-width: 95% !important;
  height: auto;
  left: 2%;
}
.tooltip:hover span {
  display: inline;
  position: absolute;
  color: #111;
  border: 1px solid #dca;
  background: #fffaf0;
}
.callout {
  z-index: 20;
  position: absolute;
  top: 30px;
  border: 0;
  left: -12px;
}

/*CSS3 extras*/
.tooltip span {
  border-radius: 4px;
  box-shadow: 5px 5px 8px #ccc;
}

tr .spnTooltip {
  //   z-index: 10;
  //   display: none;
  //   padding: 14px 20px;
  //   margin-top: -30px;
  //   margin-left: 28px;
  //   width: 300px;
  //   line-height: 16px;
  //   transition: 0.2s all;
  // }
  // tr:hover .spnTooltip {
  //   transition: 0.2s all;
  //   left: 0;
  //   margin-top: 24px;
  //   width: 95%;
  //   display: inline;
  //   position: absolute;
  color: #111;
  border: 1px solid #dca;
  background: #fffaf0;
}
// .spnTooltip {
//   &:hover {
//     display: none !important;
//   }
// }
</style>
