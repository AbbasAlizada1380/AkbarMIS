// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../Controllers/OrdersController.js";

const OrdersRout = express.Router();

OrdersRout.post("/", createOrder);
OrdersRout.get("/", getOrders);
OrdersRout.get("/:id", getOrderById);
OrdersRout.put("/:id", updateOrder);
OrdersRout.delete("/:id", deleteOrder);

export default OrdersRout;
