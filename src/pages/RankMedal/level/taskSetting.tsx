import React from 'react';
import Thumbnail from '../../../components/Thumbnail';
import { ContentWrapper } from '../../../components/Themeable';
import ChartView from './components/ChartView';
import DayList from './components/DayList';
import WeekList from './components/WeekList';
import GrowUpList from './components/GrowUpList';

const Report: React.FC = () => {
  return (
    <ContentWrapper>
      <Thumbnail></Thumbnail>
      {/* 图表 */}
      <ChartView />
      {/* 每日任务 */}
      <DayList />
      {/* 每周任务 */}
      {/* <WeekList /> */}
      {/* 成长任务 */}
      {/* <GrowUpList /> */}
    </ContentWrapper>
  )
};

export default Report;