const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication-helper');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', userAuthenticated, (req, res) => {
    res.render('admin/index');
});

router.post('/generate-fake-posts/', (req, res) => {
    for(let i=0; i < req.body.amount; i++){
        let post = new Post({
            title: faker.lorem.sentence(),
            status: 'Public',
            allowComments: faker.random.boolean(),
            body: faker.lorem.paragraph()
        });
        post.save((err, result) => {
            if (err){
                throw err;
            }
        });
    }
    res.redirect('/admin/posts');
});

module.exports = router;