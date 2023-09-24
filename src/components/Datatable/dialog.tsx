import React from 'react';
import {
	Modal,
	Card,
	Button,
} from 'antd';

export interface Props {
	title: string
	visible: boolean
	[key: string]:any
}
export default function Dialog(props: Props = {title: '弹出框', visible: false}) {

	const {children} = props;

	return <Modal {...(props as any)}>
		{children as React.ReactNode}
	</Modal>
}
