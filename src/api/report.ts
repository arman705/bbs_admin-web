import { get, post, newPost } from '../service';

// 举报管理

/** -------------------------- @举报分类 -------------------------- */
// 举报分类列表
export const reportClassList = () => get( '/novel/reportClass/list' );

// 新增举报分类
interface IreportClassSave {
  reportClassName: string;
};
export const reportClassSave = ( data: IreportClassSave ) => post( '/novel/reportClass/save', data );

// 修改举报分类
interface IreportClassUpdate {
  reportClassId: number;
  status: number;
};
export const reportClassUpdate = ( data: IreportClassUpdate ) => post( '/novel/reportClass/update', data );

// 删除举报分类
interface IreportClassRemove {
  reportClassId: string | number;
};
export const reportClassRemove = ( id: IreportClassRemove ) => post( `/novel/reportClass/remove?reportClassId=${id}`);



/** -------------------------- @举报审核 -------------------------- */
// 举报信息列表
interface IreportList {
  status: string | number;
};
export const reportList = ( params: IreportList ) => get( '/novel/report/list', params );

// 举报审核
interface IreportUpdate {
  id: string | number;
  isLegal: string | number;
};
export const reportUpdate = ( data: IreportUpdate ) => newPost( '/novel/report/update', data );

export const batchRemove: any = ( data: any ) => {
  const fd = new FormData()
  fd.append('ids[]', data.ids.join(','))
  return newPost( '/novel/report/batchRemove', fd );
}
