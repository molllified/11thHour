
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var port  	 = process.env.PORT || 8080;
var passport = require('passport');
var flash 	 = require('connect-flash');
var database = require('./config/database');

mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

require('./config/passport')(passport);

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.set('views', __dirname + '/public/views');
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.set('view engine', 'ejs');

	app.use(express.session({ secret: 'onthespot' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
});


require('./app/routes.js')(app, passport);


app.listen(port);
console.log("App listening on port " + port);
