import React from "react";
import moment from "moment-jalaali";
import { FaPhone, FaPrint, FaTimes } from "react-icons/fa";

const PrintOrderBill = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  console.log(order);

  // Helper functions to check if items are filled (same as in Orders component)
  const isDigitalItemFilled = (item) => {
    return (
      item.name.trim() !== "" ||
      item.quantity > 0 ||
      item.height > 0 ||
      item.weight > 0 ||
      item.price_per_unit > 0 ||
      item.money > 0
    );
  };

  const isOffsetItemFilled = (item) => {
    return (
      item.name.trim() !== "" ||
      item.quantity > 0 ||
      item.price_per_unit > 0 ||
      item.money > 0
    );
  };

  // Filter out empty items
  const filledDigital = (order.digital || []).filter(isDigitalItemFilled);
  const filledOffset = (order.offset || []).filter(isOffsetItemFilled);

  // Recalculate totals based on filled items only
  const total_money_digital = filledDigital.reduce(
    (sum, d) => sum + Number(d.money || 0),
    0
  );
  const total_money_offset = filledOffset.reduce(
    (sum, o) => sum + Number(o.money || 0),
    0
  );
  const total = total_money_digital + total_money_offset;
  const remained = total - (order.recip || 0);

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
            <div>نام مشتری: {order.customer?.name || order.name || "—"}</div>
            <div>
              شماره تماس:{" "}
              {order.customer?.phone_number || order.phone_number || "—"}
            </div>
          </div>
        </div>

        {/* Digital Printing Section - Only show if there are filled items */}
        {filledDigital.length > 0 && (
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
                  <th className="border p-1">ارتفاع (cm)</th>
                  <th className="border p-1">عرض (cm)</th>
                  <th className="border p-1">مساحت (cm²)</th>
                  <th className="border p-1">قیمت واحد</th>
                  <th className="border p-1">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {filledDigital.map((d, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1">{d.name || "—"}</td>
                    <td className="border p-1">{d.quantity || 0}</td>
                    <td className="border p-1">{d.height || 0}</td>
                    <td className="border p-1">{d.weight || 0}</td>
                    <td className="border p-1">{d.area || 0}</td>
                    <td className="border p-1">
                      {formatCurrency(d.price_per_unit || 0)}
                    </td>
                    <td className="border p-1">
                      {formatCurrency(d.money || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-2 text-sm font-bold">
              مجموع چاپ دیجیتال: {formatCurrency(total_money_digital)}
            </div>
          </div>
        )}

        {/* Offset Printing Section - Only show if there are filled items */}
        {filledOffset.length > 0 && (
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
                  <th className="border p-1">قیمت واحد</th>
                  <th className="border p-1">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {filledOffset.map((o, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1">{o.name || "—"}</td>
                    <td className="border p-1">{o.quantity || 0}</td>
                    <td className="border p-1">
                      {formatCurrency(o.price_per_unit || 0)}
                    </td>
                    <td className="border p-1">
                      {formatCurrency(o.money || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-2 text-sm font-bold">
              مجموع چاپ افست: {formatCurrency(total_money_offset)}
            </div>
          </div>
        )}

        {/* Show message if no items are filled */}
        {filledDigital.length === 0 && filledOffset.length === 0 && (
          <div className="border p-4 rounded mb-4 text-center text-gray-500">
            هیچ محصولی ثبت نشده است
          </div>
        )}

        {/* Bill Summary */}
        <div className="border-t border-gray-300 pt-3 mt-auto text-sm space-y-1">
          <div className="flex justify-between">
            <span>مجموع چاپ دیجیتال:</span>
            <span>{formatCurrency(total_money_digital)}</span>
          </div>
          <div className="flex justify-between">
            <span>مجموع چاپ افست:</span>
            <span>{formatCurrency(total_money_offset)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
            <span>مجموع کل:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>مقدار پرداختی (رسید):</span>
            <span>{formatCurrency(order.recip || 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-red-600">
            <span>باقیمانده:</span>
            <span>{formatCurrency(remained)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t pt-3 text-center text-xs text-gray-600">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaPhone /> <span>تماس: 079xxxxxxx</span>
          </div>
          <p>تشکر از اعتماد شما به مطبعه اکبر !</p>
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
