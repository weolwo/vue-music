<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BSsroll from 'better-scroll'

  export default {
    name: 'scroll',
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initScroll()
      })
    },

    methods: {
      initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BSsroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        if (this.pullUp) {
          this.scroll.on('scrollEnd', () => { //监听滚动结束
            if (this.scroll.y <= (this.scroll.maxScrollX + 50)) {
              this.$emit('scrollToEnd') //只是派发出去一个事件
            }
          })
        }
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      // 滚动到指定的位置
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      // 滚动到指定的目标元素
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped>

</style>
