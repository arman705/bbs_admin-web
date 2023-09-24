const localStorage = window.localStorage

/**
 * localStorage 设置
 * @param {String} key 键
 * @param {String} val 值
 */
export function setItem(key: string, val: any ) {
  try {
    if (!key) return
    return localStorage.setItem(key, val)
  } catch (err) {}
}

/**
 * localStorage 获取
 * @param {String} key 键
 * @return {Boolean} key 对应 localStorage 的值
 */
export function getItem(key: string ) {
  try {
    if (!key) return ''
    return localStorage.getItem(key)
  } catch (err) {
    return ''
  }
}

/**
 * 清除 localStorage，若不填参数 key ，则清除所有 localStorage
 * @param {String} key 键
 * @return {Boolean} 是否清除成功
 */
export function remove(key: string): false | void {
  try {
    if (typeof key === 'undefined') return localStorage.clear()
    return localStorage.removeItem(key)
  } catch (err) {
    return false
  }
}



// 默认导出全量方法
export default {
  getItem,
  setItem,
  remove
}