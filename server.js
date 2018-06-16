const express = require('express');
const app = express();
const expressHandlerbars = require('express-handlebars');
const path = require('path');
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlerbars({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

app.use('/', home);
app.use('/admin/', admin);
app.use('/posts/', posts);

app.listen(4444, () => {
    console.log("Listening to the port")
})