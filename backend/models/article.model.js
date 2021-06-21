const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    strid: { type: String },
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: false },
    title: { type: String },
    content: { type: String },
    text: { type: String },
    tags: [{type: Schema.Types.ObjectId, ref: 'Tag' }],
    published: { type: Boolean }
}, {
    timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;