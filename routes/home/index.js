const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Post.find({}).then(results => {
        res.render('home/index', {posts: results});    
    }).catch(err => {
        res.status(500).send(err);
    })
})

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
