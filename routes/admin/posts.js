const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        res.status(200).render('admin/posts/', {posts: posts});
    }).catch(err => {
        res.status(500).send("Error retriving records");
    });
});

router.get('/create/', (req, res) => {
    res.render('admin/posts/create');
})

router.post('/create/', (req, res) => {
    console.log(req.body);
    let allowComments = true;
    if (allowComments){
        allowComments = true;
    }
    else{
        allowComments = false;
    }
    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body
    });
    newPost.save().then(savedPost => {
        // console.log(savedPost);
        res.redirect('/admin/posts');
    }).catch(err =>{
        // console.log(err);
        res.status(500).send("Error saving the data");
    });

    
})

module.exports = router;