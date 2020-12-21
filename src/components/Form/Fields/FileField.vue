<template>
  <div>
    <ul class="files">
      <li
        v-for="(item, key) in files"
        :key="item.id"
        class="mb-3 files__single"
        :style="{background: getIcon(key).color}"
      >
        {{ item.name ? item.name : item.file_name }}

        <v-icon
          small
          class="close"
          color="white"
          @click="deleteFile(key)"
        >
          mdi-close
        </v-icon>
        <v-icon
          dark
        >
          {{ getIcon(key).icon }}
        </v-icon>
        {{ sizeFormatter(item.size) }}
      </li>
    </ul>
    <validation-provider
      v-slot="{ errors }"
      tag="div"
      :rules="validationRule"
      :name="label"
    >
      <div
        class="file-input"
        @click="onChange"
      >
        <v-file-input
          ref="file1"
          v-model="innerValue"
          multiple
          hide-input
        />
        Выберите файлы
      </div>
    </validation-provider>
  </div>
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
        console.log(newVal)
        this.files = newVal
        this.$emit('input', {
          name: this.name,
          value: newVal,
        })
      },
    },
    methods: {
      onChange () {
        this.$refs.file1.$refs.input.click()
      },
      sizeFormatter (num) {
        // jacked from: https://github.com/sindresorhus/pretty-bytes
        if (typeof num !== 'number' || isNaN(num)) {
          throw new TypeError('Expected a number')
        }

        var exponent
        var unit
        var neg = num < 0
        var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        if (neg) {
          num = -num
        }

        if (num < 1) {
          return (neg ? '-' : '') + num + ' B'
        }

        exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
        num = (num / Math.pow(1000, exponent)).toFixed(2) * 1
        unit = units[exponent]

        return (neg ? '-' : '') + num + ' ' + unit
      },
      getIcon (key) {
        const type = this.files[key].type ? this.files[key].type : this.files[key].mime_type
        if (type) {
          if (type.includes('video')) {
            return { icon: 'mdi-play-circle-outline', color: 'black' }
          }
          if (type.includes('pdf')) {
            return { icon: 'mdi-file-pdf-box', color: '#c11e07' }
          }
          if (type.includes('presentation')) {
            return { icon: 'mdi-presentation', color: '#c24f32' }
          }
          if (type.includes('.document') || type.includes('msword')) {
            return { icon: 'mdi-file-word-box', color: '#2372ba' }
          }
          if (type.includes('spreadsheetml')) {
            return { icon: 'mdi-file-excel-box', color: '#30723f' }
          }
        } else {
          return { icon: '', color: 'white' }
        }
      },
      deleteFile (key) {
        this.files.splice(key, 1)
      },
    },
  }
</script>
<style scoped>
.file-input>>>.v-input__prepend-outer{
  margin: auto;
  margin-bottom: 10px;
}
</style>
<style lang="scss" scoped>
.file-input{
  background: #e2e2e205;
  text-align: center;
  width: 310px;
  height: 100px;
  border: 2px dashed #bbbbbb;
  border-radius: 5px;
  cursor: pointer;
}
.files{
  display: flex;
  grid-auto-flow: column;
  grid-gap: 10px;
  list-style: none;
  padding: 0;
  margin-bottom: 10px;
  flex-wrap: wrap;
  &__single {
    width: 150px;
    min-height: 150px;
    position: relative;
    padding: 20px 10px 10px;
    text-align: center;
    color: white;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .close {
      position: absolute;
      right: 0;
      top: 0;
    }

    i {
      font-size: 50px;
      display: block;
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
