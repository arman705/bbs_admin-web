import React,{useEffect} from "react"
import {
	Switch,
	Route,
	Link,
} from 'react-router-dom'

import Login from './Login';
import Dashboard from './Dashboard';

export default function App() {
	useEffect(() => {
		(window as any).process = {
		  ...window.process,
		};
	  }, []);
	return <Switch>
		<Route exact path="/" component={Login}></Route>
		<Route path="/dashboard" component={Dashboard}></Route>
	</Switch>
}