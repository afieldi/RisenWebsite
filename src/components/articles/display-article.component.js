import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'quill/dist/quill.core.css';

export default function DisplayArticle(props) {
  const id = props.match.params.article;
  const [articleData, setArticleData] = useState({
    authorDetails: [],
    tagDetails: []
  });

  useEffect(() => {
    const url = process.env.REACT_APP_BASE_URL + "/articles/modify/" + id;
    fetch(url).then(res => {
      res.json().then(data => {
        setArticleData(data);
      })
    })
  }, [])

  return (
    <div className="dark-section text-light">
      <div className="container">
        <h2>{articleData.title}</h2>
        {
          articleData.authorDetails.map(author => {
            return (
              <Link to={`/articles/list?author=${author._id}`}>
                <h5 className="clickable">{articleData.authorDetails.map(v => <i>{v.name}</i>)}</h5>
              </Link>
            )
          })
        }
        <hr style={{backgroundColor: 'white'}}></hr>
        <div className="ql-editor" dangerouslySetInnerHTML={{__html: articleData.content}}></div>
        <hr style={{backgroundColor: 'white'}}></hr>
        {articleData.tagDetails.map(v => {
          return (
            <Link to={`/articles/list?tag=${v._id}`}>
              <span class="badge badge-warning clickable tag">{v.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}