import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Row, Col, message } from 'antd'
import ReviewPost from './ReviewPost';
import QuickMessagePanel from '../../components/QuickMessagePanel';
import { common } from '../../api';

export default function VerifyModal ({ visible, data, onCancel, onSubmitSuccess }) {
	// 快捷理由
	const [msgVisible, setMsgVisible] = useState<boolean>(false); 
	const [ textAreaValue, setTextAreaValue ] = useState<string>('');
  const [ rejectReasonStatus, setRejectReasonStatus ] = useState<boolean>( false );
  const [passLoading, setPassLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

	if (data) {
		data.htmlContent = data.htmlContent.replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/g, (match, url) => {
			return `<div class="dplayer-container" data-src="${url}"></div>`
		})
	}
  // 快捷列表
	const ui_QuickMessagePanel = () => msgVisible && <QuickMessagePanel quickMsg={(reply: string) => { setTextAreaValue(reply) }} />;

  // 帖子通过 & 拒绝 接口
	const md_postsRejectReason = ( status: string ) => {
		let res: any = { id: '', auditState: ''};
		if ( status === 'PASS' ) {
      setPassLoading(true)
			// api_postsAudit
			res = { id: data.id, auditState: status };
		} else {
			if ( rejectReasonStatus &&  textAreaValue === '' ) {
				message.warning( '请填写拒绝原因!' );
				return ;
			} else {
        setRejectLoading(true)
				res = {  id: data.id, auditState: status, rejectReason: textAreaValue };
			};
		};
    api_postsAudit(res)
	};
  // 帖子审核通过
	const md_handleOk = ( status: string ) => {
		md_postsRejectReason( status );
	};
  // 帖子审核
	const api_postsAudit = async ( data: { id: string, auditState: string, rejectReason?: string } ) => {
		await common.postsAudit( data ).then( ( res: any ) => {
			textAreaValue.length > 0 && setTextAreaValue( '' ); 
      onSubmitSuccess();
      onCancel();
      setPassLoading(false)
      setRejectLoading(false)
		} );
	};
  // 帖子拒绝
  const md_handleReviewRefush = () => {
    setRejectReasonStatus( () => !rejectReasonStatus );
    textAreaValue.length > 0 && setTextAreaValue( '' ); 
  };
	useEffect(() => {
		if (visible) {
			setTimeout(() => {
				const videos = document.querySelector('.verify-modal-content')?.querySelectorAll('.dplayer-container')
				videos?.forEach(item => {
					const src = item.dataset.src || ''
					// const src = 'http://103.210.238.161:9000/bbs-test//20230320/37c297e5-68b8-48db-9662-0bb3697ea4c2/index.m3u8'
					const isHls = src.toLowerCase().includes('m3u8')
					new window.DPlayer({
						container: item,
						screenshot: true,
						video: {
							url: src,
							type: isHls ? 'hls' : ''
						}
					});
				})
			}, 0)
		}
	}, [visible])
  return (
    <Modal visible={visible} width="80%" title="审核" footer={null} onCancel={onCancel}>
			<Row><div className="verify-modal-content"><ReviewPost { ...data}></ReviewPost></div></Row>
			<Row><Col span={24} style={{ marginBottom: '10px' }}>{ui_QuickMessagePanel()}</Col></Row>
			{
				rejectReasonStatus ? 
				<Row justify='space-between'>
					<Col span={ 17 }>
						<Input.TextArea value={ textAreaValue } onChange={ ( ev: any ) => setTextAreaValue( ev.target.value ) } placeholder='请填写拒绝原因' style={{ resize: 'none'}}></Input.TextArea>
					</Col>
					
					<Col span={ 3 }>
						<Button style={{ width: '100%', height: '100%'}} type='primary' onClick={() => setMsgVisible(!msgVisible)}>快捷理由</Button>
					</Col>
					<Col span={ 3 }>
						<Button style={{ width: '100%', height: '100%'}} type='primary' onClick={ () => { md_postsRejectReason( 'REJECT' ); setRejectReasonStatus( false ); } }>提交</Button>
					</Col>
				</Row>
				: null
			}
			<Row justify='end'>
				<Col style={{ marginTop: '10px'}}>
					<Button loading={rejectLoading} onClick={ md_handleReviewRefush }> { rejectReasonStatus ? '关闭' : '拒绝' }</Button>
					<Button loading={passLoading} onClick={ () => md_handleOk( 'PASS' ) } disabled={ rejectReasonStatus } type='primary' style={{ 'marginLeft': '10px' }}>通过</Button>
				</Col>
			</Row>
		</Modal>
  )
}