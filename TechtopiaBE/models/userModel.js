const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userId: String,
	username: String,
	email: String,
	password: String,
	firstName: String,
	lastName: String,
	address: String,
	city: String,
	zip: String,
	orders: [
		{
			orderId: String
		}
	]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
