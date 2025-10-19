import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DigitalSection from "./DigitalSection.jsx";
import OffsetSection from "./OffsetSection.jsx";
import BillSummary from "./BillSummary.jsx";
import PrintOrderBill from "./PrintOrderBill.jsx";
import { FaArrowCircleDown, FaArrowCircleUp, FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Pagination from "../pagination/Pagination.jsx";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  toggleDelivery,
  payRemaining,
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
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import SearchBar from "../searching/SearchBar.jsx";
const OrdersList = () => {
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
  const searchRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSection, setActiveSection] = useState("digital");
  const [editMode, setEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const fetchOrders = async (page = 1) => {
    const data = await getOrders(page, 20);
    setOrders(data.orders);
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
      if (editMode) {
        // Update existing order
        await updateOrder(editingOrderId, record);
      } else {
        // Create new order
        await createOrder(record);
      }

      fetchOrders(currentPage);
      resetForm();
    } catch (err) {
      Swal.fire(
        "خطا",
        editMode ? "ویرایش بیل موفقیت‌آمیز نبود" : "ثبت بیل موفقیت‌آمیز نبود",
        "error"
      );
    }
  };

  const resetForm = () => {
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
    setEditMode(false);
    setEditingOrderId(null);
    setActiveSection("digital");
  };

  const handleEditOrder = (order) => {
    // Transform the order data to match the record structure
    setRecord({
      customer: {
        name: order.customer?.name || order.name || "",
        phone_number: order.customer?.phone_number || order.phone_number || "",
      },
      digital: order.digital || [],
      offset: order.offset || [],
      total_money_digital: order.total_money_digital || 0,
      total_money_offset: order.total_money_offset || 0,
      total: order.total || 0,
      recip: order.recip || 0,
      remained: order.remained || 0,
    });
    setEditMode(true);
    setEditingOrderId(order.id);

    // Scroll to the top of the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleViewBill = (order) => {
    setSelectedOrder(order);
    setIsBillOpen(true);
  };

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
        {editMode && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <FaEdit className="text-lg" />
              <span className="font-semibold">
                حالت ویرایش - در حال ویرایش سفارش #{editingOrderId}
              </span>
            </div>
          </div>
        )}
      </div>

      {editMode && (
        <>
          {" "}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  معلومات مشتری
                </h2>
              </div>
              {editMode && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <FaTimes className="text-sm" />
                  لغو ویرایش
                </button>
              )}
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
              <h2 className="text-2xl font-bold text-gray-800">
                اطلاعات پرداخت
              </h2>
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
                  className={`flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    editMode
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  } text-white`}
                >
                  <FaSave className="text-lg" />
                  {editMode ? "ویرایش اطلاعات" : "ذخیره اطلاعات"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Orders Table */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => searchRef.current?.reset()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowCircleDown className="text-xl" />
          پاک کردن جستجو
        </button>

        <SearchBar ref={searchRef} onResults={setSearchResult} />
      </div>
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
                <th className="border border-gray-300 px-4 py-2">
                  تحویل داده شده
                </th>
                <th className="border border-gray-300 px-4 py-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {(searchResult && searchResult.length > 0
                ? searchResult
                : orders
              ).map((order, index) => (
                <tr key={order.id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {order.id || "#"}
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
                  <td className="border border-gray-300 px-4 py-2 flex gap-2">
                    {/* Toggle delivery */}
                    <button
                      onClick={async () => {
                        try {
                          const updated = await toggleDelivery(
                            order.id,
                            order.isDelivered
                          );

                          // Update main orders
                          setOrders((prev) =>
                            prev.map((o) => (o.id === order.id ? updated : o))
                          );

                          // Update search result if it exists
                          setSearchResult((prev) =>
                            prev?.length
                              ? prev.map((o) =>
                                  o.id === order.id ? updated : o
                                )
                              : prev
                          );
                        } catch (err) {
                          console.error("Error toggling delivery:", err);
                        }
                      }}
                      className="p-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      {order.isDelivered ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <ImCross className="text-red-500" />
                      )}
                    </button>

                    {/* Pay remaining */}
                    <button
                      onClick={async () => {
                        try {
                          const updated = await payRemaining(order);

                          // Update main orders
                          setOrders((prev) =>
                            prev.map((o) => (o.id === order.id ? updated : o))
                          );

                          // Update search result if it exists
                          setSearchResult((prev) =>
                            prev?.length
                              ? prev.map((o) =>
                                  o.id === order.id ? updated : o
                                )
                              : prev
                          );
                        } catch (err) {
                          console.error("Error paying remaining:", err);
                        }
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      پرداخت باقی‌مانده
                    </button>
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewBill(order)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
                      >
                        <FaEye className="text-sm" />
                        مشاهده فاکتور
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const updated = await handleEditOrder(order);
                            setOrders((prev) =>
                              prev.map((o) => (o.id === order.id ? updated : o))
                            );
                          } catch (err) {
                            console.error("Error editing order:", err);
                          }
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
                      >
                        <FaEdit className="text-sm" />
                        ویرایش
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await deleteOrder(order.id);
                            setOrders((prev) =>
                              prev.filter((o) => o.id !== order.id)
                            );
                          } catch (err) {
                            console.error("Error deleting order:", err);
                          }
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
                      >
                        <FaTimes className="text-sm" />
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {(!orders || orders.length === 0) &&
                (!searchResult || searchResult.length === 0) && (
                  <tr>
                    <td colSpan="9" className="text-gray-500 py-4">
                      هیچ سفارشی وجود ندارد
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
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

export default OrdersList;
