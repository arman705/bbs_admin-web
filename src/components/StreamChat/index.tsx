import React, { useContext, useEffect, useState, useRef } from 'react';

// Api
import { socket } from '../../api/socket';
import { getChatMessages, chatroomParam } from '../../api/newsflash';

// Context
import { ThemeContext } from '../../theme';

// Components
import { Card } from 'antd';
import ChatMessgeScroll from '../ChatMessageScroll';
import { GlobalContext, STRAEM_CHAT } from '../../utils/global';
import { BlockInline, Dot, StreamWrapper } from '../../pages/styled';
import { FullscreenOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment'


const Name = STRAEM_CHAT;

// 实时聊天监控
const StreamChat: React.FC = () => {

	const { theme } = useContext(ThemeContext);
	const { global, updateGlobal } = useContext(GlobalContext);
	const [msgLists, setMsgLists] = useState<any>([]);
	const [noRead, setNoRead] = useState(0);
	const [defaultParam, setDefaultParam] = useState<any>({})
	const srollRef: any = useRef(null);


	/* -------------------- Api start -------------------- */
	useEffect(() => {
		const box = srollRef.current;

		getChatMessages().then((res) => {
			for (let i = 0; i < res.length; i++) {
				if (res[i].messageType === 'AUDIO') {
					const au = document.createElement('audio');
					au.src = res[i].content;
					au.addEventListener('loadedmetadata', function () {
						res[i].audioDuration = Math.ceil(au.duration);
					}, false);
				}
			}
			setTimeout(() => {
				setMsgLists(res);
				box.scrollTop = box.scrollHeight;
				console.log('res', res);
			}, 300);
		})
		chatroomParam().then((res) => {
			const data = res && res[0];
			if (data.value) {
				const params = {};
				data.value.split('\r\n').forEach((val: any) => {
					const key = val.split(': ')[0];
					const value = val.split(': ')[1] === 'null' ? null : val.split(': ')[1];
					params[key] = value ? value.replace('\' ', '').replaceAll('\"', '').replaceAll(' ', '') : value;
				})
				setDefaultParam(params);
			}
			console.log('res===', res);
		})

		socket.addEventListener('open', () => {
			console.log('链接成功')
		})
		socket.addEventListener('message', (e: any) => {
			console.log('vvv', e)
			let msg: any
			try {
				msg = JSON.parse(e.data);
			} catch (error) {
				msg = e.data
			}
			if(msg && msg.messageSource==='CHAT'){
				setMsgLists((pre: any) => [...pre, msg])
				const clientHeight = box.clientHeight
				const scrollTop = box.scrollTop
				if (clientHeight - scrollTop <= 80) {
					box.scrollTop = box.scrollHeight;
					setNoRead(0)
				} else {
					setNoRead(noRead + 1)
				}
			}
		})

		//关闭事件
		// socket.onclose = () => {
		// 	alert("Socket已关闭");
		// };
		// //发生了错误事件
		// socket.onerror = () => {
		// 	alert("发生了错误");
		// }

	}, [])
	/* -------------------- Api start -------------------- */


	/* -------------------- Method start -------------------- */
	const toggleZoom = () => {
		console.log('global', global);
		if (global.zoomView) {
			global.zoomView = '';
		} else {
			global.zoomView = Name;
		};
		updateGlobal(global);
	};

	const sendMsg = (content: string) => {
		if (socket.readyState === 1) {
			const param = { ...defaultParam };
			param.messageType = 'TEXT';
			param.content = content;
			param.sendTime = moment().format('YYYY-MM-DD hh:mm:ss')
			console.log(JSON.stringify(param))
			socket.send(JSON.stringify(param));
		}
	}




	/* -------------------- Method start -------------------- */



	/* -------------------- Ui start -------------------- */
	const ui_extra = () => (
		<BlockInline style={{ fontSize: "13px", cursor: 'pointer' }}>

			<BlockInline onClick={toggleZoom}>
				<FullscreenOutlined />
				<span>{global.zoomView === '' ? '全屏' : '半屏'}</span>
			</BlockInline>

		</BlockInline>
	);
	/* -------------------- Ui start -------------------- */






	if (global.zoomView != '' && global.zoomView != Name) return null;

	return (
		<StreamWrapper zoom={global.zoomView == Name ? true : false}>
			{/* <button onClick={ () => {}} >发送</button> */}
			<Card
				extra={ui_extra()}
				title={
					<BlockInline>
						<Dot style={{ marginRight: '5px' }} color={theme.colors.bg2} />
						实时聊天监控
					</BlockInline>
				}>
				<ChatMessgeScroll ref={srollRef} msgLists={msgLists} sendMsg={sendMsg} />
			</Card>
		</StreamWrapper>
	)
};

export default StreamChat;