var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var passport = require('passport');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.configure(function(){
	// server port number
	app.set('port', process.env.PORT || 3000);

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.favicon());
	app.use(express.methodOverride());
    app.use(express.session({ secret: '34ur3hruewn' }));

	//  templates directory to 'views'
	app.set('views', __dirname + '/views');

	// setup template engine - we're using Hogan-Express
	app.set('view engine', 'html');
	app.set('layout','layout'); // use layout.html as the default layout 
	app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

// DATABASE INTERACTION //

var mongoose = require('mongoose'); // mongodb
mongoose.connect(process.env.MONGOLAB_URI); // connect to the mongolab database

var Schema = mongoose.Schema;

var Info = mongoose.model('Info', {
	Date: String,
	imageData: String,
	theme: String, // dictates which theme the picture is
	question: String,
	user: {type:Schema.ObjectId, ref:'User'}
});


var User = mongoose.model('User',{
	name: String,
	facebookId: String,
	drawings: [{type:Schema.ObjectId, ref:'Info'}]
});


// LOG IN //

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// SESSION SUPPORT, SERIALIZE USER
passport.serializeUser(function(user, done) {
  console.log('in serializeUser');
  console.log(user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id,function(err,user){
  	console.log('in deserializeUser');  	
  	console.log(user);
    if(err) done(err,null);
    else done(null,user);
  })
});


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log('Facebook user logging in!>> ' + profile);
      // get user details in profile field
      var facebookId = profile.id;
      var name = profile.displayName;
      User.findOne({facebookId:facebookId},function(err,data){
      	if(err) console.log(err);
      	console.log(data);
      	if(data==null||data.length==0){
      		// we have a new user to save! (they aren't in database yet)
      		var user = new User({
				name: name,
				facebookId: facebookId     			
      		})
      		user.save(function(err,user_data){
      			if(err) console.log(err);
      			console.log('created a new user! ' +  user_data)
      			return done(null, user_data);
      		})
      	}
      	else{
      		// they already signed up! continue...
      		console.log(data);
      		console.log('they are an existing user! ' + data.name)
      		return done(null, data);
      	}
      })
    });
  }
));


// THEMES //

var themes = {
	weather: {
		name: 'weather',
		question: 'test test test',
		isOpen: false
	},
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

////////////////////// ROUTES //////////////////////
// if routes are "/" render the index file
app.get('/', function(req,res){
	if(!req.user) return res.redirect('/login'); // if not logged in, make them log in
	Info.find({},function(err,photos){


		var themeArray = Object.keys(themes);

		var dataToReturn = [];

		for(var i = 0 ; i < themeArray.length; i++){
			var photoCount = 0;
			for( var j = 0; j < photos.length; j++){
				if(photos[j].theme == themeArray[i] ) photoCount++;
				else continue;
			}
			var currentData = {name: themeArray[i], count: photoCount, isOpen: themes[themeArray[i]].isOpen}
			dataToReturn.push(currentData);
		}

		// console.log(dataToReturn);
		var data = {
			themes: dataToReturn,
			user: req.user	
		}

		res.render('index.html', data);
	})

});

// i don't need new drawing route..
// app.get('/newDRAWING', function(req,res){
	// if(!req.user) return res.redirect('/login'); // if not logged in, make them log in
	// // console.log(req.user);

// 	// only shows the most recent one
// 	Info.find({theme: currentTheme}).sort('-Date').limit(1).exec(function(err,info){
// 		if(err){
// 			res.json(err);
// 		} else {
// 			console.log(info);
// 			// info data is the object that I defined in the gallery
// 			res.render('newdrawing.html', { photos: info })
// 		}
// 	});
// });

// submission page
app.get('/submission', function(req,res){
	res.render('submission.html');
});

// to see whole gallery / css
app.get('/gallery', function(req,res){
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
	if(!req.user) return res.redirect('/login'); // if not logged in, make them log in
	// console.log(req.user);

	var requestedTheme = req.param('theme');

	// first, we need to make sure that the requested Theme is in our theme list
	// if it is NOT, we need to redirect the user to home pages
	if(!contains(Object.keys(themes),requestedTheme)) return res.redirect('/');

	Info.find({ theme: requestedTheme }).sort('Date').exec(function(err,info){
		if(err){
			res.json(err);
		} else {
			// console.log(info);

			// if the requested theme is still open, send to new drawing
			if( themes[requestedTheme].isOpen ) {
				var data = {
					theme: requestedTheme,
					question: themes[requestedTheme]['question'], //
					photo: info[info.length-1]
				}
				// console.log(data);
				res.render('newdrawing.html', data)
			}
			else if( !themes[requestedTheme].isOpen ) {
				var data = {
					question: themes[requestedTheme]['question'],
					photos: info 
				}
				res.render('gallery.html', data)
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

app.get('/users', function(req,res){
	res.render("userpage.html");
})


app.post('/submitDrawing', function(req,res){
	var infoData = {
		Date: req.body.Date,
		imageData : req.body.imageData,
		theme: currentTheme.name, // update this every time it changes
		// theme: req.body.theme // front-end: if it's in the POST request, would look like this
		user: req.user._id
	}

	var i = new Info(infoData);
	i.save(function (err, doc){
		if (err) {
			console.log(err);
		} else {
			console.log("DRAWING SAVED INTO DATABASE!!!!!!!!!");

			// now need to update the user, push the photo Id into their list of photos... doc._id;
			var currentUser = req.user._id;
			User.findByIdAndUpdate(currentUser,{$push:{drawings:doc._id}},function(err,data){
				console.log('update the user, pushed the drawing into their array!')
				return res.redirect('/gallery');
			})
		}
	});

});

// LOG IN ROUTES //

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// END Log In Routes //

// function to see if a string exists in an array
function contains(arr, str) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}


// 404 PAGE -- keep this at the last
app.get('*', function(req, res){
  res.render('404page.html');
});

////////////////////////////////////////////////////

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('express server listening on port ' + app.get('port'));
})

