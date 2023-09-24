import { get, newGet } from '../service';


// 监控台

/** -------------------------- @监控台 -------------------------- */

// 帖子统计
export const novelPost = () => get( '/novel/posts/statistics' );

// 问题反馈统计
export const novelUserFeedback = () => get( '/novel/userFeedback/statistics' );

// 用户资料审核统计
export const novelUserFeedbackStatistics = () => get( '/novel/userdata/statistics' );





/** -------------------------- @搜索统计 -------------------------- */
// 热门搜索
export const hotKeyword = () => get( '/novel/userSearchRecord/hotKeyword' );

// 板块前三热帖
export const hotPosts = ( id: string | number ) => get( `/novel/posts/hotPosts?typeId=${id}` );

// 关键词搜索
export const byKeyword = () => get( '/novel/userSearchRecord/statisticsByKeyword' );

// 搜索用户数、人均搜索次数统计
export const byUser = () => get( '/novel/userSearchRecord/statisticsByUser' );

// 图表搜索
export const byChart = () => get( 'novel/userSearchRecord/statisticsByChart' );

// 获取聊天室最近20条消息
export const getChatMessages: any = () => newGet( '/chatRoom/getChatMessages' );

// 获取最近20条评论
export const getCommentMessages: any = () => newGet( '/chatRoom/getCommentMessages' );