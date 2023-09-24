export interface IviolateLogs {
  banDec?: string;
  banTime?: string;
  banTypeName?: string;
  operator?: string;
};

export interface Iviolate {
  nickName?: string;
  status?: string;
  userId?: string;
  violateNum?: number;
  violateLogs?: IviolateLogs[]
}
