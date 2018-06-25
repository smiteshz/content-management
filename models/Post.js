const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true,

    },
    status:{
        type: String,
        default: "Public"
    },
    allowComments:{
        type: Boolean,
        default: true
    },
    body:{
        type: String,
        required: true

    },
    files : {
        type: String
    },
    date :{
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
});

module.exports = mongoose.model('Post', PostSchema);
