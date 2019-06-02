<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="touchStart"
           @touchmove.prevent="touchMove"
           @touchend="touchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from '../../common/js/dom'

  const PROGRESSBTN_WIDTH = 10
  const transform = prefixStyle('transform')
  export default {
    name: 'progress-bar',
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      //实现拖动进度条播放功能
      touchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      touchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const deffx = e.touches[0].pageX - this.touch.startX
        const width = Math.min(this.$refs.progressBar.clientWidth - PROGRESSBTN_WIDTH, Math.max(0, this.touch.left + deffx))
        this._offset(width)
      },
      touchEnd () {
        this.touch.initiated = false
        //派发一个事件出去告诉播放器应该播放的进度
        this.togglePercent()
      },
      togglePercent () {
        let barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN_WIDTH
        let progressWidth = this.$refs.progress.clientWidth
        let percent = progressWidth / barWidth
        this.$emit('percentChange', percent)
      },
      _offset (width) {
        this.$refs.progressBtn.style[transform] = `translate3d(${width}px,0,0)`
        this.$refs.progress.style.width = `${width}px`
      },
      //点击进度条改变播放时间功能
      progressClick (e) {
        this._offset(e.offsetX)
        this.togglePercent()
      }
    },
    watch: {
      // 进度条效果实现
      percent (newPercent) {
        if (newPercent > 0 && !this.touch.initiated) {
          let barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN_WIDTH
          let width = this.percent * barWidth
          this._offset(width)
        }
      }
    }
  }
</script>

+
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
