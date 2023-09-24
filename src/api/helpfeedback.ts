import { get, post, newPost } from '../service';

// 帮助/反馈

interface Iid {
  id: string | number;
};

/** -------------------------- @帮助中心 -------------------------- */

interface IcenterPars {
  title: string;
  solution: string;
  sort: string | number;
  status: string | number;
};

// 新增解决方案
export const helpSave = ( data: IcenterPars ) => post( '/novel/help/save', data );

// 查询帮助中心列表
type TheplList = { limit: string | number, offset: string | number, title?: string };
export const helpList = ( params: TheplList ) => get( '/novel/help/list', params );

// 修改解决方案
export const helpUpdate = ( data: IcenterPars & Iid ) => post( '/novel/help/update', data );

// 删除解决方案
export const helpRemove = ( id: string | number ) => post( `/novel/help/remove?id=${id}` );



/** -------------------------- @问题反馈 -------------------------- */
// 反馈列表
type TuserFeedbackList = { status: string | number }; 
export const userFeedbackList = ( params: TuserFeedbackList ) => get( '/novel/userFeedback/list', params );

// 回复反馈
type TuserFeedbackUpdate = { id: string | number, replyContent: string | number };
export const userFeedbackUpdate = ( data: TuserFeedbackUpdate ) => post( '/novel/userFeedback/update', data );

export const batchRemove: any = ( data: any ) => {
  const fd = new FormData()
  fd.append('ids[]', data.ids.join(','))
  return newPost( '/novel/userFeedback/batchRemove', fd );
}
