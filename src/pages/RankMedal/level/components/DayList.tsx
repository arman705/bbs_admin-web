import React from 'react';
import TaskList from './TaskList';

const WeekList: React.FC = () => {
  const taskType = [
    { name: '发布评论', value: 'PostPublish' },
    { name: '帖子点赞', value: 'Postcomment' },
    { name: '观看视频', value: 'WatchVideo' },
    { name: '分享帖子到微信', value: 'PostShare' }
  ]
  return <TaskList title="每日任务" type={1} taskType={taskType} />
};

export default WeekList;