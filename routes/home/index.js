const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email: email}).then(user => {
        if(!user){
            return done(null, false, {message: `User ${email} was not registered`});
        }
        bcrypt.compare(password, user.password, (err, matched) => {
            if (err){
                return (err);
            }
            if(matched){
                return done(null, user);
            }
            else{
                console.log("Invalid Password");
                return done(null, false, {message: `User ${email} does not have the right password`});
            }
        });
    }).catch(err => {
        return (err)
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
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
    Post.findById(req.params.id)
    .populate('comments')
    .populate('createdBy')
    .then(posts => {
            Category.find({}).then(categories => {
            res.render('home/post', {post: posts, categories: categories});
        });
    }).catch(err => {
        res.status(500).send(err);
    });
});

router.get('/login', (req, res) => {
    res.render('home/login', {layout: 'home'});
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');

});


router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password !== req.body.passwordConfirm){
        errors.push({message: "Password fields do not match."})
    }
    if (errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        User.findOne({email: req.body.email})
        .then(userExist => {

            if(userExist){
                res.render('home/register', {
                    errors: [{message: `Email ID ${userExist.email} already exists!`}],
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                })
            } else {
                let hashedPassword = '';
                bcrypt.genSalt(10, (err, salt) => {
                if(err) console.log(err);
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                if(err) console.log(err);
                hashedPassword = hash;
                let newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashedPassword
                });
                newUser.save()
                .then(savedUser => {
                    res.render('home/login', {notifications: [{message: `User ${savedUser.firstName} ${savedUser.lastName} successfully registered. Continue to log in!`}]});
                }).catch(err => {
                    if (err)
                    console.log(err);
                    res.status(500).send(err);
                 });
            });
        });
            }
        })
        .catch(err => {
            console.log(err);
        }); 
}
});

router.get('/register/', (req, res) => {
    res.render('home/register');
})

router.get('/about/', (req, res) => {
    res.render('home/about');
})

module.exports = router;
