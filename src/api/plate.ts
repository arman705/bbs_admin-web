import { get, post } from '../service';

// 板块管理

/** -------------------------- @板块分类管理 -------------------------- */
// 获取板块分类列表
export const getScope = () => get( '/novel/articleType/getScope' );




/** -------------------------- @板块管理 -------------------------- */
interface IarticleTypeList {
  scope?: string;
  offset?: number;
  limit?: number;
};
// 获取板块列表
export const articleTypeList = ( params: IarticleTypeList ) => get( '/novel/articleType/list', params );

// 删除板块
export const articleTypeRemove = ( data: Iid ) => post( `/novel/articleType/remove?id=${data.id}` );



/** -------------------------- @板块分类管理与板块分类 -------------------------- */
interface Iid {
  id: string | number;
};

interface ICommonParm {
  scope: string;
  imgUrl?: string;
  imgIcon?: string;
  name?: string;
  color?: string;
  userLevelId?: string | number;
};

// 新增板块分类、新增板块 /novel/articleType/save
interface IarticleTypeSave extends ICommonParm {};
export const articleTypeSave = ( data: IarticleTypeSave ) => post( '/novel/articleType/save', data );

// 修改板块分类
interface IarticleTypeUpdate extends Iid, ICommonParm {
  subTitle?: string;
};
export const articleTypeUpdate = ( data: IarticleTypeUpdate ) => post( '/novel/articleType/update', data );

export const articleScopeUpdate = ( data: IarticleTypeUpdate ) => post( '/novel/articleType/updateByScope', data );


// 删除板块分类
export const deleteScope = ( data: { scope: string } ) => post( `/novel/articleType/deleteScope?scope=${data.scope}` );


export const updateScope = ( data: { newScope: string, oldScope: string } ) => post( `/novel/articleType/updateScope?newScope=${data.newScope}&oldScope=${data.oldScope}` );

//刷新缓存
export const refreshScope = () => get ('/novel/articleType/flush/cache');

