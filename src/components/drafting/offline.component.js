import React, {Component} from 'react';
import { Container } from 'react-bootstrap';
import risenLogo from '../../images/RE_TypeLogo_Shading.png';

const champions = require('../../data/champions.json').data;

export default class OfflineDraft extends Component {
  constructor() {
    super();
    this.state = {
      filteredChamps: champions,
      red: {
        ban: [
          null,
          null,
          null,
          null,
          null
        ],
        pick: [
          null,
          null,
          null,
          null,
          null
        ]
      },
      blue: {
        ban: [
          null,
          null,
          null,
          null,
          null
        ],
        pick: [
          null,
          null,
          null,
          null,
          null
        ]
      },
      selected: null
    }
  }

  filterChamps() {
    let newChamps = {};
    const text = document.getElementById('champFilter').value;
    for (let key in champions) {
      if (champions[key].name.toLowerCase().includes(text.toLowerCase())) {
        newChamps[key] = champions[key];
      }
    }
    this.setState({
      filteredChamps: newChamps
    });
  }

  deselectBox(draft, event) {
    event.preventDefault();
    document.getElementById(draft).style.backgroundImage = null;

    draft = draft.split("-")
    let arr = this.state[draft[0]][draft[1]];

    arr[Number(draft[2])] = null;

    let assigner = this.state;
    assigner[draft[0]][draft[1]] = arr;
    
    this.setState(assigner);
  }

