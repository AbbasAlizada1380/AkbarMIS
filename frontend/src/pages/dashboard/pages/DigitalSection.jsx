import React from "react";
import { FaPlus, FaTrash, FaCalculator } from "react-icons/fa";

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
      money: "محاسبه خودکار",
    };
    return placeholders[field] || field;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">چاپ دیجیتال</h2>
            <p className="text-gray-600 text-sm">مدیریت محصولات چاپ دیجیتال</p>
          </div>
        </div>

        <button
          onClick={addDigital}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-lg" />
          افزودن محصول
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {record.digital.map((d, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(d).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {getFieldLabel(key)}
                  </label>
                  <div className="relative">
                    <input
                      placeholder={getFieldPlaceholder(key)}
                      value={d[key]}
                      onChange={(e) => updateDigital(i, key, e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        key === "area" || key === "money"
                          ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                          : "bg-white text-gray-800 hover:border-gray-400"
                      }`}
                      disabled={key === "area" || key === "money"}
                    />

                    {/* Unit Labels */}
                    {key === "height" || key === "weight" ? (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        
                      </span>
                    ) : key === "area" ? (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        
                      </span>
                    ) : key === "money" ? (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        
                      </span>
                    ) : null}
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
                      {d.area} 
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
        ))}
      </div>

      {/* Empty State */}
      {record.digital.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            محصولی اضافه نشده است
          </h3>
          <p className="text-gray-500 mb-4">
            برای شروع، اولین محصول چاپ دیجیتال را اضافه کنید
          </p>
          <button
            onClick={addDigital}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <FaPlus />
            افزودن اولین محصول
          </button>
        </div>
      )}

      {/* Summary Card */}
      {record.digital.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-400 rounded-full">
                <FaCalculator className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">خلاصه چاپ دیجیتال</h3>
                <p className="text-blue-100 text-sm">
                  {record.digital.length} محصول اضافه شده
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {record.total_money_digital} افغانی
              </div>
              <div className="text-blue-100 text-sm">مجموع مبلغ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalSection;
