import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DigitalSection from "./DigitalSection";
import OffsetSection from "./OffsetSection";
import BillSummary from "./BillSummary";
import PrintOrderBill from "./PrintOrderBill";

const Orders = () => {
  const [record, setRecord] = useState({
    customer: { name: "", phone_number: "" },
    digital: [],
    offset: [],
    total_money_digital: 0,
    total_offset: 0,
    total: 0,
    recip: 0, // 💰 money received from customer
    remained: 0, // 💵 money still unpaid
  });

  const [isBillOpen, setIsBillOpen] = useState(false);

  // 🧠 Automatically calculate totals whenever digital, offset, or recip changes
  useEffect(() => {
    const totalDigital = record.digital.reduce(
      (sum, d) => sum + Number(d.money || 0),
      0
    );
    const totalOffset = record.offset.reduce(
      (sum, o) => sum + Number(o.money || 0),
      0
    );
    const total = totalDigital + totalOffset;

    setRecord((prev) => ({
      ...prev,
      total_money_digital: totalDigital.toFixed(2),
      total_offset: totalOffset.toFixed(2),
      total: total.toFixed(2),
      remained: (total - Number(prev.recip || 0)).toFixed(2),
    }));
  }, [record.digital, record.offset, record.recip]); // 👈 watch for changes

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
      console.log(record);
      await axios.post("/api/records", record);
      Swal.fire("Success", "Record saved successfully", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to save record", "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Customer Information</h2>
      <div className="flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={record.customer.name}
          onChange={handleCustomerChange}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={record.customer.phone_number}
          onChange={handleCustomerChange}
          className="border p-2 rounded w-1/2"
        />
      </div>

      {/* Digital Printing Section */}
      <DigitalSection record={record} setRecord={setRecord} />

      {/* Offset Printing Section */}
      <OffsetSection record={record} setRecord={setRecord} />

      {/* Bill Summary */}
      <BillSummary record={record} />

      {/* 💰 Recip and Remained Fields */}
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Received Amount"
          value={record.recip}
          onChange={handleRecipChange}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="number"
          placeholder="Remained Amount"
          value={record.remained}
          readOnly
          className="border p-2 rounded w-1/2 bg-gray-100 cursor-not-allowed"
        />
        <button
          onClick={()=>saveRecord()}
          className="bg-indigo-600 text-white px-4 py-2 rounded mt-4"
        >
          Save Record
        </button>
      </div>

      <button
        onClick={() => setIsBillOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        View Bill
      </button>

      {isBillOpen && (
        <PrintOrderBill
          isOpen={isBillOpen}
          onClose={() => setIsBillOpen(false)}
          order={record}
        />
      )}
    </div>
  );
};

export default Orders;
