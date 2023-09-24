import React, { useEffect, useState } from 'react';
import Charts from 'echarts-for-react';
import { EchartWrapper } from '../styled';

const data1 = [820, 932, 901, 934, 1290, 1330, 1320];
const data2 = [820 /2, 932/2, 901/2, 934/2, 1290/2, 1330/2, 1320/2];



const UserCharts = ( props: any ) => {
  const [ ydata, setYdata ] = useState<string[]>([]);
  const [ loginList, setLoginList] = useState<string[]>([]);
  const [ createList, setCreateList ] = useState<string[]>([]);

  let { CreateTableSta, LoginTableSta } = props.chartsList;

  const getKey = ( CreateTableSta: object, LoginTableSta: object  ) => {
    if ( !CreateTableSta && !LoginTableSta ) return false;
    let arr = [ ...Object.keys( LoginTableSta ), ...Object.keys( CreateTableSta )  ];
    let _list: string[] = [];
    for( let i = 0; i < arr.length; i++ ){
      if ( _list.indexOf( arr[ i ] ) === -1 ) {
        _list.push( arr[ i ] );
      };
    };
    _list.sort( ( a: string, b: string ) => { return new Date( a ).getTime() - new Date( b ).getTime() } );
    setYdata( [ ..._list ] );
    setLoginList( Object.values( LoginTableSta ) );
    setCreateList( Object.values( CreateTableSta ) );
  };

  useEffect( () => {
    getKey( CreateTableSta, LoginTableSta );
  }, [ props.chartsList ] );

  const echartOptions = {
    title: { show: false, text: '标题' },
    xAxis: {
      type: 'category',
      data: ydata.map( m => `${m}`),
    },
    yAxis:  { type: 'value' },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: (params:any, ticker: string, callback: any) => {
        let d1 = createList[params[0].dataIndex];
        let d2 = loginList[params[0].dataIndex];
        return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#5470c6;"></span>
                  <span>注册量: ${d1 ? d1 : '0'}</span> 
                  <br /> 
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#f00;"></span>
                  <span>登录量: ${d2 ? d2 : '0' }</span>
                `;
      },
    },
    series: [ { data: createList, type: 'line', smooth: true }, { data: loginList, type: 'line', smooth: true } ],
    dataZoom: [
      {
              start: 0,//默认为0
              end: 70,//默认为100
              type: "slider",
              show: false,
              xAxisIndex: [0],
              handleSize: 0,//滑动条的 左右2个滑动条的大小
              height: 10,//组件高度
              // left: "5%", //左边的距离
              // right: "4%",//右边的距离
              bottom: 0,//底边的距离
              borderColor: "#000",
              fillerColor: "#269cdb",
              borderRadius: 5,
              backgroundColor: "#33384b",//两边未选中的滑动条区域的颜色
              showDataShadow: false,//是否显示数据阴影 默认auto
              showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
              realtime: true, //是否实时更新
              filterMode: "empty",
              },
      {
              type: "inside",
              show: true,
              xAxisIndex: [0],
              start: 1,//默认为1
              end: 5,//默认为100
              }

    ]
  };

  return (
    <EchartWrapper>
      <Charts option={echartOptions}></Charts>
    </EchartWrapper>
  )
};

export default UserCharts;