import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import { getQueryValues } from '../../Helpers';

export default function ListArticles(props) {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("All Articles");
  const [lastQuery, setLastQuery] = useState("-1");
  // let lastQuery = "-1";
  const dateStyle = {
    textAlign: 'right',
    color: '#cecdcd',
    fontStyle: 'italic'
  }

  const q = getQueryValues(props);

  useEffect(() => {
    console.log(lastQuery)
    if (lastQuery === props.location.search) {
      // console.log("fuck");
      // console.log(articles);
      return;
    }
    const url = process.env.REACT_APP_BASE_URL + "/articles/published" + props.location.search;
    fetch(url).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          // console.log(data);
          // console.log(getTitle(data))
          setArticles(data);
          setLastQuery(props.location.search ? props.location.search : "");
          setTitle(getTitle(data, props.location.search ? props.location.search : ""));
        })
      }
    })
  })


  function getDateTime(timestamp) {
    let d = new Date(timestamp);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`
  }

  function getTitle(arts, query) {

    if (query.includes("author")) {
      for (let a of arts) {
        for (let author of a.authorDetails) {
          return "Articles From: " + author.name;
        }
      }
    }
    else if (query.includes("tag")) {
      for (let a of arts) {
        for (let tag of a.tagDetails) {
          if (query.includes(tag._id)) {
            return `Articles Tagged: ${tag.name}`;
          }
        }
      }
    }
    else {
      return "All Articles";
    }
  }
  return (
    <div className="dark-section text-light">
      <div className="container">
        <div>
          <h1>{title}</h1>
        </div>
        <hr style={{backgroundColor: 'white'}}></hr>
        {
          articles.map(article => {
            return (
              <div className="risen-stats-block">
                <div className='risen-stats-header'>
                  <div className="row">
                    <div className="col">
                      <Link to={"/articles/view/" + article._id}><h2 style={{color: 'white'}} className="clickable">{article.title}</h2></Link>
                    </div>
                    <div className="col" style={dateStyle}>
                      {getDateTime(article.updatedAt)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      {
                        article.authorDetails.map(author => 
                          <Link to={`/articles/list?author=${author._id}`}>
                            <i className="clickable" style={{color: '#a6d9ff'}}>by {author.name}</i>
                          </Link>
                        )
                      }
                      {
                        article.tagDetails.map(v => {
                          return (
                            <Link to={`/articles/list?tag=${v._id}`}>
                              <span class="badge badge-warning clickable tag">{v.name}</span>
                            </Link>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="risen-stats-body">
                  <div className="row">
                    <div className="col">
                      {article.text.substring(0, 500)}
                      <Link to={"/articles/view/" + article._id}>  <i>Full Article</i></Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}