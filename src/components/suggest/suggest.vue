<template>
  <scroll ref="suggest" class="suggest" :data="result" :pull-up="pullUp" @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <div v-show="hasMore">
        <Loading></Loading>
      </div>
    </ul>
  </scroll>
</template>

<script>
  import {search} from '../../api/search'
  import {createSong} from '../../common/js/song'
  import Singer from '../../common/js/singer'
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import {mapMutations,mapActions} from 'vuex'

  const SINGER_TYPE = 'singer'
  export default {
    name: 'suggest',
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        result: [],
        page: 1,
        prepage: 20,
        pullUp: true,
        hasMore: true //标志是否还能继续上拉请求数据
      }
    },
    methods: {
      getDisplayName (item) {
        if (item.type === SINGER_TYPE) {
          return item.singername
        } else {
          return `${item.name}-${(item.singer)}`
        }
      },
      getIconCls (item) {
        if (item.type === SINGER_TYPE) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      _search () {
        this.hasMore = true
        this.page = 1 //重置当前页
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, this.prepage).then((res) => {
          this.result = this.genResult(res.data)
          this._checkMore(res.data)
        })
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (this.page * this.prepage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      normalData (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      //处理搜索结果数据
      genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: SINGER_TYPE}})
        }
        if (data.song) {
          ret = ret.concat(this.normalData(data.song.list))
        }
        return ret
      },
      //上拉刷新
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, this.prepage).then((res) => {
          this.result = this.result.concat(this.normalData(this.genResult(res.data)))
        })
      },
      //点击搜索结果根据分类跳转
      selectItem (item) {
        if (item.type === SINGER_TYPE) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: '/search/' + singer.id
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
        ...mapActions(['insertSong'])
    },
    watch: {
      query () {
        this._search()
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
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
