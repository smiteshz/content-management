const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication-helper');

router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Category.find({}).then(results => {
        res.render('admin/categories/', {categories: results});
    }).catch(err => {
        res.status(500).send(err);
    })
});

router.post('/create/', (req, res) => {
    let newCategory = new Category({
        title: req.body.Title
    });
    newCategory.save().then(results => {
        res.redirect('/admin/categories');
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.get('/:id', (req, res) => {
    Category.findById(req.params.id).then(results => {
        res.render('admin/categories/edit', {category: results});
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.put('/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id, {title: req.body.Title, date: Date.now()}).then(results => {
        res.redirect('/admin/categories/');
    }).catch(err => {
        res.status(500).send(err);
    })
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(results => {
        res.redirect('/admin/categories/');
    }).catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;