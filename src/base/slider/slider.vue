<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex===index}"></span>
    </div>
  </div>
</template>

<script>
  import BScorll from 'better-scroll'
  import {addClass} from '../../common/js/dom'

  export default {
    name: 'slider',

    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }

    },
    mounted () {
      this.$nextTick(() => {
        this.initSlider()
        this.initDots()
        this.initScroll()
        if (this.autoPlay){
          this.play()
        }
      })
      window.addEventListener('resize',()=>{ // 监听窗口改变，然后重新计算宽度
        if (!this.slide){
          return
        }
        this.initSlider(true)
        this.slide.refresh()
      })
    },
    methods: {
      initSlider (isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      initDots () {
        this.dots = new Array(this.children.length)
      },
      initScroll () {
        this.slide = new BScorll('.slider', {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        })
        this.slide.on('scrollEnd', () => {
          let currentIndex = this.slide.getCurrentPage().pageX
          if (this.loop) {
            currentIndex -= 1
          }
          this.currentPageIndex = currentIndex
          if (this.autoPlay){
            clearTimeout(this.timer)
            this.play()
          }
        })
      },
      // 自动播放
      play(){
        let pageIndex=this.currentPageIndex+1
        if (this.loop) {
          pageIndex += 1
        }
        setTimeout(()=>{
          this.slide.goToPage(pageIndex,0,400)
        },this.interval)
      }
    },

    destroyed(){
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
