"use client";
import { BaseTable } from "./BaseTable";
import { Eye, CheckCircle, Clock, XCircle, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const OrderTable = ({ data, loading, orderType, onView, onUpdateStatus, onCancel }) => {
  const { t } = useLanguage();

  const columns = [
    { 
      header: t("order") || "Order Details", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-black dark:text-white">{row.orderNumber}</span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        </div>
      ) 
    },
    { 
      header: t("customer") || "Customer", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-black dark:text-white">
            {row.customer?.name || row.shippingAddress?.name || row.shippingAddress?.fullName || 'Walk-in'}
          </span>
          <span className="text-[9px] text-[#E9B10C] font-black mt-0.5">
            {row.customer?.phone || row.shippingAddress?.phone || 'N/A'}
          </span>
        </div>
      ) 
    },
    { 
      header: t("amount") || "Amount", 
      render: (row) => (
        <span className="text-[11px] font-black text-black dark:text-white">SAR {row.totalAmount}</span>
      ) 
    },
    { 
      header: t("payment") || "Payment", 
      render: (row) => (
        <div className="flex flex-col">
          <span className={`text-[10px] font-black ${row.paymentStatus?.toUpperCase() === 'PAID' ? 'text-green-500' : 'text-neutral-400'}`}>
            {row.paymentStatus?.toUpperCase() || 'PENDING'}
          </span>
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
            {row.paymentMethod}
          </span>
        </div>
      )
    },
    { 
      header: t("status") || "Status", 
      render: (row) => {
        // Extract correct status based on POS or Website
        const status = (orderType === 'pos' ? row.orderStatus : row.status)?.toUpperCase();
        
        let colorClass = 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
        let displayText = status;
        let Icon = null;

        // Apply specific styles and icons based on the marked status
        if (['COMPLETED', 'DELIVERED'].includes(status)) {
          colorClass = 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
          displayText = t("completedOrders") || "RECEIVED";
          Icon = Check;
        } else if (status === 'CANCELLED') {
          colorClass = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
          displayText = t("cancelledOrders") || "CANCELLED";
          Icon = XCircle;
        } else if (status === 'PENDING') {
          colorClass = 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
          displayText = t("pendingOrders") || "PENDING";
          Icon = Clock;
        } else if (status === 'SHIPPED') {
          colorClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
          displayText = "SHIPPED";
        } else if (status === 'PROCESSING') {
          colorClass = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
          displayText = "PROCESSING";
        }

        return (
          <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm border flex w-max items-center gap-1.5 ${colorClass}`}>
            {Icon && <Icon size={10} strokeWidth={3} />}
            {displayText}
          </span>
        );
      }
    },
    { 
      header: t("actions") || "Actions", 
      render: (row) => {
        const status = (orderType === 'pos' ? row.orderStatus : row.status)?.toUpperCase();
        
        const isCompleted = ['COMPLETED', 'DELIVERED'].includes(status);
        const isPending = status === 'PENDING';
        const isCancelled = status === 'CANCELLED';

        return (
          <div className="flex gap-2 items-center">
            {/* Always show View Button */}
            <button 
              onClick={() => onView(row)} 
              title={t("viewDetails") || "View Details"} 
              className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-sm text-neutral-600 transition-colors hover:text-black dark:hover:text-white"
            >
              <Eye size={14} />
            </button>
            
            {/* Hide action buttons if the order is permanently Cancelled */}
            {!isCancelled && (
              <>
                {/* Show Mark Received ONLY if it is not already completed */}
                {!isCompleted && (
                  <button 
                    onClick={() => onUpdateStatus(row, 'completed')} 
                    title={t("markReceived") || "Mark Received"} 
                    className="p-1.5 bg-green-500/10 rounded-sm text-green-600 transition-colors hover:bg-green-500 hover:text-white"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
                
                {/* Show Mark Pending ONLY if it is not already pending */}
                {!isPending && (
                  <button 
                    onClick={() => onUpdateStatus(row, 'pending')} 
                    title={t("markPending") || "Mark Pending"} 
                    className="p-1.5 bg-yellow-500/10 rounded-sm text-yellow-600 transition-colors hover:bg-[#E9B10C] hover:text-black"
                  >
                    <Clock size={14} />
                  </button>
                )}

                {/* Show Cancel ONLY if it is not completed yet */}
                {!isCompleted && (
                  <button 
                    onClick={() => onCancel(row)} 
                    title={t("cancelOrder") || "Cancel Order"} 
                    className="p-1.5 bg-red-500/10 rounded-sm text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        );
      }
    }
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};