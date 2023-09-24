import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
interface IChartData {
  time: string;
  loginNum: number;
  signInNum: number;
}

export default function CurveLineCharts({ data }: any) {
  const [chartData, setChartData] = useState<any>({});
  useEffect(() => {
    const dataObj: any = {
      month: [],
      login: [],
      sign: []
    };
    data.forEach((val: IChartData) => {
      dataObj.month.push(val.time);
      dataObj.login.push(val.loginNum);
      dataObj.sign.push(val.signInNum);
    })
    setChartData(dataObj);

  }, [JSON.stringify(data)])


  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: chartData.month || []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '登录用户',
        data: chartData.login || [],
        type: 'line',
        smooth: true,
      },
      {
        name: '签到用户',
        data: chartData.sign || [],
        type: 'line',
        smooth: true
      }
    ]
  }
  return <ReactEcharts className="chart-full" option={option} />
}