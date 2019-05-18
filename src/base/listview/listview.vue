<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probe-type="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="(group,index) in data" class="list-group" ref="listGroup" >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectedItem(item)" v-for="(item,index) in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index"
            :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import {getData} from '../../common/js/dom'
  import Loading from '../../base/loading/loading'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18
  export default {
    name: 'listview',
    data () {
      return {
        scrollY: -1,
        diff: -1,
        currentIndex: 0,
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      },
    },
    created () {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectedItem(item){
        this.$emit('select',item)
      },
      onShortcutTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        let fristTouch = e.touches[0] // 表示当前位于 屏幕上的手指列表 取第一个
        this.touch.y1 = fristTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this.scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        let fristTouch = e.touches[0] // 表示当前位于 屏幕上的手指列表 取第一个
        this.touch.y2 = fristTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = delta + parseInt(this.touch.anchorIndex)
        this.scrollTo(anchorIndex)
      },
      // 获取到滚动的y坐标值
      scroll (pos) {
        this.scrollY = pos.y
      },
      _calculateHeight () {
        this.listheight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listheight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listheight.push(height)
        }
        console.log(this.listheight)
      },
      scrollTo (index) {
        if (!index && index !== 0) {
          return
        } else if (index < 0) {
          index = 0
        } else if (index > this.listheight.length - 1) {
          index = this.listheight.length - 2
        }
        this.scrollY = -this.listheight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        const listheight = this.listheight
        // 当滚到顶部时
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        //滚到中间
        for (let i = 0; i < listheight.length - 1; i++) {
          let height1 = listheight[i]
          let height2 = listheight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到最底部时
        this.currentIndex = listheight.length - 2
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-weight bold
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
