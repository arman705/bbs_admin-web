import React, { useState, useEffect, useMemo } from 'react'
import { Button, Modal, Tree, Input, message, Spin } from 'antd'
import { getTreeMenus } from '../../../api/backstage'

let dataList = []

function generateList (data) {
  const res = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const { id, text } = node
    res.push({
      id,
      text: text
    })
    if (node.children) {
      res.push(...generateList(node.children))
    }
  }
  return res
}

export default function MenuModal ({ visible, addVisible, onCancel, onSelect }) {
  const [expandedKeys, setExpandedKeys] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [defaultData, setDefaultData] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
 
  useEffect(() => {
    if (addVisible) fetchTreeMenus()
  }, [addVisible])
  const treeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const text = item.text
        const index = text.indexOf(searchValue)
        const beforeStr = text.substring(0, index)
        const afterStr = text.slice(index + searchValue.length)
        const title = index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{text}</span>
        )
        if (item.children) {
          return {
            text: title,
            id: item.id,
            children: loop(item.children)
          }
        }
        return {
          text: title,
          id: item.id
        }
      })
    return loop(defaultData)
  }, [searchValue, defaultData])
  async function fetchTreeMenus () {
    try {
      setLoading(true)
      const res = await getTreeMenus()
      if (res.code == 200) {
        const data = [{
          text: '主目录',
          id: '0',
          children: res.data.children
        }]
        setExpandedKeys(getExpandedKeys(data))
        setDefaultData(data)
        dataList = generateList(data)
      }
    } finally {
      setLoading(false)
    }
  }
  function getExpandedKeys (data) {
    const res = ['0']
    data[0].children.forEach(item => {
      res.push(item.id)
    })
    return res
  }
  function onSelect_ (val, { selectedNodes }) {
    setSelectedNode(selectedNodes[0])
  }
  function getNodeText (id) {
    return dataList.find(item => item.id === id).text
  }
  function submit () {
    if (selectedNode === null) {
      message.warning('请选择上级菜单')
      return
    }
    
    onSelect({ text: getNodeText(selectedNode.id), id: selectedNode.id })
    onCancel()
  }
  function onExpand (newExpandedKeys) {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }
  function onChange (e) {
    const value = e.target.value
    let newExpandedKeys
    if (value) {
      newExpandedKeys = dataList
        .filter(item => item.text.includes(value))
        .map(item => item.id)
    } else {
      newExpandedKeys = getExpandedKeys(defaultData)
    }
    setExpandedKeys(newExpandedKeys)
    setSearchValue(value)
    setAutoExpandParent(true)
  }
  return <Modal
    width="400px"
    title="菜单选择"
    visible={ visible }
    onCancel={ onCancel }
    footer={
      <>
        <Button onClick={ onCancel }>取消</Button>
        <Button type="primary" onClick={submit}>确定</Button>
      </>
    }>
    <Spin spinning={loading}>
      <div style={{ height: 300, overflowY: 'auto' }}>
        <Input.Search
          style={{ marginBottom: 8 }}
          placeholder="搜索关键字"
          onChange={onChange}
        />
        <Tree
          showLine
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={onExpand}
          onSelect={onSelect_}
          fieldNames={{
            title: 'text',
            key: 'id',
            children: 'children'
          }}
          treeData={treeData}
        />
      </div>
    </Spin>
  </Modal>
}