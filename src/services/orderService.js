const OrderRepository = require('../repositories/orderRepository');
const ProductRepository = require('../repositories/productRepository');
const { validateCreateOrder, validateUpdateOrder } = require('../validators/orderValidator');
const CustomError = require('../utils/customError');

class OrderService {
  async createOrder(data) {
    try {
      // Validate data
      const validatedData = await validateCreateOrder(data);
      
      // Calculate total amount and create order details data
      let totalAmount = 0;
      const orderDetailsData = [];

      // Get product details and calculate totals
      for (const detail of validatedData.order_details) {
        const product = await ProductRepository.findById(detail.product_id);
        if (!product) {
          throw new Error(`Product with id ${detail.product_id} not found`);
        }

        const subtotal = parseFloat(product.price) * detail.quantity;
        totalAmount += subtotal;

        orderDetailsData.push({
          product_id: detail.product_id,
          quantity: detail.quantity,
          price: product.price,
          subtotal: subtotal
        });
      }

      // Create order
      const order = await OrderRepository.create({
        user_id: validatedData.user_id,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'unpaid'
      });

      // Array untuk menyimpan detail orders
      const orderDetails = [];

      // Create order details
      for (const detailData of orderDetailsData) {
        const detail = await OrderRepository.createDetail({
          order_id: order.id,
          ...detailData
        });
        orderDetails.push(detail);
      }

      // Format response
      return {
        id: order.id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        order_date: order.createdAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderDetails: orderDetails
      };

    } catch (error) {
      throw new CustomError(error.message, 400);
    }
  }

  async getAllOrders(options = {}) {
    try {
      return await OrderRepository.findAll(options);
    } catch (error) {
      throw new CustomError(error.message, 400);
    }
  }

  async getOrderById(id) {
    try {
      const order = await OrderRepository.findById(id);
      if (!order) throw new Error('Order not found');
      return order;
    } catch (error) {
      throw new CustomError(error.message, 400);
    }
  }

  async updateOrder(id, data) {
    try {
      // Check if order exists
      const existingOrder = await OrderRepository.findById(id);
      if (!existingOrder) {
        throw new Error('Order not found');
      }

      // Validate update data
      const validatedData = await validateUpdateOrder(data);

      let updateData = {};
      let orderDetails = await OrderRepository.findOrderDetails(id);

      // If updating status
      if (validatedData.status) {
        updateData.status = validatedData.status;
      }

      // If updating payment_status
      if (validatedData.payment_status) {
        updateData.payment_status = validatedData.payment_status;
      }

      // If updating user_id
      if (validatedData.user_id) {
        updateData.user_id = validatedData.user_id;
      }

      // If there are order details to update
      if (validatedData.order_details) {
        // Delete existing order details
        await OrderRepository.deleteOrderDetails(id);

        // Calculate new total amount
        let totalAmount = 0;
        const orderDetailsData = [];

        // Get product details and calculate totals
        for (const detail of validatedData.order_details) {
          const product = await ProductRepository.findById(detail.product_id);
          if (!product) {
            throw new Error(`Product with id ${detail.product_id} not found`);
          }

          const subtotal = parseFloat(product.price) * detail.quantity;
          totalAmount += subtotal;

          orderDetailsData.push({
            product_id: detail.product_id,
            quantity: detail.quantity,
            price: product.price,
            subtotal: subtotal
          });
        }

        // Update total amount
        updateData.total_amount = totalAmount;

        // Create new order details
        orderDetails = [];
        for (const detailData of orderDetailsData) {
          const detail = await OrderRepository.createDetail({
            order_id: id,
            ...detailData
          });
          orderDetails.push(detail);
        }
      }

      // Update order with new data
      const updatedOrder = await OrderRepository.update(id, updateData);

      // Format response
      return {
        id: updatedOrder.id,
        user_id: updatedOrder.user_id,
        total_amount: updatedOrder.total_amount,
        status: updatedOrder.status,
        payment_status: updatedOrder.payment_status,
        order_date: updatedOrder.createdAt,
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt,
        orderDetails: orderDetails
      };
    } catch (error) {
      throw new CustomError(error.message, 400);
    }
  }

  async deleteOrder(id) {
    try {
      const result = await OrderRepository.delete(id);
      if (!result) throw new Error('Order not found');
      return result;
    } catch (error) {
      throw new CustomError(error.message, 400);
    }
  }
}

module.exports = new OrderService();