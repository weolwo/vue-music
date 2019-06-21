import state from './state'

export const singer = state => state.singer

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const currentIndex = state => state.currentIndex

export const mode = state => state.mode

export const playing = state => state.playing

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc

export const topList = state => state.topList

//搜索历史记录
export const searchHistory = state => state.searchHistory

//播放历史记录
export const playHistory = state => state.playHistory

//收藏列表
export const favoriteList = state => state.favoriteList
