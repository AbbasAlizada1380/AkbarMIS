import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Orders = () => {
  const [record, setRecord] = useState({
    customer: { name: "", phone_number: "" },
    digital: [],
    offset: [],
    total_money_digital: 0,
    total_offset: 0,
    total: 0,
  });

  // Handle customer input
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setRecord({
      ...record,
      customer: { ...record.customer, [name]: value },
    });
  };

  // Add new digital entry
  const addDigital = () => {
    setRecord({
      ...record,
      digital: [
        ...record.digital,
        {
          name: "",
          quantity: "",
          height: "",
          weight: "",
          area: "",
          price_per_unit: "",
          money: "",
        },
      ],
    });
  };

  // Update digital entry (auto-calc but editable money)
  const updateDigital = (index, field, value) => {
    const updated = [...record.digital];
    updated[index][field] = value;

    const quantity = parseFloat(updated[index].quantity) || 0;
    const height = parseFloat(updated[index].height) || 0;
    const weight = parseFloat(updated[index].weight) || 0;
    const price_per_unit = parseFloat(updated[index].price_per_unit) || 0;

    // Auto-calculate area
    const area = height * weight * quantity;
    updated[index].area = area ? area.toFixed(2) : "";

    // Auto-calculate money only if not editing money field
    if (field !== "money") {
      const money =  price_per_unit * area;
      updated[index].money = money ? money.toFixed(2) : "";
    }

    setRecord({ ...record, digital: updated });
  };

  // Delete digital entry
  const deleteDigital = (index) => {
    const updated = record.digital.filter((_, i) => i !== index);
    setRecord({ ...record, digital: updated });
  };

  // Add offset entry
  const addOffset = () => {
    setRecord({
      ...record,
      offset: [
        ...record.offset,
        { name: "", quantity: "", price_per_unit: "", money: "" },
      ],
    });
  };

  // Update offset entry (auto-calc but editable money)
  const updateOffset = (index, field, value) => {
    const updated = [...record.offset];
    updated[index][field] = value;

    const quantity = parseFloat(updated[index].quantity) || 0;
    const price_per_unit = parseFloat(updated[index].price_per_unit) || 0;

    // Auto-calculate money only if not editing money field
    if (field !== "money") {
      const money = quantity * price_per_unit;
      updated[index].money = money ? money.toFixed(2) : "";
    }

    setRecord({ ...record, offset: updated });
  };

  // Delete offset entry
  const deleteOffset = (index) => {
    const updated = record.offset.filter((_, i) => i !== index);
    setRecord({ ...record, offset: updated });
  };

  // Calculate totals
  const calculateTotals = () => {
    const totalDigital = record.digital.reduce(
      (sum, d) => sum + Number(d.money || 0),
      0
    );
    const totalOffset = record.offset.reduce(
      (sum, o) => sum + Number(o.money || 0),
      0
    );

    setRecord({
      ...record,
      total_money_digital: totalDigital.toFixed(2),
      total_offset: totalOffset.toFixed(2),
      total: (totalDigital + totalOffset).toFixed(2),
    });
  };

  // Save to backend
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
      {/* CUSTOMER INFO */}
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

      {/* DIGITAL SECTION */}
      <h2 className="text-xl font-bold mt-4">Digital Printing</h2>
      <button
        onClick={addDigital}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        + Add Digital Item
      </button>

      {record.digital.map((d, i) => (
        <div key={i} className="grid grid-cols-7 gap-2 mt-2">
          {Object.keys(d).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={d[key]}
              onChange={(e) => updateDigital(i, key, e.target.value)}
              className={`border p-1 rounded ${
                key === "area" ? "bg-gray-100" : ""
              }`}
              disabled={key === "area"}
            />
          ))}
          <button
            onClick={() => deleteDigital(i)}
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
        </div>
      ))}

      {/* OFFSET SECTION */}
      <h2 className="text-xl font-bold mt-6">Offset Printing</h2>
      <button
        onClick={addOffset}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        + Add Offset Item
      </button>

      {record.offset.map((o, i) => (
        <div key={i} className="grid grid-cols-5 gap-2 mt-2">
          {Object.keys(o).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={o[key]}
              onChange={(e) => updateOffset(i, key, e.target.value)}
              className={`border p-1 rounded`}
            />
          ))}
          <button
            onClick={() => deleteOffset(i)}
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
        </div>
      ))}

      {/* TOTAL SECTION */}
      <div className="mt-6">
        <button
          onClick={calculateTotals}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Calculate Totals
        </button>
        <div className="mt-4 space-y-1">
          <p>Total Digital: {record.total_money_digital}</p>
          <p>Total Offset: {record.total_offset}</p>
          <p className="font-bold">Total: {record.total}</p>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveRecord}
        className="bg-indigo-600 text-white px-4 py-2 rounded mt-4"
      >
        Save Record
      </button>
    </div>
  );
};

export default Orders;
