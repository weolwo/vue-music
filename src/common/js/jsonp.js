import OriginJsonp from 'jsonp'

export default function jsonp (url, data, option) {
  return new Promise((resolve, reject) => {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
    OriginJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // url += '&' + k + '=' + encodeURIComponent(value)
    // 使用es6语法
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
