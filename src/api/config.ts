import { newGet, newPost } from '../service';

// 列表
export const getConfigList: any = (data) => newGet( '/novel/config/list', data);

// 新增
export const addConfig: any = (data) => newPost( '/novel/config/save', data);

// 编辑
export const editConfig: any = (data) => newPost( '/novel/config/update', data);

// 批量删除
export const deleteConfig: any = (data) => {
  const fd = new FormData()
  fd.append('ids[]', data.ids.join(','))
  return newPost('/novel/config/batchRemove', fd)
}