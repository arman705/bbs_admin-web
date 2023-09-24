import { newGet, newPost } from '../service';
import QS from 'qs'

// 列表
export const getChatroomList: any = (data) => newGet( '/novel/chatroom/list', data);

// 新增
export const addChatroom: any = (data) => newPost( '/novel/chatroom/save', data);

// 编辑
export const editChatroom: any = (data) => newPost( '/novel/chatroom/update', data);

// 批量删除
export const deleteChatroom: any = (data) => {
  const fd = new FormData()
  fd.append('ids', data.ids)
  return newPost('/novel/chatroom/batchRm', fd)
}