import React from "react";

const BillSummary = ({ record }) => {
  return (
    <div className="mt-6">
  
      <div className="mt-4 space-y-1">
        <p>Total Digital: {record.total_money_digital}</p>
        <p>Total Offset: {record.total_offset}</p>
        <p className="font-bold text-lg">Total: {record.total}</p>
      </div>


    </div>
  );
};

export default BillSummary;
