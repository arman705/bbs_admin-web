import React, { useEffect, useState } from 'react'
import { ContentInner } from '../../../../components/Themeable';
import { Typography, DatePicker, Row, Col, Spin } from 'antd';
import { scoreRecordStatisticsByChart } from '../../../../api/rankmedal'
import TotalChart from './TotalChart'
import AverageChart from './AverageChart'
import RankingList from './RankingList'
import moment from 'moment';

const ChartView = () => {
  const [value, setValue] = useState([moment(), moment()])
  const [chartData, setChartData] = useState([])
  const [dates, setDates] = useState([])
  const [hackValue, setHackValue] = useState<any>();
  const [loading, setLoading] = useState(false)

  function onOpenChange (open: boolean) {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };
  function onChange (val: any) {
    setValue(val)
  }
  function fetchChartData (params: any) {
    setLoading(true)
    scoreRecordStatisticsByChart(params).then((res: any) => {
      if (res.code === 200) {
        setChartData(res.data)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function disabledDate (current: any) {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && (dates[1] as any).diff(current, 'days') > 7;
    return tooEarly || tooLate;
  }

  useEffect(() => {
    fetchChartData({
      startTime: value ? (value[0] as any).format('YYYY-MM-DD') : undefined,
      endTime: value ? (value[1] as any).format('YYYY-MM-DD') : undefined
    })
  }, [value])

  return (
    <ContentInner style={{ marginBottom: '20px' }}>
      <Typography.Title level={ 5 }>任务统计</Typography.Title>
      <div style={{ textAlign: 'center' }}>
        <DatePicker.RangePicker
          value={hackValue || value}
          format="YYYY-MM-DD"
          onChange={onChange}
          onCalendarChange={(val: any) => setDates(val)}
          onOpenChange={onOpenChange}
          disabledDate={disabledDate}
        />
      </div>
      <Row justify="center" align="middle">
        <Col span={8}>
          <Spin spinning={loading}>
            <TotalChart data={chartData} />
          </Spin>
        </Col>
        <Col span={8}>
          <Spin spinning={loading}>
            <AverageChart data={chartData} />
          </Spin>
        </Col>
        <Col span={8}><RankingList /></Col>
      </Row>
    </ContentInner>
  )
}

export default ChartView
