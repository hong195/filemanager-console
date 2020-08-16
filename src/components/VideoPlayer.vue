<template>
  <video-player
    ref="videoPlayer"
    class="video-player-box"
    :options="options"
    :playsinline="true"
  />
</template>

<script>
  export default {
    name: 'CustomVideoPlayer',
    props: {
      url: {
        type: String,
        required: true,
      },
    },
    computed: {
      player () {
        return this.$refs.videoPlayer.player
      },
      options () {
        return {
          muted: false,
          language: 'ru',
          height: 450,
          playbackRates: [],
          sources: [{
            type: 'video/mp4',
            src: this.url,
          }],
          poster: '',
        }
      },
    },
    methods: {
      pause () {
        this.player.pause()
      },
    },
  }
</script>

<style lang="scss">
.vjs-big-play-button {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}
</style>
