import { newGet, newPost } from '../service';

export const getCommentList: any = (data) => newGet( '/novel/randomComment/list', data);
export const getCommentDetail: any = (data) => newGet( '/novel/randomComment/get', data);
export const addComment: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/novel/randomComment/add', fd);
}
export const updateComment: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/novel/randomComment/update', fd);
}
export const getCommentConfig: any = (data) => newGet( '/novel/randomComment/getConfig', data);
export const configComment: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/novel/randomComment/config', fd);
}
export const deleteComment: any = (data) => {
  const fd = new FormData()
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return newPost( '/novel/randomComment/delete', fd);
}