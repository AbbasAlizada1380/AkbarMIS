import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DigitalSection from "./DigitalSection";
import OffsetSection from "./OffsetSection";
import BillSummary from "./BillSummary";
import PrintOrderBill from "./PrintOrderBill";
import Pagination from "../pagination/Pagination.jsx";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/ServiceManager.js";
import {
  FaUser,
  FaPhone,
  FaMoneyBillWave,
  FaFileInvoice,
  FaSave,
  FaEye,
  FaPrint,
  FaLayerGroup,
} from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Orders = () => {
  const [record, setRecord] = useState({
    customer: { name: "", phone_number: "" },
    digital: [],
    offset: [],
    total_money_digital: 0,
    total_money_offset: 0,
    total: 0,
    recip: 0,
    remained: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // New state for selected order
  const [activeSection, setActiveSection] = useState("digital");

  const fetchOrders = async (page = 1) => {
    const data = await getOrders(page, 20);
    setOrders(data.orders);
    console.log(data);

    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
  };

  const onPageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchOrders(pageNumber);
    }
  };
  useEffect(() => {
    fetchOrders(currentPage);
  }, []);
  useEffect(() => {
    if (!record) return;

    const totalDigital = (record.digital || []).reduce(
      (sum, d) => sum + Number(d.money || 0),
      0
    );
    const totalOffset = (record.offset || []).reduce(
      (sum, o) => sum + Number(o.money || 0),
      0
    );
    const total = totalDigital + totalOffset;

    setRecord((prev) => ({
      ...prev,
      total_money_digital: Number(totalDigital.toFixed(2)),
      total_money_offset: Number(totalOffset.toFixed(2)),
      total: Number(total.toFixed(2)),
      remained: Number((total - Number(prev.recip || 0)).toFixed(2)),
    }));
  }, [record?.digital, record?.offset, record?.recip]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setRecord({
      ...record,
      customer: { ...record.customer, [name]: value },
    });
  };

  const handleRecipChange = (e) => {
    const value = Number(e.target.value || 0);
    setRecord({
      ...record,
      recip: value,
    });
  };

  const saveRecord = async () => {
    try {
      await axios.post(`${BASE_URL}/orders`, record);
      Swal.fire("موفق", "بیل با موفقیت ثبت شد", "success"); // Success message in Dari
      fetchOrders(); // Refresh the orders list after saving
      setRecord({
        customer: { name: "", phone_number: "" },
        digital: [],
        offset: [],
        total_money_digital: 0,
        total_money_offset: 0,
        total: 0,
        recip: 0,
        remained: 0,
      });
    } catch (err) {
      Swal.fire("خطا", "ثبت بیل موفقیت‌آمیز نبود", "error"); // Error message in Dari
    }
  };

  // Function to handle viewing bill for a specific order
  const handleViewBill = (order) => {
    setSelectedOrder(order);
    setIsBillOpen(true);
  };

  // Function to close bill and reset selected order
  const handleCloseBill = () => {
    setIsBillOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          سیستم مدیریت سفارشات
        </h1>
        <p className="text-gray-600">مدیریت سفارش‌های مشتریان و خدمات چاپی</p>
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-full">
            <FaUser className="text-blue-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">معلومات مشتری</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700 mb-2">
              نام مشتری
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="نام مشتری را وارد کنید"
                value={record.customer.name || ""}
                onChange={handleCustomerChange}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              />
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700 mb-2">
              شماره تماس
            </label>
            <div className="relative">
              <input
                type="text"
                name="phone_number"
                placeholder="شماره تماس را وارد کنید"
                value={record.customer.phone_number || ""}
                onChange={handleCustomerChange}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              />
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Toggle Buttons */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-full">
            <FaLayerGroup className="text-purple-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">بخش‌های چاپ</h2>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection("digital")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
              activeSection === "digital"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaPrint className="text-lg" />
            افزودن چاپ دیجیتال
          </button>

          <button
            onClick={() => setActiveSection("offset")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
              activeSection === "offset"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaPrint className="text-lg" />
            افزودن چاپ افست
          </button>
        </div>

        {/* Dynamic Section Display */}
        <div className="transition-all duration-300">
          {activeSection === "digital" && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <DigitalSection record={record} setRecord={setRecord} />
            </div>
          )}

          {activeSection === "offset" && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <OffsetSection record={record} setRecord={setRecord} />
            </div>
          )}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <BillSummary record={record} />
      </div>

      {/* Payment Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-full">
            <FaMoneyBillWave className="text-green-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">اطلاعات پرداخت</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ دریافتی
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="مبلغ دریافتی را وارد کنید"
                value={record.recip}
                onChange={handleRecipChange}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              />
              <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ باقیمانده
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="مبلغ باقیمانده"
                value={record.remained}
                readOnly
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-end space-x-4">
            <button
              onClick={saveRecord}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaSave className="text-lg" />
              ذخیره اطلاعات
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6">
        <button
          onClick={() => handleViewBill(record)}
          className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <FaEye className="text-lg" />
          مشاهده فاکتور
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-full">
            <FaFileInvoice className="text-orange-600 text-xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">لیست سفارشات</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">شماره</th>
                <th className="border border-gray-300 px-4 py-2">نام مشتری</th>
                <th className="border border-gray-300 px-4 py-2">شماره تماس</th>
                <th className="border border-gray-300 px-4 py-2">مجموع</th>
                <th className="border border-gray-300 px-4 py-2">دریافتی</th>
                <th className="border border-gray-300 px-4 py-2">باقیمانده</th>
                <th className="border border-gray-300 px-4 py-2">تاریخ</th>
                <th className="border border-gray-300 px-4 py-2">بیل</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {order.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.customer?.name || order.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.customer?.phone_number || order.phone_number}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.total}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.recip}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.remained}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(order.createdAt).toLocaleDateString("fa-AF")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleViewBill(order)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
                      >
                        <FaEye className="text-sm" />
                        مشاهده فاکتور
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-gray-500 py-4">
                    هیچ سفارشی وجود ندارد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} on onPageChange={onPageChange} />
        </div>
      </div>

      {/* Print Bill Modal */}
      {isBillOpen && (
        <PrintOrderBill
          isOpen={isBillOpen}
          onClose={handleCloseBill}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default Orders;
