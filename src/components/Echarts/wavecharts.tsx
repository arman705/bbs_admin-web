import React from "react";

import ReactEcharts from 'echarts-for-react';
import Styled from 'styled-components';

const ChartWrapper = Styled.div`
	height: 55px;
	width: 400px;
`;

// 波浪堆叠折线图
export default function WaveCharts() {
	const options = {
		grid: {
			show: false,
			left:0,
			top: 0,
			width: 400,
			height: 50,
		},
		xAxis: {
			type: 'category',
			show: false,
			boundaryGap: true,
		},
		yAxis: {
			type: 'value',
			show: false,
		},
		lineStyle: {
			color: 'rgba(81, 46, 222, 1)',
		},
		series: [{
			data: [30,60,80,120,60,90,200],
			type: 'line',
			smooth: true,
			symbol: 'none',
			areaStyle: {
				color: 'rgba(121, 72, 234, 0.31)',
			}
		}],
	};

	return <ChartWrapper>
		<ReactEcharts option={options}></ReactEcharts>
	</ChartWrapper>
}
