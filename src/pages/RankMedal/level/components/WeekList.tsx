import React from 'react';
import TaskList from './TaskList';

const WeekList: React.FC = () => {
  const taskType = [
    { name: '发表帖子', value: 'PostPublish' },
    { name: '发送私信', value: 'MessageSend' }
  ]
  return <TaskList title="每周任务" type={2} taskType={taskType} />
};

export default WeekList;