/* eslint-disable react/jsx-no-target-blank */
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';

// Api
// import { socket } from '../../api';

// context
import { ThemeContext } from '../../theme';

// hooks
import { useOutClick } from '../../utils/hooks';

// utils
import Emoji from '../Emoji';
import { GlobalContext } from '../../utils/global';
import { defaultEmoji } from '../../utils/emoji';

// assets
import audioSample from '../../assets/audio/notice.mp3';
import chatSampleImg from '../../assets/images/chat-sample.png';

// components
import { Row, Col, Input, Button, Image, Avatar } from 'antd';
import ChatMessageRow from '../ChatMessageRow';
import QuickMessagePanel from '../QuickMessagePanel';
import { SoundOutlined, SmileOutlined, BarsOutlined, DownOutlined } from '@ant-design/icons';
import { Wrapper, ScrollContainer, Scrollable, AudioWrapper, Botter, UpcomingWrapper, EmojiWrapper } from './styled';

interface IProps {
	hideInput?: boolean;
	msgLists?: any;
	sendMsg?: any;
	ref?: any;
};


const ChatMessgeScroll: React.FC<any> = React.forwardRef(({ hideInput = false, msgLists = [], sendMsg }: IProps, ref: any) => {

	const { theme } = useContext(ThemeContext);
	const { global } = useContext(GlobalContext);
	const [sendValue, setSendValue] = useState<string>('');
	const [viewEmoji, setViewEmoji] = useState<boolean>(false);  // 表情
	const [viewQuickMessage, setViewQuickMessage] = useState<boolean>(false); // 快捷消息

	/* -------------------- Api start -------------------- */

	/* -------------------- Api start -------------------- */


	/* -------------------- Method start -------------------- */
	// 表情 - 点击如果超过了界面外 则把表情和快捷回复隐藏起来
	const emojiRef = useRef(null);
	const emojiToggerRef = useRef(null);
	useOutClick(emojiRef, emojiToggerRef, () => {
		setViewEmoji(false);
		setViewQuickMessage(false);
	});

	// 快捷消息 - 超过界面外后 把表情和快捷隐藏起来
	const quickMessageRef = useRef(null);
	const quickMessageToggerRef = useRef(null);
	useOutClick(quickMessageRef, quickMessageToggerRef, () => {
		console.log('click out side');
		setViewEmoji(false);
		setViewQuickMessage(false);
	});


	const toggleEmoji = () => {
		setViewEmoji(!viewEmoji);
		setViewQuickMessage(false);
	};

	const toggleQuickMessage = () => {
		setViewEmoji(false);
		setViewQuickMessage(!viewQuickMessage);
	};

	let playing = false;
	const playSound = () => {
		if (playing) return;
		playing = true;
		let audio = new Audio(audioSample);
		audio.play();
		audio.addEventListener('ended', () => {
			playing = false;
		}, false);
	};

	// 发送信息

	const handleBtnSendMessage = () => {
		sendMsg(sendValue);
		setSendValue('');
	};

	/* -------------------- Method start -------------------- */


	/* -------------------- Ui start -------------------- */
	// 表情
	const ui_emojiRender = () => viewEmoji ? (<EmojiWrapper ref={emojiRef}><Emoji setSendValue={setSendValue} setViewEmoji={setViewEmoji} />	</EmojiWrapper>) : null;

	// 常用语
	const ui_quickMessagePanelRender = () => viewQuickMessage && (<EmojiWrapper ref={quickMessageRef}><QuickMessagePanel setSendValue={setSendValue} setViewQuickMessage={setViewQuickMessage}/></EmojiWrapper>);

	// 图片消息
	const ui_imageMessage = (src: string) => (<Image src={src} width={100} alt="" />);

	// 文字消息
	const ui_textMessage = (content: string) => {
		let contentStr = content;
		const reg = /\[\/.+?\]/g;
		const contentdom = contentStr.replace(reg, (a: any): any => {
			const icon = defaultEmoji.find((item: any) => a === `[/${item.text}]`)
			return `<img src="${icon ? icon.content : ''}" style="width:24px;height:24px;"}></img>`;
		});

		return <div style={{ width: 300, wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: contentdom }}>{ }</div>;
	}

	// 分享消息
	const ui_shareMessage = (content: string) => (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<span style={{ fontSize: 16 }}>分享了</span>
			<a
				href={content}
				target="_blank"
				style={{
					fontSize: 12,
					borderRadius: '4px',
					backgroundColor: '#e5e5e5',
					maxWidth: 184,
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
					color: '#000',
					padding: '2px 8px',
				}}>
				{content}
			</a>
		</div>
	);
	// 语音消息
	const ui_audioMessage = (seconds: number) => (
		<AudioWrapper onClick={playSound} color={theme.colors.bg4}>
			<Row justify="space-between">
				<Col span="6" offset="2"><SoundOutlined /></Col>
				<Col span="6"><span>{seconds}s</span></Col>
			</Row>
		</AudioWrapper>
	);

	// 最新消息
	const ui_upcoming = () => (
		<UpcomingWrapper>
			<span>35条评论</span>
			<DownOutlined style={{ marginLeft: '2px' }} />
		</UpcomingWrapper>
	);
	/* -------------------- Ui start -------------------- */





	// 消息列表
	const messages = msgLists.map((val: any, index: number) => {
		// console.log( "val", val );
		switch (val.messageType) {
			case 'AUDIO':
				return <ChatMessageRow key={index} username={val.sendNickName} sendTime={val.sendTime} headImg={val.avatar} message={ui_audioMessage(val.audioDuration || 0)} />
			case 'IMAGEs':
				return <ChatMessageRow key={index} username={val.sendNickName} sendTime={val.sendTime} headImg={val.avatar} message={ui_imageMessage(val.content)} />
			case 'TEXT':
				return <ChatMessageRow key={index} username={val.sendNickName} sendTime={val.sendTime} headImg={val.avatar} message={ui_textMessage(val.content)} />
			case 'SHARE':
				return <ChatMessageRow key={index} username={val.sendNickName} sendTime={val.sendTime} headImg={val.avatar} message={ui_shareMessage(val.content)} />
			default:
				return <ChatMessageRow key={index} username={val.sendNickName} sendTime={val.sendTime} headImg={val.avatar} message={ui_textMessage(val.content)} />
		}
	});


	return (
		<Wrapper>

			<ScrollContainer hideInput={hideInput} zoom={global.zoomView ? true : false}>
				<Scrollable ref={ref}>{messages}</Scrollable>
				{/* { ui_upcoming() } */}
				{ui_emojiRender()}
				{ui_quickMessagePanelRender()}
			</ScrollContainer>

			{
				!hideInput && (
					<Botter>
						<Row justify="space-around" align="middle" gutter={10}>
							<Col span="3" >
								<SmileOutlined ref={emojiToggerRef} onClick={toggleEmoji} />
								<BarsOutlined ref={quickMessageToggerRef} onClick={toggleQuickMessage} style={{ marginLeft: '5px' }} />
							</Col>
							<Col flex="auto"><Input value={sendValue} onChange={(ev: any) => setSendValue(ev.target.value)} placeholder="回复聊天" /></Col>
							<Col span="4"><Button onClick={handleBtnSendMessage} type="primary">发送</Button></Col>
						</Row>
					</Botter>
				)
			}
		</Wrapper>
	)
});

export default ChatMessgeScroll;