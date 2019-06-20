import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 100

function insertArray (arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  //如果该记录在最前面就不用做任何操作
  if (index === 0) {
    return
  }
  //保证最新添加的显示在最前面
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  //如果有存储的长度限制,把最后面的删掉
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, val, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (words) {
  let searchs = storage.get(SEARCH_KEY, [])
  insertArray(searchs, words, (item) => {
    return words === item
  }, SEARCH_MAX_LEN)
  //把最新的数据存入本地缓存
  storage.set(SEARCH_KEY, searchs)
  return searchs
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch (words) {
  let searchs = storage.get(SEARCH_KEY, [])
  deleteFromArray(searchs, words, (item) => {
    return words === item
  })
  //把最新的数据存入本地缓存
  storage.set(SEARCH_KEY, searchs)
  return searchs
}

export function deleteAllSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlayHistory (song) {
  let playHistory = storage.get(PLAY_KEY, [])
  insertArray(playHistory, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  //把最新的数据存入本地缓存
  storage.set(PLAY_KEY, playHistory)
  return playHistory
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}
