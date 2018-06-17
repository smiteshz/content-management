const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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

    }
});

module.exports = mongoose.model('Post', PostSchema);
