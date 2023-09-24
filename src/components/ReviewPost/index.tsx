import React from 'react';
import {
	Descriptions
} from 'antd';
import Styled from 'styled-components';

const HTMLWrapper = Styled.div`
	max-height: 300px;
	overflow: auto;
`;



const {Item} = Descriptions;

export default function ReviewPost() {

	const item = {
		nickname: '李宇',
		id: 9033,
		title: '干货! 好人缘的密码',
		module: '体育赛事',
		content: '<p>帖子详情</p>',
	};

	return <Descriptions column={2}>
		<Item label="用户昵称">{item.nickname}</Item>
		<Item label="用户ID">{item.id}</Item>
		<Item label="帖子标题">{item.title}</Item>
		<Item label="所属板块">{item.module}</Item>
		<Item label="帖子详情">
			<HTMLWrapper dangerouslySetInnerHTML={ {__html: item.content} }></HTMLWrapper>
		</Item>
	</Descriptions>
}