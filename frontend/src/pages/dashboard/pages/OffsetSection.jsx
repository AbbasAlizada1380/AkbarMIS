import React from "react";
import {
  FaPlus,
  FaTrash,
  FaCalculator,
  FaDollarSign,
  FaHashtag,
  FaPrint,
  FaBox,
} from "react-icons/fa";

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

  const getFieldLabel = (field) => {
    const labels = {
      name: "نام محصول",
      quantity: "تعداد",
      price_per_unit: "قیمت واحد",
      money: "مبلغ کل",
    };
    return labels[field] || field;
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      name: "نام محصول را وارد کنید",
      quantity: "تعداد",
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
            <FaPrint className="text-blue-500 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">چاپ افست</h2>
            <p className="text-gray-600 text-sm">مدیریت محصولات چاپ افست</p>
          </div>
        </div>

        <button
          onClick={addOffset}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-lg" />
          افزودن محصول
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {record.offset.map((o, i) => (
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
                onClick={() => deleteOffset(i)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                <FaTrash className="text-sm" />
                حذف
              </button>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(o).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {getFieldLabel(key)}
                  </label>
                  <div className="relative">
                    <input
                      placeholder={getFieldPlaceholder(key)}
                      value={o[key]}
                      onChange={(e) => updateOffset(i, key, e.target.value)}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                        key === "money"
                          ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                          : "bg-white text-gray-800 hover:border-gray-400"
                      }`}
                      disabled={key === "money"}
                    />

                    {/* Unit Labels */}
                    {key === "money" && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation Summary */}
            {o.quantity && o.price_per_unit && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تعداد:</span>
                    <span className="font-semibold text-blue-600">
                      {o.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">قیمت واحد:</span>
                    <span className="font-semibold text-yellow-600">
                      {o.price_per_unit} افغانی
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">مبلغ کل:</span>
                    <span className="font-semibold text-green-600">
                      {o.money} افغانی
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {record.offset.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaPrint className="text-blue-500 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            محصولی اضافه نشده است
          </h3>
          <p className="text-gray-500 mb-4">
            برای شروع، اولین محصول چاپ افست را اضافه کنید
          </p>
          <button
            onClick={addOffset}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <FaPlus />
            افزودن اولین محصول
          </button>
        </div>
      )}

      {/* Summary Card */}
      {record.offset.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCalculator className="text-2xl" />
              <div>
                <h3 className="text-lg font-semibold">خلاصه چاپ افست</h3>
                <p className="text-green-100 text-sm">
                  {record.offset.length} محصول اضافه شده
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {record.total_offset} افغانی
              </div>
              <div className="text-blue-100 text-sm">مجموع مبلغ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffsetSection;
