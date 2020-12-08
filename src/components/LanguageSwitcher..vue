<template>
  <div
    class="lang-switcher"
    @blur="open = false"
  >
    <div
      class="lang-switcher__selected"
      :class="{open: open}"
      @click="open = !open"
    >
      <img
        height="20"
        :src="images[currentLocale.short_code]"
        :alt="images[currentLocale.short_code]"
      >
      <span v-html="currentLocale.title" />
      <v-icon>{{ open ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </div>
    <div
      class="lang-switcher__items"
      :class="{'lang-switcher__closed': !open}"
    >
      <div
        v-for="option of availableLocales"
        :key="option.short_code"
        @click="currentLocale = option.short_code"
      >
        <img
          height="20"
          :src="images[option.short_code]"
          :alt="images[option.short_code]"
        >
        <span v-html="option.title" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import axios from 'axios'
  export default {
    name: 'LangSwitcher',
    data () {
      return {
        open: false,
        images: {
          uz:
            require('@/assets/lang/uzbekistan.png'),
          ru:
            require('@/assets/lang/russia.png'),
        },
      }
    },
    computed: {
      ...mapGetters({ availableLocales: 'locale/getLanguages' }),
      // ...mapActions('locale', ['fetchMessages']),
      currentLocale: {
        get () {
          if (this.availableLocales) {
            return this.availableLocales.find((item) => item.short_code === this.$i18n.locale)
          }
          return 'ru'
        },
        set (code) {
          this.$i18n.locale = code
          localStorage.setItem('locale', code)
          axios.defaults.headers.common['Accept-Language'] = code
          // this.fetchMessages()
          this.open = false
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
.lang-switcher {
  position: relative;
  text-align: left;
  outline: none;
  min-height: 42px;
  line-height: 40px;
  color: #4b4f63;

  &__selected {
    display: flex;
    padding-left: 8px;
    cursor: pointer;
    user-select: none;
    align-items: center;
  }

  &__selected.open {
    border-radius: 6px 6px 0px 0px;
  }
  &__closed {
    display: none;
  }
  img,
  span {
    display: inline-block;
    vertical-align: middle;
  }
  img {
    border: 1px solid #eaeaea;
    border-radius: 50%;
  }
  span {
    margin: 0 7px 0 10px;
    font-weight: 600;
    font-size: 14px;
  }
  &__items {
    border-radius: 10px;
    position: absolute;
    background-color: #ffffff;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 10px 0;
    min-width: 140px;

    div {
      padding: 0 8px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background: #eaeaea;
      }
    }
  }
}
</style>
