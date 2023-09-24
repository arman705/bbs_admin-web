import { get, post, newPost } from '../service';

// 登录

/** -------------------------- @登录 -------------------------- */
interface IgetVerify {
  uuid: string | number;
};

// 验证码
export const getVerify = ( params: IgetVerify ) => get( '/getVerify', params );

// 登录
interface Ilogin extends IgetVerify{
  username: string;
  password: string;
  verify: string | number;
};
export const login = ( data: Ilogin ) => newPost( `/login?username=${data.username}&password=${data.password}&uuid=${data.uuid}&verify=${data.verify}` );


export const logout = () => post( `user/logout` );




