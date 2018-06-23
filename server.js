//Package Imports
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const expressHandlerbars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

//File Imports
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');

const {select, formatDate} = require('./helpers/handlebars-helpers');
const {mongoDbUrl} = require('./config/database');


//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoDbUrl).then((db) => {
    console.log('Connected to the database');
}).catch(err => {console.log(err)});

//View Engine Setting
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlerbars({defaultLayout: 'home', helpers: {select:select, formatDate: formatDate}}));
app.set('view engine', 'handlebars');

//Middlewares
app.use(upload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'Smitesh123',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


app.use((req, res, next) => {
    res.locals.post_created = req.flash('post_created');
    res.locals.post_updated = req.flash('post_updated');
    res.locals.post_deleted = req.flash('post_deleted');
    next();
});

//Routes
app.use('/', home);
app.use('/admin/', admin);
app.use('/admin/posts/', posts);
app.use('/admin/categories/', categories);


//Listen Server
app.listen(4444, () => {
    console.log("Listening to the port")
});