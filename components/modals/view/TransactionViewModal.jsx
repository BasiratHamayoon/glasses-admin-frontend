"use client";
import { BaseModal } from "../BaseModal";
import { format } from "date-fns"; 

const RenderField = ({ label, value, isBadge = false, badgeColor = "bg-neutral-100 dark:bg-neutral-800" }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-4">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">{label}</span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeColor}`}>{String(value)}</span>
      ) : (
        <span className="text-[12px] font-medium text-black dark:text-white break-words">{String(value)}</span>
      )}
    </div>
  );
};

export const TransactionViewModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Transaction Details" maxWidth="max-w-3xl">
      <div className="p-2 space-y-6">
        
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Transaction ID</p>
            <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">{data.transactionNumber}</h2>
            <p className="text-[11px] font-medium text-neutral-500 mt-1 flex items-center gap-2">
              {format(new Date(data.transactionDate), "PPpp")}
              <span className="text-[8px]">•</span>
              
              {/* 🔥 Shop Name and Shop ID */}
              <span className="font-black text-black dark:text-white uppercase tracking-widest bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-sm">
                {data.shop ? `${data.shop.name} (${data.shop.shopCode || data.shop._id?.slice(-6)})` : 'Head Office'}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Net Amount</p>
            <h2 className={`text-2xl font-black ${data.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
              {data.type === 'CREDIT' ? '+' : '-'}SAR {data.netAmount?.toLocaleString()}
            </h2>
            <span className={`inline-block mt-2 px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${data.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {data.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RenderField label="Type" value={data.type} isBadge badgeColor={data.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} />
          <RenderField label="Category" value={data.category} isBadge />
          <RenderField label="Payment Method" value={data.paymentMethod} />
          <RenderField label="Reconciled" value={data.isReconciled ? 'YES' : 'NO'} isBadge badgeColor={data.isReconciled ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'} />
          
          <RenderField label="Base Amount" value={`SAR ${data.amount}`} />
          <RenderField label="Tax" value={`SAR ${data.tax || 0}`} />
          <RenderField label="Discount" value={`SAR ${data.discount || 0}`} />
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <RenderField label="Description" value={data.description} />
          <RenderField label="Internal Notes" value={data.notes} />
        </div>

      </div>
    </BaseModal>
  );
};