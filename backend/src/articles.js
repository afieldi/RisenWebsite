const mongoose = require('mongoose');

const Tag = require('../models/tag.model');
const Author = require('../models/author.model');
const Article = require('../models/article.model');

async function addArticle(id, data, callback) {
  let article = null;
  let mongooseId = undefined;
  let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: true };

  try {
    mongooseId = mongoose.Types.ObjectId(id);
    article = await Article.findById(mongooseId);
  }
  catch (e) {
    console.log(e);
    article = await Article.create({});
    article.published = false;
  }

  let searchAuthor = data.author.replace(/ /g, "").toLocaleLowerCase();
  Author.findOneAndUpdate({strid: searchAuthor}, {
    strid: searchAuthor,
    name: data.author
  }, options, async (err, authorResult) => {
    
    if (err) {
      callback(500)
    }
    let tags = [];
    for (let tag of data.tags) {
      tags.push(tag.replace(/ /g, "").toLocaleLowerCase());
    }
    Tag.find({
      strid: { $in: tags }
    }, async (err, tagResults) => {
      console.log(tagResults);
      let foundTags = []
      for (let result of tagResults) {
        let i = tags.indexOf(result.strid);
        if (i !== -1) {
          foundTags.push(+i);
        }
      }
      for (let i in data.tags) {
        if (-1 !== foundTags.indexOf(+i)) {
          continue;
        }
        let tag = data.tags[i];
        tagResults.push(
          await Tag.create({
            strid: tag.replace(/ /g, "").toLocaleLowerCase(),
            name: tag
          })
        )
      }
      article.tags = tagResults;
      article.author = authorResult;
      article.content = data.content;
      article.text = data.text;
      article.title = data.title;
      if (data.published != undefined) {
        article.published = data.published;
      }
      await article.save();
      callback(200, article);
    });
  });
}

module.exports = {
  addArticle: addArticle
}