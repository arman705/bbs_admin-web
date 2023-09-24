import React, { ReactNode, useContext, useState } from 'react';
import { Row, Col, Avatar } from 'antd';
import { MessageWrapper, Nickename, Message, SendTime } from './styled'
import { ThemeContext } from '../../theme';
import UserBanPanel from '../UserBanPanel';

type PropsType = {
	username: string
	message: ReactNode
	headImg:string
	sendTime: string
}

// 聊天消息
export default function ChatMessageRow({username, message,headImg, sendTime}: PropsType) {
	const [viewBan, setViewBan] = useState(false);
	const { theme } = useContext(ThemeContext);

	const handleBen = ( bool: boolean ) => setViewBan( bool );
	return <MessageWrapper>
		<UserBanPanel onCancel={ () => handleBen( false ) } onOk={ () => handleBen( false ) } show={ viewBan } />
		<Row align="top" justify="start">
			<Col span="2" onClick={ () => handleBen( true ) }><Avatar src={headImg} size="small" /></Col>
			<Col span="14">
				<Nickename color={theme.colors.text4}>{username}</Nickename>
				<Message color={ theme.colors.text2 }>{message}</Message>
			</Col>
			<Col span="8"><SendTime>{sendTime}</SendTime></Col>
		</Row>
	</MessageWrapper>
}