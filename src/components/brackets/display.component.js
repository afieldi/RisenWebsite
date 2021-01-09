import React, { Component } from 'react';

export default class Display extends Component {
  constructor(props) {
    super(props);
    this.tierWidth = 200;
    this.tierHeight = 50;
    this.offsetWidth = 300;
    this.offsetHeight = 80;
    this.testData = {
      "stages": [
        {
          "matches": [
            {
              "matchNumber": 1,
              "teamA": "Team 1",
              "teamB": "Team 4",
              "winnerMatch": 5,
              "loserMatch": 4
            },
            {
              "matchNumber": 2,
              "teamA": "Team 2",
              "teamB": "Team 3",
              "winnerMatch": 5,
              "loserMatch": 3
            },
            {
              "matchNumber": 3,
              "teamA": "",
              "teamB": "Team 6",
              "winnerMatch": 6,
              "loserMatch": 0
            },
            {
              "matchNumber": 4,
              "teamA": "",
              "teamB": "Team 5",
              "winnerMatch": 6,
              "loserMatch": 0
            },
            {
              "matchNumber": 5,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 8,
              "loserMatch": 7
            },
            {
              "matchNumber": 6,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 7,
              "loserMatch": 0
            },
            {
              "matchNumber": 7,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 8,
              "loserMatch": 0
            },
            {
              "matchNumber": 8,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 0,
              "loserMatch": 0
            },
          ]
        }
      ] 
    }
    this.testData = {
      "stages": [
        {
          "matches": [
            {
              "matchNumber": 1,
              "teamA": "Team 4",
              "teamB": "Team 5",
              "winnerMatch": 3,
              "loserMatch": 5
            },
            {
              "matchNumber": 2,
              "teamA": "Team 3",
              "teamB": "Team 6",
              "winnerMatch": 4,
              "loserMatch": 6
            },
            {
              "matchNumber": 3,
              "teamA": "Team 1",
              "teamB": "",
              "winnerMatch": 9,
              "loserMatch": 7
            },
            {
              "matchNumber": 4,
              "teamA": "Team 2",
              "teamB": "",
              "winnerMatch": 9,
              "loserMatch": 8
            },
            {
              "matchNumber": 5,
              "teamA": "",
              "teamB": "Team 7",
              "winnerMatch": 7,
              "loserMatch": 0
            },
            {
              "matchNumber": 6,
              "teamA": "Team 1",
              "teamB": "Team 8",
              "winnerMatch": 8,
              "loserMatch": 0
            },
            {
              "matchNumber": 7,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 10,
              "loserMatch": 0
            },
            {
              "matchNumber": 8,
              "teamA": "Team 1",
              "teamB": "Team 4",
              "winnerMatch": 10,
              "loserMatch": 0
            },
            {
              "matchNumber": 9,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 12,
              "loserMatch": 11
            },
            {
              "matchNumber": 10,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 11,
              "loserMatch": 0
            },
            {
              "matchNumber": 11,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 12,
              "loserMatch": 0
            },
            {
              "matchNumber": 12,
              "teamA": "",
              "teamB": "",
              "winnerMatch": 0,
              "loserMatch": 0
            },
          ]
        }
      ] 
    }
    this.state = {
      tierStruct: {},
      maxTier: 1
    }
  }

  componentDidMount() {
    this.createTierStructure(this.testData.stages[0].matches)
    // console.log(this.createTierStructure(this.testData.stages[0].matches));
  }

