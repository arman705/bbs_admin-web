import { get, post, newPost } from '../service';
import env from '../env';


// 公共api

// 上传地址
export const uploadImgUrl = `${env.BASE_API_URL}/common/sysFile/uploadImg`;


/** -------------------------- @WS -------------------------- */


/** -------------------------- @获取头像接口 -------------------------- */
interface IdownloadFile {
  fileName: string;
};
export const downloadFile = ( params: IdownloadFile ) => get( '/common/sysFile/downloadFileUrl', params );




/** -------------------------- @封禁_解封 -------------------------- */
// 封禁用户
interface IbanUser {
  userId: string;
  banType: string,
  cause: string;
};
export const banUser = ( data: IbanUser ) => post( '/novel/user/banUser', data );

// 解封用户
export const userLiftBan = ( id: string | number ) => post( `/novel/user/liftBan/${id}` );




/** -------------------------- @帖子管理 -------------------------- */
// 查看帖子
type TpostsDetail = { id: string | number };
export const postsDetail = ( params: TpostsDetail ) => get( '/novel/posts/detail', params );

// 帖子审核
type TpostsAudit = { id: string | number, auditState: string, rejectReason?: string };
export const postsAudit = ( data: TpostsAudit ) => post( `/novel/posts/audit?id=${data.id}&auditState=${data.auditState}&rejectReason=${data.rejectReason ? data.rejectReason : ''}` );

// 帖子置顶
type TpostsTop = { id: string | number, top: string | number };
export const postsTop = ( data: TpostsTop ) => post( `/novel/posts/top?id=${data.id}&top=${data.top}` );

// 屏蔽帖子
type TpostsBlock = { id: string | number, auditState: string };
export const postsBlock = ( data: TpostsBlock ) => post( `/novel/posts/block?id=${data.id}&auditState=${data.auditState}` );





/** -------------------------- @前台管理_签到设置_____等级勋章管理_任务统计与设置 -------------------------- */
// 获取签到配置列表 & 每日任务列表 & 每周任务
type TforumScoreConfigList = { type: string | number, sort: string | number };
export const forumScoreConfigList = ( params: TforumScoreConfigList ) => get( '/system/forumScoreConfig/list', params );

// 修改签到配置 & 修改任务
type TforumScoreConfigUpdate = { id: number, amount: number };
export const forumScoreConfigUpdate = ( data: TforumScoreConfigUpdate ) => post( '/system/forumScoreConfig/update', data );

export const uploadPicWater = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost('/file-rest/uploadPicWater', fd);
}