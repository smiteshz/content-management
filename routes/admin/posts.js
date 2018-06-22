const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const fs = require('fs');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        Category.findById(posts.category).then(category => {
            res.render('admin/posts/', {posts: posts, categories: category});
        }).catch(err => {
            res.status(500).send(err);
        })
        // res.render('admin/posts/', {posts: posts});
    }).catch(err => {
        res.status(500).send("Error retriving records");
    });
});

router.get('/create/', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/posts/create', {categories:categories});    
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.get('/edit/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        res.render('admin/posts/edit', {post: post});
    }).catch(err => {
        console.log(err);
        res.status(500).send("Unable to retrieve the post");
    })
});

router.post('/create/', (req, res) => {
    let fileName = 'default.jpg';
    if (!isEmpty(req.files)){
        let file = req.files.picture; 
        fileName = Date.now() + '_' + file.name;
        file.mv('./public/uploads/' + fileName, err => {
            if(err) res.status(500).send(err);
        });
    }
    let allowComments = true;
    if (req.body.allowComments){
        allowComments = true;
    }
    else{
        allowComments = false;
    }
    const newPost = new Post({
        category: req.body.category,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        files: fileName
    });
    newPost.save().then(savedPost => {
        // console.log(savedPost);
        req.flash('post_created', `${savedPost.title} was successfully saved as a ${savedPost.status} post.`);
        res.redirect('/admin/posts');
    }).catch(err =>{
        console.log(err);
        res.status(500).send("Error saving the data");
    });   
});

router.put('/edit/:id', (req, res) => {
    let fileName = 'default.jpg';
    let allowComments = true;
    if (req.body.allowComments){
        allowComments = true;
    }
    else{
        allowComments = false;
    }
    Post.findById(req.params.id).then(results =>{
        results.title = req.body.title;
        results.status = req.body.status;
        results.allowComments = allowComments;
        if (!isEmpty(req.files)){
            let file = req.files.picture; 
            fileName = Date.now() + '_' + file.name;
            file.mv('./public/uploads/' + fileName, err => {
                if(err) res.status(500).send(err);
            });
            results.files = fileName;
        }
        results.body = req.body.body;
        results.save().then(updatedPost => {
            req.flash('post_updated', `${updatedPost.title} was successfully updated!`);
            res.redirect('/admin/posts');
        }).catch(err => {
            res.status(500).send(err);
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send("Error updating the post");
    });
});

router.delete('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(results => {
        if (results){
            if (results.files === "default.jpg"){
            }
            else{
                fs.unlink(uploadDir + results.files, (err) => {
                    if (err) console.log (err);
                });
            }
            results.remove().then(obj => {
                req.flash('post_deleted', `${results.title} was successfully deleted`);
                res.redirect('/admin/posts');
            })
            .catch(err => {console.log(err)});
        }
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    });
})

module.exports = router;