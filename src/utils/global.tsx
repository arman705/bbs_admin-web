import React, {  useContext, useState } from 'react';

const global = {
	collapsed: false, // 折叠菜单
	zoomView: '', // 全屏显示的组件
};

export type Global = typeof global;

type GlobalContext =  {global: Global,updateGlobal: (value: { [key in KeyOfGlobal ]: any }) => void}
type KeyOfGlobal = keyof Global;

export const GlobalContext = React.createContext<GlobalContext>({} as any);

export const GlobalProvider: React.FC = ( {children} ) =>  {

	const [object, setObject] = useState<Global>(global);

	const updateGlobal = (value: { [key in KeyOfGlobal ]: any }) => {
		let newObject = {...object};
		for (let key in value) {
			(newObject as any)[key] = (value as any)[key];
		}
		setObject(newObject);
	}


	return <GlobalContext.Provider value={ {global:object, updateGlobal}}>
		{children}
	</GlobalContext.Provider>;
}

export function useGlobal() {
	return useContext(GlobalContext);
}

export const STREAM_COMMENT = 'stream_comment';
export const STRAEM_CHAT = 'stream_chat';