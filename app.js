var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();

var currentTheme = 'memory'; // set this equal to the current theme of the week

var mongoose = require('mongoose'); // mongodb
mongoose.connect(process.env.MONGOLAB_URI); // connect to the mongolab database


app.configure(function(){
	// server port number
	app.set('port', process.env.PORT || 5000);

	//  templates directory to 'views'
	app.set('views', __dirname + '/views');

	// setup template engine - we're using Hogan-Express
	app.set('view engine', 'html');
	app.set('layout','layout'); // use layout.html as the default layout 
	app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express


	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});


var Info = mongoose.model('Info', {
	Date: String,
	imageData: String,
	theme: String // dictates which theme the picture is
});


////////////////////// ROUTES //////////////////////
// if routes are "/" render the index file
app.get('/', function(req,res){
	res.render('index.html');
});


app.get('/gallery', function(req,res){
	Info.find({}, function(err, info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('gallery.html', { infoData: info })
		}
	});
});

app.get('/theme/:theme', function(req,res){
	var requestedTheme = req.param('theme');

	Info.find({theme:requestedTheme}).sort('-Date').exec(function(err,info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('newdrawing.html', { infoData: info })
		}
	});		
});

//http://stackoverflow.com/questions/5830513/how-do-i-limit-the-number-of-returned-items
app.get('/new', function(req,res){
	// only shows the most recent one
	Info.find({theme: currentTheme}).sort('-Date').limit(1).exec(function(err,info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('newdrawing.html', { infoData: info })
		}
	});

});


app.post('/submitDrawing', function(req,res){
	var infoData = {
		Date: req.body.Date,
		imageData : req.body.imageData,
		//theme: currentTheme // update this every time it changes
		theme: req.body.theme // if it's in the POST request, would look like this
	}

	var i = new Info(infoData);
	i.save(function (err, doc){
		if (err) {
			console.log(err);
		} else {
			console.log("SAVED INTO DATABASE!!!!!!!!!");
			res.redirect('/gallery');
		}
	});

});


////////////////////////////////////////////////////

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
})

