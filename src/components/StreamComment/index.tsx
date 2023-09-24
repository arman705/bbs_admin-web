import React, {useContext,useEffect,useState,useRef} from 'react';

// Api
import { socket } from '../../api/socket';
import { getCommentMessages } from '../../api/newsflash';
import ChatMessgeScroll from '../ChatMessageScroll';

import {
	Card,
 } from 'antd';
import Styled, {css} from 'styled-components';
import {FullscreenOutlined, ReloadOutlined} from '@ant-design/icons';

import { BlockInline,Dot, StreamWrapper} from '../../pages/styled';
import { ThemeContext } from '../../theme';
import { GlobalContext, STREAM_COMMENT } from '../../utils/global';

const NAME = STREAM_COMMENT;

export default function StreamComment() {

	const {theme} = useContext(ThemeContext);
	const {global, updateGlobal} = useContext(GlobalContext);
	const [msgLists, setMsgLists] = useState<any>([]);
	const srollRef: any = useRef(null);

	const toggleZoom = () => {
		if (global.zoomView) {
			global.zoomView = '';
		} else {
			global.zoomView = STREAM_COMMENT;
		}
		updateGlobal(global);
	}

	useEffect(() => {
		const box = srollRef.current;

		getCommentMessages().then((res) => {
			for (let i = 0; i < res.length; i++) {
				if (res[i].messageType === 'AUDIO') {
					const au = document.createElement('audio');
					au.src = res[i].content;
					au.addEventListener('loadedmetadata', function () {
						res[i].audioDuration = Math.ceil(au.duration);
					}, false);
				}
			}
			setTimeout(()=>{
				setMsgLists(res);
				console.log('commnet', res);
			},300);
		})
		socket.addEventListener('open', () => {
			console.log('链接成功')
		})
		socket.addEventListener('message', (e: any) => {
			console.log('avavavava', e)
			let msg: any
			try {
				msg = JSON.parse(e.data);
			} catch (error) {
				msg = e.data
			}
			if(msg && msg.messageSource==='COMMENT'){
				setMsgLists((pre: any) => [...pre, msg])
				const clientHeight = box.clientHeight
				const scrollTop = box.scrollTop
				if (clientHeight - scrollTop <= 80) {
					box.scrollTop = box.scrollHeight;
					// setNoRead(0)
				} else {
					// setNoRead(noRead + 1)
				}
			}
		})
		//关闭事件
		// socket.onclose = () => {
		// 	// alert("Socket已关闭");
		// };
		// //发生了错误事件
		// socket.onerror = () => {
		// 	// alert("发生了错误");
		// }
	}, [])

	const extra = <BlockInline style={ {fontSize: "13px", cursor: 'pointer'} }>
		<BlockInline onClick={ toggleZoom }>
			<FullscreenOutlined />
			<span>{global.zoomView===''?'全屏':'半屏'}</span>
		</BlockInline>
	</BlockInline>

	if (global.zoomView != '' && global.zoomView != STREAM_COMMENT) return null;

	return <StreamWrapper zoom={ global.zoomView == STREAM_COMMENT ? true: false }>
		<Card extra={ extra } title={ <BlockInline><Dot style={ {marginRight: '5px'} } color={ theme.colors.bg3 } />实时评论监控</BlockInline> }>
			<ChatMessgeScroll ref={srollRef} hideInput={true} msgLists={msgLists}></ChatMessgeScroll>
		</Card>
	</StreamWrapper>
}
