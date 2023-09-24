import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Cascader, Button, Table } from 'antd'
import { plate, posts } from '../../api';

export default function PostDialog(props) {
  const [ pars, setPars ] = useState( () => ( { auditState: 'PASS', typeName: '', title: '', top: ''  } ) );
  const [ plateNameList, serPlateNameList ] = useState<{ value: string; label: string; isLeaf: boolean }[]>([]);
  const [ confirmStaus, setConfirmStatus ] = useState<boolean>( false );
  const [ page, setPage ] = useState<any>({ offset: 0, limit: 10 });
  const [ postsList, setPostsList ] = useState([]);
  const [ total, setTotal ] = useState<number>(1);
  const [ loading, setLoading ] = useState<boolean>(false);

  const handleSearchTypeName = ( list: string[] ) => {
		if ( list.length > 1 ) {
			setPars( prevState => ({ ...prevState, typeName: list[ 1 ] }) )
		};
	};

  // 所属板块二级列表
	const md_getPlateName = ( list: any[] ) => {
		if ( list.length === 0 ) return [ { value: '', labal: '' } ];
		let _list:{ value: string; label: string }[] = [];
		for( let i = 0; i < list.length; i++ ) {
			_list.push( { value: list[i]["name"], label: list[i]["name"] });
		};
		return _list;
	}
  // 获取所属板块二级名称列表
	const api_articleTypeList = async ( item: { value: string; label: string; isLeaf: boolean; children: any[] } ) => {
		await plate.articleTypeList({ offset: 0, limit: 100000, scope: item.label }).then( res => {
			let { rows} = res ? res : { rows: [] };
			item.children = md_getPlateName( rows );
			serPlateNameList([...plateNameList]);
		} );
	};

  const LazyOptions = () => {
		const onChange = (value: any[], selectedOptions: any ) => {
			handleSearchTypeName( value )
		};
		const onCascaderClear = () => {
			setPars( prevState => ({ ...prevState, typeName: '' }) )
		}
		const loadData = (selectedOptions: any) => {
			const targetOption = selectedOptions[selectedOptions.length - 1];
			targetOption.loading = true;
			// load options lazily
			setTimeout(() => {
				targetOption.loading = false;
				api_articleTypeList( targetOption );
			}, 500);
		};
		return <Cascader options={plateNameList} loadData={loadData} onChange={onChange } changeOnSelect placeholder="请选择板块" onClear={onCascaderClear} />;
	};
  // 查找帖子-判断内容是文字还是id
	const md_queryVlue = ( values: any ) => {
		let param = {};
		let { inputValue } = values;
		if ( inputValue === '' || inputValue === undefined ) {
			param = { id: '', value: '' };
		}else{
			if ( isNaN( parseInt( inputValue ) )){
				param = { value: inputValue };
			}else{
				param = { id: inputValue };
			};
		};
		setPars( () => ( { ...pars, ...param } ) );
	};
  // 查找帖子
	const handleSearch = ( value: string ) => {
		let isNum = new RegExp("[0-9]+");
		let idOrTitle = { title: '', id: '' };
		if ( isNum.test( value ) ) {
			idOrTitle.id = value;
		}else{
			idOrTitle.title = value;
		};
		setPars( ( prevState ) => ({ ...prevState, ...idOrTitle }) );
	};
  // 所属板块下拉列表-typeName
	const md_getScopeName = ( list: string[] ) => {
		let _list: { value: string; label: string; isLeaf: boolean }[] = [];
		for( let i = 0; i < list.length; i++ ){
			_list.push( {  value: list[i].scope, label: list[ i ].scope, isLeaf: false } );
		};
		serPlateNameList( () => [ ..._list ] );
	};
  const api_getScope = async () => {
		await plate.getScope().then( (res: string[]) => {
			md_getScopeName( res );
		} );
	}

  const columns = [
		{ title: '帖子ID', align: 'center', dataIndex: 'id' }, 
		{ title: '帖子标题', align: 'center', dataIndex: 'title' }, 
		{ title: '所属板块', align: 'center', dataIndex: 'typeName', width: 100 }, 
		{ title: '发布时间', align: 'center', dataIndex: 'createAt' }, 
		{
			title: '操作',
			align: 'center',
			render(text:any , record: any, index: number ) {
        return (
          <>
            <Button type="link" onClick={() => {
              props.onSelect(record)
              props.onCancel()
            }}>选择</Button>
          </>
        )
      }
		}
	];
  const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		defaultPageSize: 10,
		current: page.offset === 0 ? 1 : (page.offset / 10) + 1,
		pageSize: page.limit,
		total: total,
		onChange: ( current: number, size: number ) => setPage( () => ({ offset: (current-1)*size, limit: size })),
		onShowSizeChange: ( current: any, pageSize: any ) => true
	};
  const api_getPostsList = async () => {
		let params = { ...page, ...pars };
    setLoading(true)
		await posts.getPostsList( params ).then( ( res: { rows: [], total: number } ) => {
			let { rows, total } = res ? res : { rows: [], total: 1 };
			setPostsList( () => [ ...rows ] );
			setTotal( total );
			confirmStaus && setConfirmStatus( !confirmStaus );
		} );
    setLoading(false)
	};


  // 获取板块列表
	useEffect( () => {
		api_getScope();
	}, [] );
  useEffect( () => {
		confirmStaus && api_getPostsList();
	} , [ confirmStaus ] )
  useEffect( () => {
		api_getPostsList();
	}, [ page.offset, page.limit, pars.auditState, pars.top, pars.title, pars.typeName ] )
  return (
    <Modal
      width="80%"
      title="选择推荐帖子"
      visible={ props.visible }
      onCancel={ props.onCancel }>
      <Form layout="inline" onFinish={ md_queryVlue } style={{ margin: '10px 0' }}>
				<Form.Item label="查找帖子" name="inputValue"><Input placeholder="帖子标题或ID" onChange={ (ev: any ) => handleSearch( ev.target.value ) }/></Form.Item>
				<Form.Item label="所属板块">{ LazyOptions() }</Form.Item>
				<Form.Item><Button type="primary" htmlType="submit" onClick={ () => { setConfirmStatus( true ) } }>确定</Button></Form.Item>
			</Form>
      <Table
				scroll={{x: 200}}
				bordered
        loading={loading}
				pagination={ pagination }
				dataSource={postsList}
				columns={columns as any}></Table>
    </Modal>
  )
}
