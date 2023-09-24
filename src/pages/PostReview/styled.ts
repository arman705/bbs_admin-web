import Styled, {css} from 'styled-components';

export const HTMLWrapper = Styled.div`
	max-height: 300px;
	overflow: auto;
`;


// 实时快讯
export const QuickMessageWrapper = Styled.div`
	position: absolute;
	right: 0px;
	z-index: 33333;
	top: 0px;
	transform: translateY(-100%);
`;

export const QuickReasonHeader = Styled.div`
	display: flex;
	align-items: center;
	padding: 6px 0;

	.title {
		color: #000;
		flex: 1;
	}
`

export const QuickReasonContent = Styled.div`
	width: 350px;

	.ant-list {
		max-height: 200px;
		overflow-y: auto;
	}
	.ant-form-item:nth-child(1) {
		flex: 1;
	}
	.ant-form-item:nth-child(2) {
		margin-right: 0;
	}
	.ant-list-item {
		padding: 0;
		position: relative;
		&:hover {
			background: #eee;
		}

		.text {
			cursor: pointer;
			padding: 8px 0;
			width: 100%;
		}
	}
	.anticon-minus-circle {
		color: red;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		cursor: pointer;
	}
`