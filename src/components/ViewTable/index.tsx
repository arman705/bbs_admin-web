import React from 'react';
import './table.css';

export interface Props {
	columns: string[]
	data: any[]
}

// 只显示表格 不做其他处理
export default function ViewTable({columns, data}: Props) {

	const renderTd = (item: {[key:string]:any})=> {
		let el = [];
		for (let key in item) {
			el.push(<td key={key}>{item[key]}</td>);
		}
		return el
	}

	return <table className="view-table">
		<thead>
			<tr>
			{ columns.map( (label, index) => {
				return <th key={index}>{ label }</th>
			} ) }
			</tr>
		</thead>
		<tbody>
			{ data.map( (item, key) => {
				return <tr key={key}>
					{ renderTd(item) }
				</tr>
			} ) }
		</tbody>
	</table>

}
