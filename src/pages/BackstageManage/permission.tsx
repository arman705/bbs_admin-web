import React, { useEffect, useState } from 'react';
import { sysMenuUpdateUser, sysMenuTree } from '../../api/backstage';
import { Typography, Collapse, Checkbox, Row, Col, Button, message, Space, Spin } from 'antd';
import Thumbnail from "../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { useHistory, useParams } from 'react-router-dom';
import TreeNodeList, { Node } from './components/TreeNodeList'

const Report: React.FC = () => {
  const [treeData, setTreeData] = useState([])
  const [activeKey, setActiveKey] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const params = useParams<any>()
  const history = useHistory()

  useEffect(() => {
    fetchTreeData()
  }, [])
  
  useEffect(() => {
    setActiveKey(treeData.map((item: any) => item.id))
  }, [treeData])
  
  function fetchTreeData () {
    setLoading(true)
    sysMenuTree({userId: params.userId}).then((res: any) => {
      if (res.code === 200 && res.data) {
        setTreeData(res.data.children)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function getTreeView (data: Node[], onChange: () => void) {
    if (Array.isArray(data)) {
      return data.map(item => {
        return (
          <Col key={item.id}>
            <TreeNodeList data={[item] || []} onChange={onChange} />
          </Col>
        )
      })
    } else {
      return null
    }
  }
  function getPannelView () {
    return treeData.map((item: Node) => {
      function onChange () {
        if (item.children) item.state.selected = item.children.every(item => item.state.selected)
        setTreeData([...treeData])
      }
      const header = (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={item.state.selected}
            onChange={(e) => onPanelCheckedChange(e, item)}>
            {item.text}
          </Checkbox>
        </div>
      )
      return (
        <Collapse.Panel header={header} key={item.id}>
          <Row wrap={true} gutter={ [21, 21] }>
            { getTreeView(item.children!, onChange) }
          </Row>
        </Collapse.Panel>
      )
    })
  }
  function onPanelCheckedChange (e: any, item: Node) {
    const checked = e.target.checked
    item.state.selected = checked
    checkChildren(item.children!, checked)
    setTreeData([...treeData])
  }
  function checkChildren (data: Node[], checked: boolean) {
    if (Array.isArray(data)) {
      data.forEach(item => {
        item.state.selected = checked
        checkChildren(item.children!, checked)
      })
    }
  }
  function getItemCheckedKeys (val: any) {
    if (!Array.isArray(val)) return []
    let data: any[] = []
    val.forEach((item: any) => {
      if (item.state.selected) {
        data.push(item.id)
      }
      data = [...data, ...getItemCheckedKeys(item.children)]
    });
    return data
  }
  function onSave () {
    const checkedIds = getItemCheckedKeys(treeData)
    setLoading(true)
    sysMenuUpdateUser({ userId: params.userId, menuIds: checkedIds }).then((res: any) => {
      if (res.code === 200) {
        message.success('更新成功')
        fetchTreeData()
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel () {
    history.go(-1)
  }
  return (
    <ContentWrapper>
      <Thumbnail />
      <ContentInner>
        <Typography.Title level={5}>成员管理-权限设置</Typography.Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Button onClick={onSave} type="primary" disabled={loading}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
          <Spin spinning={loading}>
            <Collapse style={{ minHeight: '200px' }} expandIconPosition="right" activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
              {getPannelView()}
            </Collapse>
          </Spin>
        </Space>
      </ContentInner>
    </ContentWrapper>
  )
};

export default Report;