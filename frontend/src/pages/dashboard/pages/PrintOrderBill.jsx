import React from "react";
import moment from "moment-jalaali";
import { FaPhone, FaPrint, FaTimes } from "react-icons/fa";

const PrintOrderBill = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  console.log(order);
  
  const today = moment().format("jYYYY/jMM/jDD");
  const billNumber = `ORD-${Math.random()
    .toString(36)
    .substr(2, 6)
    .toUpperCase()}`;

  const formatCurrency = (num) =>
    Number(num || 0).toLocaleString("fa-AF", {
      style: "currency",
      currency: "AFN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 print:bg-transparent">
      <div
        id="printable-area"
        className="bg-white w-[210mm] h-[297mm] shadow-lg rounded-lg overflow-hidden flex flex-col p-6 print:w-full print:h-full print:rounded-none print:shadow-none print:p-0"
        style={{ direction: "rtl" }}
      >
        {/* Header */}
        <div className="text-center border-b-4 border-blue-700 pb-2 mb-4">
          <h1 className="text-2xl font-bold text-blue-800">
            Akbar printing press
          </h1>
        </div>

        {/* Bill Info */}
        <div className="flex justify-between text-sm mb-4 bg-gray-100 p-2 rounded">
          <div>
            <span className="font-semibold">شماره فاکتور:</span> {billNumber}
          </div>
          <div>
            <span className="font-semibold">تاریخ:</span> {today}
          </div>
        </div>

        {/* Customer Info */}
        <div className="border p-3 rounded mb-4">
          <h2 className="text-base font-bold mb-2 text-blue-700">
            مشخصات مشتری
          </h2>
          <div className="flex justify-between text-sm">
            <div>نام مشتری: {order.customer.name || "—"}</div>
            <div>شماره تماس: {order.customer.phone_number || "—"}</div>
          </div>
        </div>

        {/* Digital Printing Section */}
        {order.digital.length > 0 && (
          <div className="border p-3 rounded mb-4">
            <h2 className="text-base font-bold text-green-700 mb-2">
              چاپ دیجیتال
            </h2>
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-1">#</th>
                  <th className="border p-1">شرح</th>
                  <th className="border p-1">تعداد</th>
                  <th className="border p-1">قیمت</th>
                </tr>
              </thead>
              <tbody>
                {order.digital.map((d, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1">{d.name}</td>
                    <td className="border p-1">{d.quantity}</td>
                    <td className="border p-1">{formatCurrency(d.money)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-2 text-sm font-bold">
              مجموع چاپ دیجیتال: {formatCurrency(order.total_money_digital)}
            </div>
          </div>
        )}

        {/* Offset Printing Section */}
        {order.offset.length > 0 && (
          <div className="border p-3 rounded mb-4">
            <h2 className="text-base font-bold text-purple-700 mb-2">
              چاپ افست
            </h2>
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-1">#</th>
                  <th className="border p-1">شرح</th>
                  <th className="border p-1">تعداد</th>
                  <th className="border p-1">قیمت</th>
                </tr>
              </thead>
              <tbody>
                {order.offset.map((o, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1">{o.name}</td>
                    <td className="border p-1">{o.quantity}</td>
                    <td className="border p-1">{formatCurrency(o.money)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-2 text-sm font-bold">
              مجموع چاپ افست: {formatCurrency(order.total_money_offset)}
            </div>
          </div>
        )}

        {/* Bill Summary */}
        <div className="border-t border-gray-300 pt-3 mt-auto text-sm space-y-1">
          <div className="flex justify-between">
            <span>مجموع کل:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>مقدار پرداختی (رسید):</span>
            <span>{formatCurrency(order.recip)}</span>
          </div>
          <div className="flex justify-between font-bold text-red-600">
            <span>باقیمانده:</span>
            <span>{formatCurrency(order.total - (order.recip || 0))}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t pt-3 text-center text-xs text-gray-600">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaPhone /> <span>تماس: 079xxxxxxx</span>
          </div>
          <p>تشکر از اعتماد شما به مطبعه اکبر  !</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-5 left-5 flex gap-3 print:hidden">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
        >
          <FaTimes /> بستن
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          <FaPrint /> چاپ فاکتور
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintOrderBill;
