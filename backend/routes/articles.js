const router = require('express').Router();	
const mongoose = require('mongoose');

const Tag = require("../models/tag.model");
const Article = require('../models/article.model');
const Author = require('../models/author.model');

const { addArticle } = require('../src/articles');

router.route("/modify/:id").get((req, res) => {
  try {
    let pipeline = [
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: '_id',
          as: 'tagDetails'
        }
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails'
        }
      }
    ]
    Article.aggregate(pipeline, (err, articles) => {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(articles[0]);
      }
    })
  }
  catch (e) {
    res.status(404).json("Article Not found")
  }
}).put((req, res) => {
  // Of form 
  /*
  {
    author: "John Doe",
    title: "Article Title",
    tags: ["Tag 1", "Tag 2"],
    content: <html />,
    published: false
  }
  */
  let id = req.params.id;
  addArticle(id, req.body, (status, article) => {
    if (status === 200) {
      res.status(status).json(article);
    }
    else {
      res.status(status).json("Something went wrong");
    }
  })
  // Article.create()
}).delete((req, res) => {

});

router.route("/published").get((req, res) => {
  let matcher = {
    published: true,
  }
  if (req.query.author) {
    try {
      matcher["author"] = mongoose.Types.ObjectId(req.query.author);
    }
    catch {}
  }
  if (req.query.tag) {
    try {
      matcher["tags"] = { $elemMatch: { $eq: mongoose.Types.ObjectId(req.query.tag)} };
    }
    catch {}
  }

  let pipeline = [
    {
      $match: matcher
    },
    {
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tagDetails'
      }
    },
    {
      $lookup: {
        from: 'authors',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDetails'
      }
    }
  ]
  Article.aggregate(pipeline, (err, articles) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    }
    else {
      res.status(200).json(articles);
    }
  })
  // Article.find({published: true}, (err, articles) => {
  //   if (err) {
  //     res.status(500).json(err);
  //   }
  //   else {
  //     res.status(200).json(articles);
  //   }
  // })
})

router.route("/tag").get((req, res) => {

});

module.exports = router;