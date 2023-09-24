import React, { useState, useEffect } from 'react';

// Api
import { reception, common } from '../../api';

// Components
import { Typography, Button, Image, Switch, Modal, Form, Input, ModalProps, Select, Upload, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Thumbnail from "../../components/Thumbnail";
import Datatable from "../../components/Datatable";
import { ContentInner, ContentWrapper, TableActionLink } from '../../components/Themeable';
import { getBase64 } from '../../utils/file';
import Permission from '../../components/Permission'
import { hasPermission } from '../../utils/utils'

interface IPreview {
  visible?: boolean;
  src?: string;
}

interface IUploadImg {
  value?: any[];
  onChange?: (val: string) => void;
}

const UploadImg: React.FC<IUploadImg> = ({ value, onChange }) => {
  const [preview, setPreview] = useState<IPreview>({
    src: '',
    visible: false
  })

  function handleChange ({ fileList }: any) {
    if (Array.isArray(fileList)) {
      const ps = fileList.map((file: any) => {
        return new Promise((resolve) => {
          if (file.originFileObj && !file.url) {
            getBase64(file.originFileObj).then(url => resolve({
              url,
              ...file
            }))
          } else if (file.url) {
            resolve(file)
          }
        })
      })
      Promise.all(ps).then((fileList: any) => {
        onChange?.(fileList)
      })
    }
  }
  function handlePreview (file: any) {
    setPreview({
      visible: true,
      src: file.url
    })
  }
  return (
    <>
      <Upload
        action={common.uploadImgUrl} 
        listType="picture-card"
        fileList={value}
        multiple
        onPreview={handlePreview}
        onChange={handleChange}
      >
        <PlusOutlined />
      </Upload>
      {/* 用于预览 */}
      <Image style={{ display: 'none' }} preview={{
        ...preview,
        onVisibleChange: (visible) => {
          if (!visible) setPreview({ visible })
        }
      }}/>
    </>
  )
}

interface AddModalProps extends ModalProps {
  onSubmitSuccess: () => void;
  recordData?: any
}

const AddModal: React.FC<AddModalProps> = (props) => {
  const { onSubmitSuccess, recordData, ...modalProps } = props
  const [formRef] = Form.useForm()
  const [loading, setLoading] = useState(false)

  function onSave (values: any) {
    setLoading(true)
    let data: any = {}
    let tips = ''
    let requestApi
    const emoji = values.emoji.map((item: any) => item.response ? item.response.data.fileName : item.name).join(',')
    if (!recordData) {
      data = { ...values, emoji }
      tips = '新增成功'
      requestApi = reception.emojiSave
    } else {
      data = { ...recordData, ...values, emoji }
      tips = '更新成功'
      requestApi = reception.emojiUpdate
    }
    requestApi(data).then((res: any) => {
      if (res.code === 200) {
        message.success(tips)
        onSubmitSuccess?.()
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  function onCancel (e: React.MouseEvent<HTMLElement>) {
    formRef.resetFields()
    modalProps.onCancel && modalProps.onCancel(e)
  }

  useEffect(() => {
    if (recordData) {
      const emojiArr = recordData.emoji.split(',')
      const emojiUrlArr = recordData.emojiUrl.split(',')
      formRef.setFieldsValue({
        ...recordData,
        emoji: emojiArr.map((name: string, index: number) => ({name, url: emojiUrlArr[index]}))
      })
    } else {
      formRef.resetFields()
    }
  }, [modalProps.visible])

  return (
    <Modal
      {...modalProps}
      okText="确定"
      cancelText="取消"
      onOk={formRef.submit}
      onCancel={onCancel}
      okButtonProps={{ loading }}>
      <Form form={formRef} layout="horizontal" labelCol={ {span: 5} } onFinish={onSave}>
        <Form.Item name="name" label="表情包名称" rules={[{ required: true, message: '请输入表情包名称' }]}>
          <Input placeholder="请输入表情包名称"></Input>
        </Form.Item>
        <Form.Item name="emoji" label="表情" rules={[{ required: true, message: '请上传表情包' }]}>
          <UploadImg />
        </Form.Item>
        <Form.Item name="level" label="等级要求" rules={[{ required: true, message: '请选择等级要求' }]}>
          <Select placeholder="请选择等级要求">
            <Select.Option value={0}>不限</Select.Option>
            <Select.Option value={1}>Lv.1</Select.Option>
            <Select.Option value={2}>Lv.2</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface IModalProps {
  visible: boolean;
  title?: string;
  recordData?: any;
}

const Emojis: React.FC = () => {

  const [ emojiList, setEmojiList ] = useState( [] );
  const [ modalProps, setModalProps ] = useState<IModalProps>({
    visible: false,
    title: '',
    recordData: null
  })
  const [tableLoading, setTableLoading] = useState(false)


  /* ---------------- Api start ---------------- */
  // 获取表情包分页
  useEffect( () => {
    api_emojiList();
  }, [] );
  const api_emojiList = () => {
    setTableLoading(true)
    reception.emojiList().then((res: any) => {
      console.log( "表情包", res );
      setEmojiList(res?.data?.rows || []);
    } ).finally(() => {
      setTableLoading(false)
    });
  };

  /* ---------------- Api end ---------------- */



  /* ---------------- Methods start ---------------- */
  // 开关切换
  const switchChange = ( record: reception.IemojiUpdate ) => {
    setTableLoading(true)
    reception.emojiUpdate({
      id: record.id,
      status: record.status === 0 ? 1 : 0
    }).then((res: any) => {
      if (res.code === 200) {
        message.error('更新成功')
        api_emojiList()
      } else {
        message.error(res.msg)
      }
    }).finally(() => {
      setTableLoading(false)
    })
  };
  /* ---------------- Methods end ---------------- */

	/* ---------------- Options start ---------------- */
  const colums = [
    { title: '表情包ID', dataIndex: 'id', align: 'center' },
    { title: '表情包名称', dataIndex: 'name', align: 'center' },
    {
      title: '表情',
      dataIndex: 'emojiUrl',
      align: 'center',
      render (text: string) {
        if (text) {
          return text.split(',').map((src: string) => {
            return <div style={{float: 'left', marginRight: '4px'}}><Image width={22} height={22} preview={false} src={src} /></div>
          })
        }
        return null
      }
    },
    { title: '等级要求', dataIndex: 'level', align: 'center' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      align: 'center',
      render ( text: any, record: any, index: number ) {
        return <Switch disabled={!hasPermission('novel:emoji:edit')} size="small" checked={record.status === 1} onChange={ () => switchChange( record ) }/>
      } 
    },
    {
      title: '操作',
      dataIndex: 'caozuo',
      align: 'center',
      render (text: any, record: any) {
        return (
          <Space direction="horizontal">
            <Permission perms="novel:emoji:edit">
              <TableActionLink onClick={() => onEdit(record)}>编辑</TableActionLink>
            </Permission>
            <Permission perms="novel:emoji:remove">
              <TableActionLink onClick={() => onDel(record.id)}>删除</TableActionLink>
            </Permission>
          </Space>
        )
      },
    }
  ]
  /* ---------------- Options end ---------------- */

  function onEdit (recordData: any) {
    setModalProps({
      visible: true,
      title: '编辑表情包',
      recordData
    })
  }

  function onDel (id: number) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        reception.emojiRemove(id).then(() => {
          message.success('删除成功')
          api_emojiList()
        }).catch(() => {
          message.success('删除失败，请稍候再试')
        })
      }
    });
  }

  function onSubmitSuccess () {
    setModalProps({ visible: false })
    api_emojiList()
  }

  return (
    <>
      <ContentWrapper>
        <Thumbnail />
        <ContentInner>
          <Typography.Title level={5}>表情管理</Typography.Title>
          <Permission perms="novel:emoji:add">
            <Button icon={ <PlusOutlined /> } type="primary" onClick={() => setModalProps({ visible: true, title: '新增表情包', recordData: null })}>新增表情包</Button>
          </Permission>
          <Datatable loading={tableLoading} title="" columns={ colums } dataSource={ emojiList } pagination={false}></Datatable>
        </ContentInner>
      </ContentWrapper>
      <AddModal {...modalProps} onCancel={() => setModalProps({ visible: false })} onSubmitSuccess={onSubmitSuccess} />
    </>
  )
};

export default Emojis;