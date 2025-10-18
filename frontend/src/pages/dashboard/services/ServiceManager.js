import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Helper function for showing Swal messages
const showAlert = (title, text, icon = "success") => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: "تایید",
    timer: icon === "success" ? 1500 : null,
  });
};

// ✅ Get all orders with pagination
export const getOrders = async (page = 1, limit = 20) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/orders?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    showAlert("خطا", "بارگذاری بیل‌ها موفقیت‌آمیز نبود", "error");
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
    showAlert("خطا", "بیل موردنظر یافت نشد", "error");
    throw error;
  }
};

// ✅ Create a new order
export const createOrder = async (orderData) => {
  try {
    if (!orderData.customer.name || orderData.customer.name.trim() === "") {
      showAlert("خطا", "نام مشتری نمی‌تواند خالی باشد", "error");
      return;
    }

    const res = await axios.post(`${BASE_URL}/orders`, orderData);
    showAlert("موفق", "بیل با موفقیت ثبت شد ✅", "success");
    return res.data;
  } catch (error) {
    console.error(error);
    showAlert("خطا", "خطا در ثبت بیل 😢", "error");
    throw error;
  }
};

// ✅ Update an existing order
export const updateOrder = async (id, orderData) => {
  try {
    const res = await axios.put(`${BASE_URL}/orders/${id}`, orderData);
    showAlert("موفق", "بیل با موفقیت ویرایش شد ✏️", "success");
    return res.data;
  } catch (error) {
    console.error(error);
    showAlert("خطا", "خطا در ویرایش بیل 😢", "error");
    throw error;
  }
};

// ✅ Delete an order
export const deleteOrder = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/orders/${id}`);
    showAlert("حذف شد", "بیل با موفقیت حذف شد 🗑️", "success");
  } catch (error) {
    console.error(error);
    showAlert("خطا", "خطا در حذف بیل 😢", "error");
    throw error;
  }
};
