var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var Apartment = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title: 'Register'});
});


router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});


router.post	('/login',
  passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'invalid username or password'}),
  function(req, res) {
    		
  	req.flash('success','You are now logged in');
  	res.redirect('/');

  });


passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	Apartment.getUserById(id, function(err, user){
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done){
	Apartment.getUserByUsername(username, function(err, user){
		if(err) {
			throw err;
				}
		if(!user){	
			return done(null, false, {message:'Unknown User'});
		}

	Apartment.comparePassword(password, user.password, function(err, isMatch){
		if(err) return done(err);
		if(isMatch)
		{	
			return done(null, user);
		}
		else
		{
			return done(null, false, {message:'Invalid Password'});
		}

	}); 
	});

}));

router.post('/register', function(req, res, next) {
 console.log(req.body);
 var name = req.body.name;
 var email = req.body.email;
 var username = req.body.username;
 var password = req.body.password;
 var password2 = req.body.password2;
 var contact = req.body.contact;
 //console.log(req.file);
 var fso = "True";

	//Form Validation
/*	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email field is not Valid').isEmail();
	req.checkBody('username','Username field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();	
	req.checkBody('password2','Passwords do not match').equals(req.body.password);
	
	//Check Errors
	var errors = req.validationErrors();

	if(errors)
	{
		console.log('Errors');
		res.render('register',{
			errors: errors
		});
	}else
	{ */
		//console.log('No Errors');
		var newUser = new Apartment({
			owner: name,
			email: email,
			username: username,
			password: password,
			firstTimesignOn: fso,
			contact: contact
		});

		Apartment.createUser(newUser, function(err, user){
			if(err)
			{
				throw err;
			}
			console.log(user);
		});
		req.flash('success','You are now Registered and can Login');
		res.location('/');
		res.redirect('/');
	
 
});

router.get('/logout',function(req, res){
	req.logout();
	req.flash('success','Your now logged out');
	res.redirect('/users/login');
});

module.exports = router;
