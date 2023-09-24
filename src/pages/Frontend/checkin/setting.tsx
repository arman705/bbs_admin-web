import React, { useState, useEffect } from 'react';

import { reception } from '../../../api';
import { SpanClick } from '../styled';
import Thumbnail from "../../../components/Thumbnail";
import Datatable from "../../../components/Datatable";
import { ContentInner, ContentWrapper } from '../../../components/Themeable';
import { Typography, Modal, Form, Input, message } from 'antd';

const Setting: React.FC = () => {

	const [ signList, setSignList ] = useState<any[]>([]);
	const [ signIndex, setSignIndex ] = useState<number>( 0 );
	const [ signValue, setSignValue ] = useState<string>('');
	const [ visibleStatue, setVisibleStatus ] = useState<boolean>( false );

	/* ---------------- Api start ---------------- */

	// 获取签到设置表
	useEffect( () => {
		api_signInConfigList();
	}, [] );
	
	const api_signInConfigList = async () => {
		await reception.signInConfigList().then( ( res: { total: number, rows: any[] } ) => {
			let _res = res ? res : { total: 1, rows: [] };
			setSignList( () => [ ..._res.rows ] );
		} );
	};

	// 修改签到设置
	const api_signInConfigUpdate = async ( data: { id: number | string, amount: number | string }) => {
		await reception.signInConfigUpdate( data ).then( res => {
			api_signInConfigList();
		} );
	};

	/* ---------------- Api end ---------------- */


	/* ---------------- Methods start ---------------- */

	// 编辑
	const handleEditClick = ( index: number ) => {
		setSignIndex( index );
		setVisibleStatus( true );
		setSignValue(signList[index].amount)
	};

	// 确定
	const handleConfirmClick = () => {
		if ( !signValue ) {
			message.warning( '内容不能为空!' );
			return ;
		}else{
			if ( isNaN( parseInt( signValue ) ) ) {
				message.warning( '请输入数字!' );
				setSignValue('');
				return ;
			}else{
				let id = signList[ signIndex ] ? signList[ signIndex ][ "id" ] : '';
				api_signInConfigUpdate( { id, amount: signValue } );
			};
		};
		setVisibleStatus( false );
		setSignValue( '' );
	};


	/* ---------------- Methods end ---------------- */


	/* ---------------- Options start ---------------- */	

	// table 配置项
	const colums = [
		{ title: '签到日', align: 'center', dataIndex: 'signDay' },
		{ 
			title: '签到奖励', 
			align: 'center',
			dataIndex: 'amount',
			render ( amount: string | number ) {
				return <SpanClick cor={ "#000" }>{ `${ amount } 虎头币` }</SpanClick>
			}
		},
		{ 
			title: '操作',  
			align: 'center',
			render ( arg: any, record: any, index: number ) {
				return <SpanClick cor={ "blue" } key={ record.id }  onClick={ () => handleEditClick( index ) }>编辑</SpanClick>
			}
		}
	];

	/* ---------------- Options end ---------------- */	

	return (
		<ContentWrapper>
			<Thumbnail />
			<ContentInner>
				<Typography.Title level={5}>签到设置</Typography.Title>
				<Datatable bordered title="" columns={ colums } dataSource={ signList } pagination={ false } ></Datatable>
			</ContentInner>

			{/* 编辑 Modal 开始 */}
			<Modal visible={ visibleStatue } title="编辑" okText="确定" cancelText="取消" onOk={ handleConfirmClick } onCancel={ () => { signValue && setSignValue( '' ); setVisibleStatus( false );} }>
				<Form layout="horizontal" labelCol={ {span: 5} }>
					<Form.Item label="签到日" >
						<Input value={ signList[ signIndex ] ? signList[ signIndex ][ "signDay" ] : '' } disabled />
					</Form.Item>
					<Form.Item label="签到奖励" required>
						<Input value={ signValue } onChange={ ( ev: any ) => setSignValue( ev.target.value ) } addonAfter="虎头币" />
					</Form.Item>
				</Form>
			</Modal>
			{/* 编辑 Modal 结束 */}

		</ContentWrapper>
	)
};

export default Setting;