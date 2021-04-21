import React from 'react';

export default function Itemboard(props) {
  let items = props.items;
  items = []
  let itemIter = [0,1,2,3,4,5,6]
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto',
    gridTemplateRows: 'auto auto'
  }
  const imgStyle = {
    height: '24px'
  }
  return (
    <div className="col">
      <div style={gridStyle}>
        {itemIter.map((v, i) => {
          return (
            <div key={"block"+i}>
              {
                v < items.length ? 
                <img src={require(`../../images/items/` + items[v] + `.png`)}
                style={imgStyle}></img> :
                null
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

