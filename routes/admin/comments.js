const express = require('express');
const router = express.Router();
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication-helper');

router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Comment.find({})
    .populate('user')
    .then(comments => {
        res.render('admin/comments/', {comments: comments});
    })
});

router.post('/', (req, res) => {
    Post.findById(req.body.id).then(post => {
        let newComment = new Comment({
            user: req.user,
            body: req.body.body
        });
        post.comments.push(newComment);
        post.save().then(savedPost => {
            newComment.save().then(savedComment => {
                res.redirect(`/posts/${req.body.id}`);
            }).catch(err => {
                res.status(500).send(err);
            });
        })
    }).catch(err =>{
        res.status(500).send(err);
    })
    
});

router.delete('/:id', (req, res) =>{
    Comment.findByIdAndRemove(req.params.id)
    .then(deletedComment => {
        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data) => {
            if(err) console.log(err);
            res.redirect('/admin/comments');
        });
        // res.redirect('/admin/comments');
    }).catch(err => {
        res.status(500).send(err);
    });
    ;
});

module.exports = router;