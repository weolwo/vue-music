export function addClass (el, className) {
  // 先判断该dom是否已经有该属性
  if (hasClass(el, className)) {
    return
  }
  // 添加属性
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')

}

export function hasClass (el, className) {
  // 使用正则表达式去判断
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
