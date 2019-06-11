function getRandomIndex (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//打乱数组的顺序
export function shuffle (arr) {
  if (arr === null || arr.length === 0) {
    return
  }
  //不打破原数组
  const _arr = arr
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomIndex(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}
export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
