import { get, post, newPost } from '../service';

// 帖子审核

/** -------------------------- @帖子审核 -------------------------- */
// 获取帖子列表
interface IgetPostsList {
  offset?: string | number;
  limit?: string | number;
  auditState?: string;
  id?: string;
  typeName?: string;
  title?: string;
  top?: string | number;
  authorId?: string
};
export const getPostsList = ( params: IgetPostsList ) => get( '/novel/posts/list', params );

// 批量删除帖子
export const batchRemove: any = ( data: any ) => {
  const fd = new FormData()
  fd.append('ids[]', data.ids.join(','))
  return newPost( `/novel/posts/batchRemove`, fd);
}

