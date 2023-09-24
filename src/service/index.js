import axios from 'axios';
import QS from 'qs';
import { BASE_URL, TIMEOUT} from './config';
import { message } from 'antd';
import { getItem, setItem } from '../utils/local'
import {HashRouter} from 'react-router-dom'
const router = new HashRouter();


const service = axios.create({
    baseURL:BASE_URL,
    timeout:TIMEOUT
});

//添加拦截
// 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
service.interceptors.request.use(config => {
    const token = getItem('user-token') || '';
    // let contentType = getItem( 'contentType' ) === 'form-data' ? 'application/x-www-form-urlencoded;charset=utf-8' : 'application/json'
    // console.log( "contentType", contentType )
    config.headers = {
      'token': token,
      'Content-Type': 'application/json'
    };
    return config
},error => {
  return error;
});

service.interceptors.response.use( response => {
  if ( response.data.code === 401 ){
    message.warning('token失效请重新登录!');
    setItem('user-token', '')
    router.history.replace('/');
  }
  return response.data;
},error => {
    return error;
});


const get = ( url, params = {} ) => {
  let timer = null;
  timer && clearTimeout( timer );
  return new Promise( ( resolve, reject ) => {
    timer = setTimeout( () => {
      service.get( url, { params } ).then( res => { 
        let data = res.data || res.pageBean;
        resolve( data ) 
      }).catch( err => { reject( err.data ) });
    }, 30 );
  } )
};

const post = ( url, data = {} ) => {
  let timer = null;
  timer && clearTimeout( timer );
  return new Promise( ( resolve, reject ) => {
    timer = setTimeout( () => {
      service.post( url, data  ).then( res => { 
        resolve( res.data ) 
      }).catch( err => { reject( err.data ) });
    }, 30 );
  } );
};

const newGet = (url, params = {}) => {
  return service.get(url, { params })
}

const newPost = (url, data = {}) => {
  return service.post(url, data)
}

export {
  get,
  post,
  newGet,
  newPost
}
