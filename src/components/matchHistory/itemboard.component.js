import React from 'react';

export default function Itemboard(props) {
  let items = props.items.sort().reverse();
  // items = []
  console.log(items)
  let itemIter = [0,1,2,3,4,5]
  // const gridStyle = {
  //   display: 'grid',
  //   gridTemplateAreas:
  //   "item1 item2 item3 trinket"
  //   "item"
  //   // gridTemplateColumns: 'auto auto auto auto',
  //   // gridTemplateRows: 'auto auto'
  // }
  const imgStyle = {
    height: '24px',
    borderRadius: '8px'
  }
  const blankStyle = {
    height: '24px',
    width: '24px',
    backgroundColor: '#494949cc',
    border: '1px solid #6f6f6f'
  }
  return (
    <div className={`itemboard-${props.side}`}>
      {itemIter.map((v, i) => {
        let posStyle = {
          // gridColumn: (i % 2),
          // gridRow: (i/3).toFixed(0)
          gridArea: `item${v}`,
          borderRadius: '8px'
        }
        if (items[v] === 0 || items[v] === "0") {
          return (
            <div key={"block"+i} style={{...blankStyle, ...posStyle}}></div>
          )
        }
        return (
          // I have no idea why the -2px is needed. Its dumb
          <div key={"block"+i} style={{...posStyle, marginTop: "-2px"}}>
            <img src={require(`../../images/items/` + items[v] + `.png`)}
              style={imgStyle}></img>
          </div>
        )
      })}
      {
        props.trinket != "0" ?
        <div style={{gridArea: "trinket"}}>
          <img src={require(`../../images/items/` + props.trinket + `.png`)}
            style={imgStyle}></img>
        </div> : 
        <div style={{...blankStyle, gridArea: "trinket"}} ></div>
      }
    </div>
  )
}

