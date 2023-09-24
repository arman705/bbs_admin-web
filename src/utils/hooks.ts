import React, { useCallback, useEffect, useState } from 'react';

export function useOutClick<T> (ref: React.MutableRefObject<T>, excludeRef: React.MutableRefObject<T>, callback: () => void) {

	const handleClick = (e: MouseEvent) => {

		// 排除?
		if (excludeRef.current && ( excludeRef.current as any).contains(e.target) ) {
			return ;
		}

		if (ref.current && !( ref.current as any ).contains(e.target)) {
			callback();
		}
	}

	useEffect( () => {
		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
		}
	});
}

export function useImageSize(): [ number[], (url: string) => void ] {
	
	const [size, setSize] = useState<number[]>([]);

	const update = (url: string) => {
		const img = new Image();
		img.onload = function() {
			const $this = this as any;
			setSize([$this.width, $this.height]);
		}
		img.src = url;
	}

	return [size, update]

}