<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="recommend-content">
          <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
            <slider>
              <div v-for="item in recommends">
                <!--此处会有一个问题：就是如果推荐下的轮播图如果在下单后面渲染的话，会导致不能滑动到底部-->
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" class="needsclick">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="(item,index) in discList" class="item">
                <div class="icon">
                  <img style="width: 60px;height: 60px" v-lazy="item.imgurl"/>
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import Slider from '../../base/slider/slider'
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'

  export default {
    data () {
      return {
        recommends: [],
        discList:[]
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      loadImage(){
        if (!this.checked){
          this.refresh()
          this.checked=true
        }
      },
      refresh(){
        this.$refs.scroll.refresh()
      },
      // 获取推荐
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      // 获取歌单列表
      _getDiscList () {
        getDiscList().then((res)=>{
          if (res.code === ERR_OK) {
            this.discList=res.data.list
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolut
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
