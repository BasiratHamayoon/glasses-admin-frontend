"use client";
import { BaseModal } from "../BaseModal";

const RenderField = ({ label, value, isBadge = false }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] rounded-sm w-fit font-black">{String(value)}</span>
      ) : (
        <span className="text-[11px] font-medium">{String(value)}</span>
      )}
    </div>
  );
};

export const TransferViewModal = ({ isOpen, onClose, transfer }) => {
  if (!transfer) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Transfer Details: ${transfer.transferNumber}`} maxWidth="max-w-2xl">
      <div className="p-2">
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 dark:bg-[#0a0a0a] rounded-sm border border-neutral-200 dark:border-neutral-800">
          <RenderField label="From Shop" value={transfer.fromShop?.name} />
          <RenderField label="To Shop" value={transfer.toShop?.name} />
          <RenderField label="Status" value={transfer.status} isBadge />
          <RenderField label="Reason" value={transfer.reason} />
          <RenderField label="Requested By" value={transfer.requestedBy?.name} />
          <RenderField label="Requested Date" value={new Date(transfer.requestedDate).toLocaleString()} />
        </div>

        <h4 className="text-[10px] uppercase font-black mb-3 text-neutral-500 tracking-widest">Items Included</h4>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">Product</th>
                <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">Requested</th>
                <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">Approved</th>
                <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">Received</th>
              </tr>
            </thead>
            <tbody>
              {transfer.items?.map((item, i) => (
                <tr key={i} className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                  <td className="p-2 text-[10px] font-bold">{item.productName || item.product?.name} <br/><span className="text-[8px] text-neutral-500 font-normal">{item.productSKU || item.product?.sku}</span></td>
                  <td className="p-2 text-[10px]">{item.requestedQuantity}</td>
                  <td className="p-2 text-[10px]">{item.approvedQuantity}</td>
                  <td className="p-2 text-[10px]">{item.receivedQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseModal>
  );
};