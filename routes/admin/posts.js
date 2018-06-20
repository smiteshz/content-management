const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const fs = require('fs');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');


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

router.get('/edit/:id', (req, res) => {
    Post.findById(req.params.id).then(post => {
        res.render('admin/posts/edit', {post: post});
    }).catch(err => {
        console.log(err);
        res.status(500).send("Unable to retrieve the post");
    })
});

router.post('/create/', (req, res) => {
    let fileName = '';
    if (!isEmpty(req.files)){
        let file = req.files.picture; 
        fileName = file.name;
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
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        files: fileName
    });
    newPost.save().then(savedPost => {
        // console.log(savedPost);
        res.redirect('/admin/posts');
    }).catch(err =>{
        // console.log(err);
        res.status(500).send("Error saving the data");
    });   
});

router.put('/edit/:id', (req, res) => {
    let allowComments = true;
    if (req.body.allowComments){
        allowComments = true;
    }
    else{
        allowComments = false;
    }
    Post.findByIdAndUpdate(req.params.id, {title: req.body.title, status: req.body.status, allowComments: allowComments, body: req.body.body})
    .then(results => {
        res.redirect('/admin/posts');
    }).catch(err => {
        res.status(500).send("Error Updated the Post");
    });
});

router.delete('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(results => {
        if (results){
            fs.unlink(uploadDir + results.files, (err) => {
                if (err) throw err;
            });
            results.remove().then(obj => {res.redirect('/admin/posts')})
            .catch(err => {console.log(err)});
            
        }
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    });
})

module.exports = router;