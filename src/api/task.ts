import { newGet, newPost } from '../service';

// 列表
export const getTaskList: any = (data) => newGet( '/system/scoreConfig/list', data);

// 新增
export const addTask: any = (data) => newPost( '/system/scoreConfig/save', data);

export const deleteTask: any = (id) => newPost(`/system/scoreConfig/remove?id=${id}`);

// 编辑
export const editTask: any = (data) => newPost( '/system/scoreConfig/update', data);

export const getPostsList: any = (data) => newGet( '/novel/posts/list', data);
export const getPostDetail: any = (data) => newGet( '/novel/posts/detail', data);
export const addPosts: any = (data) => newPost( '/novel/posts/save', data);
export const deletePosts: any = (ids) => {
  const fd = new FormData()
  fd.append('ids[]', ids)
  return newPost( '/novel/posts/batchRemove', fd)
}
export const auditPosts: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/novel/posts/audit', fd)
}
export const postTop: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/novel/posts/top', fd)
}
export const editPost: any = (data) => {
  // const fd = new FormData()
  // Object.keys(data).forEach(key => {
  //   fd.append(key, data[key])
  // })
  return newPost( '/novel/posts/update', data)
}

export const getCommentList: any = (data) => newGet( '/system/comment/list', data);
export const getCommentDetail: any = (data) => newGet( '/system/comment/detail', data);
export const adoptComment: any = (data) => newPost( '/system/comment/adopt', data);
export const auditComment: any = (data) => {
  // const fd = new FormData()
  // Object.keys(data).forEach(key => {
  //   fd.append(key, data[key])
  // })
  return newPost( '/system/comment/audit', data)
}
