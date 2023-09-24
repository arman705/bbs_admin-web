const REACT_APP_ENV = process.env.REACT_APP_ENV

const env = {
  // 测试服
  development: {
    BASE_API_URL: 'http://23.224.91.228:8081'
  },
  // 正式服
  production: {
    BASE_API_URL: 'http://23.225.197.18:8081'
  }
}

export default env[REACT_APP_ENV]