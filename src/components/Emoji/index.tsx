import React, { useContext, useState } from 'react';
import { defaultEmoji, EmojiItem } from '../../utils/emoji';
import Styled, { css } from 'styled-components';
import {

	Tabs,
	Row,
	Col,
	Tooltip,
	Avatar,

} from 'antd';
import { Color, useTheme } from '../../theme';

const { TabPane } = Tabs;

const EmojiWrapper = Styled.div`
	${(props: { color: Color, border: Color }) => css`
		background: ${props.color};
		border: 1px solid ${props.border};
	` }
	padding: 5px 5px;
`;

export default function Emoji({ setSendValue, setViewEmoji }: any) {

	const tabDatas: { [key: string]: EmojiItem[] } = {
		'默认': defaultEmoji,
	};
	const addEmoji = (text: string) => {
		setSendValue((pre: any) => pre + `[/${text}]`)
		setViewEmoji(false);
	}

	const tabsRender = Object.keys(tabDatas).map(key => {
		const emojis = tabDatas[key];
		return <TabPane key={key} tab={key}>
			<Row justify="start" align="middle" gutter={10} wrap={true}>
				{emojis.map(emoji => {
					return <Col key={emoji.text} style={{ margin: "5px 0px" }} onClick={addEmoji.bind(null, emoji.text)}>
						<Tooltip title={emoji.text}>
							<Avatar src={emoji.content} size="small"></Avatar>
						</Tooltip>
					</Col>
				})}
			</Row>
		</TabPane>
	});

	const { theme } = useTheme();

	return <EmojiWrapper border={theme.colors.text2} color={theme.colors.white}>
		<Tabs tabPosition="bottom" defaultActiveKey="default" >
			{tabsRender}
		</Tabs>
	</EmojiWrapper>
}