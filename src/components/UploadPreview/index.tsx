import React, { useState } from 'react';

import {
	Upload,
	Button,
	Image,
	Space,
	Progress
} from 'antd';
import Styled, {css} from 'styled-components';
import { useTheme } from '../../theme';
import { getBase64} from '../../utils/file';
import { useImageSize } from '../../utils/hooks';

const UploadWrapper = Styled.div`

`;

const PreviewWrapper = Styled.div`
	position: relative;
	background: rgba(0,0,0,0.1);
`;

const PreviewPosition = Styled.div`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0px;
	height: 22px;
	width: 100%;
	background: rgba(0,0,0,0.5);
`;


export interface Props {
	onPreview?: (url: string) => void,
}

export default function UploadPreview({onPreview}: Props = {onPreview: (string) => {}}) {

	const uploadedFile = [];
	const [preview, updatePreview] = useState<string>(null as any);
	const {theme} = useTheme();

	const uploadProps = {
		async onChange(info: any) {
			let base64 = await getBase64(info.file.originFileObj);
			updatePreview(base64 as string);
			onPreview && onPreview(base64 as string);
		},
		showUploadList: false,
	};

	return <UploadWrapper>
		<Space size="small" direction="vertical">
			{preview != null && <PreviewWrapper>
				<Image src={ preview } style={ {maxWidth: '190px'} }></Image>
				<PreviewPosition>
					<Progress percent={50}></Progress>
				</PreviewPosition>
			</PreviewWrapper> }
			<Upload {...uploadProps}>
				<Button style={ {background: theme.colors.bg1, color: theme.colors.white } }>上传图片</Button>
			</Upload>
		</Space>
	</UploadWrapper>
}