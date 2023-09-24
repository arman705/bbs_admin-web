import React, { useState, useRef, useEffect } from 'react'
import { Button, InputNumber, Form, Modal, message, Input, Popover, Popconfirm, Tag } from 'antd';
import { editPost, addPosts, getPostDetail, auditPosts } from '../../../api/task'
import ReactQuill from 'react-quill'
import UserPopover from './UserPopover'
import { uploadPicWater } from '../../../api/common'
import { hasPermission } from '../../../utils/utils';
import Permission from '../../../components/Permission';

export default function AddModal ({ type, id, visible, onCancel, onSubmitSuccess }) {
  const hasPerms = hasPermission(type === 'edit' ? 'novel:task:update' : '')
	const editorRef = useRef(null)
  const formRef = useRef(null)
  const reasonRef = useRef(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)
  const [userSelected, setUserSelected] = useState(null)
  const [detailData, setDetailData] = useState({})
  const [popVisible, setPopVisible] = useState(false)
  const modules = {
    toolbar: {
      container: [
        [
          { 'color': [] }, { 'background': [] }, 'bold', 'italic', 'underline', 'strike', 
          'blockquote', 'code-block',
          { 'list': 'ordered'}, { 'list': 'bullet' },
          { 'script': 'sub'}, { 'script': 'super' },
          { 'size': ['small', false, 'large', 'huge'] },
          { 'header': [1, 2, 3, 4, 5, 6, false] },
          { 'direction': 'rtl' },
          { 'indent': '-1'}, { 'indent': '+1' },
          { 'font': [] }, { 'align': [] }, 'clean', 'link', 'image', 'video'
        ]
      ],
      handlers: {
        'image': function (e) {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          // input.setAttribute('multiple', 'multiple')
          input.click()
          input.onchange = () => {
            Array.from(input.files).forEach(async item => {
              const res = await uploadPicWater({
                file: item,
                fileType: 'img'
              })
              if (res.code === 200) {
                const quill = editorRef.current.getEditor();//获取到编辑器本身
                const cursorPosition = quill.getSelection().index;//获取当前光标位置
                quill.insertEmbed(cursorPosition, "image", res.data);//插入图片
                quill.setSelection(cursorPosition + 1);//光标位置加1
              }
            })
          }
        }
      }
    }
  }
  
  useEffect(() => {
    if (visible && (type === 'edit' || type === 'audit')) {
      fillData()
    }
  }, [visible])
  useEffect(() => {
    if (!visible) {
      setUserSelected(null)
      formRef?.current?.resetFields()
    }
  }, [visible])
  async function fillData () {
    const res = await getPostDetail({ id })
    if (res.code === 200) {
      const data = res.data
      setDetailData(data)
      formRef?.current?.setFieldsValue({
        title: data.title,
        sort: data.sort,
        htmlContent: data.htmlContent,
        countdown: data.countdown
      })
      setUserSelected({
        id: data.authorId,
        nickName: data.authorName
      })
    }
  }
  async function onFinish (value) {
    try {
      let res
      setSaveLoading(true)
      value.authorId = userSelected.id
      value.category = 'TASK'
      if (type === 'add') {
        res = await addPosts(value)
      } else {
        res = await editPost({ ...value, id })
      }
      if (res.code === 200) {
        message.success(type === 'add' ? '新增成功' : '修改成功')
        onSubmitSuccess()
      } else {
        message.error(res.msg)
      }
    } finally {
      setSaveLoading(false)
    }
  }
  function submit () {
    formRef?.current?.submit()
  }
  function getRef (el: any) {
		editorRef.current = el;
	}
  async function onPass () {
    setPassLoading(true)
    try {
      const res = await auditPosts({
        id,
        auditState: 'PASS',
      })
      if (res.code === 200) {
        message.success('审核成功')
        onSubmitSuccess()
      }
    } finally {
      setPassLoading(false)
    }
  }
  async function onReject () {
    const reason = reasonRef.current.resizableTextArea.textArea.value
    if (!reason) {
      message.warning('请输入原因')
      return
    }
    setRejectLoading(true)
    try {
      const res = await auditPosts({
        id,
        auditState: 'REJECT',
        rejectReason: reason
      })
      if (res.code === 200) {
        message.success('拒绝成功')
        onSubmitSuccess()
      }
    } finally {
      setRejectLoading(false)
    }
  }
  return (
    <Modal
      width="80%"
      title={`${type === 'add' ? '新增' : '编辑' }任务`}
      visible={ visible }
      onCancel={ onCancel }
      footer={
        type === 'audit' ? <Permission perms="">
          <Button type="primary" onClick={ onPass } loading={ passLoading }>通过</Button>
          <Popconfirm
            icon={null}
            okText="确定"
            cancelText="取消"
            title={
              <Input.TextArea
                ref={reasonRef}
                style={{ width: 240 }}
                maxLength={100}
                placeholder="请输入拒绝原因"
              />
            }
            onConfirm={onReject}>
            <Button type="primary" loading={ rejectLoading }>拒绝</Button>
          </Popconfirm>
        </Permission> : <>
          <Button onClick={ onCancel }>取消</Button>
          <Permission perms="novel:task:update">
            <Button type="primary" onClick={submit} loading={saveLoading}>确定</Button>
          </Permission>
        </>
      }>
      <Form
        ref={formRef}
        labelCol={{ span: 5 }}
        onFinish={onFinish}
        initialValues={{
          title: '',
          sort: 1000,
          countdown: '',
          htmlContent: '',
          authorId: ''
        }}>
        {
          type !== 'add' && <Form.Item label=" " colon={false}>
            <Tag color="processing">{ detailData.comments || 0 } 评论</Tag>
            <Tag color="processing">{ detailData.likeNums || 0 } 收藏</Tag>
            <Tag color="processing">{ detailData.views || 0 } 浏览</Tag>
          </Form.Item>
        }
        <Form.Item
          label="发布用户"
          name="authorId"
          required
          rules={[{
            validator(rule, value, callback) {
              if (userSelected === null) {
                callback('请选择发布用户')
              } else {
                callback()
              }
            }
          }]}>
          <Popover
            placement="bottom"
            title="选择用户"
            trigger="click"
            visible={popVisible}
            onVisibleChange={(visible) => setPopVisible(visible)}
            content={() => {
              return <UserPopover onSelect={value => {
                setUserSelected(value)
                setPopVisible(false)
              }}/>
            }}>
            <Input
              value={userSelected ? userSelected.nickName : ''}
              maxLength={50}
              placeholder="请选择发布用户"
              disabled={type === 'audit' || (type === 'edit' && !hasPerms)}
              readOnly />
          </Popover>
        </Form.Item>
        <Form.Item
          label="任务标题"
          name="title"
          rules={[{ required: true, message: '请输入任务标题' }]}>
          <Input maxLength={50} placeholder="请输入任务标题" disabled={type === 'audit' || (type === 'edit' && !hasPerms)} />
        </Form.Item>
        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入排序' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            disabled={type === 'audit' || (type === 'edit' && !hasPerms)}
            placeholder="请输入排序" />
        </Form.Item>
        <Form.Item
          label="任务周期"
          name="countdown"
          rules={[{ required: true, message: '请输入任务周期' }]}>
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            precision={0}
            disabled={type === 'audit' || (type === 'edit' && !hasPerms)}
            placeholder="请输入任务周期，单位（天）" />
        </Form.Item>
        <Form.Item
          label="任务内容"
          name="htmlContent"
          rules={[{ required: true, message: '请输入排序' }]}>
          <ReactQuill
            theme="snow"
            readOnly={type === 'audit' || (type === 'edit' && !hasPerms)}
            ref={(el) => getRef(el)}
            modules={modules}>
            <div style={{ height: '200px' }}></div>
          </ReactQuill>
        </Form.Item>
      </Form>
    </Modal>
  )
}