  selectBox(element) {
    
    if(this.state.selected === null) {
      // Selecting a new element
      document.getElementById(element).classList.add('offline-selected');
      this.setState({
        selected: element
      });
    }
    else {
      // Selected a second element
      if (this.state.selected === element) {
        // Selected same element as before - deselect
        document.getElementById(element).classList.remove('offline-selected');
        this.setState({
          selected: null
        });
      }
      else if (this.state.selected.startsWith('champ') === element.startsWith('champ')) {
        // Selected another element in the same area, champ and champ or draft spot and draft spot
        // Just swap then
        if (this.state.selected.startsWith('champ') && element.startsWith('champ')) {
          document.getElementById(this.state.selected).classList.remove('offline-selected');
          document.getElementById(element).classList.add('offline-selected');
          this.setState({
            selected: element
          });
        }
        else {
          const temp = document.getElementById(this.state.selected).style.backgroundImage;
          document.getElementById(this.state.selected).style.backgroundImage = document.getElementById(element).style.backgroundImage;
          document.getElementById(element).style.backgroundImage = temp;
          document.getElementById(this.state.selected).classList.remove("offline-selected");
          document.getElementById(element).classList.remove("offline-selected");
          this.setState({
            selected: null
          });
        }
      }
      else {
        // Different, actually move shit
        let champ = '';
        let draft = '';
        if (this.state.selected.startsWith('champ')) {
          champ = this.state.selected;
          draft = element;
        }
        else {
          champ = element;
          draft = this.state.selected;
        }
        
        champ = champ.split("-")[1];
        document.getElementById(draft).style.backgroundImage = `url(${require(`../../images/champions/icons/` + champ + `_0.png`)})`;

        draft = draft.split("-")
        let arr = this.state[draft[0]][draft[1]];

        arr[Number(draft[2])] = champ;

        document.getElementById(this.state.selected).classList.remove("offline-selected");
        document.getElementById(element).classList.remove("offline-selected")

        let assigner = this.state;
        // assigner[draft[0]] = {}
        assigner[draft[0]][draft[1]] = arr;
        assigner.selected = null;

        this.setState(assigner);
      }
    }
  }
  champIsSelected(champ) {
    if(this.state.blue.ban.includes(champ) ||
      this.state.blue.pick.includes(champ) ||
      this.state.red.ban.includes(champ) ||
      this.state.red.pick.includes(champ)) {
        return true
    }
    return false

  }
  render() {
    return (
      <section>
        <br></br>
        <Container style={{backgroundColor: '#2a3343', padding: '15px'}}>
          <div className='row'>
            <div className='col'>
              <div className='row'>
                <div className='col-4'>
                  <div className='row'>
                    <div className="col text-light">
                      <input defaultValue="Blue Team" style={{...blueBoxStyle, ...nameInputStyle}}></input>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col'>
                      <div style={banGridStyle}>
                        <div style={{...blueBoxStyle, ...banBoxStyle}} className="clickable" id="blue-ban-0"
                          onClick={this.selectBox.bind(this, "blue-ban-0")}
                          onContextMenu={this.deselectBox.bind(this, "blue-ban-0")}><div style={numberStyle}>1</div></div>
                        <div style={{...blueBoxStyle, ...banBoxStyle}} className="clickable" id="blue-ban-1"
                          onClick={this.selectBox.bind(this, "blue-ban-1")}
                          onContextMenu={this.deselectBox.bind(this, "blue-ban-1")}><div style={numberStyle}>2</div></div>
                        <div style={{...blueBoxStyle, ...banBoxStyle}} className="clickable" id="blue-ban-2"
                          onClick={this.selectBox.bind(this, "blue-ban-2")}
                          onContextMenu={this.deselectBox.bind(this, "blue-ban-2")}><div style={numberStyle}>3</div></div>
                        <div style={{width: '10px', backgroundColor: 'orange'}}></div>
                        <div style={{...blueBoxStyle, ...banBoxStyle}} className="clickable" id="blue-ban-3"
                          onClick={this.selectBox.bind(this, "blue-ban-3")}
                          onContextMenu={this.deselectBox.bind(this, "blue-ban-3")}><div style={numberStyle}>4</div></div>
                        <div style={{...blueBoxStyle, ...banBoxStyle}} className="clickable" id="blue-ban-4"
                          onClick={this.selectBox.bind(this, "blue-ban-4")}
                          onContextMenu={this.deselectBox.bind(this, "blue-ban-4")}><div style={numberStyle}>5</div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col'>
                  <div style={{display: 'flex'}}>
                    <img src={risenLogo} style={{width: '125px', margin: 'auto'}} alt="Risen Logo"></img>
                  </div>
                </div>
                <div className='col-4'>
                  <div className='row'>
                    <div className="col text-light" style={{textAlign: "right"}}>
                      <input defaultValue="Red Team" style={{...redBoxStyle, ...nameInputStyle}}></input>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col'>
                      <div style={banGridStyle}>
                        <div style={{...redBoxStyle, ...banBoxStyle}} className="clickable" id="red-ban-0"
                          onClick={this.selectBox.bind(this, "red-ban-0")}
                          onContextMenu={this.deselectBox.bind(this, "red-ban-0")}><div style={numberStyle}>1</div></div>
                        <div style={{...redBoxStyle, ...banBoxStyle}} className="clickable" id="red-ban-1"
                          onClick={this.selectBox.bind(this, "red-ban-1")}
                          onContextMenu={this.deselectBox.bind(this, "red-ban-1")}><div style={numberStyle}>2</div></div> 
                        <div style={{...redBoxStyle, ...banBoxStyle}} className="clickable" id="red-ban-2"
                          onClick={this.selectBox.bind(this, "red-ban-2")}
                          onContextMenu={this.deselectBox.bind(this, "red-ban-2")}><div style={numberStyle}>3</div></div>
                        <div style={{width: '10px', backgroundColor: 'orange'}}></div>
                        <div style={{...redBoxStyle, ...banBoxStyle}} className="clickable" id="red-ban-3"
                          onClick={this.selectBox.bind(this, "red-ban-3")}
                          onContextMenu={this.deselectBox.bind(this, "red-ban-3")}><div style={numberStyle}>4</div></div>
                        <div style={{...redBoxStyle, ...banBoxStyle}} className="clickable" id="red-ban-4"
                          onClick={this.selectBox.bind(this, "red-ban-4")}
                          onContextMenu={this.deselectBox.bind(this, "red-ban-4")}><div style={numberStyle}>5</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-2">
                  <div style={pickGridStyle}>
                    <div style={{...blueBoxStyle, ...pickBoxStyle}} className="clickable" id="blue-pick-0"
                      onClick={this.selectBox.bind(this, "blue-pick-0")}
                      onContextMenu={this.deselectBox.bind(this, "blue-pick-0")}><div style={numberStyle}>B1</div></div>
                    <div style={{...blueBoxStyle, ...pickBoxStyle}} className="clickable" id="blue-pick-1"
                      onClick={this.selectBox.bind(this, "blue-pick-1")}
                      onContextMenu={this.deselectBox.bind(this, "blue-pick-1")}><div style={numberStyle}>B2</div></div>
                    <div style={{...blueBoxStyle, ...pickBoxStyle}} className="clickable" id="blue-pick-2"
                      onClick={this.selectBox.bind(this, "blue-pick-2")}
                      onContextMenu={this.deselectBox.bind(this, "blue-pick-2")}><div style={numberStyle}>B3</div></div>
                    <div style={{...blueBoxStyle, ...pickBoxStyle}} className="clickable" id="blue-pick-3"
                      onClick={this.selectBox.bind(this, "blue-pick-3")}
                      onContextMenu={this.deselectBox.bind(this, "blue-pick-3")}><div style={numberStyle}>B4</div></div>
                    <div style={{...blueBoxStyle, ...pickBoxStyle}} className="clickable" id="blue-pick-4"
                      onClick={this.selectBox.bind(this, "blue-pick-4")}
                      onContextMenu={this.deselectBox.bind(this, "blue-pick-4")}><div style={numberStyle}>B5</div></div>
                  </div>
                </div>
                <div className="col deep-section" style={{padding: '10px'}}>
                  <div>
                    <input id="champFilter" type="text" className="text-light" placeholder="Search Champion" style={searchStyle} onChange={this.filterChamps.bind(this)}></input>
                  </div>
                  <div style={{...champGridStyle, ...{maxHeight: '60vh', overflowY: 'scroll', boxSizing: 'content-box'}}}>
                    {
                      Object.keys(this.state.filteredChamps).map(champ => {
                        let style = {...iconStyle, ...{backgroundImage: `url(${require(`../../images/champions/icons/` + champ + `_0.png`)})`, margin: 'auto'}};
                        let onClickFnc = this.selectBox.bind(this, "champ-" + champ);
                        // console.log(champions)
                        if (this.champIsSelected(champ)) {
                          style = Object.assign({}, style, {"filter": "brightness(0.4)"});
                          onClickFnc = null;
                        }
                        return (
                          <div className="clickable" style={{padding: '5px'}} id={"champ-" + champ}>
                            <div key={"img" + champ}
                            style={style} onClick={onClickFnc}></div>
                            <h6 className="center text-light" style={{fontSize: '12px'}}>{champions[champ].name}</h6>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                <div className="col-2">
                  <div style={pickGridStyle}>
                    <div style={{...redBoxStyle, ...pickBoxStyle}} className="clickable" id="red-pick-0"
                      onClick={this.selectBox.bind(this, "red-pick-0")}
                      onContextMenu={this.deselectBox.bind(this, "red-pick-0")}><div style={numberStyle}>R1</div></div>
                    <div style={{...redBoxStyle, ...pickBoxStyle}} className="clickable" id="red-pick-1"
                      onClick={this.selectBox.bind(this, "red-pick-1")}
                      onContextMenu={this.deselectBox.bind(this, "red-pick-1")}><div style={numberStyle}>R2</div></div>
                    <div style={{...redBoxStyle, ...pickBoxStyle}} className="clickable" id="red-pick-2"
                      onClick={this.selectBox.bind(this, "red-pick-2")}
                      onContextMenu={this.deselectBox.bind(this, "red-pick-2")}><div style={numberStyle}>R3</div></div>
                    <div style={{...redBoxStyle, ...pickBoxStyle}} className="clickable" id="red-pick-3"
                      onClick={this.selectBox.bind(this, "red-pick-3")}
                      onContextMenu={this.deselectBox.bind(this, "red-pick-3")}><div style={numberStyle}>R4</div></div>
                    <div style={{...redBoxStyle, ...pickBoxStyle}} className="clickable" id="red-pick-4"
                      onClick={this.selectBox.bind(this, "red-pick-4")}
                      onContextMenu={this.deselectBox.bind(this, "red-pick-4")}><div style={numberStyle}>R5</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }
}

const nameInputStyle = {
  width: '100%',
  border: 0,
  marginBottom: '8px',
  padding: '5px',
  color: 'white'
}

const searchStyle = {
  width: '100%',
  backgroundColor: 'inherit',
  border: '2px #5b5656 solid',
  borderRadius: '5px'
}

const banGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto auto auto auto auto auto',
  columnGap: '10px',
  justifyContent: 'space-between'
}

const pickGridStyle = {
  display: 'grid',
  rowGap: '10px'
}

const champGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, 90px)',
  columnGap: '25px',
  justifyContent: 'space-evenly'
  // rowGap: '5px',
}

const blueBoxStyle = {
  backgroundColor: 'rgb(18, 80, 113)',
  backgroundSize: 'contain'
}

const redBoxStyle = {
  backgroundColor: 'rgb(79, 15, 23)',
  backgroundSize: 'contain'
}

const banBoxStyle = {
  width: '50px',
  height: '50px',
  padding: '5px',
  fontSize: '10px',
  position: 'relative'
}

const pickBoxStyle = {
  width: '100px',
  height: '100px',
  margin: 'auto',
  fontSize: '16px',
  position: 'relative'
}

const iconStyle = {
  width: '75px',
  height: '75px',
  backgroundSize: 'contain'
}

const numberStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  color: 'white',
}