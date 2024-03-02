const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	orderId: String,
	userId: String,
	products: [
		{
			productId: String,
			productQuantity: Number
		}
	],
	orderDate: String,
	pricePaid: Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
