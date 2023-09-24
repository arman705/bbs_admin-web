import React, { useContext, useState, useEffect } from 'react';

// Components
import { Row, Col } from 'antd';
import { ThemeContext } from '../../theme';
import { Wrapper, Selected } from './styled';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface IProps{
	texts: any[]
	view?: number,
	onSelect?: ( id: string ) => void
};

const initProps: IProps = {
	texts: [],
};

const Scrollable: React.FC<any> = ({ texts, view = 5, onSelect = ( id: string ) => {} }: IProps = initProps ) => {

	const [viewTexts, updateViewTexts] = useState<string[]>([]);
  const [ textIndex, setIndex ] = useState<number>( 0 );
	const {theme} = useContext( ThemeContext);

  /* ----------------------------- Api start ----------------------------- */
  // 更新数据
	useEffect( () => {
		updateViewTexts( filterTexts() );
	}, [ texts.length ] );
  /* ----------------------------- Api end ----------------------------- */



  /* ----------------------------- Methods start ----------------------------- */
  // 筛选数据
  const filterTexts = () => texts.filter( ( item, index ) => index < view  )

  const handleClick = ( index: number, id: string ) => {
    setIndex( index );
    onSelect && onSelect( id );
  };

  // 左右点击切换
  const handleMoveLeftOrRight = ( type: string, method: string ) => {
    
    // setIndex( -1 );
    let nameList = viewTexts.slice();
    let arrValue = nameList[ type ]();
    nameList[ method ]( arrValue );
    updateViewTexts( () => [ ...nameList ] );
    let _index = textIndex;
    if ( type === 'pop' ) {
      _index = textIndex + 1 === viewTexts.length ? 0 : textIndex + 1; 
    }else{
      _index = textIndex - 1 === -1 ? viewTexts.length - 1 : textIndex - 1;
    };
    setIndex( _index );
  };

  /* ----------------------------- Methods end ----------------------------- */



  /* ----------------------------- Ui start ----------------------------- */
 
  const ui_renderTexts = ( list: any ) => list.map( ( item: any, index: number ) => (
    <Col onClick={ () => handleClick( index, item.id )  } key={index}>
        <Selected selected={ index === textIndex } color={ theme.colors.bg1 }>{ item.name || 'No-Name' }</Selected>
      </Col>
  ) );

  /* ----------------------------- Ui end ----------------------------- */


	return (
    <Wrapper>
      <Row gutter={20} justify="space-between">
        <Col onClick={ () => handleMoveLeftOrRight( 'shift', 'push' ) }><LeftOutlined /></Col>
        { ui_renderTexts( viewTexts ) }
        <Col onClick={ () => handleMoveLeftOrRight( 'pop', 'unshift' ) }><RightOutlined /></Col>
      </Row>
    </Wrapper>
  )
};

export default Scrollable;