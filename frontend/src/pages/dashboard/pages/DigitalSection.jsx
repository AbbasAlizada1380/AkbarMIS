import React from "react";
import { FaPlus, FaTrash, FaCalculator, FaPrint } from "react-icons/fa";

const DigitalSection = ({ record, setRecord }) => {
  const addDigital = () => {
    setRecord({
      ...record,
      digital: [
        ...record.digital,
        {
          name: "",
          quantity: 0,
          height: 0,
          weight: 0,
          area: 0,
          price_per_unit: 0,
          money: 0,
        },
      ],
    });
  };

  const updateDigital = (index, field, value) => {
    const updated = [...record.digital];

    // For numeric fields, store as number
    if (
      ["quantity", "height", "weight", "price_per_unit", "money"].includes(
        field
      )
    ) {
      updated[index][field] = parseFloat(value) || 0;
    } else if (field === "name") {
      updated[index][field] = value;
    }

    const quantity = updated[index].quantity;
    const height = updated[index].height;
    const weight = updated[index].weight;
    const price_per_unit = updated[index].price_per_unit;

    // Calculate area (always calculated automatically)
    const area = height * weight * quantity;
    updated[index].area = area;

    // Only calculate money automatically if money field wasn't the one being updated
    if (field !== "money") {
      updated[index].money = price_per_unit * area;
    }

    setRecord({ ...record, digital: updated });
  };

  const deleteDigital = (index) => {
    const updated = record.digital.filter((_, i) => i !== index);
    setRecord({ ...record, digital: updated });
  };

  const getFieldLabel = (field) => {
    const labels = {
      name: "نام محصول",
      quantity: "تعداد",
      height: "ارتفاع (cm)",
      weight: "عرض (cm)",
      area: "مساحت (cm²)",
      price_per_unit: "قیمت واحد",
      money: "مبلغ کل",
    };
    return labels[field] || field;
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      name: "نام محصول را وارد کنید",
      quantity: "تعداد",
      height: "ارتفاع",
      weight: "عرض",
      area: "محاسبه خودکار",
      price_per_unit: "قیمت هر واحد",
      money: "مبلغ کل را وارد کنید",
    };
    return placeholders[field] || field;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <div className=" bg-blue-100 rounded-lg">
              <FaPrint className="text-blue-500 text-xl" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">چاپ دیجیتال</h2>
            <p className="text-gray-600 text-sm">مدیریت محصولات چاپ دیجیتال</p>
          </div>
        </div>

        <button
          onClick={addDigital}
          className="flex items-center gap-2 text-sm bg-cyan-800 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200  cursor-pointer shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-base" />
          افزودن محصول
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <div className="space-y-4">
          {record && record.digital && record.digital.length > 0 ? (
            record.digital.map((d, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      محصول {i + 1}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteDigital(i)}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    <FaTrash className="text-sm" />
                    حذف
                  </button>
                </div>

                {/* Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {Object.keys(d).map((key) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {getFieldLabel(key)}
                      </label>
                      <div className="relative">
                        <input
                          type={key === "name" ? "text" : "number"}
                          placeholder={getFieldPlaceholder(key)}
                          value={d[key]}
                          onChange={(e) =>
                            updateDigital(i, key, e.target.value)
                          }
                          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            key === "area"
                              ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                              : "bg-white text-gray-800 hover:border-gray-400"
                          }`}
                          disabled={key === "area"}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Summary */}
                {(d.area || d.money) && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">مساحت کل:</span>
                        <span className="font-semibold text-blue-600">
                          {d.area} cm²
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">مبلغ کل:</span>
                        <span className="font-semibold text-green-600">
                          {d.money} افغانی
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              هیچ مورد چاپ دیجیتال اضافه نشده است.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalSection;
