<template>
  <div>
    <v-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      :loading-text="$t('admin_panel.loading')"
      :calculate-widths="true"
      :server-items-length="total"
      @update:options="setOptions"
    >
      <template
        v-slot:body="data"
      >
        <tbody>
          <template
            v-for="(item, index) in items"
          >
            <tr :key="`values-${index}`">
              <td
                v-for="(header,index2) in data.headers"
                :key="`${header.value}-${index2}`"
                :class="header.value === 'data-table-expand' ? 'text-right' : 'text-start'"
              >
                <slot
                  v-if="header.value !== 'data-table-expand'"
                  :name="`item.${header.value}`"
                  :item="item"
                >
                  {{ item[header.value] }}
                </slot>
                <button
                  v-if="header.value === 'data-table-expand'"
                  type="button"
                  :class="rowExpandedClass(item)"
                  class="v-icon notranslate v-icon--link mdi mdi-chevron-down theme--light"
                  @click="expandRow(item)"
                />
              </td>
            </tr>
            <tr
              v-if="item.expanded"
              :key="`expanded-${index}`"
            >
              <slot
                name="opened-item"
                :item="item"
                :headers="data.headers"
              />
            </tr>
          </template>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>
<script>
  export default {
    name: 'DataTable',
    props: {
      fetchUrl: {
        type: String,
        required: true,
      },
      shouldUpdate: {
        type: Boolean,
        default: false,
      },
      headers: {
        type: Array,
        default: () => ([]),
      },
      searchOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    data: () => ({
      items: [],
      loading: true,
      meta: [],
      options: [],
    }),
    computed: {
      total () {
        if (!this.meta) {
          return 0
        }
        return this.meta.total ? this.meta.total : 0
      },
    },
    watch: {
      shouldUpdate () {
        this.fetchPosts()
      },
    },
    mounted () {
      this.$watch('searchOptions', this.fetchPosts, {
        deep: true,
        immediate: true,
      })
      this.$watch('options', this.fetchPosts, {
        deep: true,
        immediate: false,
      })
    },
    methods: {
      fetchPosts () {
        this.loading = true
        const { page = 1, itemsPerPage = 10, sortBy = null } = this.options
        this.$http.get(this.fetchUrl, {
          params: {
            ...this.searchOptions,
            per_page: itemsPerPage || 10,
            page: page,
            orderBy: sortBy ? sortBy[0] : null,
          },
        })
          .then(({ data }) => {
            this.items = []
            data.data.forEach(el => {
              el.expanded = false
              this.items.push(el)
            })
            this.meta = data.meta
            this.loading = false
          })
          .catch((response) => {
            this.loading = false
            console.error(response)
          })
      },
      setOptions (options) {
        options.itemsPerPage = options.itemsPerPage === -1 ? 1000000000 : options.itemsPerPage
        this.options = options
      },
      rowExpandedClass (item) {
        return item.expanded ? 'v-data-table__expand-icon--active' : 'v-data-table__expand-icon'
      },
      expandRow (item) {
        this.items.forEach(el => {
          el.expanded = false
        })
        item.expanded = !item.expanded
      },
    },
  }
</script>

<style scoped>

</style>
