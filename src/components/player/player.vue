<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" ref="normalPlayer" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart="middleTouchStart"
             @touchmove="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="scrollList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text" ref="lyricLine" :class="{'current':currentLyricLine === index}"
                   v-for="(line,index) in currentLyric.lines">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="process-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="process-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changePlayMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="clsDisable">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="clsDisable">
              <i @click="togglePlaying" :class="playIcon"> </i>
            </div>
            <div class="icon i-right" :class="clsDisable">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" width="40" height="40" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <audio :src="currentSong.url" ref="audio" @playing="ready" @error="error" @ended="playEnded"
           @timeupdate="updateTime"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from '../../common/js/dom'
  import {playMode} from '../../common/js/config'
  import ProgressBar from '../../base/progress-bar/progress-bar'
  import ProgressCircle from '../../base/progress-circle/progress-circle'
  import Lyric from 'lyric-parser'
  import Scroll from '../../base/scroll/scroll'
  import PlayList from '../playlist/playlist'
  import {playerMixin} from '../../common/js/mixins'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    mixins: [playerMixin],
    name: 'player',
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    },
    data () {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLyricLine: 0,
        currentShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      ...mapGetters([
        'playList',
        'fullScreen',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'

      ]),
      playIcon () {
        return !this.playing ? 'icon-play' : 'icon-pause'
      },
      miniIcon () {
        return !this.playing ? 'icon-play-mini' : 'icon-pause-mini'
      },
      cdCls () {
        return this.playing ? 'play' : 'play pause'
      },
      //当网络不好或者其他情况导致歌曲不能立即加载时，添加一个灰色样式
      clsDisable () {
        return this.songReady ? '' : 'disable'
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      //歌词页面切换
      middleTouchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      //控制点击mini播放器歌单按钮
      showPlayList () {
        this.$refs.playlist.show()
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        let deltaX = e.touches[0].pageX - this.touch.startX
        let deltaY = e.touches[0].pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX) && this.touch.left === -window.innerWidth) {
          return
        }
        let left = this.currentShow === 'cd' ? 0 : window.innerWidth
        let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.scrollList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.scrollList.$el.style[transitionDuration] = `0`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.scrollList.$el.style[transitionDuration] = `0`
      },
      middleTouchEnd (e) {
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        let time = 600
        this.$refs.scrollList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.scrollList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.scrollList.$el.style[transitionDuration] = `${time}ms`
      },
      getLyric () {
        this.currentSong._getLyric().then((lyric) => {
          //避免歌词new两次,出现歌词乱掉的情况
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handlerLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.currentLyricLine = 0
          this.playingLyric = ''
        })
      },
      handlerLyric ({lineNum, txt}) { // es6的语法，对象的结构赋值
        this.currentLyricLine = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.scrollList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.scrollList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },

      //计算拖动进度条时的时间
      percentChange (percent) {
        let currentTime = this.currentSong.duration * percent
        const audio = this.$refs.audio
        audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        //解决当点击播放进度的时候，歌词出现缭乱
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      //获取音频当前播放的时间
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      // 格式化播放时间
      formatTime (val) {
        //console.log(val, 'val')
        let minute = (val / 60) | 0
        let second = this._pad((val % 60) | 0)
        return `${minute}:${second}`
      },
      // 格式化秒为两位数
      _pad (num, len = 2) {
        let length = num.toString().length
        while (length < len) {
          num = `0${num}`
          length++
        }
        return num
      },
      ready () {
        this.songReady = true
        this.setPlayHistory(this.currentSong)
      },
      error () {
        clearTimeout(this.timer)
        this.songReady = true
      },
      prev () {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      //当音乐播放结束后自动播放下一首或者重新播放
      playEnded () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.currentTime = 0
        this.$refs.audio.play()
        this.setPlaying(true)
        //解决循环播放的时候，歌曲播放完了，歌词没有跳转到顶部
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      next () {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        //解决当歌曲播放暂停时，歌词不暂停
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
        this.setPlaying(!this.playing)
      },
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      enter (el, done) {
        const {x, y, scale} = this.getTranPosAndScale()
        // console.log(x, y, scale)
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0 scale(1)`
          },
          100: {
            transform: `translate3d(0,0 scale(1.1)`
          }
        }
        // this creates the animation above
        animations.registerAnimation({
          name: 'move',
          // the actual array of animation changes
          animation,
          // optional presets for when actually running the animation
          presets: {
            duration: 400,
            easing: 'linear',
          }
        })
        // then run it
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)

      },
      afterEnter (el) {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this.getTranPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        console.log(x, y, scale)
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave (el) {
        this.$refs.cdWrapper.style[transform] = ''
        this.$refs.cdWrapper.style.transition = ''
      },
      //获取动画坐标
      getTranPosAndScale () {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - width / 2 - paddingTop - paddingBottom

        return {
          scale,
          x,
          y
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULLSCREEN',
      }),
      ...mapActions([
        'setPlayHistory'
      ])
    },
    watch: {
      currentSong (newVal, oldVal) {
        if (!newVal.id || !newVal.url) { // 当删除播放列表中所有的歌曲时执行
          return
        }
        if (newVal.id === oldVal.id) {
          return
        }
        // 解决切换歌曲的时候，歌词跳动问题
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        //解决微信后台切换到前台时，歌曲有重新在播放
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing (newPlaying) {
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      }

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .process-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .process-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
