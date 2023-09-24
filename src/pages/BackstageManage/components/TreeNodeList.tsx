import React from 'react'
import { Tree, Checkbox } from 'antd'

interface State {
  selected: boolean;
}

export interface Node {
  text: string;
  id: string | number;
  children?: Array<Node>;
  state: State;
}

interface TreeNodeListProps {
  data: Array<Node>;
  onChange: (data: Array<Node>) => void;
}

const TreeNodeList: React.FC<TreeNodeListProps> = (props) => {
  function onCheckedChange (e: any, item: Node) {
    const checked = e.target.checked
    item.state.selected = checked
    checkChildren(item.children!, checked)
  }
  function checkChildren (data: Node[], checked: boolean) {
    if (Array.isArray(data)) {
      data.forEach(item => {
        item.state.selected = checked
        checkChildren(item.children!, checked)
      })
    }
  }
  function getListView (data: Node[], notify: () => void) {
    return data.map(item => {
      const title = (
        <Checkbox
          checked={item.state.selected}
          onChange={(e) => {
            onCheckedChange(e, item)
            notify()
          }}
          key={item.id}
        >
          {item.text}
        </Checkbox>
      )
      function handleNofify () {
        item.state.selected = item.children!.every(item => item.state.selected)
        notify()
      }
      return (
        <Tree.TreeNode title={title} key={item.id} selectable={false}>
          { item.children ? getListView(item.children, handleNofify) : null }
        </Tree.TreeNode>
      )
    })
  }

  return (
    <Tree defaultExpandAll>{ getListView(props.data, () => { props.onChange([...props.data]) }) }</Tree>
  )
}

export default TreeNodeList
