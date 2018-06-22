const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        Category.find({}).then(categories => {
            res.render('home/index', {posts: posts, categories: categories});    
        })
    }).catch(err => {
        res.status(500).send(err);
    })
})

router.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id).then(posts => {
        Category.find({}).then(categories => {
            res.render('home/post', {post: posts, categories: categories});
        });
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.get('/login/', (req, res) => {
    res.render('home/login');
})

router.get('/register/', (req, res) => {
    res.render('home/register');
})

router.get('/about/', (req, res) => {
    res.render('home/about');
})

module.exports = router;
