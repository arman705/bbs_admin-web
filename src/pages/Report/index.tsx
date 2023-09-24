import React, { useState, useEffect } from 'react';

// Api
import { report } from '../../api';

// Components

import SimpTabs from '../../common/SimpTabs';
import Thumbnail from "../../components/Thumbnail";
import Datatable from "../../components/Datatable";
import { Typography, Button, Modal, Row, Col, message, Image  } from 'antd';
import { ContentInner, ContentWrapper } from '../../components/Themeable';
import { SpanClick, ReportWrap, SubReportWrpa, SubReportBtn, VideoWrap } from './styled';
import { CaretRightOutlined } from '@ant-design/icons'
import Permission from '../../components/Permission'


const Report: React.FC = () => {

  const [ status, setStatus ] = useState<string>('');
  const [ reportList, setReportList ] = useState( [] );
  const [ reportIndex, setReportIndex ] = useState<number>( 0 );

  const [ page, setPage ] = useState( { pageNum: 1, pageSize: 10 } );
  const [ total, setTotal ] = useState<number>( 0 );

  const [ reportStatus, setReportStatus ] = useState<boolean>( false );
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [videoModal, setVideoModal] = useState({
    visible: false,
    src: ''
  })


/* ---------------- Api start ---------------- */
// 获取举报列表信息
useEffect( () => {
  api_reportList();
}, [ status, page.pageNum, page.pageSize ] );
const api_reportList = async () => {
  const offset = (page.pageNum - 1) * page.pageSize
  await report.reportList( { status, offset, limit: page.pageSize } ).then( ( res: { total: number, rows: [] }) => {
    let _res = res ? res : { total: 1, rows: [] };
    setReportList( () => [ ..._res.rows ] );
    setTotal( _res.total );
  } );
};

// 举报审核
const api_reportUpdate = ( data: { id: string | number, isLegal: string | number }) => {
  report.reportUpdate( data ).then( res => {
    if (res.code === 200) {
      api_reportList();
    } else {
      message.error(res.msg)
    }
  } );
};

const handleRemove = async (ids: string[]) => {
  const res = await report.batchRemove({ ids })
  if (res.code === 200) {
    message.success('删除成功');
    api_reportList()
  } else {
    message.error(res.msg);
  }
}
/* ---------------- Api end ---------------- */



/* ---------------- Methods start ---------------- */
// tbs 切换
const tabChange = ( item: { id: string, name: string, type?: string } ) => {
  setStatus( item.id );
  setPage( () => ( { pageNum: 1, pageSize: 10 } ) );
  setTotal( 1 );
};

// 获取单条列表数据
const returnName = ( key: string ) => {
  return reportList[ reportIndex ] ? reportList[ reportIndex ][ key ] : -1;
};

const handelRepostClick = ( id: number, isLegal: number ) => {
  api_reportUpdate( { id, isLegal } );
  setReportStatus( false );
}
/* ---------------- Methods start ---------------- */



/* ---------------- Ui start ---------------- */

const switchBtn = ( isLegal: number, status: number ) => {
  // if ( isLegal === 0 && status === 0 ) {
  //   return <SubReportBtn onClick={ () => handelRepostClick( returnName('reportClassId'), 0 ) } cor={ '#ooo' } bg={ '#ddd' } mt={ true } >未违规</SubReportBtn>
  // }else if ( isLegal === 1 && status === 0 ) {
  //   return (
  //     <>
  //       <SubReportBtn onClick={ () => handelRepostClick( returnName('reportClassId'), 1 ) } cor={ '#fff' } bg={ 'blue' }>违规属实，删除帖子</SubReportBtn>
  //       <SubReportBtn onClick={ () => handelRepostClick( returnName('reportClassId'), 0 ) } cor={ '#ooo' } bg={ '#ddd' } mt={ true }>未违规</SubReportBtn>
  //     </>
  //   )
  // }else if ( isLegal === 0 && status === 1 ) {
  //   return <SubReportBtn cor={ '#ooo' } bg={ '#ddd' } mt={ true }>未违规，已处理</SubReportBtn>
  // }else{
  //   return <SubReportBtn cor={ '#ooo' } bg={ '#ddd' } mt={ true }>违规已处理</SubReportBtn>
  // }
  // if (isLegal === null) {
  //   return (
  //     <>
  //       <SubReportBtn onClick={ () => handelRepostClick( returnName('reportClassId'), 1 ) } cor={ '#fff' } bg={ 'blue' }>违规属实，删除帖子</SubReportBtn>
  //       <SubReportBtn onClick={ () => handelRepostClick( returnName('reportClassId'), 0 ) } cor={ '#ooo' } bg={ '#ddd' } mt={ true }>未违规</SubReportBtn>
  //     </>
  //   )
  // } else {
  //   if (isLegal === 0 && status === 1) {
  //     return <SubReportBtn cor={ '#ooo' } bg={ '#ddd' } mt={ true }>未违规，已处理</SubReportBtn>
  //   }
  //   return <SubReportBtn cor={ '#ooo' } bg={ '#ddd' } mt={ true }>违规已处理</SubReportBtn>
  // }
  // 未违规
  if (isLegal === 0 || isLegal === null) {
    // 未处理
    if (status === 0) {
      return (
        <>
          <SubReportBtn onClick={ () => handelRepostClick( returnName('id'), 1 ) } cor={ '#fff' } bg={ 'blue' }>违规属实，删除帖子</SubReportBtn>
          <SubReportBtn onClick={ () => handelRepostClick( returnName('id'), 0 ) } cor={ '#ooo' } bg={ '#ddd' } mt={ true }>未违规</SubReportBtn>
        </>
      )
    } else { // 已处理
      return <SubReportBtn cor={ '#ooo' } bg={ '#ddd' } mt={ true }>未违规，已处理</SubReportBtn>
    }
  } else { // 已处理违规
    return <SubReportBtn cor={ '#ooo' } bg={ '#ddd' } mt={ true }>违规已处理</SubReportBtn>
  }
};

const onSelectChange = (newSelectedRowKeys) => {
  setSelectedRowKeys(newSelectedRowKeys);
}

const delReport = (record) => {
  Modal.confirm({
    title: '提示',
    content: '确定删除吗',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      console.log('asdf', record)
      handleRemove([record.id])
    }
  });
}
const batchDelReport = () => {
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
    return val.split(',').map((item, index) => {
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

/* ---------------- Ui end ---------------- */


/* ---------------- Options start ---------------- */
// tabs 配置项
const tabs = [
  { name: '全部', id: '',  },
  { name: '未处理', id: '0' },
  { name: '已处理', id: '1',}
];

// table 翻页
const pagination = {
  showSizeChanger: true,
  showQickJumper: false,
  showTotal: () => `共${ total }条`,
  defaultPageSize: 10,
  current: page.pageNum,
  pageSize: page.pageSize,
  total: total,
  onChange: ( current: number, size: number ) => setPage( () => ({ pageNum: current, pageSize: size })),
  onShowSizeChange: ( current: any, pageSize: any ) => true
};

// table 配置项
const colums = [
  { title: '记录ID', dataIndex: 'id', align: 'center', width: 100 },
  { title: '举报理由', dataIndex: 'reportClassName', align: 'center', width: 100 },
  { 
    title: '被举报帖子', 
    dataIndex: 'postsTitle', 
    align: 'center',
    width: 180,
    render ( text: any, record: any, index: number ) {
      return <SpanClick cor={ 'blue' } cur={ false }>{ record.postsTitle }</SpanClick>
    }
  },
  { 
    title: '反馈用户', 
    dataIndex: 'nickname', 
    align: 'center',
    width: 100,
    render ( text: any, record: any, index: number ) {
      return <SpanClick cor={ 'blue' } cur={ false }>{ record.nickname }</SpanClick>
    }
  },
  { title: '举报时间', dataIndex: 'createAt', align: 'center', width: 100 },
  { 
    title: '是否违规', 
    dataIndex: 'isLegal', 
    align: 'center',
    width: 100,
    render ( text: any, record: any, index: number ) {
      return <SpanClick cor={ record.isLegal === 1 ? 'red' : '#000' } cur={ false }>{ record.isLegal === 0 ? '-' : '违规' }</SpanClick>
    } 
  },
  { 
    title: '状态', 
    dataIndex: 'status', 
    align: 'center',
    width: 80,
    render ( text: any, record: any, index: number ) {
      return <SpanClick cor={ record.status === 1 ? 'red' : '#000' } cur={ false }>{ record.status === 1 ? '已处理' : '未处理' }</SpanClick>
    } 
  },
  { title: '操作人员', dataIndex: 'checkUser', align: 'center', width: 100 },
  { 
    title: '操作',  
    align: 'center', 
    width: 120,
    render ( text: any, record: any, index: number ) {
      // isLegal: 0 未违规 1 违规
      // status : 0 未处理 1 处理
      if ( record.isLegal === 0 && record.status  ) {

      }
      return (
        <>
          { record.status === 1 && <SpanClick cor={ 'blue' } cur={ true } onClick={() => { setReportIndex( index ); setReportStatus( true ); }}>查看</SpanClick> }
          { record.status === 0 && <Permission perms="novel:report:update">
              <SpanClick cor={ 'blue' } cur={ true } onClick={() => { setReportIndex( index ); setReportStatus( true ); }}>审核</SpanClick>
            </Permission>
          } 
          <Permission perms="novel:report:remove">
            <SpanClick cor={ 'blue' } cur={ true } style={{ marginLeft: '10px' }} onClick={ () => { delReport(record) }}>删除</SpanClick>
          </Permission>
        </>
      )
    } 
  }
];

/* ---------------- Options end ---------------- */



  return (
    <ContentWrapper>
      <Thumbnail />
      <ContentInner>
        <Typography.Title level={5}>举报管理</Typography.Title>
        <div style={{ display: 'flex' }}>
          <SimpTabs tabs={ tabs } onChange={ tabChange }/>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}></div>
          <Permission perms="novel:report:remove">
            <Button type="primary" htmlType="submit" onClick={() => batchDelReport()}>批量删除</Button>
          </Permission>
        </div>
        <Datatable
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          title=""
          columns={ colums }
          dataSource={ reportList }
          scroll={{ x: 200 }}
          pagination={ pagination }/>
      </ContentInner>

      {/* 查看 & 审核 Modal 开始 */}
      <Modal width="600px" title="举报详情" visible={ reportStatus } closable={ false } footer={[ <Button onClick={ () => setReportStatus( false ) }>关闭</Button> ]}>
        <Row justify='space-between'>
          <Col span={ 12 }>举报用户： <SpanClick cor={ 'blue' } cur={ false }>{ returnName( 'nickname' ) }</SpanClick></Col>
          <Col span={ 12 }>被举报用户：<SpanClick cor={ 'blue' } cur={ false }>{ returnName( 'reportNickname' ) }</SpanClick></Col>
        </Row>
        <Row><Col>被举报帖子：<SpanClick cor={ 'blue' } cur={ false }>{ returnName( 'postsTitle' ) }</SpanClick></Col></Row>
        <Row><Col>举报时间：<SpanClick cor={ '#000' } cur={ false } both={ true }>{ returnName( 'createAt' ) }</SpanClick></Col></Row>
        <Row><Col>举报理由：<SpanClick cor={ '#000' } cur={ false } both={ true }>{ returnName( 'reportClassName' ) }</SpanClick></Col></Row>
        <Row>
          <Col>举报描述：</Col>
          <Col span={ 20 }>
            <ReportWrap>
              { returnName( 'reason' ) }
            </ReportWrap>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col>举报描述：</Col>
          <Col span={ 20 }>
            {getFeedbackImg(returnName('imgs'))}
          </Col>
        </Row>
        {/* <Row>

        </Row> */}
        <SubReportWrpa>
          {
            switchBtn( returnName( 'isLegal' ), returnName( 'status' ) ) 
          }
          
        </SubReportWrpa>

      </Modal>
      {/* 查看 & 审核 Modal 结束 */}
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