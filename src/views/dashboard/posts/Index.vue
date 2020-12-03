<template>
  <v-container
    id="data-tables"
    tag="section"
  >
    <base-v-component
      heading="Медиа файлы"
      sub-title="Список медиа файлов"
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

      <div
        style="
          display: flex;
          flex-wrap: wrap;
          margin-left: auto;
          justify-content: flex-end;
        "
      >
        <treeselect
          v-model="searchOptions.category"
          :options="categories"
          :placeholder="$t('admin_panel.categories.plural')"
          no-options-text="Нет доступных значений"
          no-results-text="Нет доступных значений"
          no-children-text="Нет доступных значений"
          style="margin: 20px 10px 0 0; max-width: 350px"
        />

        <treeselect
          v-model="searchOptions.mime_type"
          :options="allowedMimeTypes"
          :placeholder="$t('admin_panel.attachments.file_extension')"
          style="margin: 20px 10px 0 0; max-width: 200px"
        />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          hide-details
          :label="$t('admin_panel.search')"
          single-line
          style="max-width: 250px"
        />
      </div>

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="items"
        :search.sync="search"
        locale="ru"
        :loading="loading"
        :loading-text="$t('admin_panel.loading')"
        :calculate-widths="true"
        show-expand
        :single-expand="true"
        :expanded.sync="expanded"
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
              @click="downloadFile(item.file_id)"
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
        <template v-slot:expanded-item="{ headers, item }">
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
      </v-data-table>
    </base-material-card>
    <v-dialog
      v-model="dialog"
      :content-class="
        isDocumentType(activeItem.file_name) ? 'full-width' : 'auto-width'
      "
      :width="isDocumentType(activeItem.file_name) ? '100%' : 'auto'"
      :height="isDocumentType(activeItem.file_name) ? '100%' : '350px'"
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
        <div v-if="isVideoType(activeItem.file_name)">
          <custom-video-player
            ref="player"
            :url="activeItem.url"
          />
        </div>
        <div v-else-if="isDocumentType(activeItem.file_name)">
          <document-previewer :url="activeItem.url" />
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
  import Treeselect from '@riophae/vue-treeselect'
  import allowedMimeTypes from '@/utils/utils'

  export default {
    name: 'Posts',
    components: {
      CustomVideoPlayer,
      DocumentPreviewer,
      Treeselect,
    },
    mixins: [FileMixin],
    data: () => ({
      items: [],
      activeItem: '',
      search: undefined,
      loading: false,
      dialog: false,
      categories: [],
      allowedMimeTypes,
      searchOptions: {
        mime_type: null,
        category: null,
      },
      expanded: [],
      singleExpand: false,
    }),
    computed: {
      ...mapState('user', ['isAdmin']),
      headers () {
        return [
          { text: this.$t('admin_panel.posts.name'), value: 'name' },
          { text: this.$t('admin_panel.creation_date'), value: 'date', class: 'created_at' },
          { sortable: false, text: this.$t('admin_panel.actions'), value: 'actions', class: 'actions' },
          { text: '', value: 'data-table-expand' },
        ]
      },
    },
    created () {
      this.loadOptions()
    },
    mounted () {
      this.$watch('searchOptions', this.searchFiles, {
        deep: true,
        immediate: true,
      })
    },
    methods: {
      editItem (item) {
        this.$router.push({
          name: 'post_edit',
          query: { edit: true, id: item.id },
        })
      },
      view (item) {
        this.activeItem = item
        this.dialog = true
      },
      deleteItem (item) {
        this.$http
          .delete(`posts/${item.id}`)
          .then(() => {
            this.items.splice(
              this.items.findIndex(({ id }) => id === item.id),
              1,
            )
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
      loadOptions () {
        this.$http.get('categories?with_children=1').then(({ data }) => {
          this.categories = []
          data.data.forEach(el => {
            const item = {
              id: el.id,
              label: el.name,
            }
            if (el.children && el.children.length) {
              item.children = el.children.map(el2 => ({
                id: el2.id,
                label: el2.name,
              }))
            }
            this.categories.push(item)
          })
        })
      },
      searchFiles () {
        this.loading = true
        this.$http
          .get('posts', {
            params: {
              category_id: this.searchOptions.category,
              mime_type: this.searchOptions.mime_type,
            },
          })
          .then(({ data }) => {
            this.items = []
            data.data.forEach(el => {
              if (el.attachments) {
                el.attachments.forEach(el2 => {
                  this.items.push({
                    id: el.id,
                    name: el.name,
                    file_id: el2.id,
                    file_name: el2.file_name,
                    excerpt: el.excerpt,
                    full_description: el.full_description,
                    mime_type: el2.mime_type,
                    url: el2.url,
                    date: el.created_at,
                  })
                })
              }
            })
            this.loading = false
          })
          .catch(error => {
            console.error(error)
            this.loading = false
          })
      },
    },
  }
</script>
<style lang="scss">
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
