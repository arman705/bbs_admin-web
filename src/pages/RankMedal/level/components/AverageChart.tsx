import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

interface AverageChartProps {
  data: any[]
}

const AverageChart: React.FC<AverageChartProps> = (props) => {
  const data = props.data || []
  const dates: any = []
  const chartData: any = []
  let total = 0
  let range = 0
  data.forEach((item) => {
    dates.push(item.date)
    chartData.push(item.userNum)
    total += item.userNum
  })
  if (chartData.length > 1) {
    range = (chartData[chartData.length - 1] - chartData[chartData.length - 2]) / chartData[chartData.length - 1] * 100
  }
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    title: {
      text: '人均完成任务次数',
      bottom: 0,
      left: 'center',
      textStyle: {
        color: 'rgba(128, 128, 128, 1)',
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    series: [
      {
        name: '登录用户',
        data: chartData,
        type: 'line',
        smooth: true,
        areaStyle: {}
      }
    ]
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', color: 'rgba(0, 0, 0, 0.85)' }}>{ total }</div>
        <div style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.45)', marginLeft: '30px' }}>
          { Math.abs(range) }
          { range === 0 ? null : range < 0 ? <CaretDownOutlined /> : <CaretUpOutlined />}
        </div>
      </div>
      <ReactEcharts option={option} />
    </>
  )
}

export default AverageChart
