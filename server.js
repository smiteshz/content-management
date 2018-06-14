const express = require('express');
const app = express();
const expressHandlerbars = require('express-handlebars');
const path = require('path');
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlerbars({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

app.use('/', home);
app.use('/admin', admin);

app.listen(4444, () => {
    console.log("Listening to the port")
})