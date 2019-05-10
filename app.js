var express = require('express');
var app = express();
var router = require('./router/Test')(app);
var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
	console.log('on');
});

app.use(express.static('public'));
