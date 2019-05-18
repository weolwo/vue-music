<template>
  <transition name="fade">
    <div class="singer-detail"></div>
  </transition>

</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'singer-detail',
    computed:{
      ...mapGetters(['singer'])
    },
    created(){
      console.log(this.singer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    top: 0
    bottom: 0
    left: 0
    z-index: 1000
    width: 100%
    background: $color-background
  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translate3d(100%,0,0)
    opacity: 0;
  }
</style>
