<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switchers @selectItem="switchItem" :switchers="switches" :currentIndex="currentIndex"></switchers>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll v-if="currentIndex===0" class="list-scroll" :data="favoriteList" ref="favoriteScroll">
          <div class="list-inner">
            <song-list :songs="favoriteList" @selectItem="selectSong">
            </song-list>
          </div>
        </scroll>
        <scroll v-if="currentIndex===1" class="list-scroll" :data="playHistory" ref="playScroll">
          <div class="list-inner">
            <song-list :songs="playHistory" @selectItem="selectSong">
            </song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from '../../base/scroll/scroll'
  import Switchers from '../switchers/switchers'
  import SongList from '../../base/song-list/song-list'
  import NoResult from '../../base/no-result/no-result'
  import {mapGetters, mapActions} from 'vuex'
  import {playListMixin} from '../../common/js/mixins'
  import Song from '../../common/js/song'
  import {playHistory} from '../../store/getters'

  export default {
    name: 'user-home',
    mixins: [playListMixin],
    data () {
      return {
        currentIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近在听'}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'favoriteList'
      ]),
      noResultDesc () {
        if (this.currentIndex === 0) {
          return '暂时还没有收藏哦'
        } else {
          return '没有最近听过的歌曲呢,赶紧去听歌吧'
        }
      },
      noResult () {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      }
    },
    methods: {
      handlePlayList () {
        let bottom = this.playList.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        //因为上面用了v-if,所以用之前先做判断
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playScroll && this.$refs.playScroll.refresh()
      },
      back () {
        this.$router.back()
      },
      random () {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (!list.length) { //当没有歌曲列表时,直接返回
          return
        }
        list = list.map((song) => {
          return new Song(song)
        })
        this.randomPlay({list})
      },
      selectSong (item, index) {
        this.insertSong(new Song(item))
      },
      switchItem (index) {
        this.currentIndex = index
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Scroll,
      Switchers,
      SongList,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
