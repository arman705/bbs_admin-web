import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

export default function ContrastLineCharts({ data }: any) {

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.charTimeData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.charDataOne,
        type: 'line',
        smooth: true,
        areaStyle: {
          color:'rgba(42, 130, 228, 1)'
        }
      },

      {
        data: data.charDataTwo,
        type: 'line',
        smooth: true,
        areaStyle: {
          color:'rgba(121, 72, 234, 1)'
        }
      }
    ]
  }
  return <ReactEcharts className="chart-full" option={option} />
}