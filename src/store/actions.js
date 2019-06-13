import * as types from './mutation-types'
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/util'

//找到当前播放的歌曲在列表中的索引
function findIndex (list, currentSong) {
  return list.findIndex((item) => {
    return item.id === currentSong.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_FULLSCREEN, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCELIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENTINDEX, 0)
  commit(types.SET_FULLSCREEN, true)
}
//插入歌曲
export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice() //由于action中不允许直接修改，所以我们创建了副本
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //保存当前的歌曲
  let currentSong = playList[currentIndex]
  currentIndex++
  playList.splice(currentIndex, 0, song) //添加一首歌曲
  //查找当前歌曲在列表中是否存在
  let fIndex = findIndex(playList, song)
  if (fIndex > -1) {
    if (fIndex < currentIndex) { //插入的歌曲在原有歌曲的后面
      playList.splice(fIndex, 1) //删除该索引位置的歌曲
      // 这样我们需要把索引回退1个
      currentIndex--
    } else {//插入的歌曲在原有歌曲的前面
      playList.splice(fIndex + 1, 1)//由于在被删除歌曲前面插入，所以要被删除的歌曲的所以会变大
    }
  }
  //修改sequenceList
  //找到当前歌曲在列表中的索引
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let sIndex = findIndex(sequenceList, song)
  if (sIndex > -1) {
    if (currentSIndex > sIndex) {
      sequenceList.splice(sIndex, 1)
    } else {
      sequenceList.splice(sIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCELIST, sequenceList)
  commit(types.SET_PLAYING, true)
  commit(types.SET_CURRENTINDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
}
