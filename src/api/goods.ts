import { newGet, newPost } from '../service';

// 列表
export const getGoodsList: any = (data) => newGet( '/novel/commodity/list', data);

// 新增
export const addGoods: any = (data) => newPost( '/novel/commodity/save', data);

// 编辑
export const editGoods: any = (data) => newPost( '/novel/commodity/update', data);

// 批量删除
export const deleteGoods: any = (data) => {
  const fd = new FormData()
  fd.append('ids', data.ids)
  return newPost('/novel/commodity/batchRemove', fd)
}
// 审核商品
export const auditGoods: any = (data) => newPost( '/novel/commodity/audit', data)


// 列表
export const getRecordList: any = (data) => newGet( '/novel/commodityRecord/list', data);
// 审核
export const auditRecord: any = (data) => newPost( '/novel/commodityRecord/audit', data);
// 批量删除
export const deleteRecord: any = (data) => {
  const fd = new FormData()
  fd.append('ids', data.ids)
  return newPost('/novel/commodityRecord/batchRemove', fd)
}