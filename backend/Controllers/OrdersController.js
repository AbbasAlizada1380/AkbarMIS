import { Order, Digital, Offset } from "../Models/Orders.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      digital,
      offset,
      recip,
      remained,
      total,
      total_money_digital,
      total_money_offset,
    } = req.body;

    // Create order with customer JSON
    const order = await Order.create({
      customer,
      recip,
      remained,
      total,
      total_money_digital,
      total_money_Offset: total_money_offset,
    });

    // Create digital items
    if (digital && digital.length) {
      const digitalItems = digital.map((item) => ({
        ...item,
        orderId: order.id,
      }));
      await Digital.bulkCreate(digitalItems);
    }

    // Create offset items
    if (offset && offset.length) {
      const offsetItems = offset.map((item) => ({
        ...item,
        orderId: order.id,
      }));
      await Offset.bulkCreate(offsetItems);
    }

    // Return the new order with items
    const newOrder = await Order.findByPk(order.id, {
      include: [
        { model: Digital, as: "digital" },
        { model: Offset, as: "offset" },
      ],
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Digital, as: "digital" },
        { model: Offset, as: "offset" },
      ],
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        { model: Digital, as: "digital" },
        { model: Offset, as: "offset" },
      ],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order", error });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer,
      recip,
      remained,
      total,
      total_money_digital,
      total_money_offset,
      digital,
      offset,
    } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update main order
    await order.update({
      customer: customer ?? order.customer,
      recip: recip ?? order.recip,
      remained: remained ?? order.remained,
      total: total ?? order.total,
      total_money_digital: total_money_digital ?? order.total_money_digital,
      total_money_Offset: total_money_offset ?? order.total_money_Offset,
    });

    // Update digital items (delete old, insert new)
    if (digital) {
      await Digital.destroy({ where: { orderId: id } });
      if (digital.length > 0) {
        const digitalItems = digital.map((item) => ({ ...item, orderId: id }));
        await Digital.bulkCreate(digitalItems);
      }
    }

    // Update offset items (delete old, insert new)
    if (offset) {
      await Offset.destroy({ where: { orderId: id } });
      if (offset.length > 0) {
        const offsetItems = offset.map((item) => ({ ...item, orderId: id }));
        await Offset.bulkCreate(offsetItems);
      }
    }

    // Return updated order with items
    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: Digital, as: "digital" },
        { model: Offset, as: "offset" },
      ],
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order", error });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Delete associated digital and offset items
    await Digital.destroy({ where: { orderId: id } });
    await Offset.destroy({ where: { orderId: id } });

    // Delete the order
    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order", error });
  }
};
