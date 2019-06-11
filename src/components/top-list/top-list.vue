<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from '../music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from '../../api/rank'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'

  export default {
    name: 'top-list',
    data () {
      return {
        songs: []
      }
    },
    computed: {
      rank () {
        return this.topList
      },
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._getMusicList()
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push({
            path: '/rank'
          })
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this.normalData(res.songlist)
            console.log(this.songs)
          }
        })
      },
      normalData (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.data.songid && musicData.data.albumid) {
            ret.push(createSong(musicData.data))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
