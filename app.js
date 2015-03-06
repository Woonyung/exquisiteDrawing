var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();


var themes = {
	happiness: {
		name: 'happiness',
		question: 'What are the things that makes you happy?',
		isOpen: false
	},
	memory: {
		name: 'memory',
		question: 'What are your favorite memory?',
		isOpen: true
	}	
}

var currentTheme = themes['memory'];
// currentTheme.name, currentTheme.question, currentTheme.isOpen

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
	theme: String, // dictates which theme the picture is
	question: String
});


////////////////////// ROUTES //////////////////////
// if routes are "/" render the index file
app.get('/', function(req,res){

	Info.find({},function(err,photos){


		var themeArray = Object.keys(themes);

		var dataToReturn = [];


		for(var i=0;i<themeArray.length;i++){
			var photoCount = 0;
			for(var j=0;j<photos.length;j++){
				if(photos[j].theme == themeArray[i] ) photoCount++;
				else continue;
			}
			var currentData = {name: themeArray[i], count: photoCount, isOpen: themes[themeArray[i]].isOpen}
			dataToReturn.push(currentData);
		}

		console.log(dataToReturn);
		var data = {
			themes: dataToReturn	
		}

		res.render('index.html',data);
	})

});

app.get('/newDRAWING', function(req,res){
	// only shows the most recent one
	Info.find({theme: currentTheme}).sort('-Date').limit(1).exec(function(err,info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('newdrawing.html', { photos: info })
		}
	});
});

// to see whole gallery / css
app.get('/gallllery', function(req,res){
	Info.find({}, function(err, info){
		if(err){
			res.json(err);
		} else {
			// info data is the object that I defined in the gallery
			res.render('gallery.html', { photos: info })
		}
	});
});


app.get('/theme/:theme', function(req,res){
	var requestedTheme = req.param('theme');

	// first, we need to make sure that the requested Theme is in our theme list
	// if it is NOT, we need to redirect the user to home pages
	if(!contains(Object.keys(themes),requestedTheme)) return res.redirect('/');

	Info.find({ theme: requestedTheme }).sort('Date').exec(function(err,info){
		if(err){
			res.json(err);
		} else {
			console.log(info);

			// if the requested theme is still open, send to new drawing
			if(themes[requestedTheme].isOpen) {
				var data = {
					theme: requestedTheme,
					photo: info[info.length-1]
				}
				res.render('newdrawing.html', data)
			}
			else if(!themes[requestedTheme].isOpen) {
				res.render('gallery.html', { photos: info })
			}
			// else if the requested theme is closed, send to gallery

			// // if info data is not empty;
			// if ( info.length > 0 ){
			// 	// info data is the object that I defined in the gallery
			// 	res.render('newdrawing.html', { infoData: info })
			// } else {
			// 	// if info data is empty
			// 	res.render('nopictures.html');
			// }
		}
	});		
});



app.post('/submitDrawing', function(req,res){
	var infoData = {
		Date: req.body.Date,
		imageData : req.body.imageData,
		theme: currentTheme.name // update this every time it changes
		// theme: req.body.theme // front-end: if it's in the POST request, would look like this
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

function contains(arr, str) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}



////////////////////////////////////////////////////

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
})

