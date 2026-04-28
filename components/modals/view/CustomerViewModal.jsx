"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import { ChevronDown, Star, ShoppingBag, Box, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RenderField = ({ label, value, isBadge = false, isFullWidth = false, badgeColor = "bg-neutral-100 dark:bg-neutral-800" }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={`flex flex-col mb-3 ${isFullWidth ? 'col-span-1 sm:col-span-2' : ''}`}>
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">{label}</span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeColor}`}>{String(value)}</span>
      ) : (
        <span className="text-[12px] font-medium break-words text-black dark:text-white">{String(value)}</span>
      )}
    </div>
  );
};

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm mb-2 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-3 bg-neutral-50 dark:bg-[#0a0a0a] hover:bg-neutral-100 transition-colors">
        <span className="text-[10px] uppercase tracking-widest font-black">{title}</span>
        <ChevronDown size={14} className={`text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 bg-white dark:bg-[#111111]">{children}</div>}
    </div>
  );
};

export const CustomerViewModal = ({ isOpen, onClose, data }) => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  if (!data || !data.customer) return null;
  
  // Destructure safely from your API structure
  const { 
    customer, 
    prescriptions = [], 
    orders = [], 
    recommendedProducts = [], // Ready for when backend adds this
    creditHistory = [],
    loyaltyHistory = []
  } = data;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Customer Profile" maxWidth="max-w-3xl">
      <div className="pb-4 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
        
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-black text-[#E9B10C] tracking-widest">{customer.firstName} {customer.lastName}</h2>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mt-1">{customer.customerId}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm bg-yellow-500/10 text-yellow-600`}>
              <Star size={10} className="fill-current" /> {customer.loyaltyTier || 'BRONZE'} TIER
            </span>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mt-2">Loyalty Points</p>
            <h2 className="text-xl font-black text-black dark:text-white">{customer.loyaltyPoints || 0}</h2>
          </div>
        </div>

        <Accordion title="Personal & Contact Information" defaultOpen={true}>
          <RenderField label="Phone" value={customer.phone} />
          <RenderField label="Email" value={customer.email || 'N/A'} />
          <RenderField label="Gender / Age" value={`${customer.gender || 'N/A'} ${customer.age ? `(${customer.age} yrs)` : ''}`} />
          <RenderField label="Source" value={customer.source?.replace('_', ' ')} isBadge />
          <RenderField label="Credit Limit" value={`SAR ${customer.creditLimit || 0}`} isBadge badgeColor="bg-green-500/10 text-green-600" />
          <RenderField label="Current Credit Balance" value={`SAR ${customer.creditBalance || 0}`} isBadge badgeColor="bg-red-500/10 text-red-600" />
        </Accordion>

        <Accordion title="Purchase History & Stats" defaultOpen={true}>
          <RenderField label="Total Orders" value={customer.totalOrders} />
          <RenderField label="Total Spent" value={`SAR ${customer.totalSpent?.toLocaleString() || 0}`} isBadge badgeColor="bg-[#E9B10C]/10 text-[#E9B10C]" />
          <RenderField label="Average Order Value" value={`SAR ${customer.averageOrderValue?.toLocaleString() || 0}`} />
          <RenderField label="Last Purchase" value={customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString() : 'No purchases yet'} />
          <RenderField label="Registered Shop" value={customer.registeredShop?.name || 'Walk-In'} />
        </Accordion>

        {/* Eligible & Recommended Products - Safely handles missing API Data */}
        <Accordion title="Eligible & Recommended Products" defaultOpen={true}>
          {recommendedProducts && recommendedProducts.length > 0 ? (
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
                  <div className="w-12 h-12 bg-white dark:bg-[#111111] rounded-sm flex items-center justify-center border border-neutral-200 dark:border-neutral-700 overflow-hidden relative shrink-0">
                    {prod.primaryImage || (prod.images && prod.images[0]?.url) ? (
                      <img src={prod.primaryImage || prod.images[0].url} alt={prod.name} className="w-full h-full object-cover" />
                    ) : (
                      <Box size={16} className="text-neutral-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-black dark:text-white uppercase line-clamp-1">{prod.name}</span>
                    <span className="text-[9px] text-[#E9B10C] font-black mt-0.5">SAR {prod.sellingPrice || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-2 bg-green-500/10 border border-green-500/20 rounded-sm p-4">
               <div className="flex items-center gap-2 mb-3">
                 <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                 <h4 className="text-[10px] uppercase tracking-widest font-black text-green-600 dark:text-green-400">Prescription Based Eligibility</h4>
               </div>
               {prescriptions && prescriptions.length > 0 ? (
                 <ul className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 space-y-2 list-disc pl-4">
                   <li>Eligible for Single Vision & Progressive Lenses based on active prescription.</li>
                   <li>Recommended Add-ons: Anti-Reflective & Blue Light Coating.</li>
                   <li>Recommended Frame Size: Medium to Large fit.</li>
                 </ul>
               ) : (
                 <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                   Please add an eye prescription to generate tailored lens and frame eligibility.
                 </p>
               )}
            </div>
          )}
        </Accordion>

        <Accordion title="Active Eye Prescriptions" defaultOpen={prescriptions && prescriptions.length > 0}>
          {prescriptions && prescriptions.length > 0 ? (
            <div className="col-span-2 space-y-4">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-sm p-3 bg-neutral-50 dark:bg-[#1a1a1a]">
                  <div className="flex justify-between items-center mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    <span className="text-[10px] font-black uppercase text-[#E9B10C]">{rx.type} Prescription</span>
                    <span className="text-[9px] text-neutral-500 uppercase font-bold">{new Date(rx.prescriptionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-neutral-500 mb-1 block">Right Eye (OD)</span>
                      <p className="text-[11px] font-medium">SPH: {rx.rightEye?.spherical || 0} | CYL: {rx.rightEye?.cylindrical || 0} | AXIS: {rx.rightEye?.axis || 0}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-neutral-500 mb-1 block">Left Eye (OS)</span>
                      <p className="text-[11px] font-medium">SPH: {rx.leftEye?.spherical || 0} | CYL: {rx.leftEye?.cylindrical || 0} | AXIS: {rx.leftEye?.axis || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="col-span-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest py-2">No active prescriptions found.</p>
          )}
        </Accordion>

        <Accordion title="Order History & Purchased Products" defaultOpen={orders && orders.length > 0}>
          {orders && orders.length > 0 ? (
            <div className="col-span-2 space-y-4">
              {orders.map((order, idx) => (
                <div key={idx} className="border border-neutral-200 dark:border-neutral-800 rounded-sm p-4 bg-neutral-50 dark:bg-[#1a1a1a]">
                   <div className="flex justify-between items-center mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                     <div className="flex items-center gap-2">
                       <ShoppingBag size={14} className="text-[#E9B10C]" />
                       <span className="text-[11px] font-black uppercase text-black dark:text-white tracking-widest">
                         Order #{order.orderNumber || order._id?.slice(-6)}
                       </span>
                     </div>
                     <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded-sm">
                       {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                     </span>
                   </div>
                   
                   <div className="space-y-2">
                     {order.items?.map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-[#111111] p-3 rounded-sm border border-neutral-200 dark:border-neutral-800 gap-2">
                           <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                               <Box size={14} className="text-neutral-400" />
                             </div>
                             <div className="flex flex-col">
                               <span className="text-[11px] font-bold text-black dark:text-white">
                                 {item.product?.name || 'Unknown Product'} {item.variant ? `(${item.variant})` : ''}
                               </span>
                               <span className="text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">
                                 SKU: {item.product?.sku || 'N/A'} • Qty: {item.quantity || 1}
                               </span>
                             </div>
                           </div>
                           <span className="text-[11px] font-black sm:text-right pl-11 sm:pl-0 text-[#E9B10C]">
                             SAR {item.price || item.product?.sellingPrice || 0}
                           </span>
                        </div>
                     ))}
                   </div>
                   
                   <div className="mt-4 text-right flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800 pt-3">
                     <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
                       {order.status || 'COMPLETED'}
                     </span>
                     <span className="text-[12px] font-black uppercase tracking-widest">
                       Total: <span className="text-[#E9B10C]">SAR {order.totalAmount || 0}</span>
                     </span>
                   </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="col-span-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest py-2">No previous orders found.</p>
          )}
        </Accordion>

      </div>
    </BaseModal>
  );
};