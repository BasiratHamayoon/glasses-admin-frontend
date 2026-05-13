"use client";
import { useState } from "react";
import { BaseModal } from "../BaseModal";
import {
  ChevronDown,
  Star,
  ShoppingBag,
  Box,
  TrendingUp,
  CreditCard,
  Award,
  MapPin,
  Activity,
  Heart,
  Clock,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RenderField = ({
  label,
  value,
  isBadge = false,
  isFullWidth = false,
  badgeColor = "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white",
}) => {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className={`flex flex-col mb-3 ${isFullWidth ? "col-span-1 sm:col-span-2" : ""}`}>
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1">
        {label}
      </span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <span className="text-[12px] font-medium break-words text-black dark:text-white">
          {value}
        </span>
      )}
    </div>
  );
};

const Accordion = ({ title, icon, defaultOpen = false, children, badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm mb-2 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-3 bg-neutral-50 dark:bg-[#0a0a0a] hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#E9B10C]">{icon}</span>}
          <span className="text-[10px] uppercase tracking-widest font-black text-black dark:text-white">
            {title}
          </span>
          {badge !== undefined && badge !== null && (
            <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#E9B10C]/10 text-[#E9B10C] rounded-sm uppercase tracking-widest">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-neutral-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="p-4 bg-white dark:bg-[#111111]">
          {children}
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, sub, color = "text-black dark:text-white" }) => (
  <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm p-3 flex flex-col gap-1">
    <span className="text-[8px] uppercase tracking-widest font-bold text-neutral-500">
      {label}
    </span>
    <span className={`text-[15px] font-black ${color}`}>{value}</span>
    {sub && (
      <span className="text-[8px] text-neutral-400 font-medium">{sub}</span>
    )}
  </div>
);

export const CustomerViewModal = ({ isOpen, onClose, data, loading = false }) => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("customerProfile")}
      maxWidth="max-w-4xl"
    >
      {loading || !data || !data.customer ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingProfile")}
          </span>
        </div>
      ) : (
        <div className="pb-4 space-y-3" dir={isArabic ? "rtl" : "ltr"}>
          {(() => {
            const {
              customer,
              prescriptions = [],
              creditHistory = [],
              loyaltyHistory = [],
              orders = { data: [], pagination: {} },
              orderStats = {},
              frequentProducts = [],
            } = data;

            const ordersData = orders?.data || [];

            const getTierColor = (tier) => {
              const map = {
                PLATINUM: "bg-purple-500/10 text-purple-500",
                GOLD: "bg-yellow-500/10 text-yellow-600",
                SILVER: "bg-neutral-200 dark:bg-neutral-700 text-neutral-500",
                BRONZE: "bg-orange-500/10 text-orange-500",
              };
              return map[tier] || "bg-orange-500/10 text-orange-500";
            };

            return (
              <>
                <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-5 rounded-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-black text-[#E9B10C] tracking-widest">
                        {customer.firstName} {customer.lastName}
                      </h2>
                      <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest">
                        {customer.customerId}
                      </span>
                      {customer.phone && (
                        <span className="text-[11px] font-bold text-black dark:text-white mt-1">
                          {customer.phone}
                        </span>
                      )}
                      {customer.email && (
                        <span className="text-[10px] text-neutral-500">
                          {customer.email}
                        </span>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${getTierColor(customer.loyaltyTier)}`}
                        >
                          <Star size={9} className="fill-current" />
                          {customer.loyaltyTier || "BRONZE"}
                        </span>
                        <span
                          className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
                            customer.isActive
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {customer.status || (customer.isActive ? "ACTIVE" : "INACTIVE")}
                        </span>
                        {customer.isWebsiteUser && (
                          <span className="px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm bg-blue-500/10 text-blue-500">
                            {t("webUser")}
                          </span>
                        )}
                        {customer.source && (
                          <span className="px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            {customer.source.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-[8px] uppercase font-bold text-neutral-500 tracking-widest">
                          {t("loyaltyPoints")}
                        </p>
                        <h3 className="text-2xl font-black text-black dark:text-white">
                          {(customer.loyaltyPoints || 0).toLocaleString()}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase font-bold text-neutral-500 tracking-widest">
                          {t("totalSpent")}
                        </p>
                        <h3 className="text-xl font-black text-[#E9B10C] flex items-center gap-1 justify-end">
                          ⃁ {(customer.totalSpent || 0).toLocaleString()}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <StatBox
                    label={t("totalOrders")}
                    value={orderStats.totalOrders ?? customer.totalOrders ?? 0}
                    sub={`${orderStats.posOrders || 0} POS · ${(orderStats.totalOrders || 0) - (orderStats.posOrders || 0)} Web`}
                    color="text-black dark:text-white"
                  />
                  <StatBox
                    label={t("avgOrderValue")}
                    value={`⃁ ${Math.round(orderStats.avgOrderValue || customer.averageOrderValue || 0).toLocaleString()}`}
                    color="text-[#E9B10C]"
                  />
                  <StatBox
                    label={t("completedOrders")}
                    value={orderStats.completedOrders ?? 0}
                    sub={`${orderStats.cancelledOrders ?? 0} ${t("cancelled")}`}
                    color="text-green-500"
                  />
                  <StatBox
                    label={t("creditBalance")}
                    value={`⃁ ${(customer.creditBalance || 0).toLocaleString()}`}
                    sub={`${t("limit")}: ⃁ ${(customer.creditLimit || 0).toLocaleString()}`}
                    color={customer.creditBalance > 0 ? "text-red-500" : "text-neutral-500"}
                  />
                </div>

                <Accordion
                  title={t("personalDetails")}
                  icon={<Activity size={13} />}
                  defaultOpen={true}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <RenderField label={t("phone")} value={customer.phone} />
                    <RenderField label={t("alternatePhone")} value={customer.alternatePhone} />
                    <RenderField label={t("email")} value={customer.email} />
                    <RenderField
                      label={t("gender")}
                      value={customer.gender}
                      isBadge
                    />
                    <RenderField
                      label={t("age")}
                      value={customer.age ? `${customer.age} ${t("years")}` : null}
                    />
                    <RenderField
                      label={t("dateOfBirth")}
                      value={
                        customer.dateOfBirth
                          ? new Date(customer.dateOfBirth).toLocaleDateString()
                          : null
                      }
                    />
                    <RenderField
                      label={t("registeredShop")}
                      value={customer.registeredShop?.name || t("walkIn")}
                    />
                    {customer.visitedShops && customer.visitedShops.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 block">
                          {t("visitedShops")}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {customer.visitedShops.map((shop, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-sm"
                            >
                              {shop.name || shop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <RenderField
                      label={t("lastVisit")}
                      value={
                        customer.lastVisitDate
                          ? new Date(customer.lastVisitDate).toLocaleDateString()
                          : null
                      }
                    />
                    <RenderField
                      label={t("lastPurchase")}
                      value={
                        customer.lastPurchaseDate
                          ? new Date(customer.lastPurchaseDate).toLocaleDateString()
                          : t("noPurchasesYet")
                      }
                    />
                    <RenderField
                      label={t("lastChannel")}
                      value={customer.lastOrderChannel}
                      isBadge
                    />
                    <RenderField
                      label={t("referralCode")}
                      value={customer.referralCode}
                    />
                    {customer.createdBy?.name && (
                      <RenderField
                        label={t("createdBy")}
                        value={customer.createdBy.name}
                      />
                    )}
                    {customer.updatedBy?.name && (
                      <RenderField
                        label={t("updatedBy")}
                        value={customer.updatedBy.name}
                      />
                    )}
                    {customer.notes && (
                      <RenderField
                        label={t("notes")}
                        value={customer.notes}
                        isFullWidth
                      />
                    )}
                    {customer.internalNotes && (
                      <RenderField
                        label={t("internalNotes")}
                        value={customer.internalNotes}
                        isFullWidth
                      />
                    )}
                    {customer.tags && customer.tags.length > 0 && (
                      <div className="col-span-1 sm:col-span-2 mb-3">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 block">
                          {t("tags")}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-[#E9B10C]/10 text-[#E9B10C] rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Accordion>

                {customer.addresses && customer.addresses.length > 0 && (
                  <Accordion
                    title={t("addresses")}
                    icon={<MapPin size={13} />}
                    badge={customer.addresses.length}
                    defaultOpen={false}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {customer.addresses.map((addr, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-sm border ${
                            addr.isDefault
                              ? "border-[#E9B10C]/40 bg-[#E9B10C]/5"
                              : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a]"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                              {addr.label || t("home")}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-[#E9B10C]/10 text-[#E9B10C] rounded-sm">
                                {t("default")}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-black dark:text-white leading-relaxed">
                            {[
                              addr.street,
                              addr.landmark,
                              addr.city,
                              addr.state,
                              addr.pincode,
                              addr.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}

                {customer.preferences && (
                  <Accordion
                    title={t("preferences")}
                    icon={<Heart size={13} />}
                    defaultOpen={false}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                      {customer.preferences.frameStyle?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 block">
                            {t("frameStyle")}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {customer.preferences.frameStyle.map((s, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-sm"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {customer.preferences.frameMaterial?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 block">
                            {t("frameMaterial")}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {customer.preferences.frameMaterial.map((m, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-sm"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {customer.preferences.priceRange?.min !== undefined && (
                        <RenderField
                          label={t("priceRange")}
                          value={`⃁ ${customer.preferences.priceRange.min} – ⃁ ${customer.preferences.priceRange.max}`}
                        />
                      )}
                      {customer.preferences.brands?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1 block">
                            {t("preferredBrands")}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {customer.preferences.brands.map((b, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-sm"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <RenderField
                        label={t("communicationChannel")}
                        value={customer.preferences.communicationChannel}
                        isBadge
                      />
                    </div>
                  </Accordion>
                )}

                <Accordion
                  title={t("medicalInfo")}
                  icon={<Activity size={13} />}
                  defaultOpen={false}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <RenderField
                      label={t("hasPrescription")}
                      value={customer.hasExistingPrescription ? t("yes") : t("no")}
                      isBadge
                      badgeColor={
                        customer.hasExistingPrescription
                          ? "bg-green-500/10 text-green-500"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                      }
                    />
                    <RenderField
                      label={t("lastEyeCheckup")}
                      value={
                        customer.lastEyeCheckupDate
                          ? new Date(customer.lastEyeCheckupDate).toLocaleDateString()
                          : null
                      }
                    />
                    <RenderField label={t("doctorName")} value={customer.doctorName} />
                    <RenderField label={t("doctorPhone")} value={customer.doctorPhone} />
                    {customer.medicalNotes && (
                      <RenderField
                        label={t("medicalNotes")}
                        value={customer.medicalNotes}
                        isFullWidth
                      />
                    )}
                  </div>
                </Accordion>

                <Accordion
                  title={t("activePrescriptions")}
                  icon={<Award size={13} />}
                  badge={prescriptions.length}
                  defaultOpen={prescriptions.length > 0}
                >
                  {prescriptions.length > 0 ? (
                    <div className="space-y-3">
                      {prescriptions.map((rx, idx) => (
                        <div
                          key={idx}
                          className="border border-neutral-200 dark:border-neutral-800 rounded-sm p-3 bg-neutral-50 dark:bg-[#0a0a0a]"
                        >
                          <div className="flex justify-between items-center mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-black uppercase text-[#E9B10C]">
                                {rx.prescriptionId} — {rx.type}
                              </span>
                              {rx.doctorName && (
                                <span className="text-[9px] text-neutral-500 font-medium">
                                  {t("dr")}: {rx.doctorName}
                                </span>
                              )}
                            </div>
                            <span className="text-[8px] text-neutral-500 uppercase font-bold">
                              {rx.createdAt
                                ? new Date(rx.createdAt).toLocaleDateString()
                                : ""}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[8px] font-black uppercase text-neutral-500 mb-2 block">
                                {t("rightEyeOD")}
                              </span>
                              <div className="space-y-1">
                                <div className="grid grid-cols-2 gap-1">
                                  {[
                                    { k: "SPH", v: rx.right?.sph },
                                    { k: "CYL", v: rx.right?.cyl },
                                    { k: "AXIS", v: rx.right?.axis },
                                    { k: "ADD", v: rx.right?.add },
                                  ].map(({ k, v }) =>
                                    v ? (
                                      <div
                                        key={k}
                                        className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm px-1.5 py-1"
                                      >
                                        <span className="text-[7px] uppercase font-bold text-neutral-500 block">
                                          {k}
                                        </span>
                                        <span className="text-[10px] font-black text-black dark:text-white">
                                          {v}
                                        </span>
                                      </div>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className="text-[8px] font-black uppercase text-neutral-500 mb-2 block">
                                {t("leftEyeOS")}
                              </span>
                              <div className="space-y-1">
                                <div className="grid grid-cols-2 gap-1">
                                  {[
                                    { k: "SPH", v: rx.left?.sph },
                                    { k: "CYL", v: rx.left?.cyl },
                                    { k: "AXIS", v: rx.left?.axis },
                                    { k: "ADD", v: rx.left?.add },
                                  ].map(({ k, v }) =>
                                    v ? (
                                      <div
                                        key={k}
                                        className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm px-1.5 py-1"
                                      >
                                        <span className="text-[7px] uppercase font-bold text-neutral-500 block">
                                          {k}
                                        </span>
                                        <span className="text-[10px] font-black text-black dark:text-white">
                                          {v}
                                        </span>
                                      </div>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {rx.notes && (
                            <p className="mt-2 text-[9px] text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 pt-2">
                              {rx.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest py-2">
                      {t("noPrescriptionsFound")}
                    </p>
                  )}
                </Accordion>

                <Accordion
                  title={t("orderHistory")}
                  icon={<ShoppingBag size={13} />}
                  badge={orderStats.totalOrders ?? 0}
                  defaultOpen={ordersData.length > 0}
                >
                  {ordersData.length > 0 ? (
                    <div className="space-y-4">
                      {ordersData.map((order, idx) => (
                        <div
                          key={idx}
                          className="border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a] overflow-hidden"
                        >
                          <div className="flex justify-between items-center p-3 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <ShoppingBag size={12} className="text-[#E9B10C]" />
                                <span className="text-[11px] font-black uppercase text-black dark:text-white tracking-widest">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded-sm bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                  {order.orderType}
                                </span>
                              </div>
                              {order.shop?.name && (
                                <span className="text-[9px] text-neutral-500 font-medium">
                                  {order.shop.name}
                                </span>
                              )}
                              {order.customerNotes && (
                                <span className="text-[9px] text-neutral-400 italic">
                                  {order.customerNotes}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-[9px] text-neutral-500 uppercase font-bold">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : ""}
                              </span>
                              <span
                                className={`text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded-sm ${
                                  order.orderStatus === "COMPLETED"
                                    ? "bg-green-500/10 text-green-500"
                                    : order.orderStatus === "CANCELLED"
                                    ? "bg-red-500/10 text-red-500"
                                    : order.orderStatus === "READY"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-yellow-500/10 text-yellow-600"
                                }`}
                              >
                                {order.orderStatus}
                              </span>
                              <span
                                className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-sm ${
                                  order.paymentStatus === "PAID"
                                    ? "bg-green-500/10 text-green-500"
                                    : order.paymentStatus === "PARTIAL"
                                    ? "bg-yellow-500/10 text-yellow-600"
                                    : "bg-red-500/10 text-red-500"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 space-y-2">
                            {order.items?.map((item, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center bg-white dark:bg-[#111111] p-2.5 rounded-sm border border-neutral-200 dark:border-neutral-800"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Box size={13} className="text-neutral-400" />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold text-black dark:text-white leading-tight">
                                      {item.productName || t("unknownProduct")}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      {item.sku && (
                                        <span className="text-[8px] text-neutral-500 uppercase">
                                          {item.sku}
                                        </span>
                                      )}
                                      <span className="text-[8px] font-bold text-neutral-500">
                                        {t("qty")}: {item.quantity || 1}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-0.5 shrink-0">
                                  <span className="text-[10px] font-black text-[#E9B10C]">
                                    ⃁ {(item.totalPrice || 0).toLocaleString()}
                                  </span>
                                  {item.discount > 0 && (
                                    <span className="text-[8px] text-red-400 font-bold">
                                      -{item.discount}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.prescription && (
                            <div className="mx-3 mb-3 p-2.5 bg-purple-500/5 border border-purple-500/20 rounded-sm">
                              <span className="text-[8px] uppercase font-black text-purple-500 tracking-widest block mb-1.5">
                                {t("orderPrescription")} — {order.prescription.type}
                              </span>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span className="text-[7px] uppercase font-bold text-neutral-500 block mb-1">
                                    {t("rightEyeOD")}
                                  </span>
                                  <div className="flex gap-2 flex-wrap">
                                    {[
                                      { k: "SPH", v: order.prescription.right?.sph },
                                      { k: "CYL", v: order.prescription.right?.cyl },
                                      { k: "AXIS", v: order.prescription.right?.axis },
                                      { k: "ADD", v: order.prescription.right?.add },
                                    ]
                                      .filter((x) => x.v)
                                      .map(({ k, v }) => (
                                        <span key={k} className="text-[9px] font-bold text-black dark:text-white">
                                          {k}: {v}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[7px] uppercase font-bold text-neutral-500 block mb-1">
                                    {t("leftEyeOS")}
                                  </span>
                                  <div className="flex gap-2 flex-wrap">
                                    {[
                                      { k: "SPH", v: order.prescription.left?.sph },
                                      { k: "CYL", v: order.prescription.left?.cyl },
                                      { k: "AXIS", v: order.prescription.left?.axis },
                                      { k: "ADD", v: order.prescription.left?.add },
                                    ]
                                      .filter((x) => x.v)
                                      .map(({ k, v }) => (
                                        <span key={k} className="text-[9px] font-bold text-black dark:text-white">
                                          {k}: {v}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center px-3 py-2.5 bg-neutral-50 dark:bg-[#0a0a0a] border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] uppercase font-bold text-neutral-500">
                                {order.paymentMethod}
                              </span>
                              <span className="text-[8px] text-neutral-400">
                                {order.totalItems || order.items?.length || 0} {t("items")}
                              </span>
                              {order.totalDiscount > 0 && (
                                <span className="text-[8px] font-bold text-red-400">
                                  -{t("disc")}: ⃁ {order.totalDiscount.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-[12px] font-black text-black dark:text-white flex items-center gap-1">
                              {t("total")}:
                              <span className="text-[#E9B10C]">
                                ⃁ {(order.totalAmount || 0).toLocaleString()}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest py-2">
                      {t("noOrdersFound")}
                    </p>
                  )}
                </Accordion>

                {frequentProducts.length > 0 && (
                  <Accordion
                    title={t("frequentlyBought")}
                    icon={<TrendingUp size={13} />}
                    badge={frequentProducts.length}
                    defaultOpen={false}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {frequentProducts.map((fp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm"
                        >
                          <div className="w-10 h-10 rounded-sm bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {fp.productImage ? (
                              <img
                                src={fp.productImage}
                                alt={fp.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Box size={14} className="text-neutral-400" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-[10px] font-black text-black dark:text-white uppercase truncate">
                              {fp.productName || t("unknownProduct")}
                            </span>
                            {fp.productSku && (
                              <span className="text-[8px] text-neutral-500 uppercase">
                                {fp.productSku}
                              </span>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[8px] font-black text-[#E9B10C]">
                                {fp.totalQuantity} {t("units")}
                              </span>
                              <span className="text-[8px] text-neutral-500">
                                ⃁ {(fp.totalSpent || 0).toLocaleString()} {t("spent")}
                              </span>
                              <span className="text-[8px] text-neutral-400">
                                {fp.orderCount} {t("orders")}
                              </span>
                            </div>
                            <span className="text-[7px] text-neutral-400 uppercase">
                              {t("lastBought")}:{" "}
                              {fp.lastPurchased
                                ? new Date(fp.lastPurchased).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}

                {loyaltyHistory.length > 0 && (
                  <Accordion
                    title={t("loyaltyHistory")}
                    icon={<Star size={13} />}
                    badge={loyaltyHistory.length}
                    defaultOpen={false}
                  >
                    <div className="space-y-2">
                      {loyaltyHistory.map((lh, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2.5 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm w-fit ${
                                lh.type === "EARNED" ||
                                lh.type === "BONUS" ||
                                lh.type === "REFERRAL"
                                  ? "bg-green-500/10 text-green-500"
                                  : lh.type === "REDEEMED"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                              }`}
                            >
                              {lh.type}
                            </span>
                            {lh.description && (
                              <span className="text-[9px] text-neutral-500 mt-0.5">
                                {lh.description}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span
                              className={`text-[11px] font-black ${
                                lh.type === "EARNED" || lh.type === "BONUS"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {lh.type === "REDEEMED" ? "-" : "+"}
                              {lh.points} {t("pts")}
                            </span>
                            <span className="text-[8px] text-neutral-500">
                              {t("bal")}: {lh.currentBalance}
                            </span>
                            <span className="text-[8px] text-neutral-400">
                              {new Date(lh.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}

                {creditHistory.length > 0 && (
                  <Accordion
                    title={t("creditHistory")}
                    icon={<CreditCard size={13} />}
                    badge={creditHistory.length}
                    defaultOpen={false}
                  >
                    <div className="space-y-2">
                      {creditHistory.map((ch, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2.5 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm w-fit ${
                                ch.type === "CREDIT" || ch.type === "REFUND"
                                  ? "bg-green-500/10 text-green-500"
                                  : ch.type === "DEBIT" || ch.type === "PAYMENT"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                              }`}
                            >
                              {ch.type}
                            </span>
                            {ch.description && (
                              <span className="text-[9px] text-neutral-500 mt-0.5">
                                {ch.description}
                              </span>
                            )}
                            {ch.referenceNumber && (
                              <span className="text-[8px] text-neutral-400">
                                {t("ref")}: {ch.referenceNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span
                              className={`text-[11px] font-black ${
                                ch.type === "CREDIT" || ch.type === "REFUND"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {ch.type === "DEBIT" || ch.type === "PAYMENT"
                                ? "-"
                                : "+"}
                              ⃁ {(ch.amount || 0).toLocaleString()}
                            </span>
                            <span className="text-[8px] text-neutral-500">
                              {t("bal")}: ⃁ {(ch.currentBalance || 0).toLocaleString()}
                            </span>
                            <span className="text-[8px] text-neutral-400">
                              {new Date(ch.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion>
                )}

                <Accordion
                  title={t("communication")}
                  icon={<Clock size={13} />}
                  defaultOpen={false}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "WhatsApp", key: "whatsappOptIn" },
                      { label: "SMS", key: "smsOptIn" },
                      { label: t("email"), key: "emailOptIn" },
                    ].map(({ label, key }) => (
                      <div
                        key={key}
                        className={`p-3 rounded-sm border text-center ${
                          customer[key]
                            ? "border-green-500/20 bg-green-500/5"
                            : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a]"
                        }`}
                      >
                        <span className="text-[8px] uppercase font-black tracking-widest text-neutral-500 block mb-1">
                          {label}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase ${
                            customer[key] ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {customer[key] ? t("optedIn") : t("optedOut")}
                        </span>
                      </div>
                    ))}
                  </div>
                </Accordion>
              </>
            );
          })()}
        </div>
      )}
    </BaseModal>
  );
};