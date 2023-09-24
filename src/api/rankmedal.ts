import { get, post, newGet, newPost } from '../service';

// '等级/勋章管理';

interface Iid {
  id: string | number;
};

interface Iimg_name {
  imgUrl: string;
  name: string;
};



/** -------------------------- @勋章设置_等级勋章 -------------------------- */
// 获取等级勋章列表
export const medalLevelList = (name: string) => newGet(`/novel/medalLevel/list?name=${name}`);

// 新增等级勋章
interface ImedalLevelSave extends Iimg_name {
  levelId: string | number;
  description: string;
};
export const medalLevelSave = (data: ImedalLevelSave) => newPost('/novel/medalLevel/save', data);

// 修改等级勋章
interface ImedalLevelUpdate extends Iid, Iimg_name, ImedalLevelSave { };
export const medalLevelUpdate = (data: ImedalLevelUpdate) => newPost('/novel/medalLevel/update', data);

// 删除等级勋章
export const medalLevelRemove = (id: number) => newPost(`/system/medalInfo/remove?id=${id}`);





/** -------------------------- @勋章设置_活跃勋章 -------------------------- */
interface Iid_type_num_des {
  article_type_id: string | number;
  operate_type: string | number;
  operate_num: string | number;
  description: string;
};

// 获取活跃勋章列表
export const medalActiveList = (name: string) => newGet(`/novel/medalActive/list?name=${name}`);

// 新增活跃勋章
interface ImedalActiveSave extends Iimg_name, Iid_type_num_des { };
export const medalActiveSave = (data: ImedalActiveSave) => newPost('/novel/medalActive/save', data);

// 修改活跃勋章
interface ImedalActiveUpdate extends Iimg_name, Iid, Iid_type_num_des { };
export const medalActiveUpdate = (data: ImedalActiveUpdate) => newPost('/novel/medalActive/update', data);

// 删除活跃勋章
export const medalActiveRemove = (id: number) => newPost(`/novel/medalActive/remove?id=${id}`);





/** -------------------------- @论坛等级配置 -------------------------- */
// 获取论坛等级配置列表
export const levelConfigList = (params: any) => newGet('/novel/levelConfig/list', params);

// 修改论坛等级配置
interface IlevelConfigUpdate extends Iimg_name, Iid {
  level: string;
  influence_amount: string | number;
  reward_desc?: string | number;
};
export const levelConfigUpdate = (data: any) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost('/novel/levelConfig/update', fd);
}
export const levelConfigAdd = (data: any) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost('/novel/levelConfig/save', fd);
}
export const levelConfigRemove = (data: any) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost('/novel/levelConfig/remove', fd);
}





/** -------------------------- @头像框设置 -------------------------- */
interface Ihead_name_status {
  headUrl: string;
  name: string;
  status: string | number;
};

// 获取头像框列表
export const avatarFrameList = (params: any) => newGet('/novel/avatarFrame/list', params);

// 新增头像框
interface IavatarFrameSave extends Ihead_name_status { };
export const avatarFrameSave = (data: IavatarFrameSave) => newPost('/novel/avatarFrame/save', data);

// 修改头像框
interface IavatarFrameUpdate extends Iid, Ihead_name_status { };
export const avatarFrameUpdate = (data: IavatarFrameUpdate) => newPost('/novel/avatarFrame/update', data);

// 删除头像框
export const avatarFrameRemove = (id: number) => newPost(`/novel/avatarFrame/remove?id=${id}`);




/** -------------------------- @任务统计与设置 -------------------------- */
// 成长任务列表
interface IforumScoreConfigList {
  type: string | number;
  sort: string;
  order: string;
};
export const forumScoreConfigList = (params: IforumScoreConfigList) => newGet('/system/forumScoreConfig/list', params);

// 删除任务
export const forumScoreConfigRemove = (id: number) => newPost(`/system/forumScoreConfig/remove?id=${id}`);

// 新增任务(任务名称用户输入)
interface IforumScoreConfigSave {
  actionName: string;
  type: number;
  requireNum: number;
  actionDescription: string;
  amount: number;
};
export const forumScoreConfigSave = (data: IforumScoreConfigSave) => newPost('/system/forumScoreConfig/save', data);

// 修改任务
interface IforumScoreConfigUpdate extends Iid, IforumScoreConfigSave { };
export const forumScoreConfigUpdate = (data: IforumScoreConfigUpdate) => newPost('/system/forumScoreConfig/update', data);

// 完成任务数、人均搜索次数统计
export const scoreRecordStatistics = () => get('/novel/scoreRecord/statistics');

// 任务折线图统计(时间不传默认最近七天)
interface IscoreRecordStatisticsByChart {
  startTime: string;
  endTime: string;
};
export const scoreRecordStatisticsByChart = (params: IscoreRecordStatisticsByChart) => newGet('/novel/scoreRecord/statisticsByChart', params);

// 任务类型统计
export const scoreRecordStatisticsByType = (params: { type: string | number }) => newGet('/novel/scoreRecord/statisticsByType', params);

// 勋章（新）
export const getMedalList = (params) => newGet('/system/medalInfo/list', params);
export const addMedal = (data) => newPost('/system/medalInfo/save', data);
export const editMedal = (data) => newPost('/system/medalInfo/update', data);

export const getUserMedal = (params: any) => newGet('/system/userMedal/list', params);
export const giveMedal = (data: any) => newPost('/system/userMedal/additional', data);

// 获取勋章申请列表
export const getMedalApplyList = (params: any) => newGet('/system/medalInfo/medalApplyList', params);
// 审核申请
export const checkApply = (data: any) => newPost('/system/medalInfo/check', data)
// 删除申请
export const removeApply = (data: any) => newPost('/system/medalInfo/removeApply', data)
