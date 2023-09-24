import { get, post, newGet, newPost } from '../service';

interface Iid {
  id: string | number;
};

/** -------------------------- @用户审核列表 -------------------------- */

// 用户审核信息列表
interface listPar {
  status: string | number;
  pageNum: string | number;
  pageSize: string | number;
};
export const newInfoList = ( params: listPar ) => get( `/novel/newInfo/list?status=${params.status}&offset=${params.pageNum}&limit=${params.pageSize}` );


export const newInfoUpdate = ( { id, status, refuseReason }: any ) => newPost( `/novel/newInfo/update?id=${id}&status=${status}&refuseReason=${refuseReason}` );


/** -------------------------- @会员信息管理 -------------------------- */
// 修改用户信息
interface IuserUpdate extends Iid {
  nickName: string;
  avatar: string;
  userSex: number | string;
  accountBalance: number | string;
  status: number | string;
  vipId: number | string;
  signature: string,
  level: string,
  amount: string;
};
export const userUpdate = ( data: IuserUpdate ) => post( '/novel/user/update', data );

// 获取单个用户信息
export const usertDetail = ( id: string | number ) => get( `/novel/user/detail?id=${id}` );

// 用户列表
interface Ikeyword {
  keyword: string | number;
};
export const userList = async ( params: Ikeyword ) => await get( '/novel/user/list', params );

// 获取所有等级列表
export const levelConfigAll = () => get( '/novel/levelConfig/all' );




/** -------------------------- @封禁 -------------------------- */
// 获取快捷回复列表
export const replyList = () => newGet( '/novel/reply/list' );

// 新增快捷回复
interface IreplySave {
  reply: string;
};
export const replySave: any = ( data: IreplySave ) => newPost( `/novel/reply/save?reply=${data.reply}` );

// 删除快捷回复
export const replyDel = ( id: string ) => newPost( `/novel/reply/del?id=${id}` );

// 获取用户违规记录
export const violateLogs: any = ( id: string | number ) => newGet( `/novel/user/violateLogs/${id}` );





/** -------------------------- @会员信息统计 -------------------------- */
// 每日用户
export const userDayTableSta = ( time: string ) => post( `/novel/user/dayTableSta?date=${time}` );

// 每月用户
export const userMonthTableSta = ( time: string ) => post( `/novel/user/monthTableSta?date=${time}` );

// 年份用户统计
export const userYearTableSta = ( time: string ) => post( '/novel/user/yearTableSta' );

// 用户登录设备
export const ageAnalyze = () => post( '/novel/user/ageAnalyze' );

// 用户设备
export const deviceAnalyze = () => post( '/novel/user/deviceAnalyze' );

// 用户性别统计
export const userSexAnalyze = () => post( '/novel/user/sexAnalyze' );




/** -------------------------- @评论管理 -------------------------- */
interface Iuserid_isDelete {
  userId: string | number;
  isDelete: string | number;
};

// 获取对应评论
export const commentDetail = ( params: Iid ) => get( '/system/comment/detail', params ); 

// 批量删除帖子评论 data: [ 1, 2 ]
export const batchRemove = ( data: string[] ) => post( '/system/comment/batchRemove', data );

// 删除帖子评论
export const commentRemove = ( id: string | number ) => post( `/system/comment/removeid=${id}` );

// 修改评论
export const commentUpdate = ( data: { id: number, isDelete: number }) => post( '/system/comment/update', data );

// 新增评论
interface IcommentSave extends Iuserid_isDelete {
  replyId: string | number;
  replyReplyId: string | number;
  postsId: string | number;
  content: string;
};
export const commentSave = ( data: IcommentSave ) => post( '/system/comment/save', data );

// 获取用户评论列表（分页）
interface IcommentList extends Iuserid_isDelete {
  pageSize: string | number;
  pageNum: string | number;
};
export const commentList = ( params: IcommentList ) => get( '/system/comment/list', params );

// 批量屏蔽评论
export const batchBlock = ( data: React.Key[] | string[] ) => post( '/system/comment/batchBlock', data );

// 批量恢复评论
export const batchRecover = ( data: React.Key[] | string[] ) => post( 'system/comment/batchRecover', data );




/** -------------------------- @帖子管理 -------------------------- */
// 查询帖子分页列表
export const postsPage = () => get( '/novel/posts/page' );





/** -------------------------- @用户资料管理 -------------------------- */
// 用户资料审核列表 
export const userDataList = ( params: any ) => newGet( '/novel/newInfo/list', params );

// 单个审核通过/拒绝
export const userDataPass = (data) => {
  let query = '?'
  Object.keys(data).forEach(key => (query += `${key}=${data[key]}&`))
  return newPost( `/novel/newInfo/update${query}` )
};
// 批量审核通过
export const batchPass = (data) => {
  const fd = new FormData()
  data.ids.forEach(id => {
    fd.append('ids', id)
  })
  return newPost( '/novel/newInfo/batchPass', fd);
};
// 批量拒绝
export const batchRefuse = (data) => {
  const fd = new FormData()
  data.ids.forEach(id => {
    fd.append('ids', id)
  })
  return newPost( '/novel/newInfo/batchRefuse', fd);
};



// 审核拒绝
interface IuserDataReject {
  id: string;
  rejectReason: string;
};
export const userDataReject = ( data: IuserDataReject ) => post( `/novel/userdata/reject?id=${data.id}&rejectReason=${data.rejectReason}` );




/** -------------------------- @用户记录 -------------------------- */
interface Inum_size {
  pageNum: string | number;
  pageSize: string | number;
};

interface IuserId_keyword {
  userId: string | number;
  keyword: string;
};
// 查询用户登录记录
export const loginLog = ( params: IuserId_keyword & Inum_size ) => get( '/novel/user/loginLog', params );

// 查询用户观看记录
export const viewLog = ( params: IuserId_keyword & Inum_size ) => get( '/novel/user/viewLog', params );

// 查询用户聊天记录
export const chatLog = ( params: IuserId_keyword & Inum_size ) => get( '/novel/user/chatLog', params );

// 查询聊天
interface IgetUserChat {
  id: string | number;
  order: string | number;
};
export const getUserChat = ( params: Inum_size & IgetUserChat ) => newGet( '/system/message/getUserChat', params );

export const getChatDetail = (id: number | string) => newGet(`/system/message/detail?id=${id}`)

export const getUserMenu = (): any => newPost('/user/menu')