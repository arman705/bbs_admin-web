// 解析图片 url 获取图片的名称
export function parseFileName (val) {
  if (val) {
    const url = val.split('?')[0]
    const match = url.match(/\/\d{4}-\d{2}-\d{2}\/.+/)
    if (match) {
      return match[0]
    } else {
      return url.substr(url.lastIndexOf('/') + 1)
    }
  }
}