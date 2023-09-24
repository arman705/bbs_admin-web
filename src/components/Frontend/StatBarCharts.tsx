import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';

interface IChartData {
  time: string;
  twoNum: number;
  threeNum: number;
  fourNum: number;
  fiveNum: number;
  sixNum: number;
  sevenNum: number;
}

export default function StatBarCharts({ data }: any) {
  const [chartData, setChartData] = useState<any>({});
  useEffect(() => {
    const dataObj: any = {
      time: [],
      twoNum: [],
      threeNum: [],
      fourNum: [],
      fiveNum: [],
      sixNum: [],
      sevenNum: [],
    };
    data.forEach((val: IChartData) => {
      dataObj.time.push(val.time);
      dataObj.twoNum.push(val.twoNum);
      dataObj.threeNum.push(val.threeNum);
      dataObj.fourNum.push(val.fourNum);
      dataObj.fiveNum.push(val.fiveNum);
      dataObj.sixNum.push(val.sixNum);
      dataObj.sevenNum.push(val.sevenNum);
    })
    setChartData(dataObj);

  }, [JSON.stringify(data)])

  const months = []
  for (let i = 1; i <= 12; i++) months.push(`${i}月`)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: chartData.time
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '2日',
        data:  chartData.twoNum,
        barGap: 0,
        type: 'bar',
        itemStyle: {
          color: 'rgb(82, 0, 166)'
        }
      },
      {
        name: '3日',
        data: chartData.threeNum,
        barGap: 0,
        type: 'bar',
        itemStyle: {
          color: 'rgb(107, 0, 211)'
        }
      },
      {
        name: '4日',
        data: chartData.fourNum,
        barGap: 0,
        type: 'bar',
        itemStyle: {
          color: 'rgb(107, 0, 211)'
        }
      },
      {
        name: '5日',
        data: chartData.fiveNum,
        barGap: 0,
        type: 'bar',
        itemStyle: {
          color: 'rgb(155, 65, 223)'
        }
      },
      {
        name: '6日',
        data: chartData.sixNum,
        barGap: 0,
        type: 'bar',
        itemStyle: {
          color: 'rgb(159, 109, 236)'
        }
      },
      {
        name: '7日',
        data: chartData.sevenNum,
        barGap: 0,
        type: 'bar',
        itemStyle: {
          color: 'rgb(197, 170, 250)'
        }
      }
    ]
  }
  return <ReactEcharts className="chart-full" option={option} />
}