import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Checkbox, Spin, Tree } from 'antd';
import { getTreeMenus } from '../../../api/backstage'

function MenuItem ({ value, onChange }, ref) {
  const treeRef = useRef(null)
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandChecked, setExpandChecked] = useState(false)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    setCheckedKeys(value)
  }, [value])
  useEffect(() => {
    fetchTreeMenus()
  }, [])
  useImperativeHandle(ref, () => ({
    reset: () => {
      setExpandChecked(false)
      setSelected(false)
      // setCheckStrictly(true)
      setCheckedKeys([])
      setExpandedKeys([])
    }
  }))
  useEffect(() => {
    let keys = []
    if (expandChecked) {
      keys = getAllKeys(treeData)
    }
    setExpandedKeys(keys)
  }, [expandChecked])
  useEffect(() => {
    let keys = []
    if (selected) {
      keys = getAllKeys(treeData)
    }
    setCheckedKeys(keys)
    onChange(keys)
  }, [selected])

  async function fetchTreeMenus () {
    try {
      setLoading(true)
      const res = await getTreeMenus()
      if (res.code == 200) {
        const data = res.data.children
        handleMenuData(data)
        setTreeData(data)
      }
    } finally {
      setLoading(false)
    }
  }
  function handleMenuData (data, parent = null) {
    data.forEach(item => {
      item.parent = parent
      if (item.children) {
        handleMenuData(item.children, item)
      }
    })
  }
  function getAllKeys (data) {
    const res = []
    data.forEach(item => {
      const id = item.id
      const children = item.children
      res.push(id)
      if (children && children.length > 0) {
        res.push(...getAllKeys(children))
      }
    })
    return res
  }
  function onCheck (checkedKeys, { checked, node }) {
    const childrenIds = getChildrenIds(node)
    const parentIds = getParentIds(node)
    if (checked) {
      checkedKeys.checked.push(...childrenIds)
      checkedKeys.checked.push(...parentIds)
    } else {
      childrenIds.forEach(id => {
        const index = checkedKeys.checked.indexOf(id)
        index !== -1 && checkedKeys.checked.splice(index, 1)
      })
    }
    onChange(Array.from(new Set(checkedKeys.checked)))
  }
  function getParentIds (node) {
    const result = []
    if (node.parent) {
      result.push(node.parent.id)
      result.push(...getParentIds(node.parent))
    }
    return result
  }
  function getChildrenIds (node) {
    const result = []
    const children = node.children
    if (children) {
      children.forEach(item => {
        result.push(item.id)
        result.push(...getChildrenIds(item))
      })
    }
    return result
  }
  function onExpand (expandedKeys) {
    setExpandedKeys(expandedKeys)
  }
  return (
    <Spin spinning={loading}>
      <div style={{ border: '1px solid #eee', minHeight: 150 }}>
        <div style={{ padding: 10, borderBottom: '1px solid #eee' }}>
          <Checkbox
            disabled={treeData.length === 0}
            checked={expandChecked}
            onChange={e => setExpandChecked(e.target.checked)}>
            展开/折叠
          </Checkbox>
          <Checkbox
            disabled={treeData.length === 0}
            checked={selected}
            onChange={e => setSelected(e.target.checked)}>
            全选/全不选
          </Checkbox>
          {/* <Checkbox
            disabled={treeData.length === 0}
            checked={checkStrictly}
            onChange={e => setCheckStrictly(e.target.checked)}>
            父子联动
          </Checkbox> */}
        </div>
        <div style={{ padding: 10 }}>
          <Tree
            ref={treeRef}
            showLine
            checkable
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            onExpand={onExpand}
            checkStrictly={true}
            onCheck={onCheck}
            fieldNames={{
              title: 'text',
              key: 'id',
              children: 'children'
            }}
            treeData={treeData}
          />
        </div>
      </div>
    </Spin>
  )
}

export default forwardRef(MenuItem)