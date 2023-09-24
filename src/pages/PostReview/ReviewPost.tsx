import React from 'react';
import { Descriptions } from 'antd';
import { HTMLWrapper } from './styled';
const {Item} = Descriptions;

const defaultProps = {
  id: '-',
  username: '-',
  title: '-',
  typeName: '-',
  htmlContent: '-'
};

interface Iprops {
  id: string | number;
  username: string | null;
  title: string;
  typeName: string;
  htmlContent: string | null;
};

export default function ReviewPost( { authorId, authorName, title, typeName, htmlContent, transcodingStatus }: Iprops = defaultProps ) {

  function getStatus (text) {
    switch (text) {
      case 0:
        return '待转码'
      case 1:
        return '转码中'
      case 2:
        return '转码成功'
      case 3:
        return '转码失败'
    }
  }
	return (
  <Descriptions column={2}>
		<Item label="用户昵称">{ authorName || '-' }</Item>
		<Item label="用户ID">{ authorId }</Item>
		<Item label="帖子标题">{ title }</Item>
		<Item label="所属板块">{ typeName }</Item>
    {
      transcodingStatus > -1 ? <>
        <Item label="转码状态">{ getStatus(transcodingStatus) }</Item>
		    <Item label=""></Item>
      </> : null
    }
    <Item label="帖子详情">
      <HTMLWrapper dangerouslySetInnerHTML={ { __html: htmlContent ? htmlContent : '暂无详情' } }></HTMLWrapper>
    </Item>
	</Descriptions>
  )
}