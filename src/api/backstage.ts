import { get, post, newGet, newPost } from '../service';

// 后台管理

interface IuserId {
  userId: string | number;
};

/** -------------------------- @成员管理 -------------------------- */
interface IsysParams {
  username: string;
  password: string;
  name: string;
  jobNumber: string;
  job: string;
};

// 新增用户

export const userSave = (data: IsysParams) => newPost('/sys/user/save', data);

// 用户列表展示
export const sysUserList = () => newGet('/sys/user/list');

// 操作日志列表
export const sysLogList = (params: any) => get('/common/log/list', params);

// 版本列表
export const sysVersionList = (params: any) => get('/sys/version/list', params);

// 版本列表
export const getVersionDetail = (id: string) => get(`/sys/version/detail?id=${id}`);

// 新增版本
export const saveVersion = (params: any) => newPost('/sys/version/save', params);

// 修改版本
export const updateVersion = (params: any) => newPost('/sys/version/update', params);

// 删除版本
export const deleteVersion = (id: string | number) => newPost(`/sys/version/remove?id=${id}`);

// 修改用户信息
export const sysUserUpdate = (data: IuserId & IsysParams) => newPost('/sys/user/update', data);

// 删除用户
export const sysUserRemove = (id: string | number) => newPost(`/sys/user/remove?id=${id}`);

// 查看用户详情信息
export const sysUserDetail = (params: any) => newGet('/sys/user/detail', params);





/** -------------------------- @成员权限设置 -------------------------- */
// 用户权限查询
export const sysMenuTree = (params: IuserId) => newGet('/sys/menu/tree', params);

// 更改用户权限
interface IsysMenuUpdateUser {
  menuIds: (string | number)[]
};
export const sysMenuUpdateUser = (data: IuserId & IsysMenuUpdateUser) => newPost('/sys/menu/updateUser', data);

// 所有菜单列表
export const sysMenuTreeAll = () => newGet('/sys/menu/treeAll');

// 角色列表
export const getRoles: any = (data) => newGet( '/sys/role/list', data);
export const getRole: any = (data) => newGet( '/sys/role/detail', data);
export const addRole: any = (data) => newPost( '/sys/role/save', data);
export const editRole: any = (data) => newPost( '/sys/role/update', data);
export const removeRole: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/sys/role/remove', fd);
}

// 所有菜单
export const getTreeMenus: any = (data) => newGet( '/sys/menu/treeAll', data);
export const getTreeMenusById: any = (id) => newGet(`/sys/menu/treeAll/${id}`);

// 菜单列表
export const getMenus: any = (data) => newGet( '/sys/menu/list', data);
export const addMenu: any = (data) => newPost('/sys/menu/save', data);
export const editMenu: any = (data) => newPost('/sys/menu/update', data);
export const deleteMenu: any = (data) => newGet('/sys/menu/remove', data);