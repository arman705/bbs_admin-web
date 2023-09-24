import { get, post, newGet, newPost } from '../service';

// 前台管理

/** -------------------------- @水印管理 -------------------------- */
// 获取水印列表
export const watermarkList = () => get('/novel/watermark/list');

// 修改水印
interface IwatermarkUpdate {
  id: string | number;
  name: string;
  url: string;
  size: string | number;
  remark: string;
};
export const watermarkUpdate = (data: IwatermarkUpdate) => newPost(`/novel/watermark/update?id=${data.id}&name=${data.name}&url=${data.url}&size=${data.size}&remark=${data.remark}`);

/** -------------------------- @群发私信 -------------------------- */
// 群发私信
interface IsaveBatch {
  title: string;
  content: string;
  systemType: number;
  receiver?: string;
}
export const saveBatch = (data: IsaveBatch) => post('/system/message/saveBatch', data);

// 群发消息列表
export interface IMessageList {
  offset?: number;
  limit?: number;
  content?: string;
}
export const getMessageList = (params: IMessageList) => get('/system/message/list?type=SYSTEM_MESSAGE', params);

/** -------------------------- @过滤词管理 -------------------------- */
// 获取过滤词列表
export const banList = () => get('/novel/ban/list');

// 新增过滤词
export const banSave = (banName: string) => post(`/novel/ban/save?banName=${banName}`);

// 删除过滤词
export const banRemove = (id: string | number) => post(`/novel/ban/remove?id=${id}`);


/** -------------------------- @签到管理_签到设置 -------------------------- */
// 获取签到配置列表
export const signInConfigList = () => get('/novel/signInConfig/list');

// 修改签到配置
export const signInConfigUpdate = (data: { id: string | number, amount: string | number }) => post(`/novel/signInConfig/update?id=${data.id}&amount=${data.amount}`);


/** -------------------------- @签到管理_签到统计 -------------------------- */
// 无


/** -------------------------- @表情管理 -------------------------- */
interface IemojiPars {
  name: string;
  emoji: string;
  level: string;
};

// 表情包分页
export const emojiList = (params?: any) => newGet('/novel/emoji/list', params);

// 新增表情包
export const emojiSave = (data: IemojiPars) => newPost('/novel/emoji/save', data);

// 修改表情包(修改状态仅传id和status)
export interface IemojiUpdate {
  id: number;
  status: number;
};
export const emojiUpdate = (data: IemojiUpdate) => newPost('/novel/emoji/update', data);

// 删除表情包
export const emojiRemove = (id: string | number) => newPost(`/novel/emoji/remove?id=${id}`);

// 签到曲线图
export const getSignInRecord = (type: string) => newGet(`/novel/signInRecord/countSignInAndLogin?timeType=${type}`);

// 签到对比图
export const getSignContrastInRecord = (params: any) => newGet(`/novel/signInRecord/countSignInByTime`, params);

// 连续签到统计
export const getSignInContinuityRecord = (type: string) => newGet(`/novel/signInRecord/countContinuousSignInAndLogin?timeType=${type}`);
