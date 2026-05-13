"use client";

import { BaseModal } from "../BaseModal";
import { Loader2 } from "lucide-react";

const money = (value) => `SAR ${Number(value || 0).toLocaleString()}`;

const RenderField = ({ label, value, highlight = false }) => {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex flex-col mb-3">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      <span
        className={`text-[11px] font-medium ${
          highlight
            ? "text-[#E9B10C] font-black"
            : "text-black dark:text-white"
        }`}
      >
        {String(value)}
      </span>
    </div>
  );
};

export const OrderViewModal = ({ isOpen, onClose, data, loading }) => {
  if (loading) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Order Details"
        maxWidth="max-w-5xl"
      >
        <div className="p-10 flex justify-center items-center">
          <Loader2 className="animate-spin text-[#E9B10C]" />
        </div>
      </BaseModal>
    );
  }

  if (!data) return null;

  const customerName =
    data.customer?.name ||
    data.shippingAddress?.fullName ||
    (data.guestCheckout ? "Guest Customer" : "Walk-in Customer");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${data.orderNumber || "-"}`}
      maxWidth="max-w-6xl"
    >
      <div className="p-4 space-y-6">
        {/* Header Banner */}
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-6 rounded-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-black dark:text-white">
              {money(data.totalAmount)}
            </h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
              {new Date(data.createdAt).toLocaleString()} | {data.orderType || "ORDER"} |{" "}
              {data.source || "-"}
            </p>
          </div>

          <div className="text-left md:text-right space-y-2">
            <span className="inline-block px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white">
              ORDER: {data.orderStatus || "-"}
            </span>
            <div>
              <span className="inline-block px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm bg-[#E9B10C]/10 text-[#E9B10C]">
                PAYMENT: {data.paymentStatus || "-"}
              </span>
            </div>
            <div>
              <span className="inline-block px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm bg-blue-500/10 text-blue-500">
                DELIVERY: {data.deliveryStatus || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Customer Info
            </h4>

            <div className="grid grid-cols-1 gap-2">
              <RenderField label="Customer" value={customerName} />
              <RenderField label="Phone" value={data.customer?.phone || data.shippingAddress?.phone} />
              <RenderField label="Email" value={data.customer?.email || data.shippingAddress?.email} />
              <RenderField
                label="Guest Checkout"
                value={data.guestCheckout ? "Yes" : "No"}
              />
            </div>
          </div>

          {/* Shop Info */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Shop Info
            </h4>

            <div className="grid grid-cols-1 gap-2">
              <RenderField label="Shop Name" value={data.shop?.name} />
              <RenderField label="Shop Code" value={data.shop?.code} />
              <RenderField
                label="Address"
                value={
                  data.shop?.address
                    ? `${data.shop.address.street || ""}, ${data.shop.address.city || ""}, ${data.shop.address.state || ""}, ${data.shop.address.pincode || ""}`
                    : null
                }
              />
              <RenderField label="Created By" value={data.createdBy?.name} />
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Payment Info
            </h4>

            <div className="grid grid-cols-1 gap-2">
              <RenderField label="Payment Method" value={data.paymentMethod} highlight />
              <RenderField label="Payment Status" value={data.paymentStatus} />
              <RenderField label="Paid Amount" value={money(data.paidAmount)} />
              <RenderField label="Due Amount" value={money(data.dueAmount)} />
              <RenderField label="Shipping Method" value={data.shippingMethod} />
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            Financial Summary
          </h4>

          <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-neutral-500">Subtotal</span>
              <span>{money(data.subtotal)}</span>
            </div>

            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-neutral-500">Discount</span>
              <span className={data.totalDiscount > 0 ? "text-red-500" : ""}>
                {money(data.totalDiscount)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-neutral-500">Tax</span>
              <span>{money(data.totalTax)}</span>
            </div>

            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-neutral-500">Shipping Charge</span>
              <span>{money(data.shippingCharge)}</span>
            </div>

            <div className="flex justify-between text-[14px] font-black pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-black dark:text-white">Total</span>
              <span className="text-[#E9B10C]">{money(data.totalAmount)}</span>
            </div>

            <div className="flex justify-between text-[12px] font-black">
              <span className="text-green-500">Paid</span>
              <span className="text-green-500">{money(data.paidAmount)}</span>
            </div>

            <div className="flex justify-between text-[12px] font-black">
              <span className="text-red-500">Due</span>
              <span className="text-red-500">{money(data.dueAmount)}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            Order Items
          </h4>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 dark:bg-[#0a0a0a] text-[9px] uppercase tracking-widest font-bold text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Discount</th>
                  <th className="p-3 text-right">Tax</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {data.items?.map((item, idx) => (
                  <tr key={item._id || idx} className="bg-white dark:bg-[#111111]">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.productName || item.product?.name || "Product"}
                            className="w-10 h-10 object-cover rounded-sm border border-neutral-200 dark:border-neutral-800"
                          />
                        ) : null}
                        <div>
                          <p className="text-[11px] font-black text-black dark:text-white">
                            {item.productName || item.product?.name || "Unknown Product"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-[10px] font-bold text-neutral-500 uppercase">
                      {item.sku || item.product?.sku || "-"}
                    </td>

                    <td className="p-3 text-center text-[11px] font-bold">
                      {item.quantity}
                    </td>

                    <td className="p-3 text-right text-[11px] font-bold text-neutral-500">
                      {money(item.price)}
                    </td>

                    <td className="p-3 text-right text-[11px] font-bold text-red-500">
                      {money(item.discount)}
                    </td>

                    <td className="p-3 text-right text-[11px] font-bold text-blue-500">
                      {money(item.tax)}
                    </td>

                    <td className="p-3 text-right text-[11px] font-black">
                      {money(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extra Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              Extra Info
            </h4>

            <RenderField label="Order Type" value={data.orderType} />
            <RenderField label="Source" value={data.source} />
            <RenderField label="Sales Person" value={data.salesPerson?.name || "—"} />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};