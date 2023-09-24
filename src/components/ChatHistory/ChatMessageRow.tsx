import React, { ReactNode, useContext, useState } from 'react';
import { Row, Col, Avatar } from 'antd';
import { MessageWrapper, Nickename, Message, SendTime, ShowTime } from './styled'
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
		{/* 用户封禁弹窗 */}
		<UserBanPanel onCancel={ () => handleBen( false ) } onOk={ () => handleBen( false ) } show={ viewBan } />
		<Row justify="center" align="middle"><ShowTime>2020-2020</ShowTime></Row>

		<Row justify="start" style={{ marginBottom: '20px'}}>
			<Col span="3" onClick={ () => handleBen( true ) }>
				<Avatar src={headImg} size={45} />
			</Col>
			<Col span={21}>
				<Row><Col>名字</Col></Row>
				<Row align='bottom'>
					<Col span={17}> <div style={{ padding: '10px', textAlign: 'left', lineHeight: '20px', fontSize: '14px', color: '#fff', background: 'rgba(81, 46, 222, 1)', borderRadius: '5px' }}>是多少的法师是多少的法师打发士大夫但是是多少的法师打发士大夫但是是多少的法师打发士大夫但是打发士大夫但是</div> </Col>
					<Col span={4}>19:45:59</Col>
				</Row>
			</Col>
		</Row>

		<Row justify="end">
			
			<Row justify="end"><Col>名字</Col></Row>
			<Col span="3" onClick={ () => handleBen( true ) }>
				<Avatar src={headImg} size={45} />
			</Col>
			<Col span={21}>
				<Row align='bottom'>
				<Col span={4}>19:45:59</Col>
					<Col span={17}> <div style={{ padding: '10px', textAlign: 'left', lineHeight: '20px', fontSize: '14px', color: '#000', background: 'rgba(241, 241, 241, 1)', borderRadius: '5px' }}>是多少的法师是多少的法师打发士大夫但是是多少的法师打发士大夫但是是多少的法师打发士大夫但是打发士大夫但是</div> </Col>
				</Row>
			</Col>
		</Row>
		{/* <Row align="top" justify="start">
			
			<Col span="2" onClick={ () => handleBen( true ) }>
				<Avatar src={headImg} size="small" />
			</Col>
			<Col span="14">
				<Nickename color={theme.colors.text4}>{username}</Nickename>
				<Message color={ theme.colors.text2 }>{message}</Message>
			</Col>
			<Col span="8"><SendTime>{sendTime}</SendTime></Col>
		</Row> */}
	</MessageWrapper>
}