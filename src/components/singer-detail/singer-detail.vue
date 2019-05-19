<template>
  <transition name="fade">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import { createSong, isValidMusic, processSongsUrl } from '../../common/js/song'
  import MusicList from '../music-list/music-list'
  export default {
    name: 'singer-detail',
    components:{
      MusicList
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer']),

      title(){
        return this.singer.name
      },

      bgImage(){
        return this.singer.avatar
      }
    },
    created () {
      this._getSingerDetail(this.singer.id)
    },
    methods: {
      _getSingerDetail (singerId) {
        if (!singerId) { // 因为在详情页下刷新是不会发起请求的，所以让用户先回到歌手页面
          this.$router.push({
            path: '/singer'
          })
          return
        }
        getSingerDetail(singerId).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this.formatSongs(res.data.list)).then((songs) => {
              this.songs = songs
              console.log(this.songs,'song')
            })
          }
        })
      },
      // 构建歌手详情页数据
      formatSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret;
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translate3d(100%, 0, 0)
    opacity: 0;
  }
</style>
