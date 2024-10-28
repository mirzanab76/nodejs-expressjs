const OrderService = require('../services/orderService');

// Create new order
exports.create = async (req, res) => {
  const order = await OrderService.createOrder(req.body);
  res.status(201).json(order);
};

// Get all orders
exports.findAll = async (req, res) => {
  const orders = await OrderService.getAllOrders(req.query);
  res.json(orders);
};

// Get order by id
exports.findOne = async (req, res) => {
  const { id } = req.params;
  const order = await OrderService.getOrderById(id);
  res.json(order);
};

// Update order
exports.update = async (req, res) => {
  const { id } = req.params;
  const order = await OrderService.updateOrder(id, req.body);
  res.json(order);
};

// Delete order
exports.delete = async (req, res) => {
  const { id } = req.params;
  await OrderService.deleteOrder(id);
  res.json({
    message: "Order deleted successfully"
  });
};