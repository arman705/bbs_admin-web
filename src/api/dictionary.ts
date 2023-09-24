import { newGet, newPost } from '../service';

// 列表
export const getDicList: any = (data) => newGet( '/common/dict/list', data);

// 新增
export const addDic: any = (data) => newPost( '/common/dict/save', data);

// 编辑
export const editDic: any = (data) => newGet( '/common/dict/update', data);

// 批量删除
export const deleteDic: any = (data) => {
  const fd = new FormData()
  fd.append('ids[]', data.ids.join(','))
  return newPost('/common/dict/batchRemove', fd)
}