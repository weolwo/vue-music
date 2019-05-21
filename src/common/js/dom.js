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

export function getData (el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return `${vendor}${style.charAt(0).toUpperCase()}${style.substr(1)}`
}
