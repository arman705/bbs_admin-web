import React from 'react';
import {
	Switch,
	Route,
	useRouteMatch,
} from 'react-router-dom';

import Monitor from './Monitor';
import SearchStat from './SearchStat';
import UserIndex, { Comments, Topics, UserAnalysis, UserManage, HistoryLogin, HistoryWatch, HistoryChat, AuditList } from './User';
import Module from './Module';
import PostPreview, {Express} from './PostReview';
import {
	WaterMark,
	Broadcase,
	Words,
	Stat as CheckinStat,
	Setting as CheckinSetting,
	Emojis
} from './Frontend';

// 举报管理
import Report from './Report';

// 帮助/反馈
import { Help, Feedback } from './Help';

// 等级/勋章
import { Medal, Frame, Setting, TaskSetting, UserMedal } from './RankMedal';

// 后台管理
import { BackMember, Permission, Logs, Versions, Detail, Configmge, Dictionary } from './BackstageManage';
import ChatRoom from './ChatRoom'	
import Goods from './Goods/list'
import Exchange from './Goods/exchange'
import Platform from './Task/Platform'
import Whole from './Task/Whole'
import TaskComment from './Task/Comment'
import Roles from './BackstageManage/roles'
import Menus from './BackstageManage/menus'
import Banner from './Banner'
import RandomComment from './RandomComment'

const components = {
	Monitor,
	SearchStat,
	UserIndex,
	Comments,
	Topics,
	UserAnalysis,
	UserManage,
	HistoryLogin,
	HistoryWatch,
	HistoryChat,
	AuditList,
	Module,
	PostPreview,
	Express,
	WaterMark,
	Broadcase,
	Words,
	CheckinStat,
	CheckinSetting,
	Emojis,
	Report,
	Help,
	Feedback,
	Medal,
	UserMedal,
	Setting,
	Frame,
	TaskSetting,
	BackMember,
	Permission,
	Logs,
	Versions,
	Detail,
	ChatRoom,
	Goods,
	Exchange,
	Platform,
	Whole,
	TaskComment,
	Configmge,
	Dictionary,
	Roles,
	Menus,
	Banner,
	RandomComment
}

export default function Routes({path = ''}: {path: string}) {
	return <Switch>
		<Switch>
			{/* <Route exact path={ path } component={Monitor}></Route> */}
			{/* <Route exact path={ `${path}/search/stat` } component={SearchStat}></Route> */}
			{/* <Route exact path={ `${path}/user/index` } component={UserIndex}></Route> */}
			{/* <Route exact path={ `${path}/user/comments` } component={Comments}></Route> */}
			<Route exact path={ `${path}/user/topics` } component={Topics}></Route>
			{/* <Route exact path={ `${path}/user/analysis` } component={UserAnalysis}></Route> */}
			{/* <Route exact path={ `${path}/user/manage` } component={UserManage}></Route> */}
			{/* <Route exact path={ `${path}/user/history/login` } component={HistoryLogin}></Route> */}
			{/* <Route exact path={ `${path}/user/history/watch` } component={HistoryWatch}></Route> */}
			{/* <Route exact path={ `${path}/user/history/chat` } component={HistoryChat}></Route> */}
			<Route exact path={ `${path}/user/audit/list` } component={AuditList}></Route>
			{/* <Route exact path={ `${path}/module` } component={Module}></Route> */}
			{/* <Route exact path={ `${path}/post-review` } component={PostPreview}></Route> */}
			{/* <Route exact path={ `${path}/express` } component={Express}></Route> */}
			{/* <Route exact path={ `${path}/front/watermark` } component={WaterMark}></Route> */}
			{/* <Route exact path={ `${path}/front/broadcase` } component={Broadcase}></Route> */}
			{/* <Route exact path={ `${path}/front/words` } component={Words}></Route> */}
			{/* <Route exact path={ `${path}/front/checkin/stat` } component={CheckinStat}></Route> */}
			<Route exact path={ `${path}/front/checkin/setting` } component={CheckinSetting}></Route>
			{/* <Route exact path={ `${path}/front/emojis` } component={Emojis}></Route> */}
			{/* <Route exact path={ `${path}/report` } component={Report}></Route> */}
			{/* <Route exact path={ `${path}/helpCenter` } component={Help}></Route> */}
			{/* <Route exact path={ `${path}/feedback` } component={Feedback}></Route> */}
			{/* <Route exact path={ `${path}/medal/setting` } component={Medal}></Route> */}
			{/* <Route exact path={ `${path}/medal/user` } component={UserMedal}></Route> */}
			{/* <Route exact path={ `${path}/level/setting` } component={Setting}></Route> */}
			<Route exact path={ `${path}/level/frame` } component={Frame}></Route>
			{/* <Route exact path={ `${path}/level/taskSetting` } component={TaskSetting}></Route> */}
			{/* <Route exact path={ `${path}/manager/backMember` } component={BackMember}></Route> */}
			<Route exact path={ `${path}/manager/permission/:userId` } component={Permission}></Route>
			{/* <Route exact path={ `${path}/manager/logs` } component={Logs}></Route> */}
			{/* <Route exact path={ `${path}/manager/versions` } component={Versions}></Route> */}
			<Route exact path={ `${path}/manager/detail/:id` } component={Detail}></Route>
			{/* <Route exact path={ `${path}/chat-room` } component={ChatRoom}></Route> */}
			{/* <Route exact path={ `${path}/goods/list` } component={Goods}></Route> */}
			{/* <Route exact path={ `${path}/goods/exchange` } component={Exchange}></Route> */}
			{/* <Route exact path={ `${path}/task/platform` } component={Platform}></Route> */}
			{/* <Route exact path={ `${path}/task/whole` } component={Whole}></Route> */}
			{/* <Route exact path={ `${path}/task/comment` } component={TaskComment}></Route> */}
			{/* <Route exact path={ `${path}/manager/configmge` } component={Configmge}></Route> */}
			{/* <Route exact path={ `${path}/manager/dictionary` } component={Dictionary}></Route> */}
			{/* <Route exact path={ `${path}/manager/roles` } component={Roles}></Route> */}
			{/* <Route exact path={ `${path}/manager/menus` } component={Menus}></Route> */}
			{/* <Route exact path={ `${path}/banner` } component={Banner}></Route> */}
			{
				window.$flatMenus.map(item => {
					return <Route exact path={ item.url } component={components[item.component]} />
				})
			}
		</Switch>
	</Switch>
}