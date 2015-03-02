var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// the following are the user permission levels
//   basic  :  access to only basic rules
//	 full   :  access to all content from dnd players handbook
//   paid   :  access to custom spellbooks and additional features
//   admin  :  access to full app functionality including administration

// user schema 
var UserSchema = new Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true, select: false },
	permissions: { type: String, default: 'basic', required: true }
	// custom spell slots will be added here?
});

UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, null, null, function(err, hash) { 
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);