import React from "react";
import { Printer } from "lucide-react";
import PrintBillModal from "./PrintOrderBill";
import PrintOrderBill from "./PrintOrderBill";

const formatDisplay = (num) =>
  Number(num || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const OrderBillDetails = ({ order, onClose }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = React.useState(false);

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h1 className="text-xl font-bold">Bill Details</h1>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-red-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Customer Info */}
          <div className="border p-4 rounded mb-6 bg-gray-50">
            <p>
              <strong>Name:</strong> {order.customer.name}
            </p>
            <p>
              <strong>Phone:</strong> {order.customer.phone_number}
            </p>
          </div>

          {/* Digital Section */}
          {order.digital.length > 0 && (
            <>
              <h2 className="font-semibold text-lg mb-2">Digital Printing</h2>
              <table className="w-full border-collapse border text-sm mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Height</th>
                    <th className="border p-2">Weight</th>
                    <th className="border p-2">Area</th>
                    <th className="border p-2">Price/Unit</th>
                    <th className="border p-2">Money</th>
                  </tr>
                </thead>
                <tbody>
                  {order.digital.map((item, i) => (
                    <tr key={i} className="text-center">
                      <td className="border p-1">{item.name}</td>
                      <td className="border p-1">{item.quantity}</td>
                      <td className="border p-1">{item.height}</td>
                      <td className="border p-1">{item.weight}</td>
                      <td className="border p-1">{item.area}</td>
                      <td className="border p-1">{item.price_per_unit}</td>
                      <td className="border p-1 font-semibold text-blue-700">
                        {formatDisplay(item.money)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Offset Section */}
          {order.offset.length > 0 && (
            <>
              <h2 className="font-semibold text-lg mb-2">Offset Printing</h2>
              <table className="w-full border-collapse border text-sm mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Price/Unit</th>
                    <th className="border p-2">Money</th>
                  </tr>
                </thead>
                <tbody>
                  {order.offset.map((item, i) => (
                    <tr key={i} className="text-center">
                      <td className="border p-1">{item.name}</td>
                      <td className="border p-1">{item.quantity}</td>
                      <td className="border p-1">{item.price_per_unit}</td>
                      <td className="border p-1 font-semibold text-green-700">
                        {formatDisplay(item.money)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Totals */}
          <div className="mt-6 border-t pt-3 text-right space-y-1">
            <p>
              <strong>Total Digital:</strong>{" "}
              {formatDisplay(order.total_money_digital)}
            </p>
            <p>
              <strong>Total Offset:</strong> {formatDisplay(order.total_offset)}
            </p>
            <p className="font-bold text-lg">
              <strong>Grand Total:</strong>{" "}
              {formatDisplay(order.total_money_digital + order.total_offset)}
            </p>

            {/* New Fields */}
            <div className="mt-3 border-t pt-3 space-y-1">
              <p className="text-blue-700">
                <strong>Received (Recip):</strong> {formatDisplay(order.recip)}
              </p>
              <p className="text-red-700">
                <strong>Remaining Balance:</strong>{" "}
                {formatDisplay(order.remained)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Printer size={18} /> Print Bill
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Optional Print Modal */}

      {isPrintModalOpen && (
        <PrintOrderBill
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          order={order}
        />
      )}
    </>
  );
};

export default OrderBillDetails;
