import React, { useEffect, useState } from 'react'
import Styled from 'styled-components'
import { Row, Col, Spin } from 'antd'
import { scoreRecordStatisticsByType } from '../../../../api/rankmedal'

const Container = Styled.div`
  display: flex;
  border: 1px solid rgba(193, 197, 238, 1);
  border-radius: 4px;

  .tags {
    flex-shrink: 0;

    .tag {
      width: 24px;
      font-size: 14px;
      text-align: center;
      padding: 4px 0;
      border-right: 1px solid rgba(193, 197, 238, 1);
      cursor: pointer;
      &:not(:first-child) {
        border-top: 1px solid rgba(193, 197, 238, 1);
      }
      &.selected {
        color: #fff;
        background: rgba(193, 197, 238, 1);
        transition: all 0.2s;
      }
    }
  }

  .list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .ant-col {
      text-align: center;
      font-size: 12px;
      color: rgba(56, 56, 56, 1);
    }
  }
`

const RankingList: React.FC = () => {
  const [type, setType] = useState(1)
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const tags = [
    { name: '每日', value: 1 },
    { name: '每周', value: 2 },
    { name: '成长', value: 3 },
  ]
  const tagsView = tags.map(item => <div className={`tag ${type === item.value ? 'selected' : ''}`} onClick={() => onTagClick(item)}>{item.name}</div>)
  const listView = tableData.map((item:any) => {
    return (
      <Row>
        <Col span={8}>{item.actionDescription}</Col>
        <Col span={8}>{item.userNum}</Col>
        <Col span={8}>{item.userCompareNum !== undefined ? `${item.userCompareNum}%` : ''}</Col>
      </Row>
    )
  })

  function onTagClick (item: any) {
    setType(item.value)
  }
  function fetchTabelData (params: any) {
    setLoading(true)
    scoreRecordStatisticsByType(params).then((res: any) => {
      if (res.code === 200) {
        const data = (res.data || []).slice(0, 4)
        data.push(...new Array(4 - data.length).fill({}))
        setTableData(data)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchTabelData({type})
  }, [type])

  return (
    <Spin spinning={loading}>
      <Container>
        <div className="tags">
          {tagsView}
        </div>
        <div className="list-container">
          <Row>
            <Col span={8}>任务</Col>
            <Col span={8}>完成用户数</Col>
            <Col span={8}>涨幅</Col>
          </Row>
          {listView}
        </div>
      </Container>
    </Spin>
  )
}

export default RankingList
