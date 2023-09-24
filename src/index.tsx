import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import "antd/dist/antd.css";
import './assets/styles/index.css';
import { ThemeProvider } from './theme';
import { GlobalProvider } from './utils/global';
import { getItem } from './utils/local'
import { getUserMenu } from './api/user';
import { Spin } from 'antd'

function init () {
  ReactDOM.render(
    <div style={{
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <Spin spinning />
      <div style={{ color: '#aaa', marginTop: 2 }}>加载中...</div>
    </div>,
    document.getElementById('root')
  )
}

init()

async function render () {
  const res = await import('./pages/App')
  const App = res.default
  ReactDOM.render(
    <HashRouter>
      <ThemeProvider >
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </ThemeProvider>
    </HashRouter>,
    document.getElementById('root')
  );
}

if (getItem('user-token')) {
  getUserMenu().then(res => {
    window.$flatMenus = getFlatMenus(res.data || [])
    window.$permissionMap = getPermissionMap(res.data || [])
    const menus = getMenus(res.data || [])
    pruneLeaf(menus)
    window.$menus = menus
    const path = window.location.href.split('/#')[1]
    const target = window.$flatMenus.find(item => item.url === path)
    if (!target) {
      const firstMenu = getFirstMenu(window.$menus)
      if (firstMenu) window.location.hash = `#${firstMenu.url}`
    }
    render()
  })
} else {
  window.$menus = []
  render()
}
function getFirstMenu (data) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.type === 1) return item
    if (item.children) {
      return getFirstMenu(item.children)
    }
  }
}
function getPermissionMap (data) {
  const result = {}
  data.forEach(item => {
    if (item.type === 2 && item.perms) result[item.perms] = item
  })
  return result
}
function getFlatMenus (data) {
  return data.filter(item => item.type === 1 && item.status === 1)
}
function pruneLeaf (data, cb) {
  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i]
    const children = item.children
    if (item.type === 0) {
      if (children && children.length > 0) {
        pruneLeaf(children, () => {
          data.splice(i, 1)
        })
      } else {
        data.splice(i, 1)
      }
    }
  }
  if (data.length === 0) cb && cb()
}
function getMenus (data) {
  let result = []
  let map = {}
  data.forEach(item => {
    map[item.menuId] = item
  })
  data.forEach(item => {
    if ((item.type === 0 || item.type === 1) && item.status === 1) {
      let parent = map[item.parentId]
      if (parent) {
        const children = parent.children || (parent.children = [])
        item.parentName = parent.name
        children.push(item)
      } else {
        if (item.parentId === 0) {
          result.push(item)
        }
      }
    }
  })
  result = handleSort(result)
  return result
}
function handleSort (data) {
  let result = []
  result = data.sort((a, b) => {
    if (a.children) a.children = handleSort(a.children)
    if (b.children) b.children = handleSort(b.children)
    return a.orderNum - b.orderNum
  })
  return result
}