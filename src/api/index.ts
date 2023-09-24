import * as user from './user';
import * as login from './login';
import * as plate from './plate';
import * as posts from './posts';
import * as socket from './socket';
import * as common from './common';
import * as report from './report';
import * as monitor from './monitor';
import * as rankmedal from './rankmedal';
import * as newsflash from './newsflash';
import * as backstage from './backstage';
import * as reception from './reception';
import * as helpfeedback from './helpfeedback';
import * as activationcode from './activationcode';

export {
  common,         // 公共接口
  login,          // 登录
  monitor,        // 监控台
  user,           // 用户信息
  plate,          // 板块管理
  posts,          // 帖子管理
  newsflash,      // 实时快讯
  reception,      // 前台管理
  report,         // 举报管理
  helpfeedback,   // 帮助/反馈
  rankmedal,      // 等级/勋章管理
  activationcode, // 激活码
  backstage,      // 后台管理
  socket
};