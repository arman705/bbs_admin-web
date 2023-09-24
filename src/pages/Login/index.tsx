import React, {useContext, useEffect, useRef, useState} from 'react';

// Api
import { login } from '../../api';

// Utils
import { setItem, getItem } from '../../utils/local';

// Hooks
import { useHistory } from 'react-router-dom';

// Image
import bg from '../../assets/images/login-bg.jpg';

// Context
import { ThemeContext } from '../../theme';

// Components
import { Row, Col, Form, Input, Button, message } from 'antd';
import { LoginBg, Title, LoginFormWrap } from './styled';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () =>  {
	const randomNumber = useRef( 0 );

	const [loading, setLoading] = useState(false)
	const [ verify, setVerify ] = useState<string>( '' );
	const {theme} = useContext(ThemeContext);
	const history = useHistory();

	useEffect(() => {
		if (getItem('user-token')) history.replace('/dashboard')
	}, [])
	/* ---------------------- Api start ---------------------- */
	// 获取验证码 
	useEffect( () => { 	
		api_getVerify(); 
	}, [] );
	const api_getVerify = async () => {
		randomNumber.current = getRandomNumber();
		await login.getVerify({uuid: randomNumber.current }).then( res => {
			let imgUrl: string =  res ? `data:image/png;base64,${res[ 0 ][ "base64ImgUrl" ]}` : '';
			setVerify( imgUrl );
		} );
	};

	// 登录
	const api_login = ( params: any ) => {
		setLoading(true)
		login.login( params ).then( res => {
			if (res.code === 200) {
				setItem( 'user-token', res.data );
				window.location.reload()
			} else {
				message.error(res.msg)
			}
		}).finally(() => {
			setLoading(false)
		});
	};

	/* ---------------------- Api end ---------------------- */
	


	/* ---------------------- Method start ---------------------- */
	// 表单提交
	const onFinish = (values: any) => {
		let params = { ...values, uuid: randomNumber.current };
		api_login( params );
  };

	// 随机数
	const getRandomNumber = () => Math.floor( Math.random()* 10000 );
	/* ---------------------- Method end ---------------------- */
	

  
	return (
	<LoginBg bg={ bg }>
		<LoginFormWrap>
			<Row align="middle" justify="center">
				<Col span="5" offset="15">
					<Title color={ theme.colors.text1 }>BBS后台登录</Title>
					<Form name="login" wrapperCol={ {span:24} } onFinish={onFinish} >
						<Form.Item name="username" rules={ [ {required: true, message: '请输入登录账户'} ] }>
							<Input size="large" placeholder="账户" prefix={ <UserOutlined /> } />
						</Form.Item>
						<Form.Item name="password" rules={ [ {required: true, message: '请输入登录密码'} ] }>
							<Input.Password size="large" placeholder="密码" prefix={ <LockOutlined /> } />
						</Form.Item>

						<Row>
							<Col span={ 14 }>
								<Form.Item name="verify" rules={ [ {required: true, message: '请输入验证码'} ] }>
									<Input size="large" placeholder="验证码" prefix={ <LockOutlined /> } />
								</Form.Item>
							</Col>
							<Col span={10}><img onClick={ api_getVerify } style={{ height: '40px', width: '80%', float: 'right' }} src={ verify } alt="alt" /></Col>
						</Row>

						<Form.Item><Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%'}}>登录</Button></Form.Item>

					</Form>
				</Col>
				{/* <Col span="4"></Col> */}
			</Row>
		</LoginFormWrap>
	</LoginBg>
	)
}

export default Login;