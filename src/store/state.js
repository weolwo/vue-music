import {playMode} from '../common/js/config'
import {loadSearch} from '../common/js/cache'

const state = {
  singer: {},
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  playing: false,
  disc:{},
  topList:{},
  searchHistory:loadSearch()
}
export default state
