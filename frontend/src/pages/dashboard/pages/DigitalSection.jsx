import React from "react";

const DigitalSection = ({ record, setRecord }) => {
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

  const updateDigital = (index, field, value) => {
    const updated = [...record.digital];
    updated[index][field] = value;

    const quantity = parseFloat(updated[index].quantity) || 0;
    const height = parseFloat(updated[index].height) || 0;
    const weight = parseFloat(updated[index].weight) || 0;
    const price_per_unit = parseFloat(updated[index].price_per_unit) || 0;

    const area = height * weight * quantity;
    updated[index].area = area ? area.toFixed(2) : "";

    if (field !== "money") {
      const money = price_per_unit * area;
      updated[index].money = money ? money.toFixed(2) : "";
    }

    setRecord({ ...record, digital: updated });
  };

  const deleteDigital = (index) => {
    const updated = record.digital.filter((_, i) => i !== index);
    setRecord({ ...record, digital: updated });
  };

  return (
    <div>
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
    </div>
  );
};

export default DigitalSection;
