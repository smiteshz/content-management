const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const fs = require('fs');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const {userAuthenticated} = require('../../helpers/authentication-helper');

router.all('/*', userAuthenticated,(req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.find({})
    .populate('category')
    .then(posts => {
            res.render('admin/posts/', {posts: posts});
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
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
        Category.find({}).then(categories => {
            res.render('admin/posts/edit', {post: post, categories:categories});
        }).catch(err => {
            res.status(500).send(err);
        });
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
        createdBy: req.user,
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
            res.redirect('/admin/posts/my-posts');
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
    .populate('comments')
    .then(results => {
        if (results){
            if (results.files === "default.jpg"){
            }
            else{
                if (results.comments.length > 0){
                    results.comments.forEach(comment => {
                        comment.remove();
                    });
                }
                fs.unlink(uploadDir + results.files, (err) => {
                    if (err) console.log (err);
                });
            }
            results.remove().then(obj => {
                req.flash('post_deleted', `${results.title} was successfully deleted`);
                res.redirect('/admin/posts/my-posts');
            })
            .catch(err => {console.log(err)});
        }
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    });
})

router.get('/my-posts', (req, res) => {
    Post.find({createdBy: req.user.id})
    .then(posts => {
        res.render('admin/posts/my-posts', {posts: posts});
    })
    .catch(err => {
        console.log(err);
        res.status(500).render("Unable to retrive your posts");
    })
});

module.exports = router;