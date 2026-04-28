"use client";
import { BaseModal } from "../BaseModal";
import { SafeImage } from "@/components/ui/SafeImage";

const RenderField = ({ label, value, isBadge = false }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? (
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] rounded-sm w-fit font-black">{String(value)}</span>
      ) : (
        <span className="text-[12px] font-medium break-words text-black dark:text-white">{String(value)}</span>
      )}
    </div>
  );
};

export const StockViewModal = ({ isOpen, onClose, stock, isWebsite = false }) => {
  if (!stock) return null;

  const primaryImg = stock.product?.images?.find(img => img.isPrimary)?.url || stock.product?.images?.[0]?.url;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isWebsite ? "Website Stock Details" : "Shop Stock Details"} maxWidth="max-w-2xl">
      <div className="p-4 space-y-6">
        
        <div className="flex gap-4 items-center bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800">
          <div className="w-16 h-16 rounded-sm overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
             <SafeImage src={primaryImg} alt={stock.product?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">{stock.product?.name}</h2>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1">{stock.product?.sku}</p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${stock.status === 'IN_STOCK' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {stock.status?.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {!isWebsite && <RenderField label="Assigned Shop" value={stock.shop?.name} isBadge />}
          <RenderField label="Total Quantity" value={stock.quantity} />
          <RenderField label="Available Quantity" value={stock.availableQuantity} isBadge />
          
          <RenderField label="Cost Price" value={`SAR ${stock.costPrice}`} />
          <RenderField label="Selling Price" value={`SAR ${stock.sellingPrice}`} />
          {isWebsite && <RenderField label="Web Override Price" value={`SAR ${stock.websitePrice}`} isBadge />}
          
          <RenderField label="Min Stock Alert" value={stock.minStockLevel} />
          {isWebsite && <RenderField label="Is Visible On Web" value={stock.isVisible ? "YES" : "NO"} />}
          {isWebsite && <RenderField label="Is Featured" value={stock.isFeatured ? "YES" : "NO"} />}
        </div>

      </div>
    </BaseModal>
  );
};