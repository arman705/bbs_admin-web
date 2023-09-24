import React, {useState} from 'react';

import { MonitorOutlined, 
	UserOutlined, 
	HistoryOutlined, 
	BorderOuterOutlined, 
	BankOutlined,
	CustomerServiceOutlined,
	EyeOutlined,
	FlagOutlined,
	TrophyOutlined,
	SettingOutlined,
	BookOutlined,
	BranchesOutlined,
	GiftOutlined,
	FileSearchOutlined,
	FileImageOutlined,
	CommentOutlined} from '@ant-design/icons';
import { useRouteMatch } from 'react-router';

type Permission = string;

export function granted(role: string, permission: string) {
	return true;
}

export interface MenuData {
	title: string
	icon?: React.ForwardRefExoticComponent<any>,
	url?: string
	permission?: Permission,
	children?: MenuData[],
	hidden?: boolean,
}

// 所有可见的菜单
// const allMenus: MenuData[] = [
// 	{
// 		title: '监控台',
// 		icon: MonitorOutlined,
// 		url: '/dashboard',
// 		permission: 'view-monitor', 
// 		children: [
// 			{ title: '监控首页', url: '/dashboard', permission: 'view-monitor' }, 
// 			{ title: '搜索统计', url: '/dashboard/search/stat', permission: 'view-monitor' }
// 		]
// 	}, 
// 	{
// 		title: '用户管理',
// 		icon: UserOutlined,
// 		url: '/dashboard/user',
// 		permission: 'manage-user',
// 		children: [
// 			{ title: '用户列表', url:'/dashboard/user/index', permission: 'manage-user' }, 
// 			{ title: '用户评论管理', hidden: true, url: '/dashboard/user/comments' },
// 			{ title: '用户帖子管理', hidden: true, url: '/dashboard/user/topics' }, 
// 			{ title: '用户分析', url: '/dashboard/user/analysis' }, 
// 			{ title: '用户资料管理', url: '/dashboard/user/manage' }, 
// 			{ title: '用户评论管理', url: '/dashboard/user/comments' }, 
// 			// { title: '用户审核列表', url: '/dashboard/user/audit/list' }, 
// 			{
// 				title: '用户记录',
// 				children: [
// 					{ title: '登录记录', url: '/dashboard/user/history/login' }, 
// 					{ title: '观看记录', url: '/dashboard/user/history/watch' }, 
// 					{ title: '聊天记录',	url: '/dashboard/user/history/chat'}
// 				]
// 			}
// 		]
// 	}, 
// 	{ title: '板块管理', 	url: '/dashboard/module', icon: BorderOuterOutlined }, 
// 	{ 
// 		title: '帖子管理',
// 		icon: BookOutlined,
// 		children: [
// 			{ title: '帖子审核', url: '/dashboard/post-review', icon: CustomerServiceOutlined }, 
// 			{ title: '实时快讯', url: '/dashboard/express', icon: BranchesOutlined } 
// 		]
// 	}, 
// 	{ title: '聊天室管理', url: '/dashboard/chat-room', icon: CommentOutlined }, 
// 	{
// 		title: '商品管理',
// 		icon: GiftOutlined,
// 		children: [
// 			{ title: '商品管理' , url: '/dashboard/goods/list' },
// 			{ title: '兑换记录' , url: '/dashboard/goods/exchange' }
// 		]
// 	},
// 	{
// 		title: '任务管理',
// 		icon: FileSearchOutlined,
// 		children: [
// 			{ title: '平台任务' , url: '/dashboard/task/platform' },
// 			{ title: '全民任务' , url: '/dashboard/task/whole' },
// 			{ title: '评论审核' , url: '/dashboard/task/comment' }
// 		]
// 	}, 
// 	{ 
// 		title: '前台管理',
// 		icon: BankOutlined,
// 		children: [
// 			{ title: '水印管理', url: '/dashboard/front/watermark' }, 
// 			{ title: '群发私信', url: '/dashboard/front/broadcase' }, 
// 			{ title: '过滤词', url: '/dashboard/front/words' }, 
// 			{
// 				title: '签到管理',
// 				children: [
// 					{	title: '签到统计', url: '/dashboard/front/checkin/stat' }, 
// 					// { title: '签到设置', url: '/dashboard/front/checkin/setting' }
// 				]
// 			}, 
// 			{ title: '表情管理', url: '/dashboard/front/emojis' }
// 		]
// 	}, 
// 	{ title: '举报管理', url: '/dashboard/report', icon: EyeOutlined }, 
// 	{	
// 		title: '帮助/反馈',
// 		icon: FlagOutlined,
// 		children: [
// 			{ title: '帮助中心', url: '/dashboard/helpCenter' }, 
// 			{ title: '问题反馈', url: '/dashboard/feedback' }
// 		]
// 	}, 
// 	{
// 		title: '等级/勋章管理',
// 		icon: TrophyOutlined,
// 		children: [
// 			{ title: '勋章设置', url: '/dashboard/medal/setting' }, 
// 			{ title: '用户勋章', url: '/dashboard/medal/user' }, 
// 			{ title: '论坛等级设置', url: '/dashboard/level/setting' },
// 			// { title: '头像框设置', url: '/dashboard/level/frame' }, 
// 			{ title: '任务统计与设置', url: '/dashboard/level/taskSetting' }
// 		],
// 	},
// 	{ title: 'Banner管理', url: '/dashboard/banner', icon: FileImageOutlined },
// 	{
// 		title: '后台管理',
// 		icon: SettingOutlined,
// 		children: [
// 			{ title: '后台成员', url: '/dashboard/manager/backMember' }, 
// 			{ title: '角色管理', url: '/dashboard/manager/roles' }, 
// 			{ title: '菜单管理', url: '/dashboard/manager/menus' }, 
// 			// { title: '成员管理-权限设置', url: '/dashboard/manager/permission' }, 
// 			{ title: '操作日志', url: '/dashboard/manager/logs' }, 
// 			{ title: '版本更新记录', url: '/dashboard/manager/versions' }, 
// 			{ title: '参数管理', url: '/dashboard/manager/configmge' },
// 			{ title: '字典管理', url: '/dashboard/manager/dictionary' },
// 			// { title: '版本更新详情', url: '/dashboard/manager/detail' }
// 		]
// 	}
// ];
const allMenus = window.$menus || []


export const useMenuCascade = () => {
	const {path} = useRouteMatch();
	return menuCascade(path);
}

// 根据当前路径 返回menu的全路径树
export const menuCascade: ( path: string ) => MenuData[] = ( path: string ) => {
	const findTree = ( menu: MenuData, tree: MenuData[] ): [ boolean, MenuData[] ] => {
		let found = false;
		tree.push(menu);
		if (menu.url == path) {
			return [true, tree];
		};

		if (menu.children && menu.children.length > 0) {
			for (let item of menu.children) {
				let ttree:MenuData[] = [];
				let [sfound, stree] = findTree(item, ttree);
				if (sfound) {
					tree = tree.concat(stree);
					found = sfound;
					return [found, tree];
				};
			};
		};
		
		return [false, tree];
	};

	for (let menu of allMenus) {
		let [found, s] = findTree( menu, [] );
		if (found) {
			return s;
		};
	};

	return [];
};

export const useMenu = () => {
	return [allMenus];
};