const { Order } = require("../model/Order");
exports.fetchOrdersByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const orders = await Order.find({ user: user });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    console.log("doc", doc);
    res.status(201).json(doc);

    console.log("Order Placed Successfully");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndDelete(id);

    res.status(201).json(doc);

    console.log("Order delete successfully from cart");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete from Order" });
  }
};
