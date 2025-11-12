import React, { useEffect, useRef } from "react";
import moment from "moment-jalaali";
import { FaPhone, FaPrint, FaTimes } from "react-icons/fa";

const PrintBillOrder = ({ isOpen, onClose, order, autoPrint }) => {
  const hasAutoPrintedRef = useRef(false);
  const printTimeoutRef = useRef(null);
  console.log(autoPrint);

  // Helper functions to check if items are filled
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
    return number + " افغانی";
  };

  const handlePrint = () => {
    window.print();
  };

  // Auto print functionality
  useEffect(() => {
    if (autoPrint && isOpen && order && !hasAutoPrintedRef.current) {
      // Set flag to prevent multiple auto-prints
      hasAutoPrintedRef.current = true;

      // Delay print to ensure DOM is fully rendered
      printTimeoutRef.current = setTimeout(() => {
        window.print();
      }, 800);
    }

    return () => {
      if (printTimeoutRef.current) {
        clearTimeout(printTimeoutRef.current);
      }
    };
  }, [autoPrint, isOpen, order]);

  // Reset auto-print flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasAutoPrintedRef.current = false;
    }
  }, [isOpen]);

  // Early return if not ready to render
  if (!isOpen || !order) {
    return null;
  }

  // Filter out empty items
  const filledDigital = (order.digital || []).filter(isDigitalItemFilled);
  const filledOffset = (order.offset || []).filter(isOffsetItemFilled);

  // Calculate totals
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

  // Generate bill number and timestamp
  const billNumber = order.id
    ? `${order.id}`
    : `${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const now = new Date();
  const dateTime = now
    .toLocaleString("fa-AF", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

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
            className="bg-gradient-to-l from-cyan-800 to-cyan-600 text-white py-4 px-4 text-center"
          >
            <h1 className="text-xl font-bold mb-1">چاپخانه اکبر</h1>
            <div className="flex justify-between items-center mt-2 text-xs">
              <span>شماره: {billNumber}</span>
              <span>تاریخ: {dateTime}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-3 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="">
                <span className="font-semibold">نام: </span>{" "}
                {order.customer?.name || order.name || "—"}
              </div>
              <div className=" text-center">
                <span className="font-semibold">آی دی دیجیتال: </span>{" "}
                {order.digitalId || "—"}
              </div>
              <div className=" text-end">
                <span className="font-semibold">شماره تماس: </span>{" "}
                {order.customer?.phone_number || order.phone_number || "—"}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-3  overflow-auto">
            {/* Digital Printing Section */}
            {filledDigital.length > 0 && (
              <div className="mb-2 ">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-1 text-center ">
                          #
                        </th>
                        <th className="border border-gray-300 p-1 text-center">
                          نام
                        </th>
                        <th className="border border-gray-300 p-1 text-center ">
                          تعداد
                        </th>
                        <th className="border border-gray-300 p-1 text-center ">
                          ارتفاع
                        </th>
                        <th className="border border-gray-300 p-1 text-center ">
                          عرض
                        </th>
                        <th className="border border-gray-300 p-1 text-center ">
                          قیمت فی واحد
                        </th>
                        <th className="border border-gray-300 p-1 text-center 0">
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
                          <td className="border border-gray-300 p-1 text-center">
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
              </div>
            )}

            {/* Offset Printing Section */}
            {filledOffset.length > 0 && (
              <div className=" mt-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 p-1 text-center ">
                          #
                        </th>
                        <th className="border border-gray-300 p-1 text-center">
                          نام
                        </th>
                        <th className="border border-gray-300 p-1 text-center ">
                          تعداد
                        </th>
                        <th className="border border-gray-300 p-1 text-center">
                          قیمت فی واحد
                        </th>
                        <th className="border border-gray-300 p-1 text-center ">
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
                <div className="flex items-center py-1 justify-between">
                  <div className="flex justify-end mt-1 text-xs font-bold text-green-700">
                    مجموع چاپ دیجیتال: {formatCurrency(total_money_digital)}
                  </div>
                  <div className="flex justify-end mt-1 text-xs font-bold text-purple-700">
                    مجموع چاپ افست: {formatCurrency(total_money_offset)}
                  </div>
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
          <div className="flex border-t h-[110px] border-gray-300 bg-gray-50">
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
              <div className="w-full   border-gray-400 h-28 flex flex-col items-center justify-center">
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
              <span> تماس: 0789384700 - 0799306437 - 0748852569</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Hide during auto-print */}
      {
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
      }

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

export default PrintBillOrder;
