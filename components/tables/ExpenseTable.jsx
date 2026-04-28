"use client";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, CreditCard, XCircle } from "lucide-react";

export const ExpenseTable = ({ data, loading, onView, onApprove, onPay, onReject }) => {
  const columns = [
    {
      header: "Expense ID",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest text-[#E9B10C]">{row.expenseNumber}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{row.vendorName || 'No Vendor'}</span>
        </div>
      )
    },
    { 
      header: "Shop", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-wider font-black text-neutral-800 dark:text-neutral-200">
            {row.shop?.name || 'Head Office'}
          </span>
          {row.shop && (
            <span className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
              {row.shop.shopCode || `ID: ${row.shop._id?.slice(-6)}`}
            </span>
          )}
        </div>
      ) 
    },
    { 
      header: "Category", 
      render: (row) => <span className="text-[9px] uppercase tracking-wider font-bold">{row.category}</span> 
    },
    { 
      header: "Total Amount", 
      render: (row) => <span className="text-[11px] font-black">SAR {row.totalAmount?.toLocaleString() || 0}</span> 
    },
    { 
      header: "Due Amount", 
      render: (row) => <span className="text-[11px] font-black text-red-500">SAR {row.dueAmount?.toLocaleString() || 0}</span> 
    },
    { 
      header: "Status", 
      render: (row) => {
        const statusColors = {
          PAID: 'bg-green-500/10 text-green-500',
          APPROVED: 'bg-blue-500/10 text-blue-500',
          PARTIAL: 'bg-indigo-500/10 text-indigo-500',
          PENDING: 'bg-orange-500/10 text-orange-500',
          REJECTED: 'bg-red-500/10 text-red-500',
          CANCELLED: 'bg-neutral-500/10 text-neutral-500'
        };

        return (
          <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${statusColors[row.status] || 'bg-neutral-500/10 text-neutral-500'}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} title="View Details" className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors">
            <Eye size={14} />
          </button>
          {row.status === 'PENDING' && (
            <>
              <button onClick={() => onApprove(row)} title="Approve Expense" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors">
                <CheckCircle size={14} />
              </button>
              <button onClick={() => onReject(row)} title="Reject Expense" className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-sm transition-colors">
                <XCircle size={14} />
              </button>
            </>
          )}
          {(row.status === 'APPROVED' || row.status === 'PARTIAL') && row.dueAmount > 0 && (
            <button onClick={() => onPay(row)} title="Pay Now" className="px-2 py-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-sm flex items-center gap-1 text-[9px] font-black uppercase transition-colors">
              <CreditCard size={14} /> Pay
            </button>
          )}
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};