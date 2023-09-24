import React, { useState, useEffect } from "react";

// Api
import { reception } from '../../api';

// Hooks
import { useTheme } from "../../theme";

// Components
import  { WordWrapper } from './styled';
import Thumbnail from "../../components/Thumbnail";
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { Typography, Space, Popover, Button, Modal, Form, Input, message } from 'antd';
import Permission from "../../components/Permission";
import { hasPermission } from "../../utils/utils";
const { Title } = Typography;

interface Iwords {
	id: number;
	banName: string;
	createAt: string;
};

const Words: React.FC = () => {
	const { theme } = useTheme();
	const [ wordsList, setWordsList ] = useState<Iwords[]>([]); 		// 过滤词列表
	const [ viewAdd, setViewAdd ] = useState(false);								// 新增过滤词 Modal 
	const [ banNameValue, setBanNameValue ] = useState<string>(''); // 过滤词

	/* -------------------- Api start -------------------- */

	// 获取过滤词列表
	useEffect( () => {
		api_banList();
	}, [] );
	const api_banList = async () => {
		await reception.banList().then( ( res: { total: number, rows: Iwords[] } ) => {
			let _res = res ? res : { total: 1, rows: [] };
			setWordsList( () => [ ..._res.rows ] );
		} );
	};

	// 新增过滤词
	const api_banSave = async ( banName: string ) => {
		await reception.banSave( banName ).then( res => {
			setBanNameValue( '' );
			api_banList();
		} );
	};

	// 删除过滤词
	const api_banRemove = async ( id: string | number ) => {
		await reception.banRemove( id );
	};

	/* -------------------- Api end -------------------- */



	/* -------------------- Methods start -------------------- */

	// 删除过滤词
	const removeWord = (index: number) => {
		let id =  wordsList.length > 0 ? wordsList[ index ][ "id" ] : '';
		let list = wordsList.slice();
		list.splice( index, 1 );
		setWordsList( () => [ ...list ] );
		api_banRemove( id );
	};

	// 确定新增
	const handleAddOk = () => {
		if ( !banNameValue ) {
			message.warning( '新增内容不能为空!' );
			return ;
		}else{
			api_banSave( banNameValue );
			setViewAdd(false);
		};
	};

	/* -------------------- Methods end -------------------- */

	return (
	<ContentWrapper>
		<Thumbnail />

		{/* 过滤词列表 开始 */}
		<ContentInner>
			<Title level={5}>过滤词管理</Title>
			<Space direction="horizontal" wrap={true} size="large">
				{ 
					wordsList.map( ( item, index ) => {
						if (hasPermission('asf')) {
							return <Popover key={ item.id } content={ <Button type="link" size="small" onClick={ () => removeWord(index) }>删除</Button>	}>
								<WordWrapper bg={theme.colors.bg6} color={theme.colors.white}>{ item.banName }</WordWrapper>
							</Popover>
						} else {
							return <WordWrapper bg={theme.colors.bg6} color={theme.colors.white}>{ item.banName }</WordWrapper>
						}
					})
				}
				<Permission perms="novel:ban:add">
					<Button type="default" onClick={ () => setViewAdd(true) }>+新增</Button>
				</Permission>
			</Space>
		</ContentInner>
		{/* 过滤词列表 结束 */}

		{/* 添加过滤词 Modal 开始 */}
		<Modal title="新增过滤词" okText="确定" cancelText="取消" visible={ viewAdd } onCancel={ () => { banNameValue && setBanNameValue(''); setViewAdd(false)} } onOk={ handleAddOk  }>
			<Form labelCol={ {span: 6} } layout="horizontal">
				<Form.Item label="过滤词" required>
					<Input value={ banNameValue } onChange={ ( ev: any ) => setBanNameValue( ev.target.value ) } />
				</Form.Item>
			</Form>
		</Modal>
		{/* 添加过滤词 Modal 结束 */}

	</ContentWrapper>
	)
};

export default Words;