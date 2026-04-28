"use client";
import { BaseModal } from "../BaseModal";
import { Loader2 } from "lucide-react";

const RenderField = ({ label, value, highlight }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      <span className={`text-[11px] font-medium ${highlight ? 'text-[#E9B10C] font-black' : 'text-black dark:text-white'}`}>
        {String(value)}
      </span>
    </div>
  );
};

export const OrderViewModal = ({ isOpen, onClose, data, loading }) => {
  if (loading) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title="Order Details" maxWidth="max-w-3xl">
        <div className="p-10 flex justify-center items-center"><Loader2 className="animate-spin text-[#E9B10C]" /></div>
      </BaseModal>
    );
  }

  if (!data) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Order #${data.orderNumber}`} maxWidth="max-w-4xl">
      <div className="p-4 space-y-6">
        {/* Header Banner */}
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-black dark:text-white">SAR {data.totalAmount}</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              {new Date(data.createdAt).toLocaleString()} | {data.orderType || 'WEBSITE'}
            </p>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white">
              STATUS: {data.orderStatus || data.status}
            </span>
            <p className="text-[10px] mt-2 font-bold text-[#E9B10C]">PAYMENT: {data.paymentStatus}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Customer & Shipping</h4>
            <div className="grid grid-cols-2 gap-4">
              <RenderField label="Name" value={data.customer?.name || data.shippingAddress?.fullName || 'Walk-in'} />
              <RenderField label="Phone" value={data.customer?.phone || data.shippingAddress?.phone} />
              <RenderField label="Email" value={data.customer?.email || data.shippingAddress?.email} />
              <RenderField label="Payment Method" value={data.paymentMethod?.toUpperCase()} highlight />
            </div>
            {data.shippingAddress && (
              <div className="mt-4">
                <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 block mb-1">Address</span>
                <p className="text-[11px] font-medium text-black dark:text-white">
                  {data.shippingAddress.addressLine1}, {data.shippingAddress.city}, <br/>
                  {data.shippingAddress.state} - {data.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Financial Summary</h4>
             <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex justify-between text-[11px] font-bold"><span className="text-neutral-500">Subtotal</span><span>SAR {data.subTotal || data.totalAmount}</span></div>
                {data.discountAmount > 0 && <div className="flex justify-between text-[11px] font-bold"><span className="text-neutral-500">Discount</span><span className="text-red-500">-SAR {data.discountAmount}</span></div>}
                {data.taxAmount > 0 && <div className="flex justify-between text-[11px] font-bold"><span className="text-neutral-500">Tax</span><span>SAR {data.taxAmount}</span></div>}
                {data.shippingCost > 0 && <div className="flex justify-between text-[11px] font-bold"><span className="text-neutral-500">Shipping</span><span>SAR {data.shippingCost}</span></div>}
                <div className="flex justify-between text-[14px] font-black pt-2 border-t border-neutral-200 dark:border-neutral-800"><span className="text-black dark:text-white">Total</span><span className="text-[#E9B10C]">SAR {data.totalAmount}</span></div>
             </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Order Items</h4>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 dark:bg-[#0a0a0a] text-[9px] uppercase tracking-widest font-bold text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {data.items?.map((item, idx) => (
                  <tr key={idx} className="bg-white dark:bg-[#111111]">
                    <td className="p-3">
                      <p className="text-[11px] font-black text-black dark:text-white">{item.product?.name || 'Unknown Product'}</p>
                      {item.variant && <p className="text-[9px] text-neutral-500 uppercase">SKU: {item.variant.sku}</p>}
                    </td>
                    <td className="p-3 text-center text-[11px] font-bold">{item.quantity}</td>
                    <td className="p-3 text-right text-[11px] font-bold text-neutral-500">SAR {item.price || item.product?.sellingPrice}</td>
                    <td className="p-3 text-right text-[11px] font-black">SAR {(item.price || item.product?.sellingPrice) * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </BaseModal>
  );
};