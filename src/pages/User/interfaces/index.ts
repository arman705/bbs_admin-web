export interface IuserList {
	accountBalance: string;
	amount: number;
	avatar: string | null;
	birthday: string;
	country: string;
	createTime: string;
	email: null;
	follow: string;
	followed: number;
	follower: number;
	id: string;
	lastLoginTime: string;
	level: string;
	nickName: string;	
	password: string | null;
	phone: string;
	signature: null
	status: number;
	updateTime: string;
	userPhoto: string | null;
	userSex: string;
	username: string | null;
	vipId: number;
};


export interface IuserLevelList {
	id: number;
	imgUrl: string;
	influenceAmount: number;
	level: string;
	name: string;
	rewardDesc: string;
};
