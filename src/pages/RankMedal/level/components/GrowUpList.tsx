import React from 'react';
import TaskList from './TaskList';

const WeekList: React.FC = () => {
  const taskType = [
    { name: '完善资料', value: 'ImproveUserInfo' },
    { name: '关注用户', value: 'FollowUser' }
  ]
  return <TaskList title="成长任务" type={3} taskType={taskType} />
};

export default WeekList;