  createTierStructure(matches) {
    
    let matchTiers = {};
    let tierCount = {};

    for(let match of matches) {
      let mN = match["matchNumber"];
      matchTiers[mN] = {
        "match": match,
        "tier": 0,
        "height": 0,
        "priority": 0 // Winner matches should be on top, losers on the bottom, lower prio is better
      };
    }

    for(let match of matches) {
      let mN = match["matchNumber"];
      let wN = match["winnerMatch"];
      let lN = match["loserMatch"];

      if (wN === 0) {
        matchTiers[mN].priority += 1;
      }
      
      if (wN !== 0) {
        if (matchTiers[wN].match.teamA.length === 0) {
          matchTiers[wN].match.teamA = `<i>Winner of Match ${mN}</i>`;
        }
        else if (matchTiers[wN].match.teamB.length === 0) {
          matchTiers[wN].match.teamB = `<i>Winner of Match ${mN}</i>`;
        }
        if(matchTiers[wN]) {
          if (matchTiers[wN].tier < matchTiers[mN].tier + 1) {
            matchTiers[wN].tier = matchTiers[mN].tier + 1;
          }
        }
        else {
          matchTiers[wN].tier = matchTiers[mN].tier + 1;
        }
      }
      
      if (lN !== 0) {
        matchTiers[lN].priority += 2;
        if (matchTiers[lN].match.teamA.length === 0) {
          matchTiers[lN].match.teamA = `<i>Loser of Match ${mN}</i>`;
        }
        else if (matchTiers[lN].match.teamB.length === 0) {
          matchTiers[lN].match.teamB = `<i>Loser of Match ${mN}</i>`;
        }
        if(matchTiers[lN]) {
          if (matchTiers[lN].tier < matchTiers[mN].tier + 1) {
            matchTiers[lN].tier = matchTiers[mN].tier + 1;
          }
        }
        else {
          matchTiers[lN].tier = matchTiers[mN].tier + 1;
        }
      }
    }

    let matchFormat = [];
    for (let mT of Object.values(matchTiers)) {
      if (matchFormat[mT.tier] == undefined) {
        matchFormat[mT.tier] = [];
      }
      matchFormat[mT.tier].push(mT);
    }

    let tierOffset = 0;
    for (let tier in matchFormat) {
      matchFormat[tier].sort((a,b) => {
        if (a.priority > b.priority) {
          return 1;
        }
        else if (a.priority < b.priority) {
          return -1;
        }
        return 0;
      })
      let tierArr = matchFormat[tier];
      if (Number(tier) !== 0) {
        tierOffset += (matchFormat[tier-1].length - matchFormat[tier].length) / 2
        if (tierOffset < 0) {
          tierOffset = 0;
        }
      }
      for (let i in tierArr) {
        matchTiers[tierArr[i].match.matchNumber].height = +i + tierOffset;
      }
    }


    let maxTier = 0;

    for (let mT of Object.values(matchTiers)) {
      let wN = mT.match.winnerMatch;
      if (wN == 0) {
        continue;
      }
      if (mT.tier > maxTier) {
        maxTier = mT.tier;
      }
      if (matchTiers[wN].tier - mT.tier > 1) {
        matchTiers[wN].height += mT.height - matchTiers[wN].height;
      }
    }
    this.setState({
      tierStruct: matchTiers,
      maxTier: maxTier + 2
    })
    return matchTiers; 
  }

  renderMatch(match) {
    return (
      <g>
        <rect width="25" height="25" x="0" y="0" style={{fill:'#787a80'}} />
        <rect width="200" height="25" x="25" y="0" style={{fill:'#58595e'}} />
        <text x="5" y="18" style={{fill: 'white'}}>{match.match.matchNumber}</text>
        <text x="30" y="18" style={{fill: 'white'}}>{match.match.teamA}</text>

        <rect width="25" height="25" x="0" y="28" style={{fill:'#787a80'}} />
        <rect width="200" height="25" x="25" y="28" style={{fill:'#58595e'}} />
        <text x="5" y="46" style={{fill: 'white'}}>{match.match.matchNumber}</text>
        <text x="30" y="46" style={{fill: 'white'}}>{match.match.teamB}</text>
      </g>
    )
  }

  renderLine(fromMatch, toMatch) {
    let fromX = (this.offsetWidth * fromMatch.tier) + this.tierWidth + 10;
    let fromY = (this.offsetHeight * fromMatch.height) + (this.tierHeight / 2);
    let toX = (this.offsetWidth * toMatch.tier) - 10;
    let toY = (this.offsetHeight * toMatch.height) + (this.tierHeight / 2);
    return (
      <g>
        <path stroke="white" stroke-width="3" fill="none" d={`M ${fromX} ${fromY} l ${(toX - fromX) / 2} 0 l 0 ${toY - fromY} l ${(toX - fromX) / 2} 0`}></path>
        {/* <path d="M 10 10 H 90 V 90 H 10 L 10 10"/> */}
      </g>
    )
  }

  render () {
    return (
      <section style={{paddingTop: '200px'}}>
        {
          this.state.tierStruct ? 
          <svg width={this.state.maxTier * this.offsetWidth} height="500">
          {
            Object.values(this.state.tierStruct).map((match) => {
              return (
                <svg width="200" height="100" x={this.offsetWidth * match.tier} y={this.offsetHeight * match.height}>
                  {this.renderMatch(match)}
                </svg>
              )
            })
          }
          {
            Object.values(this.state.tierStruct).map((match) => {
              let wN = match.match.winnerMatch;
              return wN !== 0 ? 
                this.renderLine(
                  match,
                  this.state.tierStruct[wN]
                ) : null;
            })
          }
        </svg> : null
        }
      </section>
    )
  }
}