// import io from 'socket.io-client';
export const socket: any = new WebSocket(`ws://23.225.197.18:8081/webSocket`)

// interface Idata {
//   userId: string;
//   banType: string;
//   cause: string;
// };
// export const ws: any = (data: Idata) => ({ socket: new WebSocket(`ws://103.210.238.161:8081/webSocket?userId=${data.userId}&banType=${data.banType}&cause=${data.cause}`) })
