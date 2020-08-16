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
          Файлы
        </div>
      </template>

      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto"
        hide-details
        label="Поиск"
        single-line
        style="max-width: 250px;"
      />

      <v-divider class="mt-3" />

      <v-data-table
        :headers="headers"
        :items="items"
        :search.sync="search"
        locale="ru"
        :loading="loading"
        loading-text="Загрузка..."
        :calculate-widths="true"
      >
        <template v-slot:item.actions="{ item }">
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
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
    <v-dialog
      v-model="dialog"
      :content-class="isDocumentType(activeItem.file_name) ? 'full-width' : 'auto-width'"
      :width="isDocumentType(activeItem.file_name) ? '100%' : 'auto'"
      :height="isDocumentType(activeItem.file_name) ? '100%' : '350px'"
      @click:outside="onModalClose()"
    >
      <div
        v-if="isVideoType(activeItem.file_name)"
      >
        <custom-video-player
          ref="player"
          :url="activeItem.url"
        />
      </div>
      <div
        v-else-if="isDocumentType(activeItem.file_name)"
      >
        <document-previewer
          :url="activeItem.url"
        />
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
  import moment from 'moment'
  import DocumentPreviewer from '@/components/DocumentPreviewer'
  import CustomVideoPlayer from '@/components/VideoPlayer'
  import FileMixin from '@/mixins/FileMixin'

  export default {
    name: 'Posts',
    components: {
      CustomVideoPlayer,
      DocumentPreviewer,
    },
    mixins: [FileMixin],
    data: () => ({
      headers: [
        { text: 'Наименование', value: 'name' },
        { sortable: false, text: 'Описание', value: 'description' },
        { text: 'Дата добавления', value: 'date', class: 'created_at' },
        { sortable: false, text: 'Действия', value: 'actions', class: 'actions' },
      ],
      items: [],
      activeItem: '',
      search: undefined,
      loading: false,
      dialog: false,
    }),
    created () {
      this.loading = true
      this.$http.get('post')
        .then(({ data }) => {
          data.data.forEach((el) => {
            el.attachments.forEach((el2) => {
              this.items.push({
                id: el.id,
                name: el.name,
                file_id: el2.id,
                file_name: el2.file_name,
                description: el.description,
                mime_type: el2.mime_type,
                url: el2.url,
                date: moment(el.created_at).format('YYYY-MM-DD HH:mm'),
              })
            })
          })
        })
        .catch(error => console.error(error))
      this.loading = false
    },
    methods: {
      editItem (item) {
      },
      view (item) {
        this.activeItem = item
        this.dialog = true
      },
      deleteItem (item) {
        this.$http.delete(`post/${item.id}`)
          .then(() => {
            this.items.splice(this.items.findIndex(({ id }) => id === item.id), 1)
          })
          .catch(error => {
            console.error(error)
          })
      },
      onModalClose () {
        if (!this.isVideoType(this.activeItem.source)) {
          return
        }
        this.$refs.player.pause()
      },
    },
  }
</script>
<style lang="scss">
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
</style>
