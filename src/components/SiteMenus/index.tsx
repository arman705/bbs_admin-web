import React, { useContext } from 'react';

import { Menu } from 'antd';
import { MenuData, useMenu } from '../../utils/menu';
import { Link } from 'react-router-dom';
import * as Icon from '@ant-design/icons/lib/icons';
import {GlobalContext} from '../../utils/global';

const {SubMenu} = Menu;

function renderMenu(menu: MenuData): React.ReactNode {
	const IconComponent = Icon[menu.icon]
	// 有子节点
	if (menu.children) {
		return <SubMenu key={menu.name} title={menu.name} icon={ IconComponent ? <IconComponent /> : null }>
			{ menu.children.map( smenu => renderMenu(smenu) ) }
		</SubMenu>
	} else {
		// 没有字节点
		return ( menu.hidden == true ? null:  <Menu.Item key={menu.url} icon={ IconComponent ? <IconComponent /> : null }>
			<Link to={menu.url as any }>{menu.name}</Link>
		</Menu.Item>)
	}
}

export default function SiteMenu() {

	const [menus,] = useMenu();

	const menuComponent = menus.map( menu => renderMenu(menu) );

	return <Menu 
		mode="inline"
		style={ { borderRight: '0px'} }
		>
			{menuComponent}
		</Menu>

}