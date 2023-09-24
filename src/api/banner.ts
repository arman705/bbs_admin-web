import { newGet, newPost } from '../service';

// 列表
export const getBannerList: any = (data) => newGet( '/system/banner/list', data);

// 新增
export const addBanner: any = (data) => newPost( '/system/banner/save', data);

export const deleteBanner: any = (id) => newPost(`/system/banner/remove?id=${id}`);

// 编辑
export const editBanner: any = (data) => newPost( '/system/banner/update', data);