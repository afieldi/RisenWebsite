import React, {Component} from 'react';

import Minimap from '../images/minimap.png'

export default class DotMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dots: []
        }
    }

    toTime(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    componentDidUpdate() {
        if(this.props.dots && this.props.dots.length !== this.state.dots.length) {
            this.setState({
                dots: this.props.dots
            });
        }
    }

    render() {
        return (
            <section>
                <div style={holderStyle}>
                    <img src={Minimap}></img>
                    {
                        this.state.dots.map((dot, i) => {
                            let curDotStyle = JSON.parse(JSON.stringify(dotStyle));
                            curDotStyle["left"] = dot[0];

                            curDotStyle["bottom"] = dot[1];
                            curDotStyle["backgroundColor"] = dot[4];
                            return (
                                <div style={curDotStyle} className="risen-tooltip" key={"dot-" + i}>
                                    <span className="risen-tooltiptext">{dot[2]}: {this.toTime(dot[3])}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        )
    }
}

const holderStyle = {
    display: 'inline-block',
    position: 'relative'
}

const dotStyle = {
    backgroundColor: 'red',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    position: 'absolute'
}