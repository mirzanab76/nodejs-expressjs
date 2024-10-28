class OrderRepository {
  constructor() {
    const models = require('../models');
    this.Order = models.Order;
    this.OrderDetail = models.OrderDetail;
  }

  async create(data) {
    return await this.Order.create(data);
  }

  async createDetail(data) {
    return await this.OrderDetail.create(data);
  }

  async findById(id) {
    return await this.Order.findByPk(id);
  }

  async update(id, data) {
    const order = await this.findById(id);
    if (order) {
      return await order.update(data);
    }
    return null;
  }

  async delete(id) {
    const order = await this.findById(id);
    if (order) {
      return await order.destroy();
    }
    return false;
  }

  async deleteOrderDetails(orderId) {
    return await this.OrderDetail.destroy({
      where: { order_id: orderId }
    });
  }

  async findOrderDetails(orderId) {
    return await this.OrderDetail.findAll({
      where: { order_id: orderId }
    });
  }
}

module.exports = new OrderRepository();