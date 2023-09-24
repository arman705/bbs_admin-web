import React, {useState, useEffect } from 'react';

// Api
import { common, user } from '../../api';

// hooks
import { useTheme } from '../../theme';

// components
import QuickMessagePanel from '../QuickMessagePanel';
import { AlignLeftOutlined } from '@ant-design/icons';
import { Modal, Button, Descriptions, Row, Col, Input, message } from 'antd';
import { DialogWrapper, QuickMessagePanelWrapper, ListWrapper, ActionWrapper } from './styled';


const UserBanPanel = ( props: any ) => {
	let { show, onCancel, onOk, id, updade } = props;
	const {theme} = useTheme();
	const [viewQuickMessage, setViewQuickMessage] = useState(false);
	const [ pars, setPars ] = useState({userId: '', banType: '', cause: ''});
	const [ violateLogs, setViolateLogs ] = useState({ 
		nickName: '', 
		userId: '', 
		status: '', 
		violateNum: 0, 
		violateLogs: [{ banDec: '', banTime: '', banTypeName: '', operator: '' }], 
		banTypes: [ {name: '', value: ''}] }
	);


	
	/* -------------------- Api start -------------------- */
	// 获取用户违规记录
	useEffect( () => {
		api_getViolateLogs( id );
	}, [ id ] );
	const api_getViolateLogs = async ( id: string | number ) => {
		if ( id ) {
		await user.violateLogs( id ).then( res => {
				if(res) {
					setViolateLogs( res );
				}
			})
		};
	};

	// 封禁用户
	const api_banUser = async ( data: any ) => {
		await common.banUser( data ).then( res => {
			updade( true );
			setPars( {userId: '', banType: '', cause: ''} );
		} );
	};

	/* -------------------- Api end -------------------- */



	/* -------------------- Method start -------------------- */
	// 禁言状态
	const handleButtonClick = ( time: string ) => setPars( Object.assign( {}, pars, { banType: time } ) );

	// 封禁原因
	const handleInputValue = ( ev: any ) => setPars( Object.assign( {}, pars, { cause: ev.target.value } ) );

	// 确认封禁
	const modalConfirm = () => {
		setPars( Object.assign( pars, { userId: violateLogs.userId } ) );
		// onOk
		if ( pars.userId !== '' && pars.banType !== '' && pars.cause !== '' ) {
			api_banUser( pars );
		}else{
			message.warning( '禁言和封禁原因必填' );
			return false;
		};
		onOk();
	};

	// 取消封禁
	const handleCancel = () => {
		onCancel();
		setPars( {userId: '', banType: '', cause: ''} );
	};
	/* -------------------- Method end -------------------- */

	return (
		<Modal onOk={ modalConfirm  } cancelText="取消" okText="确认" onCancel={ handleCancel } visible={ show } title="封禁用户">
			<DialogWrapper>

				{/* 用户信息-start */}
				<Descriptions column={2}>
					<Descriptions.Item label="用户昵称">{ violateLogs.nickName}</Descriptions.Item>
					<Descriptions.Item label="用户ID">{ violateLogs.userId }</Descriptions.Item>
					<Descriptions.Item label="用户状态">{ violateLogs.status }</Descriptions.Item>
					<Descriptions.Item label="违规次数">{ violateLogs.violateNum }</Descriptions.Item>
				</Descriptions>
				{/* 用户信息-end */}

				{/* 禁言列表-satrt */}
				<ListWrapper color={theme.colors.black} bg={theme.colors.text2}>
					{ violateLogs.violateLogs.map( ( item, index) => (
						<Row justify="space-between" key={index}>
							<Col span={ 12 }>{ item.banTime }</Col> 
							<Col span={ 4 }>{ item.banTypeName }</Col> 
							<Col span={ 4 }>{ item.banDec }</Col> 
							<Col span={ 4 }>{ item.operator }</Col> 
						</Row>
						)) 
					}
				</ListWrapper>
				{/* 禁言列表-end */}

				{/* 禁言-start */}
				<ActionWrapper>
					<Row justify="start" gutter={20}>
						{ violateLogs.banTypes.map( item => <Col key={ item.value }><Button size="small" onClick={ () => handleButtonClick( item.value ) }>{ item.name }</Button></Col> )	}
					</Row>
				</ActionWrapper>
				{/* 禁言-end */}

				{/* 快捷原因&输入内容-satrt */}
				<ActionWrapper>
					<Row justify="space-between" gutter={5}>
						<Col flex="1"><Input style={ {width: '100%'} } value={ pars.cause } onChange={ ev => handleInputValue( ev ) } placeholder="请输入封禁原因" /></Col>
						<Col flex="none">
							<Button type="primary" size="middle" onClick={ () => setViewQuickMessage(!viewQuickMessage) }>
								<AlignLeftOutlined></AlignLeftOutlined>
								快捷原因
							</Button>
						</Col>
					</Row>
				</ActionWrapper>
				{/* 快捷原因&输入内容-end */}
				
				{/* 快捷回复-start */}
				{
					viewQuickMessage ? 
					<QuickMessagePanelWrapper>
						<QuickMessagePanel quickMsg={ ( msg: string ) => setPars( Object.assign( {}, pars, { cause: msg } ) ) } />
					</QuickMessagePanelWrapper>: 
					null 
				}
				{/* 快捷回复-end */}
				
			</DialogWrapper>
		</Modal>
	)
};

export default UserBanPanel;
