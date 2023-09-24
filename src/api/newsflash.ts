import { post,get, newGet, newPost } from '../service';

// 实时快讯

/** -------------------------- @实时快讯管理 -------------------------- */
interface Iid {
  id: string | number;
};

// 新增实时快讯
interface Irecommend extends Iid {
  recommendReason: string;
};
export const recommend = ( data: Irecommend ) => newPost( `/novel/posts/recommend?id=${data.id}&recommendReason=${data.recommendReason}` );

// 取消推荐
export const cancleRecommend = ( data: Iid ) => post( `novel/posts/cancleRecommend?id=${data.id}` );

// 获取最新20条聊天
export const getChatMessages = () => get( `/chatRoom/getChatMessages` );

// 获取最新20条评论
export const getCommentMessages = () => get(`/chatRoom/getCommentMessages`);

// 获取配置参数
export const chatroomParam = () => newGet(`/common/dict/list/chatroom_param`);
