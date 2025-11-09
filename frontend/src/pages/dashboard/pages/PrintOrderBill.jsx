import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { FaPhone, FaPrint, FaTimes } from "react-icons/fa";

const PrintOrderBill = ({ isOpen, onClose, order, autoPrint }) => {
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Helper functions to check if items are filled - more relaxed version
  const isDigitalItemFilled = (item) => {
    return (
      item?.name?.trim() !== "" ||
      (item?.quantity > 0 && (item?.price_per_unit > 0 || item?.money > 0))
    );
  };

  const isOffsetItemFilled = (item) => {
    return (
      item?.name?.trim() !== "" ||
      (item?.quantity > 0 && (item?.price_per_unit > 0 || item?.money > 0))
    );
  };

  const formatCurrency = (num) => {
    const number = Number(num || 0);
    return number.toLocaleString("fa-AF") + " افغانی";
  };

  const handlePrint = () => {
    window.print();
  };

  // Data loading effect
  useEffect(() => {
    if (isOpen && order) {
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(false);
    }
  }, [isOpen, order]);

  // Auto print when component is ready
  useEffect(() => {
    if (autoPrint && isOpen && order) {
      // Set a small delay to ensure the component is fully rendered with data
      const timer = setTimeout(() => {
        setIsReadyToPrint(true);
      }, 500);

      return () => {
        clearTimeout(timer);
        setIsReadyToPrint(false);
      };
    }
  }, [autoPrint, isOpen, order]);

  // Trigger print when ready
  useEffect(() => {
    if (isReadyToPrint && autoPrint) {
      const printTimer = setTimeout(() => {
        window.print();
      }, 300);

      return () => clearTimeout(printTimer);
    }
  }, [isReadyToPrint, autoPrint]);

  // ✅ Move conditional return to AFTER all hooks
  if (!isOpen || !order || !isDataLoaded) {
    return null;
  }

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
  const billNumber = order.id
    ? `${order.id}`
    : `${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const now = new Date();
  // Format date and time together
const dateTime = now.toLocaleString("fa-AF", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true, // ✅ Use 12-hour format
});


  // Debug: Check if we have data
  console.log("PrintOrderBill - Order data:", order);
  console.log("PrintOrderBill - Filled digital:", filledDigital);
  console.log("PrintOrderBill - Filled offset:", filledOffset);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 print:bg-transparent print:p-0">
      {/* A5 Container */}
      <div className="px-5">
        <div
          id="printable-area"
          className="bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col print:shadow-none print:rounded-none"
          style={{
            width: "148mm",
            height: "210mm",
            direction: "rtl",
          }}
        >
          {/* Header */}
          <div
            id="header-area"
            className="bg-gradient-to-l from-cyan-800 to-cyan-600 text-white p-4 text-center"
          >
            <h1 className="text-xl font-bold mb-1">چاپخانه اکبر</h1>
            <p className="text-sm opacity-90">Akbar Printing House</p>
            <div className="flex justify-between items-center mt-2 text-xs">
              <span>شماره: {billNumber}</span>
              <span>تاریخ: {dateTime}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1 border-gray-300">
              معلومات مشتری
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-semibold">نام:</span>{" "}
                {order.customer?.name || order.name || "—"}
              </div>
              <div>
                <span className="font-semibold">شماره تماس:</span>{" "}
                {order.customer?.phone_number || order.phone_number || "—"}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-3 overflow-auto">
            {/* Digital Printing Section */}
            {filledDigital.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-green-700 mb-2 bg-green-50 p-2 rounded border-r-4 border-green-500">
                  چاپ دیجیتال : {order.digitalId || "—"}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-1 text-center w-6">
                          #
                        </th>
                        <th className="border border-gray-300 p-1 text-center">
                          شرح
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-12">
                          تعداد
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-16">
                          ارتفاع
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-16">
                          عرض
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-20">
                          قیمت واحد
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-20">
                          مبلغ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filledDigital.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-1 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-300 p-1 text-right">
                            {d.name || "—"}
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {d.quantity || 0}
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {d.height || 0}
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {d.weight || 0}
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {formatCurrency(d.price_per_unit || 0)}
                          </td>
                          <td className="border border-gray-300 p-1 text-center font-semibold">
                            {formatCurrency(d.money || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-1 text-xs font-bold text-green-700">
                  مجموع: {formatCurrency(total_money_digital)}
                </div>
              </div>
            )}

            {/* Offset Printing Section */}
            {filledOffset.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-purple-700 mb-2 bg-purple-50 p-2 rounded border-r-4 border-purple-500">
                  چاپ افست
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-1 text-center w-6">
                          #
                        </th>
                        <th className="border border-gray-300 p-1 text-center">
                          شرح
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-12">
                          تعداد
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-20">
                          قیمت واحد
                        </th>
                        <th className="border border-gray-300 p-1 text-center w-20">
                          مبلغ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filledOffset.map((o, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-1 text-center">
                            {i + 1}
                          </td>
                          <td className="border border-gray-300 p-1 text-right">
                            {o.name || "—"}
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {o.quantity || 0}
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {formatCurrency(o.price_per_unit || 0)}
                          </td>
                          <td className="border border-gray-300 p-1 text-center font-semibold">
                            {formatCurrency(o.money || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-1 text-xs font-bold text-purple-700">
                  مجموع: {formatCurrency(total_money_offset)}
                </div>
              </div>
            )}

            {/* No Items Message */}
            {filledDigital.length === 0 && filledOffset.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
                هیچ محصولی ثبت نشده است
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="flex border-t border-gray-300 bg-gray-50">
            {/* Left Half — Totals Section */}
            <div className="w-1/2 border-l border-gray-300 p-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1 text-sm">
                  <span>مجموع کل:</span>
                  <span className="text-cyan-800">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1 text-sm">
                  <span>
                    <strong>دریافتی :</strong>
                  </span>
                  <span className="text-green-600">
                    {formatCurrency(order.recip || 0)}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                  <span
                    className={remained > 0 ? "text-red-600" : "text-green-600"}
                  >
                    باقیمانده:
                  </span>
                  <span
                    className={remained > 0 ? "text-red-600" : "text-green-600"}
                  >
                    {formatCurrency(remained)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Half — Signature and Stamp Section */}
            <div className="w-1/2 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-full border border-dashed border-gray-400 h-28 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-sm font-semibold">
                  محل امضاء و مُهر
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            id="footer-area"
            className="bg-gray-800 text-white p-3 text-center text-xs"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <FaPhone className="text-cyan-300" />
              <span>تماس: ۰۷۸۹۳۸۴۷۰۰ - ۰۷۹۹۳۰۶۴۳۷ - ۰۷۴۸۸۵۲۵۶۹</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Only show if not auto printing */}
      {!autoPrint && (
        <div className="absolute bottom-6 left-6 flex gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            <FaTimes size={14} /> بستن
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2 shadow-lg transition-colors"
          >
            <FaPrint size={14} /> چاپ فاکتور
          </button>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 148mm !important;
            height: 210mm !important;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          #header-area {
            background-color: oklch(45% 0.085 224.283);
          }
          #footer-area {
            background-color: oklch(27.8% 0.033 256.848);
          }
          .print-hidden {
            display: none !important;
          }
        }

        /* Hide scrollbars for print */
        @media print {
          ::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PrintOrderBill;
