import React, { useState, useEffect } from 'react';
import { getQueryString } from '../../utils/utils'
// Api
import { helpfeedback } from '../../api';

// Components
import { SpanClick } from './styles';
import { ModalContentWrap, FeedbackTable, VideoWrap } from './styles';
import SimpTabs from '../../common/SimpTabs';
import Thumbnail from "../../components/Thumbnail";
import { Typography, Button, Modal, Row, Col, Input, message, Image } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons'
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import Permission from '../../components/Permission'



const Report: React.FC = () => {
  const [ feedbackList, setFeedbackList ] = useState( [] );              // 举报列表信息
  const [ feedIndex, setFeedIndex ] = useState<number>( 0 );             // 举报列表索引
  const [ sts, setSts ] = useState<string>(getQueryString('status') || '');                   // 状态 status: 全部 '', 未回复: 0, 已回复: 1
  const [ page, setPage ] = useState( { offset: 0, limit: 10 } );        // 翻页
  const [ total, setTotal ] = useState( 1 );                             // 总条数
  const [ visibleStatus, setVisibleStatus ] = useState<boolean>( false );// Modal 显隐状态
  const [ textVal, setTextVal ] = useState<string|number>( '' );         // 客服回复
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [videoModal, setVideoModal] = useState({
    visible: false,
    src: ''
  })

  /* ---------------- Api start ---------------- */
  // 获取举报列表信息
  useEffect( () => {
    api_userFeedbackList();
  }, [ sts, page.offset, page.limit ] );
  const api_userFeedbackList = async () => {
    await helpfeedback.userFeedbackList( { ...page, status: sts } ).then( ( res: { total: number, rows: [] } ) => {
      let _res = res ? res : { total: 1, rows: [] };
      setFeedbackList( () => [ ..._res.rows ] );
      setTotal( _res.total );
    } );
  };

  useEffect(() => {
    if (visibleStatus) {
      if (getListVal('status') === 1) {
        setTextVal(getListVal('replyContent'))
      } else {
        setTextVal('')
      }
    }
  }, [visibleStatus])

  // 回复反馈
  const api_userFeedbackUpdate = async ( data: { id: string | number, replyContent: string | number } ) => {
    await helpfeedback.userFeedbackUpdate( data ).then( res => {
      setTextVal('');
      api_userFeedbackList();
    } );
  };

  const handleRemove = async (ids: string[]) => {
    const res = await helpfeedback.batchRemove({ ids })
    if (res.code === 200) {
      message.success('删除成功');
      api_userFeedbackList()
    } else {
      message.error(res.msg);
    }
  }
  /* ---------------- Api end ---------------- */



  /* ---------------- Methods start ---------------- */
  // tbs 切换
  const tabChange = ( item: { id: string, name: string } ) => {
    setSts( item.id );
    setPage( () => ( { offset: 0, limit: 10 } ) );
  };

  // 获取列表值
  const getListVal = ( key: string ) => feedbackList[ feedIndex ] ? feedbackList[ feedIndex ][ key ] : -1;

  // 查看 & 回复
  const viewOrReply = ( status: number, index: number ) => {
    setFeedIndex( index );
    setTimeout(() => {
      setVisibleStatus( true );
    }, 0)
  };

  // Modal 关闭 & 提交
  const handleButtonClick = ( status: number ) => {
    if ( status !== 1 ) {
      if ( !textVal ) {
        message.warning( '回复内容不能为空!' );
        return ;
      };
      let data = { id: getListVal( 'id' ), replyContent: textVal };
      api_userFeedbackUpdate( data );
    };
    setVisibleStatus( false );
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }
  
  const singleDel = (record) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        handleRemove([record.id])
      }
    });
  }
  const batchDel = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一项')
      return
    }
    Modal.confirm({
      title: '提示',
      content: '确定删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        // console.log('asdf', record)
        handleRemove(selectedRowKeys)
      }
    });
  }
  const getSuffix = (val: string, toUpperCase = false): string => {
    const suffix = val.substr(val.lastIndexOf('.') + 1)
    return toUpperCase ? suffix.toUpperCase() : suffix.toLowerCase()
  }
  const getFeedbackImg = (val = '') => {
    try {
      return val.slice(1, -1).split(',').map((item, index) => {
        return getSuffix(item) === 'mp4' ? (
          <VideoWrap onClick={() => setVideoModal({
            visible: true,
            src: item
          })}>
            <video src={item} />
            <div class="video-mask">
              <CaretRightOutlined />
            </div>
          </VideoWrap>
        ) : (
          <span style={{ marginRight: '10px' }}>
            <Image
              style={{ objectFit: 'cover' }}
              key={index}
              width={100}
              height={100}
              src={item}
            />
          </span>
        )
      })
    } catch (error) {
      return []
    }
  }
  /* ---------------- Methods start ---------------- */



  /* ---------------- Options start ---------------- */
  // 翻页配置项
  const pagination = {
		showSizeChanger: true,
		showQickJumper: false,
		showTotal: () => `共${ total }条`,
		defaultPageSize: 10,
		current: page.offset + 1,
		pageSize: page.limit,
		total: total,
		onChange: ( current: number, size: number ) => setPage( () => ({ offset: current - 1, limit: size })),
		onShowSizeChange: ( current: any, pageSize: any ) => true
	};

  // tabs 配置项
  const tabs = [
    { name: '全部', id: '' },
    { name: '未回复', id: '0' },
    { name: '已回复', id: '1' }
  ];

  // table 配置项
  const colums = [
    { title: '问题ID', align: 'center', dataIndex: 'id', width: 100 },
    { title: '问题描述', align: 'center', dataIndex: 'content', width: 200 },
    { 
      title: '反馈用户', 
      align: 'center', 
      dataIndex: 'nickname',
      width: 100,
      render ( nickname: string ) {
        return <SpanClick cor={ 'blue' } cur={ false }>{ nickname }</SpanClick>
      }
    },
    { title: '反馈时间', align: 'center', dataIndex: 'createTime', width: 100 },
    { title: '回复时间', align: 'center', dataIndex: 'replyTime', width: 100 },
    { 
      title: '状态', 
      align: 'center', 
      dataIndex: 'status',
      width: 100,
      render ( status: number ) {
        return <SpanClick cor={ status === 1 ? '#5ad286' : '#000' } cur={ false }>{ status === 1 ? '已回复' : '未回复' }</SpanClick>
      }
    },
    { title: '操作人员', align: 'center', dataIndex: 'checkUser', width: 100 },
    { 
      title: '操作', 
      align: 'center', 
      width: 100,
      render ( arg: any, record: any, index: number ) {
        return (
          <>
            { record.status === 1 && <SpanClick cor={ 'blue' } cur={ true } onClick={ () => viewOrReply( record.status, index ) }>查看</SpanClick> }
            { record.status === 0 && <Permission perms="novel:userFeedback:update">
                <SpanClick cor={ 'blue' } cur={ true } onClick={ () => viewOrReply( record.status, index ) }>回复</SpanClick>
              </Permission>
            }
            <Permission perms="novel:userFeedback:batchRemove">
              <SpanClick cor={ 'blue' } cur={ true } style={{ marginLeft: '10px' }} onClick={ () => { singleDel(record) }}>删除</SpanClick>
            </Permission>
          </>
        )
      }
    }
  ];

  // 已回复 CSS
  const replyText: any = { 
    textAlign: 'center', 
    background: '#a896ee', 
    borderRadius: '2px', 
    padding: '2px 0', 
    color: '#fff', 
    marginRight: '9px'
  };
  /* ---------------- Options end ---------------- */

  return (
    <ContentWrapper>
      <Thumbnail />
      <ContentInner>
        <Typography.Title level={5}>问题反馈</Typography.Title>
        <div style={{ display: 'flex' }}>
          <SimpTabs defaultSelected={sts} tabs={ tabs } onChange={ tabChange }/>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}></div>
          <Permission perms="novel:userFeedback:batchRemove">
            <Button type="primary" htmlType="submit" onClick={batchDel}>批量删除</Button>
          </Permission>
        </div>
        <FeedbackTable
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          title=""
          pagination={ pagination }
          scroll={{ x: 200 }}
          columns={ colums }
          dataSource={ feedbackList } />
      </ContentInner>

    {/* 查看 & 回复 Modal 开始 */}
    <Modal maskClosable={false} title={ getListVal( 'status' ) === 1 ? "查看" : "回复" } visible={ visibleStatus } onCancel={ () => setVisibleStatus( false ) } footer={ [ <Button type="primary" onClick={ () => handleButtonClick( getListVal( 'status' ) ) }>{ getListVal( 'status' ) === 1 ? '关闭' : '提交'  }</Button> ] }>
      <Row justify='space-between'>
        <Col span={ 12 }>用户昵称： <SpanClick cor={ '#000' } both={ true }>{ getListVal( 'nickname' ) }</SpanClick></Col>
        <Col span={ 12 }>用户ID：<SpanClick cor={ '#000' } both={ true }>{ getListVal( 'userId' ) }</SpanClick></Col>
      </Row>
      <Row justify='space-between' style={{ margin: '10px 0'}}>
        <Col span={ 12 }>用户状态： <SpanClick cor={ getListVal( 'userStatus' ) === 0 ? '#000' : 'red' } both={ true }>{ getListVal( 'userStatus' ) === 0 ? '正常' : '异常' }</SpanClick></Col>
        <Col span={ 12 }>浏览器：<SpanClick cor={ '#000' } both={ true }>{ getListVal( 'browser' ) }</SpanClick></Col>
      </Row>
      <Row style={{ margin: '10px 0'}}>
        <Col>问题描述：</Col>
        <Col span={ 20 }><ModalContentWrap>{ getListVal( 'content' ) }</ModalContentWrap></Col>
      </Row>
      <Row style={{ margin: '10px 0'}}>
        <Col>反馈图片：</Col>
        <Col span={ 20 }>{getFeedbackImg(getListVal('feedbackImg'))}</Col>
      </Row>
      <Row style={{ margin: '10px 0'}}>
        <Col>客服回复：</Col>
        <Col span={ 20 }> <Input.TextArea value={ textVal } onChange={ ( ev: any ) => setTextVal( ev.target.value ) } disabled={ getListVal( 'status' ) === 1 ? true : false } style={{ resize: 'none', color: 'blue', fontWeight: 'bold' }}/></Col>
      </Row>
      { getListVal( 'status' ) === 1 && <Row justify='end'><Col span={ 20} style={ replyText }>已回复</Col></Row> }
    </Modal>
    {/* 查看 & 回复 Modal 结束 */}

    <Modal
      width="600px"
      title="视频播放"
      visible={videoModal.visible}
      footer={null}
      onCancel={() => setVideoModal(pre => ({...pre, visible: false}))}>
      <video style={{ width: '100%' }} src={videoModal.src} controls />
    </Modal>
   </ContentWrapper>
  )
};

export default Report;