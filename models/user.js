var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://admin:admin123@ds013559.mlab.com:13559/asvsunrise',{ useNewUrlParser: true });
var db = mongoose.connection;

//User Schema
var ApartmentSchema = mongoose.Schema({
	username: {
		type: String,
		
	},
	password: {
		type: String

	},
	owner: {
		type: String

	},
	contact:{
		type: String
	},
	email: {
		type: String
	},
	firstTimesignOn:{
		type: String
	}
});


var Apartment = module.exports = mongoose.model('Apartment', ApartmentSchema,'Apartment');

module.exports.getUserById = function(id, callback){
	Apartment.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	console.log(query);
	console.log(username);
	Apartment.findOne(query, callback);
	
}

module.exports.comparePassword = function(candidatePassword, hash, callback)
{
	console.log(candidatePassword,hash);
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err,salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			newUser.password = hash;
			newUser.save(callback);

		});
	});


}
