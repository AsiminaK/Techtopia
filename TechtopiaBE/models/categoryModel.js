const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: String,
	products: [
		{
			productId: String,
			name: String,
			price: Number,
			image: String
		}
	]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
