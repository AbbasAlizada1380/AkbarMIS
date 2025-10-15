import React from "react";

const OffsetSection = ({ record, setRecord }) => {
  const addOffset = () => {
    setRecord({
      ...record,
      offset: [
        ...record.offset,
        { name: "", quantity: "", price_per_unit: "", money: "" },
      ],
    });
  };

  const updateOffset = (index, field, value) => {
    const updated = [...record.offset];
    updated[index][field] = value;

    const quantity = parseFloat(updated[index].quantity) || 0;
    const price_per_unit = parseFloat(updated[index].price_per_unit) || 0;

    if (field !== "money") {
      const money = quantity * price_per_unit;
      updated[index].money = money ? money.toFixed(2) : "";
    }

    setRecord({ ...record, offset: updated });
  };

  const deleteOffset = (index) => {
    const updated = record.offset.filter((_, i) => i !== index);
    setRecord({ ...record, offset: updated });
  };

  return (
    <div>
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
              className="border p-1 rounded"
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
    </div>
  );
};

export default OffsetSection;
