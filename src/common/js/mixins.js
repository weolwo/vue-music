import {mapGetters} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  methods: {
    handlePlayList () {
      throw new Error('Coponent must implement handlePlayList method')
    }
  },
  watch: {
    playList (newPlayList) {
      this.handlePlayList(newPlayList)
    }
  }
}
