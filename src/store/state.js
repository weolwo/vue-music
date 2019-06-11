import {playMode} from '../common/js/config'

const state = {
  singer: {},
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  playing: false,
  disc:{},
  topList:{}
}
export default state
