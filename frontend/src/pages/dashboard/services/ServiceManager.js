import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Get all orders with pagination
export const getOrders = async (page = 1, limit = 20) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/orders?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw error;
  }
};

// ✅ Get a single order by ID
export const getOrderById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    throw error;
  }
};

// ✅ Create a new order
export const createOrder = async (orderData) => {
  try {
    const res = await axios.post(`${BASE_URL}/orders`, orderData);
    Swal.fire("موفق", "بیل با موفقیت ثبت شد ✅", "success");
    return res.data;
  } catch (error) {
    Swal.fire("خطا", "خطا در ثبت بیل 😢", "error");
    throw error;
  }
};

// ✅ Update an existing order
export const updateOrder = async (id, orderData) => {
  try {
    const res = await axios.put(`${BASE_URL}/orders/${id}`, orderData);
    Swal.fire("موفق", "بیل با موفقیت ویرایش شد ✏️", "success");
    return res.data;
  } catch (error) {
    Swal.fire("خطا", "خطا در ویرایش بیل 😢", "error");
    throw error;
  }
};

// ✅ Delete an order
export const deleteOrder = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/orders/${id}`);
    Swal.fire("حذف شد", "بیل با موفقیت حذف شد 🗑️", "success");
  } catch (error) {
    Swal.fire("خطا", "خطا در حذف بیل 😢", "error");
    throw error;
  }
};
