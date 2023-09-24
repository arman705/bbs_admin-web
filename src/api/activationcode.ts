import { get, post } from '../service';

// fileName: 激活码互通管理

/** -------------------------- @激活码互通管理 -------------------------- */
interface Iid {
  id: number;
};

interface IcodeParms {
  name: string;
 	iconUrl: string;
 	website: string;
 	activationCodeAmount: string;
 	limitAmount: number;
  activationCode: string;
};

// 激活码列表
export const platformActivationList = () => get( '/novel/platformActivation/list' );

// 新增激活码
export const platformActivationSave = ( data: IcodeParms ) => post( '/novel/platformActivation/save', data );

// 修改激活码
interface IplatformActivationUpdate {
 	status: number;
};
export const platformActivationUpdate = ( data: IplatformActivationUpdate & IcodeParms & Iid ) => post( '/novel/platformActivation/update', data );

// 删除激活码
export const platformActivationRemove = ( id: string | number ) => post( `/novel/platformActivation/remove?id=${id}` );

// 激活码教程
interface IplatformActivationCourse {
  courseContent: string;
}
export const platformActivationCourse = ( data: Iid & IplatformActivationCourse ) => post( '/novel/platformActivation/course', data );