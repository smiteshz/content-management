const express = require('express');
const mongoose = require('mongoose');
const app = express();
const expressHandlerbars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const path = require('path');
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const {select} = require('./helpers/handlebars-helpers');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/cms').then((db) => {
    console.log('Connected to the database');
}).catch(err => {console.log(err)});





app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlerbars({defaultLayout: 'home', helpers: {select:select}}));
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use('/', home);
app.use('/admin/', admin);
app.use('/admin/posts/', posts);

app.listen(4444, () => {
    console.log("Listening to the port")
})