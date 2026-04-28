"use client";
import { BaseTable } from "./BaseTable";
import { Edit2, Eye, Truck, CheckCircle, XCircle } from "lucide-react";

export const TransferTable = ({ data, loading, onView, onApprove, onShip, onReceive }) => {
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'DRAFT': case 'REQUESTED': return 'bg-blue-500/10 text-blue-500';
      case 'APPROVED': case 'SHIPPED': case 'IN_TRANSIT': return 'bg-orange-500/10 text-orange-500';
      case 'RECEIVED': return 'bg-green-500/10 text-green-500';
      case 'REJECTED': case 'CANCELLED': return 'bg-red-500/10 text-red-500';
      default: return 'bg-neutral-500/10 text-neutral-500';
    }
  };

  const columns = [
    { 
      header: "Transfer ID", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black tracking-widest text-[#E9B10C]">{row.transferNumber}</span>
          <span className="text-[8px] text-neutral-500 uppercase">{new Date(row.requestedDate).toLocaleDateString()}</span>
        </div>
      ) 
    },
    { 
      header: "Route", 
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-red-500">From: {row.fromShop?.name}</span>
          <span className="text-[10px] font-bold text-green-500">To: {row.toShop?.name}</span>
        </div>
      ) 
    },
    { header: "Total Items", render: (row) => <span className="text-[10px] font-bold">{row.totalQuantity} items</span> },
    { header: "Status", render: (row) => (
      <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${getStatusColor(row.status)}`}>
        {row.status.replace('_', ' ')}
      </span>
    )},
    { 
      header: "Actions", 
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button onClick={() => onView(row)} title="View Details" className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors"><Eye size={14} /></button>
          
          {/* Action buttons based on backend Status Machine */}
          {row.status === 'REQUESTED' && (
            <>
              <button onClick={() => onApprove(row, 'approve')} title="Approve" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"><CheckCircle size={14} /></button>
              <button onClick={() => onApprove(row, 'reject')} title="Reject" className="p-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-sm transition-colors"><XCircle size={14} /></button>
            </>
          )}

          {row.status === 'APPROVED' && (
            <button onClick={() => onShip(row)} title="Mark as Shipped" className="p-1.5 bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white rounded-sm transition-colors"><Truck size={14} /></button>
          )}

          {row.status === 'SHIPPED' && (
            <button onClick={() => onReceive(row)} title="Mark as Received" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-sm transition-colors"><CheckCircle size={14} /></button>
          )}
        </div>
      )
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};