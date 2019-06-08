<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '../music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'

  export default {
    name: 'disc',
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters(['disc'])
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) { //处理当在歌单详情页刷新时，没数据
          this.$router.push({
            path: '/recommend'
          })
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (ERR_OK === res.code) {
            this.songs = this.normalData(res.cdlist[0].songlist)
          }
        })
      },
      normalData (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList,
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
