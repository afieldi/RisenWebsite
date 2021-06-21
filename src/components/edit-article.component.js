import React, {useState, useEffect} from 'react';
import Editor from './articles/editor.component';

export default function EditArticle(props) {
  const [quillObj, setQuillObj] = useState(null);
  const [articleData, setArticleData] = useState({});

  let id = props.match.params.article;
  // let articleData = {}
  useEffect(() => {
    const url = process.env.REACT_APP_BASE_URL + "/articles/modify/" + id;
    fetch(url).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          setArticleData(data);
        })
      }
    })
  }, [])

  useEffect(() => {
    assignData();
  });
  
  function assignData() {
    if (Object.keys(articleData).length === 0) {
      return;
    }
    document.getElementById("title-input").value = articleData.title;
    document.getElementById("name-input").value = articleData.authorDetails ? articleData.authorDetails[0].name : "";
    // console.log(quillObj);
    if (quillObj) {
      quillObj.root.innerHTML = articleData.content;
    }
    document.getElementById("tag-input").value = articleData.tagDetails.map((v) => v.name).join(" ");
  }

  function saveArticle(state) {
    console.log(quillObj.root.innerHTML);
    let title = document.getElementById("title-input").value;
    let name = document.getElementById("name-input").value;

    if (title.length < 3) {
      alert("Input valid title");
      return;
    }
    if (name.length < 3) {
      alert("Input valid Name");
      return;
    }

    let tags = document.getElementById("tag-input").value.split(" ");

    let article = {
      "title": title,
      "author": name,
      "tags": tags,
      "content": quillObj.root.innerHTML,
      "text": quillObj.getText(),
      "published": state ? state : (articleData.published ? articleData.published : false)
    }

    const url = process.env.REACT_APP_BASE_URL + "/articles/modify/" + id;
    fetch(url, {
      method: "PUT",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(article)
    }).then(res => {
      if (res.status === 200) {
        alert("Article submitted");
        window.location.reload();
      }
      else {
        alert("Error! Try again");
      }
    });
  }

  return (
    <section>
      <br></br>
      <br></br>
      <div className="container text-light">
        <div class="input-group mb-3 bg-dark">
          <div class="input-group-prepend">
            <span class="input-group-text" id="title-label">Title</span>
          </div>
          <input type="text" id="title-input" class="form-control bg-dark text-light border border-warning" placeholder="My Glorious Article" aria-label="ArticleTitle" aria-describedby="title-label" />
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text border border-warning" id="name-label">Name</span>
          </div>
          <input type="text" id="name-input" class="form-control bg-dark text-light border border-warning" placeholder="John Doe" aria-label="Username" aria-describedby="name-label" />
        </div>
        <Editor setQuill={setQuillObj}></Editor>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text border border-warning" id="name-label">Tags</span>
          </div>
          <input type="text" id="tag-input" class="form-control bg-dark text-light border border-warning" placeholder="Tag1 Tag2" aria-label="Username" aria-describedby="name-label" />
        </div>
        <button type="button" className="btn btn-outline-warning" onClick={saveArticle.bind(this, undefined)}>Save</button>
        {
          articleData.published === true ? 
          <button type="button" className="btn btn-outline-warning" onClick={saveArticle.bind(this, false)}>Unpublish</button>
          :
          <button type="button" className="btn btn-outline-warning" onClick={saveArticle.bind(this, true)}>Publish</button>
        }
      </div>
    </section>
  )
}